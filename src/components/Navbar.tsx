"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-cream/80 backdrop-blur-md border-b border-cream-border px-6 py-4 flex justify-between items-center"
    >
      <div className="text-xl font-semibold tracking-tight-sub text-charcoal">
        Lu<span className="text-charcoal-muted font-normal">ECE</span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-normal text-charcoal">
        <a href="#curriculum" className="hover:text-charcoal transition-colors">Curriculum</a>
        <a href="#infrastructure" className="hover:text-charcoal transition-colors">Infrastructure</a>
        <a href="#placements" className="hover:text-charcoal transition-colors">Placements</a>
        <a href="#faq" className="hover:text-charcoal transition-colors">FAQ</a>
      </div>
      <button className="btn-primary">
        Connect
      </button>
    </motion.nav>
  );
}
