import { ECE_DATA } from "./data";
import { CUTOFF_DATA } from "./cutoff";

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

// ── Full context built from all data, sent with every LLM call ──

export function buildFullContext(): string {
  const sections: string[] = [];

  sections.push(`=== CURRICULUM ===\n${ECE_DATA.curriculum.content}`);
  sections.push(`=== INFRASTRUCTURE ===\n${ECE_DATA.infrastructure.content}`);
  sections.push(`=== FACULTY ===\n${ECE_DATA.faculty.content}`);
  sections.push(`=== PLACEMENTS ===\n${ECE_DATA.placements.content}`);
  sections.push(`=== ROADMAP ===\n${ECE_DATA.roadmap.content}`);

  const cutoffText = buildCutoffResponse();
  if (cutoffText) sections.push(`=== CUTOFFS ===\n${cutoffText}`);

  ECE_DATA.faq.forEach((faq, i) => {
    sections.push(`=== FAQ ${i + 1}: ${faq.question} ===\n${faq.answer}`);
  });

  return sections.join("\n\n");
}

// ── Legacy keyword engine (fallback only) ──

type LegacyChunk = {
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

function buildLegacyChunks(): LegacyChunk[] {
  return [
    {
      id: "curriculum",
      keywords: ["curriculum", "syllabus", "subjects", "study", "nep"],
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
      synonyms: ["phd", "doctorate", "iit", "instructor", "mentor", "researcher", "experienced", "doctor", "siddharth", "anand", "manoj", "anum", "roli", "deepak", "gupta", "akshat", "sonkar", "assistant dean", "assistant professor", "coordinator", "guest faculty", "student assistant", "best", "good", "senior", "guide"],
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
        id: "roadmap",
        keywords: ["roadmap", "vlsi", "chip design", "silicon", "tape-out", "verilog", "physical design", "semiconductor"],
        synonyms: ["nptel", "vlsii", "rtl", "synthesis", "pnr", "placement and routing", "cts", "clock tree", "floorplan", "yosys", "openlane", "openroad", "tiny tapeout", "agentic-ic", "before college", "coming to college", "before joining", "preparation", "before you arrive", "pre-college", "what should i do before", "get started", "start learning vlsi", "zero to silicon", "asic", "fpga", "digital design", "hdl", "systemverilog", "uvm", "verification", "k-map", "boolean", "number system", "binary", "hex"],
        response: ECE_DATA.roadmap.content,
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

export class RAGEngine {
  private chunks: LegacyChunk[];
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
    this.chunks = buildLegacyChunks();
  }

  query(input: string): { answer: string | null; source: "cache" | "local" | null; id?: string } {
    const n = input.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    const cached = this.cache.get(n);
    if (cached) return { answer: cached, source: "cache" };

    let bestScore = 0;
    let bestChunk: LegacyChunk | null = null;

    for (const chunk of this.chunks) {
      let score = 0;
      for (const kw of chunk.keywords) {
        score += countMatches(n, kw) * 3;
      }
      for (const syn of chunk.synonyms) {
        score += countMatches(n, syn);
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

  getRelevantContext(input: string): string {
    const n = input.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    const results: { chunk: LegacyChunk; score: number }[] = [];
    for (const chunk of this.chunks) {
      let score = 0;
      for (const kw of chunk.keywords) score += countMatches(n, kw) * 3;
      for (const syn of chunk.synonyms) score += countMatches(n, syn);
      if (score > 0) results.push({ chunk, score });
    }
    const top = results.sort((a, b) => b.score - a.score).slice(0, 3);
    if (top.length === 0) return "";
    return top.map(t => `=== ${t.chunk.id.toUpperCase()} ===\n${t.chunk.response}`).join("\n\n");
  }

  cacheResponse(query: string, response: string) {
    const n = query.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    this.cache.set(n, response);
    if (this.cache.size > 200) {
      const first = this.cache.keys().next().value;
      if (first) this.cache.delete(first);
    }
  }
}

export const rag = new RAGEngine();
