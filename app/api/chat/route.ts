import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db/prisma";
import { embedText } from "@/lib/rag/embeddings";
import { getTopMatchesWithScore } from "@/lib/rag/retrieval";
import { buildSystemPrompt } from "@/lib/rag/prompt";

export const runtime = "nodejs";

const groqApiKey = process.env.GROQ_API_KEY;

const supportKeywords = [
  "shipping",
  "delivery",
  "returns",
  "return",
  "warranty",
  "care",
  "assembly",
  "payment",
  "invoice",
  "studio",
  "commercial",
  "volume",
  "bulk",
  "support",
  "contact",
  "quote",
];

const isSupportSource = (source: string) =>
  source.startsWith("markdown:") ||
  source.startsWith("faq:") ||
  source.startsWith("shipping:") ||
  source.startsWith("payment:");

type DocumentVector = {
  id: string;
  title: string;
  content: string;
  source: string;
  embedding: number[];
};

let cachedDocs: DocumentVector[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 1000 * 60 * 10;

let cachedPolicies: { returns?: string; warranty?: string } = {};

const loadPolicySnippet = async (fileName: string, fallback: string) => {
  if (fileName.includes("shipping") && cachedPolicies.returns) {
    return cachedPolicies.returns;
  }
  if (fileName.includes("warranty") && cachedPolicies.warranty) {
    return cachedPolicies.warranty;
  }

  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "content", "knowledge", fileName),
      "utf-8"
    );
    const lines = raw
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
    const snippet = lines.slice(0, 3).join(" ");
    if (fileName.includes("shipping")) cachedPolicies.returns = snippet;
    if (fileName.includes("warranty")) cachedPolicies.warranty = snippet;
    return snippet || fallback;
  } catch {
    return fallback;
  }
};

const normalizeReply = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (trimmed.includes("\n")) {
    return trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n");
  }
  return trimmed.replace(/([.!?])\s+/g, "$1\n");
};

