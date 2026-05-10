"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { ECE_DATA } from "@/lib/data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 max-w-3xl mx-auto py-12" id="faq">
      <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight-heading leading-[1.0] text-charcoal text-center mb-8 sm:mb-12">
        Common Questions
      </h2>
      {ECE_DATA.faq.map((item, i) => (
        <div key={i} className="card-premium cursor-pointer" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
          <div className="flex justify-between items-center gap-3">
            <h4 className="text-sm sm:text-lg font-normal text-charcoal">{item.question}</h4>
            {openIndex === i ? <Minus size={16} className="sm:hidden" /> : <Plus size={16} className="sm:hidden" />}
            {openIndex === i ? <Minus size={20} className="hidden sm:block flex-shrink-0" /> : <Plus size={20} className="hidden sm:block flex-shrink-0" />}
          </div>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-charcoal-muted leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
