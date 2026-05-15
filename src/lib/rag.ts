import { ECE_DATA } from "./data";
import { CUTOFF_DATA } from "./cutoff";

type Chunk = {
  id: string;
  keywords: string[];
  synonyms: string[];
  response: string;
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countMatches(text: string, term: string): number {
  return (text.match(new RegExp(escapeRegex(term), "g")) || []).length;
}

function buildCutoffResponse(): string {
  if (CUTOFF_DATA.length === 0) return "";
  const years = [...new Set(CUTOFF_DATA.map(c => c.year))].sort((a, b) => b - a);
  const lines: string[] = ["Previous year closing ranks (UPTAC) for ECE at Lucknow University:"];
  for (const year of years) {
    lines.push(`\n${year}:`);
    const rounds = [...new Set(CUTOFF_DATA.filter(c => c.year === year).map(c => c.round))].sort();
    for (const round of rounds) {
      const entries = CUTOFF_DATA.filter(c => c.year === year && c.round === round);
      lines.push(`  Round ${round}:`);
      for (const e of entries) {
        lines.push(`    ${e.category}: ${e.rank.toLocaleString("en-IN")}`);
      }
    }
  }
  return lines.join("\n");
}

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
        synonyms: ["phd", "doctorate", "iit", "instructor", "mentor", "researcher", "experienced", "doctor", "siddharth", "anand", "manoj", "anum", "roli", "deepak", "gupta", "akshat", "sonkar", "assistant dean", "assistant professor", "coordinator", "guest faculty", "student assistant", "style"],
        response: ECE_DATA.faculty.content,
      },
      ...(() => {
        const cutoffText = buildCutoffResponse();
        return cutoffText
          ? [{
              id: "cutoffs",
              keywords: ["cutoff", "cut off", "rank", "closing rank", "closing", "opening", "uptac"],
              synonyms: ["category", "general", "obc", "sc", "st", "ews", "admission", "counselling", "previous year", "merit", "female", "defence", "opening", "closing", "round", "rank list", "seat", "allotment", "jee main", "uptac", "2025", "close", "get in", "eligible", "chance", "required"],
              response: cutoffText,
            }]
          : [];
      })(),
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

  private scoreChunk(chunk: Chunk, normalized: string): number {
    let score = 0;
    for (const kw of chunk.keywords) {
      score += countMatches(normalized, kw) * 3;
    }
    for (const syn of chunk.synonyms) {
      score += countMatches(normalized, syn);
    }
    return score;
  }

  query(input: string): { answer: string | null; source: "cache" | "local" | null; id?: string } {
    const n = this.normalize(input);

    const cached = this.cache.get(n);
    if (cached) return { answer: cached, source: "cache" };

    let bestScore = 0;
    let bestChunk: Chunk | null = null;

    for (const chunk of this.chunks) {
      const score = this.scoreChunk(chunk, n);
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

  getRelevantContext(input: string): string {
    const n = this.normalize(input);
    const results: { chunk: Chunk; score: number }[] = [];

    for (const chunk of this.chunks) {
      const score = this.scoreChunk(chunk, n);
      if (score > 0) results.push({ chunk, score });
    }

    const top = results.sort((a, b) => b.score - a.score).slice(0, 3);
    
    if (top.length === 0) return "";

    return top.map(t => `=== ${t.chunk.id.toUpperCase()} ===\n${t.chunk.response}`).join("\n\n");
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