const loadDocuments = async () => {
  if (cachedDocs && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedDocs;
  }

  const documents = await prisma.knowledgeDocument.findMany();
  cachedDocs = documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    content: doc.content,
    source: doc.source,
    embedding: doc.embedding as number[],
  }));
  cachedAt = Date.now();
  return cachedDocs;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: Array<{ role: string; content: string }>;
    };
    const messages = body.messages ?? [];
    const latest = messages[messages.length - 1]?.content ?? "";

    if (!latest) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const lower = latest.toLowerCase();
    const wantsCatalog = /name|names|price|prices|list|catalog/i.test(lower);
    const wantsShipping = /shipping|delivery|return|returns|refund/i.test(lower);
    const wantsWarranty = /warranty|guarantee|coverage/i.test(lower);
    const wantsRecommendation = /recommend|suggest|looking for|need|best|compact/i.test(lower);
    const categoryMap: Array<[RegExp, string]> = [
      [/treadmill|run/i, "treadmills"],
      [/bike|cycle|spin/i, "exercise-bikes"],
      [/rower|rowing/i, "rowing-machines"],
      [/bench/i, "benches"],
      [/dumbbell/i, "adjustable-dumbbells"],
      [/rack|rig|squat/i, "racks-rigs"],
      [/cable|pulley/i, "cable-systems"],
      [/mat|band|accessory/i, "mats-accessories"],
      [/bundle|studio setup|home gym/i, "bundles"],
    ];
    const matchedCategory = categoryMap.find(([pattern]) => pattern.test(lower))?.[1];
    if (wantsCatalog) {
      const catalogProducts = await prisma.product.findMany({
        include: { brand: true, category: true },
        orderBy: { createdAt: "desc" },
        take: 12,
      });
      if (catalogProducts.length) {
        const catalogLines = catalogProducts.map(
          (product, index) =>
            `${index + 1}. ${product.name} — €${product.price} (${product.category?.name ?? "Equipment"})`
        );
        const reply = normalizeReply(
          `Here are the current equipment names and prices:\n${catalogLines.join("\n")}`
        );
        return NextResponse.json({ data: { reply } });
      }
    }

    if (wantsShipping) {
      const shippingMethods = await prisma.shippingMethod.findMany({
        orderBy: { sortOrder: "asc" },
      });
      const returnsPolicy = await loadPolicySnippet(
        "shipping-returns.md",
        "Returns are accepted within 30 days for unused equipment in original packaging."
      );
      const lines = ["Delivery & returns overview:", returnsPolicy];
      if (shippingMethods.length) {
        lines.push(
          ...shippingMethods.map(
            (method, index) =>
              `${index + 1}. ${method.name} — €${method.price} (ETA ${method.etaDays} days)`
          )
        );
      }
      const reply = normalizeReply(lines.join("\n"));
      return NextResponse.json({ data: { reply } });
    }

    if (wantsWarranty) {
      const warrantyPolicy = await loadPolicySnippet(
        "warranty-care.md",
        "Most equipment includes a 24‑month warranty with coverage for manufacturing defects."
      );
      const warrantyProduct = matchedCategory
        ? await prisma.product.findMany({
            where: { category: { slug: matchedCategory } },
            orderBy: { createdAt: "desc" },
            take: 3,
          })
        : [];
      const lines = ["Warranty overview:", warrantyPolicy];
      if (warrantyProduct.length) {
        lines.push(
          ...warrantyProduct.map(
            (product, index) =>
              `${index + 1}. ${product.name} — ${product.warrantyMonths ?? 24} months`
          )
        );
      }
      const reply = normalizeReply(lines.join("\n"));
      return NextResponse.json({ data: { reply } });
    }

    if (wantsRecommendation || matchedCategory) {
      const recommended = await prisma.product.findMany({
        where: matchedCategory ? { category: { slug: matchedCategory } } : undefined,
        orderBy: { createdAt: "desc" },
        take: 4,
      });
      if (recommended.length) {
        const lines = ["Recommended options:",
          ...recommended.map(
            (product, index) =>
              `${index + 1}. ${product.name} — €${product.price} (${product.shortDescription ?? "Premium build"})`
          ),
        ];
        const reply = normalizeReply(lines.join("\n"));
        return NextResponse.json({ data: { reply } });
      }
    }

    const queryEmbedding = await embedText(latest);
    const documents = await loadDocuments();
    const minScore = Number(process.env.RAG_MIN_SCORE ?? 0.2);
    const matches = getTopMatchesWithScore(
      queryEmbedding,
      documents,
      8
    );
    const prefersSupport = supportKeywords.some((keyword) =>
      latest.toLowerCase().includes(keyword)
    );
    const scoredDocs = matches.filter((match) => match.score >= minScore);
    const fallbackDocs = scoredDocs.length ? scoredDocs : matches;
    const supportDocs = prefersSupport
      ? fallbackDocs.filter((match) => isSupportSource(match.doc.source))
      : fallbackDocs;
    const topDocs = (supportDocs.length ? supportDocs : fallbackDocs).map((match) => match.doc);

    const contextChunks = topDocs.map((doc) => `Source: ${doc.title}\n${doc.content}`);

    const context = contextChunks.length
      ? contextChunks.join("\n---\n").slice(0, 4000)
      : "No relevant context found.";

    if (!groqApiKey) {
      const fallbackLines = topDocs.slice(0, 4).map((doc, index) => `${index + 1}. ${doc.title}`);
      const reply = normalizeReply(
        fallbackLines.length
          ? `Here is what I can confirm right now:\n${fallbackLines.join("\n")}`
          : "Please ask about equipment, delivery, returns, or warranties so I can help immediately."
      );
      return NextResponse.json({ data: { reply } });
    }

    const payload = {
      model: process.env.GROQ_CHAT_MODEL ?? "llama-3.1-8b-instant",
      temperature: 0.3,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "system", content: "Format every sentence on its own line." },
        { role: "system", content: `Context:\n${context}` },
        ...messages,
      ],
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const fallbackLines = topDocs.slice(0, 4).map((doc, index) => `${index + 1}. ${doc.title}`);
      const reply = normalizeReply(
        fallbackLines.length
          ? `Here is what I can confirm right now:\n${fallbackLines.join("\n")}`
          : "Please share a bit more detail so I can answer accurately."
      );
      return NextResponse.json({ data: { reply } });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    let reply = normalizeReply(data.choices?.[0]?.message?.content ?? "");
    if (!reply) {
      const fallbackLines = topDocs.slice(0, 4).map((doc, index) => `${index + 1}. ${doc.title}`);
      reply = normalizeReply(
        fallbackLines.length
          ? `Here is what I can confirm right now:\n${fallbackLines.join("\n")}`
          : "Please share a bit more detail so I can answer accurately."
      );
    }

    return NextResponse.json({
      data: {
        reply,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
