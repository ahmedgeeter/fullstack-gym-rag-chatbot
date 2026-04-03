import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const seedPath = path.join(root, "prisma", "seed.ts");
const productsDir = path.join(root, "public", "images", "products");
const collectionsDir = path.join(root, "public", "images", "collections");
const fallbackDir = path.join(root, "public", "images", "fallback");

const categoryQueries = {
  treadmills: "treadmill gym",
  "exercise-bikes": "exercise bike gym",
  "rowing-machines": "rowing machine gym",
  benches: "weight bench gym",
  "adjustable-dumbbells": "adjustable dumbbells",
  "racks-rigs": "power rack gym",
  "cable-systems": "cable machine gym",
  "mats-accessories": "gym mat fitness",
  bundles: "home gym setup",
};

const categoryFilters = {
  treadmills: ["treadmill"],
  "exercise-bikes": ["bike", "bicycle", "cycling", "spin"],
  "rowing-machines": ["row", "rower", "rowing"],
  benches: ["bench"],
  "adjustable-dumbbells": ["dumbbell"],
  "racks-rigs": ["rack", "rig", "squat", "power"],
  "cable-systems": ["cable", "pulley", "functional trainer"],
  "mats-accessories": ["mat", "band", "accessory", "foam"],
  bundles: ["gym", "fitness", "training", "strength"],
};

const collectionQueries = {
  "compact-home-gym": "home gym interior",
  "studio-essentials": "studio gym equipment",
  "best-sellers": "fitness equipment gym",
  "quiet-cardio": "cardio equipment gym",
  "strength-foundations": "strength training gym",
  bundles: "home gym setup",
};

const collectionFilters = ["gym", "fitness", "training", "equipment", "strength"];

const pexelsApiKey = process.env.PEXELS_API_KEY;
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPexelsJson = async (url, retries = 3) => {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "coremont-image-fetch/1.0",
        Authorization: pexelsApiKey ?? "",
      },
    });
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        const waitMs = retryAfter ? retryAfter * 1000 : 6000;
        await sleep(waitMs);
        return fetchPexelsJson(url, retries - 1);
      }
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(1200);
    return fetchPexelsJson(url, retries - 1);
  }
};

const searchImages = async (
  query,
  limit = 30,
  keywords = [],
  orientation = "portrait"
) => {
  if (!pexelsApiKey) {
    throw new Error("Missing PEXELS_API_KEY");
  }

  const searchUrl = new URL("https://api.pexels.com/v1/search");
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("per_page", String(Math.min(limit, 80)));
  searchUrl.searchParams.set("orientation", orientation);

  const data = await fetchPexelsJson(searchUrl.toString());
  const photos = data.photos ?? [];
  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());

  let filtered = photos;
  if (normalizedKeywords.length) {
    const matches = photos.filter((photo) => {
      const alt = String(photo.alt ?? "").toLowerCase();
      return normalizedKeywords.some((keyword) => alt.includes(keyword));
    });
    if (matches.length) {
      filtered = matches;
    }
  }

  const urls = filtered
    .map((photo) => photo.src?.large2x ?? photo.src?.large ?? photo.src?.original)
    .filter((url) => typeof url === "string");

  return Array.from(new Set(urls));
};

