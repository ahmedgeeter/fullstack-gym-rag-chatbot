import { pipeline, env } from "@xenova/transformers";

// Use Vercel's writable /tmp directory to avoid read-only filesystem errors
env.cacheDir = "/tmp";
env.allowLocalModels = false;

type Embedder = (input: string, options?: Record<string, unknown>) => Promise<{ data: Float32Array }>;

let embedderPromise: Promise<Embedder> | null = null;

const loadEmbedder = async () => {
  if (!embedderPromise) {
    embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      quantized: true,
    }) as Promise<Embedder>;
  }

  return embedderPromise;
};

export const embedText = async (text: string) => {
  try {
    const embedder = await loadEmbedder();
    const output = await embedder(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  } catch (err) {
    console.error("Embedding error:", err);
    return new Array(384).fill(0);
  }
};
