import { ECE_DATA } from "./data";

type Chunk = {
  id: string;
  keywords: string[];
  synonyms: string[];
  response: string;
};

export class RAGEngine {
  private chunks: Chunk[];
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
    this.chunks = this.buildChunks();
  }

  private buildChunks(): Chunk[] {
    return [
      {
        id: "curriculum",
        keywords: ["curriculum", "syllabus", "teach", "subject", "study", "nep"],
        synonyms: ["course", "semester", "learn", "topic", "first year", "electronics", "math", "physics", "basic electronics", "signal", "embedded", "vlsi", "wireless", "digital", "lateral", "four year", "b.tech", "btech", "programme", "thrust", "semester"],
        response: ECE_DATA.curriculum.content,
      },
      {
        id: "infrastructure",
        keywords: ["infrastructure", "lab", "laboratory", "facility"],
        synonyms: ["library", "equipment", "internet", "pcb", "fabrication", "cadence", "matlab", "simulation", "building", "classroom", "high-speed", "computer centre", "server", "node", "solid state", "microprocessor", "microwave", "integrated circuit", "workshop", "jankipuram", "green", "solar", "campus"],
        response: ECE_DATA.infrastructure.content,
      },
      {
        id: "faculty",
        keywords: ["faculty", "teacher", "professor", "lecturer", "hod"],
        synonyms: ["phd", "doctorate", "iit", "instructor", "mentor", "researcher", "experienced", "doctor", "siddharth", "anand", "manoj", "anum", "roli", "assistant professor", "coordinator", "guest faculty"],
        response: ECE_DATA.faculty.content,
      },
      {
        id: "placements",
        keywords: ["placement", "job", "salary", "package", "lpa"],
        synonyms: ["recruit", "company", "career", "scope", "tcs", "infosys", "wipro", "bel", "opportunities", "average", "top", "graduate", "tech", "core", "training", "internship", "internshala", "bsnl", "airport", "hcl", "intel", "hpcl", "nielit", "summer training", "placement cell", "mock interview", "aptitude", "resume"],
        response: ECE_DATA.placements.content,
      },
      ...ECE_DATA.faq.map((faq, i) => ({
        id: `faq-${i}`,
        keywords: faq.question.toLowerCase().replace("?", "").split(" ").filter(w => w.length > 3),
        synonyms: [],
        response: faq.answer,
      })),
    ];
  }

  private normalize(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  }

  query(input: string): { answer: string | null; source: "cache" | "local" | null; id?: string } {
    const n = this.normalize(input);

    const cached = this.cache.get(n);
    if (cached) return { answer: cached, source: "cache" };

    let bestScore = 0;
    let bestChunk: Chunk | null = null;

    for (const chunk of this.chunks) {
      let score = 0;

      for (const kw of chunk.keywords) {
        const count = (n.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
        score += count * 3;
      }
      for (const syn of chunk.synonyms) {
        const count = (n.match(new RegExp(syn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
        score += count;
      }

      if (score > bestScore) {
        bestScore = score;
        bestChunk = chunk;
      }
    }

    if (bestScore >= 3) {
      return { answer: bestChunk!.response, source: "local", id: bestChunk!.id };
    }

    return { answer: null, source: null };
  }

  cacheResponse(query: string, response: string) {
    const n = this.normalize(query);
    this.cache.set(n, response);
    if (this.cache.size > 200) {
      const first = this.cache.keys().next().value;
      if (first) this.cache.delete(first);
    }
  }
}

export const rag = new RAGEngine();
