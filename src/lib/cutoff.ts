export type CutoffEntry = {
  year: number;
  category: string;
  round: number;
  rank: number;
};

// Data sourced from JEE Main BE/B.Tech Cutoff 2025 for Lucknow University - ECE
// Ranks are closing ranks (last rank admitted) in each counselling round
export const CUTOFF_DATA: CutoffEntry[] = [
  // ── Round 2 ──────────────────────────────────────────
  { year: 2025, category: "General",           round: 2, rank: 156708 },
  { year: 2025, category: "EWS",               round: 2, rank: 166796 },
  { year: 2025, category: "BC",                round: 2, rank: 172163 },
  { year: 2025, category: "General (Female)",  round: 2, rank: 188421 },
  { year: 2025, category: "EWS (Female)",      round: 2, rank: 188897 },
  { year: 2025, category: "BC (Female)",       round: 2, rank: 205399 },
  { year: 2025, category: "General (Defence)", round: 2, rank: 248864 },
  { year: 2025, category: "OBC (Defence)",     round: 2, rank: 316285 },
  { year: 2025, category: "SC",                round: 2, rank: 408221 },
  { year: 2025, category: "SC (Female)",       round: 2, rank: 436829 },
  { year: 2025, category: "ST",                round: 2, rank: 887893 },

  // ── Round 3 ──────────────────────────────────────────
  { year: 2025, category: "General",           round: 3, rank: 157766 },
  { year: 2025, category: "EWS",               round: 3, rank: 170474 },
  { year: 2025, category: "BC",                round: 3, rank: 175183 },
  { year: 2025, category: "BC (Female)",       round: 3, rank: 206495 },
  { year: 2025, category: "SC",                round: 3, rank: 424903 },

  // ── Round 4 ──────────────────────────────────────────
  { year: 2025, category: "General",           round: 4, rank: 161476 },
  { year: 2025, category: "EWS",               round: 4, rank: 172469 },
  { year: 2025, category: "General (Female)",  round: 4, rank: 173183 },
  { year: 2025, category: "BC",                round: 4, rank: 179948 },
  { year: 2025, category: "BC (Female)",       round: 4, rank: 207345 },
  { year: 2025, category: "SC",                round: 4, rank: 461455 },
];

export function getCutoffYears(): number[] {
  const years = new Set(CUTOFF_DATA.map((e) => e.year));
  return Array.from(years).sort((a, b) => b - a);
}

export function getCutoffCategories(year: number): string[] {
  return Array.from(new Set(CUTOFF_DATA.filter((e) => e.year === year).map((e) => e.category)));
}

export function getCutoffRounds(year: number): number[] {
  return Array.from(new Set(CUTOFF_DATA.filter((e) => e.year === year).map((e) => e.round))).sort();
}

export function getCutoffForYear(year: number): CutoffEntry[] {
  return CUTOFF_DATA.filter((e) => e.year === year).sort((a, b) => {
    if (a.round !== b.round) return a.round - b.round;
    return a.rank - b.rank;
  });
}
