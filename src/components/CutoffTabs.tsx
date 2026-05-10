"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCutoffYears, getCutoffForYear, getCutoffRounds, getCutoffCategories } from "@/lib/cutoff";

export default function CutoffTabs() {
  const years = getCutoffYears();
  const [selectedYear, setSelectedYear] = useState(years[0] || 0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (years.length === 0) {
    return null;
  }

  const entries = getCutoffForYear(selectedYear);
  const rounds = getCutoffRounds(selectedYear);
  const categories = getCutoffCategories(selectedYear);
  const [selectedRound, setSelectedRound] = useState(rounds[0] || 1);

  const filtered = entries.filter(
    (e) => e.round === selectedRound && (!selectedCategory || e.category === selectedCategory)
  );

  const roundLabel = (r: number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const suffix = r <= 3 ? suffixes[r] : "th";
    return `${r}${suffix} Round`;
  };

  const formatRank = (n: number) => n.toLocaleString("en-IN");

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-cream-border" id="cutoffs">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight-heading leading-[1.0] text-charcoal mb-3 sm:mb-4">
            Cutoff Ranks
          </h2>
          <p className="text-sm sm:text-lg text-charcoal-muted">Previous year closing ranks for ECE at LU</p>
        </div>

        {/* Year tabs */}
        <div className="flex justify-center gap-2 mb-6 sm:mb-10">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => {
                setSelectedYear(y);
                const r = getCutoffRounds(y);
                setSelectedRound(r[0] || 1);
              }}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-pill text-xs sm:text-sm font-normal transition-all ${
                selectedYear === y
                  ? "bg-charcoal text-charcoal-offwhite shadow-inset-button"
                  : "bg-cream text-charcoal border border-cream-border hover:bg-cream-border"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Round tabs */}
        <div className="flex justify-center gap-2 mb-6 sm:mb-10">
          {rounds.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRound(r)}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-pill text-[10px] sm:text-xs font-normal transition-all ${
                selectedRound === r
                  ? "bg-charcoal text-charcoal-offwhite shadow-inset-button"
                  : "bg-cream text-charcoal border border-cream-border"
              }`}
            >
              {roundLabel(r)}
            </button>
          ))}
        </div>

        {/* Category filter pills */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-pill text-[10px] sm:text-xs transition-all ${
              !selectedCategory
                ? "bg-charcoal text-charcoal-offwhite"
                : "bg-cream text-charcoal border border-cream-border"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-pill text-[10px] sm:text-xs transition-all ${
                selectedCategory === c
                  ? "bg-charcoal text-charcoal-offwhite"
                  : "bg-cream text-charcoal border border-cream-border"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="card-premium overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-cream-border text-charcoal-muted text-[10px] sm:text-xs uppercase tracking-widest">
                  <th className="text-left px-4 sm:px-6 py-3 sm:py-4 font-normal">Category</th>
                  <th className="text-left px-4 sm:px-6 py-3 sm:py-4 font-normal">Closing Rank</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((e, i) => (
                    <motion.tr
                      key={`${e.category}-${e.round}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-cream-border last:border-0 hover:bg-[rgba(28,28,28,0.02)] transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-charcoal">{e.category}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-charcoal">{formatRank(e.rank)}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="px-4 sm:px-6 py-8 sm:py-12 text-center text-charcoal-muted text-xs sm:text-sm">
              No cutoff data for this selection.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
