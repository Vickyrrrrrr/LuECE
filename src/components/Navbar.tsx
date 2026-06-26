"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  function navigateTo(section: string) {
    setOpen(false);
    if (isHome) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-cream/80 backdrop-blur-md border-b border-cream-border px-4 sm:px-6 py-4 flex justify-between items-center"
    >
      <a href="/" className="text-xl font-semibold tracking-tight-sub text-charcoal no-underline">
        Lu<span className="text-charcoal-muted font-normal">ECE</span>
      </a>
      <div className="hidden md:flex gap-8 text-sm font-normal text-charcoal">
        <button onClick={() => navigateTo("overview")} className="hover:text-charcoal transition-colors cursor-pointer">Overview</button>
        <a href="/roadmap" className="hover:text-charcoal transition-colors">Getting Started</a>
        <button onClick={() => navigateTo("faculty")} className="hover:text-charcoal transition-colors cursor-pointer">Faculty</button>
        <button onClick={() => navigateTo("cutoffs")} className="hover:text-charcoal transition-colors cursor-pointer">Cutoffs</button>
        <button onClick={() => navigateTo("faq")} className="hover:text-charcoal transition-colors cursor-pointer">FAQ</button>
        <a href="/chat" className="hover:text-charcoal transition-colors font-medium">Ask Advisor</a>
      </div>
      <div className="flex items-center gap-3">
        <a href="/chat" className="btn-primary hidden sm:inline-flex">Ask Advisor</a>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-charcoal">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 bg-cream border-b border-cream-border px-4 py-4 flex flex-col gap-4 text-sm md:hidden"
          >
            <button onClick={() => navigateTo("overview")} className="hover:text-charcoal transition-colors text-left cursor-pointer">Overview</button>
            <a href="/roadmap" onClick={() => setOpen(false)} className="hover:text-charcoal transition-colors">Getting Started</a>
            <button onClick={() => navigateTo("faculty")} className="hover:text-charcoal transition-colors text-left cursor-pointer">Faculty</button>
            <button onClick={() => navigateTo("cutoffs")} className="hover:text-charcoal transition-colors text-left cursor-pointer">Cutoffs</button>
            <button onClick={() => navigateTo("faq")} className="hover:text-charcoal transition-colors text-left cursor-pointer">FAQ</button>
            <a href="/chat" onClick={() => setOpen(false)} className="font-medium text-charcoal">Ask Advisor</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