const downloadImage = async (url, filePath, retries = 4) => {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "coremont-image-fetch/1.0" },
    });
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        const waitMs = retryAfter ? retryAfter * 1000 : 8000;
        await sleep(waitMs);
        return downloadImage(url, filePath, retries - 1);
      }
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    const contentLength = Number(response.headers.get("content-length") ?? "0");
    if (contentLength && contentLength > MAX_IMAGE_BYTES) {
      throw new Error(`Image too large: ${contentLength}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
      throw new Error(`Image too large: ${arrayBuffer.byteLength}`);
    }
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
  } catch (error) {
    if (retries <= 0) throw error;
    const waitMs = (5 - retries) * 1500 + 1500;
    await sleep(waitMs);
    return downloadImage(url, filePath, retries - 1);
  }
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const parseBlock = (content, startToken) => {
  const start = content.indexOf(startToken);
  if (start === -1) return "";
  const end = content.indexOf("];", start);
  if (end === -1) return "";
  return content.slice(start, end);
};

const parseProducts = (content) => {
  const block = parseBlock(content, "const productCatalog = [");
  const matches = [...block.matchAll(/name:\s*\"([^\"]+)\"[\s\S]*?slug:\s*\"([^\"]+)\"[\s\S]*?categorySlug:\s*\"([^\"]+)\"/g)];
  return matches.map((match) => ({ name: match[1], slug: match[2], category: match[3] }));
};

const parseCollections = (content) => {
  const block = parseBlock(content, "const collections = [");
  const matches = [...block.matchAll(/slug:\s*\"([^\"]+)\"[\s\S]*?heroImageAlt:\s*\"([^\"]+)\"/g)];
  return matches.map((match) => ({ slug: match[1], alt: match[2] }));
};

const buildProductQuery = (name) => {
  const cleaned = name
    .replace(/coremont/gi, "")
    .replace(/\b\d+(kg)?\b/gi, "")
    .replace(/\b[srtmvc]\d+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const query = cleaned ? `${cleaned} gym` : "gym equipment";
  return query;
};

const main = async () => {
  await fs.mkdir(productsDir, { recursive: true });
  await fs.mkdir(collectionsDir, { recursive: true });
  await fs.mkdir(fallbackDir, { recursive: true });

  const seedContent = await fs.readFile(seedPath, "utf-8");
  const products = parseProducts(seedContent);
  const collections = parseCollections(seedContent);
  const force = process.argv.includes("--force");

  const fallbackPool = await searchImages(
    "gym equipment",
    40,
    ["gym", "fitness", "equipment"],
    "portrait"
  );
  const usedUrls = new Set();

  const takeUrl = (pool) => pool.find((item) => !usedUrls.has(item)) ?? null;

  const downloadFromPool = async (pool, filePath, label) => {
    for (const url of pool) {
      if (usedUrls.has(url)) continue;
      try {
        await downloadImage(url, filePath);
        usedUrls.add(url);
        return true;
      } catch (error) {
        usedUrls.add(url);
        console.warn(`Skipped ${label}: ${String(error)}`);
      }
    }
    return false;
  };

  for (const product of products) {
    const filePath = path.join(productsDir, `${product.slug}.jpg`);
    if (!force && (await fileExists(filePath))) {
      continue;
    }
    const filters = categoryFilters[product.category] ?? ["gym", "fitness"];
    const productQuery = buildProductQuery(product.name);
    let urls = await searchImages(productQuery, 20, filters, "portrait");
    await sleep(600);
    if (!urls.length) {
      const categoryQuery = categoryQueries[product.category] ?? "gym equipment";
      urls = await searchImages(categoryQuery, 20, filters, "portrait");
      await sleep(600);
    }
    const primaryPool = urls.length ? urls : fallbackPool;
    const downloaded = await downloadFromPool(primaryPool, filePath, product.slug);
    if (!downloaded) {
      const fallbackDownloaded = await downloadFromPool(fallbackPool, filePath, product.slug);
      if (!fallbackDownloaded) {
        console.warn(`No image found for ${product.slug}`);
      }
    }
    await sleep(1200);
  }

  for (const collection of collections) {
    const filePath = path.join(collectionsDir, `${collection.slug}.jpg`);
    if (!force && (await fileExists(filePath))) {
      continue;
    }
    const query = collectionQueries[collection.slug] ?? "fitness gym";
    const urls = await searchImages(query, 20, collectionFilters, "landscape");
    const url = urls.find((item) => !usedUrls.has(item)) ?? urls[0];
    if (!url) {
      console.warn(`No hero image found for ${collection.slug}`);
      continue;
    }
    usedUrls.add(url);
    try {
      await downloadImage(url, filePath);
    } catch (error) {
      console.warn(`Failed to download hero ${collection.slug}: ${String(error)}`);
    }
    await sleep(1200);
  }

  const fallbackProductUrl = (
    await searchImages("fitness equipment", 10, ["gym", "fitness"], "portrait")
  )[0];
  const fallbackHeroUrl = (
    await searchImages("fitness gym", 10, ["gym", "fitness"], "landscape")
  )[0];

  const productFallback = path.join(fallbackDir, "product.jpg");
  const heroFallback = path.join(fallbackDir, "hero.jpg");

  if (fallbackProductUrl && (force || !(await fileExists(productFallback)))) {
    try {
      await downloadImage(fallbackProductUrl, productFallback);
    } catch (error) {
      console.warn(`Failed to download fallback product: ${String(error)}`);
    }
  }

  if (fallbackHeroUrl && (force || !(await fileExists(heroFallback)))) {
    try {
      await downloadImage(fallbackHeroUrl, heroFallback);
    } catch (error) {
      console.warn(`Failed to download fallback hero: ${String(error)}`);
    }
  }

  console.log("✅ Download complete.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
