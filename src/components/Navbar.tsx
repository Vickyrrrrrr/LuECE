"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-cream/80 backdrop-blur-md border-b border-cream-border px-6 py-4 flex justify-between items-center"
    >
      <a href="/" className="text-xl font-semibold tracking-tight-sub text-charcoal no-underline">
        Lu<span className="text-charcoal-muted font-normal">ECE</span>
      </a>
      <div className="hidden md:flex gap-8 text-sm font-normal text-charcoal">
        <a href="/#overview" className="hover:text-charcoal transition-colors">Overview</a>
        <a href="/#faculty" className="hover:text-charcoal transition-colors">Faculty</a>
        <a href="/#cutoffs" className="hover:text-charcoal transition-colors">Cutoffs</a>
        <a href="/#faq" className="hover:text-charcoal transition-colors">FAQ</a>
        <a href="/chat" className="hover:text-charcoal transition-colors font-medium">Ask Advisor</a>
      </div>
      <a href="/chat" className="btn-primary">
        Ask Advisor
      </a>
    </motion.nav>
  );
}
