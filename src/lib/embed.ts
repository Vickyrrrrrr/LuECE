type ModelPipeline = {
  embed: (text: string) => Promise<Float32Array>;
};

let model: ModelPipeline | null = null;
let loading: Promise<ModelPipeline> | null = null;

export async function getEmbedder(): Promise<ModelPipeline> {
  if (model) return model;
  if (loading) return loading;

  loading = (async () => {
    const { pipeline } = await import("@huggingface/transformers");
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    model = {
      embed: async (text: string) => {
        const result = await extractor(text, { pooling: "mean", normalize: true });
        return result.data as Float32Array;
      },
    };
    return model;
  })();

  return loading;
}

export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
