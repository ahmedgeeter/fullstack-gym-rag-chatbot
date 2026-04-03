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
    let dynamicContext = "";
    const documents = await loadDocuments();
    const knowledgeContext = documents.map(doc => `Source: ${doc.title}\n${doc.content}`).join("\n---\n");
    
    if (wantsCatalog || wantsRecommendation || matchedCategory) {
      const catalogProducts = await prisma.product.findMany({
        where: matchedCategory ? { category: { slug: matchedCategory } } : undefined,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      if (catalogProducts.length) {
        dynamicContext += "Related Catalog Products:\n" + catalogProducts.map(p => `- ${p.name} [${p.category?.name}]: €${p.price}. ${p.shortDescription}. Warranty: ${p.warrantyMonths} months.`).join("\n") + "\n\n";
      }
    }

    if (wantsShipping || wantsWarranty) {
      const shippingMethods = await prisma.shippingMethod.findMany({ orderBy: { sortOrder: "asc" } });
      if (shippingMethods.length) {
        dynamicContext += "Shipping Methods:\n" + shippingMethods.map(m => `- ${m.name}: €${m.price} (ETA ${m.etaDays} days)`).join("\n") + "\n\n";
      }
    }
    
    const context = `Store Policies & Database Info:\n${knowledgeContext}\n\n${dynamicContext}`.slice(0, 6000);

    if (!groqApiKey) {
      return NextResponse.json({ data: { reply: "I am functioning in fallback mode since no API key is available. However, I am ready!" } });
    }

    const payload = {
      model: process.env.GROQ_CHAT_MODEL ?? "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "system", content: "You are Coremont Assist, an elite AI for a premium fitness brand. Answer queries accurately, intelligently, and elegantly. Use bullet points and paragraphs to organize your responses beautifully. Never say 'Based on the context', just answer naturally like a human expert. Impress the user with your precision." },
        { role: "system", content: `Context Data:\n${context}` },
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
      const fallbackLines = documents.slice(0, 4).map((doc, index) => `${index + 1}. ${doc.title}`);
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
      const fallbackLines = documents.slice(0, 4).map((doc, index) => `${index + 1}. ${doc.title}`);
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
