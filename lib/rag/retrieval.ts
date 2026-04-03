type Vector = number[];

type DocumentVector = {
  id: string;
  title: string;
  content: string;
  source: string;
  embedding: Vector;
};

export const cosineSimilarity = (a: Vector, b: Vector) => {
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    aNorm += a[i] * a[i];
    bNorm += b[i] * b[i];
  }

  if (!aNorm || !bNorm) return 0;
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
};

export const getTopMatches = (
  query: Vector,
  documents: DocumentVector[],
  limit = 4
) => {
  return documents
    .map((doc) => ({ doc, score: cosineSimilarity(query, doc.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.doc);
};

export const getTopMatchesWithScore = (
  query: Vector,
  documents: DocumentVector[],
  limit = 4
) => {
  return documents
    .map((doc) => ({ doc, score: cosineSimilarity(query, doc.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
