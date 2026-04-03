import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/db/prisma";
import { embedText } from "../lib/rag/embeddings";

type KnowledgeInput = {
  source: string;
  title: string;
  content: string;
};

const chunkText = (text: string, chunkSize = 1200, overlap = 200) => {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= chunkSize) return [trimmed];

  const chunks: string[] = [];
  let start = 0;

  while (start < trimmed.length) {
    const end = Math.min(trimmed.length, start + chunkSize);
    chunks.push(trimmed.slice(start, end));
    if (end === trimmed.length) break;
    const nextStart = Math.max(end - overlap, 0);
    if (nextStart <= start) break;
    start = nextStart;
  }

  return chunks;
};

const loadMarkdownKnowledge = async () => {
  const directory = path.join(process.cwd(), "content", "knowledge");
  const entries = await fs.readdir(directory);

  const docs: KnowledgeInput[] = [];
  for (const file of entries) {
    if (!file.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(directory, file), "utf-8");
    const [firstLine, ...rest] = raw.split("\n");
    const title = firstLine.replace(/^#\s*/, "").trim() || file.replace(/\.md$/, "");
    docs.push({ source: `markdown:${file}`, title, content: rest.join("\n").trim() });
  }

  return docs;
};

const loadDatabaseKnowledge = async () => {
  const [products, categories, collections, faqs, shipping, payment] = await Promise.all([
    prisma.product.findMany({ include: { brand: true, category: true } }),
    prisma.category.findMany(),
    prisma.collection.findMany(),
    prisma.fAQ.findMany(),
    prisma.shippingMethod.findMany(),
    prisma.paymentMethod.findMany(),
  ]);

  const docs: KnowledgeInput[] = [];

  products.forEach((product: (typeof products)[number]) => {
    const lines = [
      `Product: ${product.name}`,
      product.shortDescription ?? "",
      product.description ?? "",
      `Price: €${product.price}`,
      `Category: ${product.category?.name ?? ""}`,
      `Brand: ${product.brand?.name ?? ""}`,
      `Usage: ${product.usageType ?? ""}`,
      `Footprint: ${product.footprintTag ?? ""}`,
      `Stock: ${product.stockStatus}`,
      `Warranty: ${product.warrantyMonths ? `${product.warrantyMonths} months` : ""}`,
      `Shipping estimate: ${product.shippingEstimateDays ?? ""} days`,
    ].filter(Boolean);

    docs.push({
      source: `product:${product.slug}`,
      title: product.name,
      content: lines.join("\n"),
    });
  });

  categories.forEach((category: (typeof categories)[number]) => {
    docs.push({
      source: `category:${category.slug}`,
      title: `Category: ${category.name}`,
      content: category.description ?? category.name,
    });
  });

  collections.forEach((collection: (typeof collections)[number]) => {
    docs.push({
      source: `collection:${collection.slug}`,
      title: `Collection: ${collection.name}`,
      content: collection.description ?? collection.name,
    });
  });

  faqs.forEach((faq: (typeof faqs)[number]) => {
    docs.push({
      source: `faq:${faq.id}`,
      title: faq.question,
      content: faq.answer,
    });
  });

  shipping.forEach((method: (typeof shipping)[number]) => {
    docs.push({
      source: `shipping:${method.name}`,
      title: `Shipping: ${method.name}`,
      content: `Price: €${method.price}. ETA: ${method.etaDays} days.`,
    });
  });

  payment.forEach((method: (typeof payment)[number]) => {
    docs.push({
      source: `payment:${method.name}`,
      title: `Payment: ${method.name}`,
      content: `Type: ${method.type}. Provider: ${method.provider ?? ""}`,
    });
  });

  return docs;
};

const indexKnowledge = async () => {
  const [markdownDocs, databaseDocs] = await Promise.all([
    loadMarkdownKnowledge(),
    loadDatabaseKnowledge(),
  ]);

  const inputs = [...markdownDocs, ...databaseDocs];
  await prisma.knowledgeDocument.deleteMany();

  for (const entry of inputs) {
    const chunks = chunkText(entry.content);

    for (const chunk of chunks) {
      const embedding = await embedText(chunk);
      await prisma.knowledgeDocument.create({
        data: {
          source: entry.source,
          title: entry.title,
          content: chunk,
          embedding,
        },
      });
    }
  }
};

indexKnowledge()
  .then(() => {
    console.log("Coremont knowledge indexed.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
