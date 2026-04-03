import { pipeline } from "@xenova/transformers";

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
  const embedder = await loadEmbedder();
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
};
