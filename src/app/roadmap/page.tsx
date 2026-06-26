"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Cpu, Layers, Cable, Microchip, CircuitBoard, Binary, ArrowRight, ExternalLink, Award, ChevronDown, GraduationCap, CheckCircle } from "lucide-react";

const phases = [
  {
    icon: Cable,
    title: "Set Up Your Environment",
    desc: "All EDA tools run on Linux. Set up Ubuntu (or WSL2 on Windows), then let agentic-ic handle the rest.",
    topics: ["Install Ubuntu or WSL2", "pip install agentic-ic", "agentic setup", "agentic doctor"],
    resources: [
      { label: "Ubuntu Installation Guide", url: "https://ubuntu.com/download/desktop" },
      { label: "WSL2 Setup on Windows", url: "https://learn.microsoft.com/en-us/windows/wsl/install" },
      { label: "agentic-ic on PyPI", url: "https://pypi.org/project/agentic-ic/" },
    ],
  },
  {
    icon: Binary,
    title: "Digital Electronics Fundamentals",
    desc: "Before touching any tools, you need a rock-solid grasp of digital logic. This is the foundation everything else sits on.",
    topics: ["Number systems & Boolean algebra", "Combinational logic (gates, MUX, decoders)", "Sequential logic (flip-flops, counters, FSMs)", "Logic minimization (K-maps, QMC)", "Static & dynamic timing concepts"],
    resources: [
      { label: "Digital Design — Morris Mano", url: "https://www.amazon.com/Digital-Design-6th-M-MORRIS-MANO/dp/9353167887" },
      { label: "CMOS Digital VLSI Design — NPTEL (Video Course)", url: "https://www.youtube.com/playlist?list=PLLy_2iUCG87Bdulp9brz9AcvW_TnFCUmM" },
      { label: "Switching Circuits & Logic Design — NPTEL (Video Course)", url: "https://www.youtube.com/playlist?list=PLbRMhDVUMngfV8C6ElNAUaQQz06wEhFM5" },
      { label: "MIT 6.004: Computation Structures", url: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/" },
      { label: "CircuitVerse — Online Simulator", url: "https://circuitverse.org" },
    ],
  },
  {
    icon: BookOpen,
    title: "Hardware Description Languages",
    desc: "Verilog and SystemVerilog are the lingua franca of chip design. Learn to think in hardware, not software.",
    topics: ["Verilog: modules, always blocks, assignments", "Synthesizable vs non-synthesizable constructs", "Finite State Machine coding", "Testbenches & simulation", "SystemVerilog for verification (assertions, interfaces)"],
    resources: [
      { label: "Hardware Modelling using Verilog — NPTEL (Video Course)", url: "https://www.youtube.com/playlist?list=PLRsFfXmDi9IYCNlvNjrsD8bLMmNE0UxBH" },
      { label: "Verilog HDL — Samir Palnitkar", url: "https://www.amazon.com/Verilog-HDL-Digital-Design-Synthesis/dp/0130449113" },
      { label: "EDA Playground (Browser-based sim)", url: "https://www.edaplayground.com" },
      { label: "Icarus Verilog + GTKWave Guide", url: "https://iverilog.fandom.com/wiki/Getting_Started" },
      { label: "HDLBits — Verilog Practice Problems", url: "https://hdlbits.01xz.net" },
    ],
  },
  {
    icon: Cpu,
    title: "RTL Design & Logic Synthesis",
    desc: "Transform your HDL code into actual gates. This is where you learn what the tools do and how to write efficient RTL.",
    topics: ["RTL design methodology", "Synthesis flow: RTL → netlist", "Timing constraints (SDC)", "Area vs speed tradeoffs", "Clock domains & synchronization"],
    resources: [
      { label: "VLSI Design Flow: RTL to GDS — NPTEL (Video Course)", url: "https://www.youtube.com/playlist?list=PL4PtpyzWn6WbpzsiququkQV8Wqa_LzaqR" },
      { label: "Yosys Open Synthesis Suite", url: "https://yosyshq.net/yosys/" },
      { label: "RTL Design — Suchit Bhatnagar (free PDF roadmap)", url: "https://www.vlsisystemdesign.com" },
      { label: "OpenLane — Open-source ASIC Flow", url: "https://github.com/efabless/openlane2" },
      { label: "Yosys + Verilog Tutorial Series", url: "https://yosyshq.readthedocs.io" },
    ],
  },
  {
    icon: Layers,
    title: "Physical Design (PnR)",
    desc: "Floorplanning, placement, clock tree synthesis, and routing. This is the backend of VLSI where your netlist becomes a real chip layout.",
    topics: ["Floorplanning & power planning", "Placement & optimization", "Clock Tree Synthesis (CTS)", "Routing (global + detail)", "Static Timing Analysis (STA)", "Physical verification (DRC, LVS, ANT)"],
    resources: [
      { label: "VLSI Physical Design Full Course — VLSI Academy (Video)", url: "https://www.youtube.com/playlist?list=PL1h5a0eaDD3pimcMlzW15RpW02HPzIziL" },
      { label: "Physical Design Essentials — Khosrow Golshan", url: "https://link.springer.com/book/10.1007/978-0-387-68713-5" },
      { label: "OpenROAD — Open-source PnR", url: "https://theopenroadproject.org" },
      { label: "STA Primer: PrimeTime User Guide", url: "https://www.synopsys.com/prime-time.html" },
      { label: "OpenLane Flow Documentation", url: "https://openlane.readthedocs.io" },
    ],
  },
  {
    icon: Microchip,
    title: "Functional Verification",
    desc: "More than half the effort in chip design goes into verification. You'll need constrained-random, coverage-driven, and formal methods.",
    topics: ["Testbench architecture (driver, monitor, scoreboard)", "Constrained-random testing", "Code & functional coverage", "UVM (Universal Verification Methodology)", "Formal verification basics"],
    resources: [
      { label: "VLSI Design Verification & Test — NPTEL (Video Course)", url: "https://www.youtube.com/playlist?list=PLbMVogVj5nJTClnafWQ9FK2nt3cGG8kCF" },
      { label: "Design Verification with SystemVerilog/UVM — Udemy", url: "https://www.udemy.com/course/design-verification-with-systemverilog-uvm/" },
      { label: "SystemVerilog for Verification — Chris Spear", url: "https://www.amazon.com/SystemVerilog-Verification-Introduction-Processor-Architectures/dp/3030475183" },
      { label: "Verification Academy", url: "https://verificationacademy.com" },
      { label: "UVM 1.2 Reference Guide", url: "https://www.accellera.org/downloads/standards/uvm" },
    ],
  },
  {
    icon: CircuitBoard,
    title: "Tape-out & Silicon (Hands-on)",
    desc: "The best way to learn is to actually fabricate something. Open-source shuttle programs let students tape out for free or cheap.",
    topics: ["Caravel SoC / Harness architecture", "Tiny Tapeout shuttles", "Open-source PDK (SkyWater 130nm / GF 180nm)", "Managing a real tape-out schedule", "Post-silicon validation"],
    resources: [
      { label: "Tiny Tapeout — Submit Your Design", url: "https://tinytapeout.com" },
      { label: "Zero to ASIC Course", url: "https://zerotoasiccourse.com" },
      { label: "Efabless Caravel & MPW Shuttles", url: "https://efabless.com" },
      { label: "SkyWater PDK Documentation", url: "https://skywater-pdk.readthedocs.io" },
      { label: "Google + Efabless Open MPW Program", url: "https://platform.efabless.com" },
    ],
  },
  {
    icon: Award,
    title: "Advanced Topics & Specialization",
    desc: "Once you're comfortable with the standard flow, dive deeper into one of these areas that interest you most.",
    topics: ["Low-power design (UPF / CPF)", "DFT (Scan, BIST, Boundary Scan)", "IR drop & electromigration analysis", "Analog/Mixed-signal co-design", "AI-for-chip (ML in EDA)", "SoC architecture & NoC", "RISC-V CPU design"],
    resources: [
      { label: "Low-Power Methodology Manual (Synopsys)", url: "https://www.synopsys.com/lpmm" },
      { label: "DFT Essentials — Laung-Terng Wang", url: "https://link.springer.com/book/10.1007/0-387-34119-6" },
      { label: "PULP Platform (RISC-V SoCs)", url: "https://pulp-platform.org" },
      { label: "Chipyard RISC-V SoC Framework", url: "https://chipyard.readthedocs.io" },
      { label: "Free Silicon Conference Resources", url: "https://f-si.org" },
    ],
  },
];

const faqs = [
  { q: "Which tools are actually used in the industry?", a: "Industry standard is Synopsys (Design Compiler, ICC2, PrimeTime), Cadence (Genus, Innovus, Tempus), and Siemens (Questa, Calibre). For open-source, Yosys + OpenROAD + KLayout is fully capable of tape-out quality work." },
  { q: "Do I need Linux for VLSI?", a: "Yes — virtually all EDA tools run on Linux. Install Ubuntu or use WSL2 on Windows. Every open-source tool listed here runs on Linux." },
  { q: "Can I do VLSI as a college project?", a: "Absolutely. Tiny Tapeout lets you fabricate a design for ~$150. The Google/Efabless MPW program provides free shuttles for open-source designs. Join the community." },
  { q: "How long does it take to go from zero to tape-out?", a: "With focused effort (10-15 hrs/week): fundamentals 1-2 months, HDL 2 months, synthesis + physical design 3 months, tape-out ~1 month. About 6-9 months to fabricate your first chip." },
  { q: "What math do I need?", a: "Boolean algebra and basic probability (for verification coverage). No calculus-heavy stuff unless you go into analog/mixed-signal." },
  { q: "I haven't started college yet. Can I still learn VLSI?", a: "Yes. The roadmap assumes zero prior knowledge. Before you arrive, just watch a 10-min intro to VLSI on YouTube, install WSL2 if you're on Windows, and review binary/hex math. That's it — everything else is built step by step." },
];

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-pill bg-cream border border-cream-border text-[10px] sm:text-xs font-normal text-charcoal mb-6 sm:mb-8">
          <Cpu size={12} className="sm:hidden" />
          <Cpu size={14} className="hidden sm:block" />
          <span>VLSI Chip Design</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight-hero leading-[1.1] text-charcoal mb-6 sm:mb-8 max-w-4xl px-2"
        >
          Your VLSI Roadmap.
          <br />
          <span className="text-charcoal-muted font-normal">From zero to silicon.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-xl text-charcoal-muted max-w-2xl mb-10 sm:mb-12 leading-relaxed px-2"
        >
          A curated, no-fluff guide to learning chip design. Every resource here is hand-picked — no AI-generated nonsense, only the tools, books, and courses that actually work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none justify-center mb-16 sm:mb-24"
        >
          <button onClick={() => document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary text-sm sm:text-base">
            Start the Roadmap
          </button>
          <button onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })} className="btn-ghost text-sm sm:text-base">
            FAQs
          </button>
        </motion.div>
      </section>

      {/* Quick Overview */}
      <section className="px-4 sm:px-6 pb-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {phases.map((phase, i) => (
            <button
              key={i}
              onClick={() => document.getElementById(`step-${i}`)?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-standard bg-cream border border-cream-border hover:bg-cream-border transition-colors text-left"
            >
              <span className="text-[10px] sm:text-xs font-semibold text-charcoal-muted/60 w-4 flex-shrink-0">{i + 1}</span>
              <span className="text-[10px] sm:text-xs text-charcoal leading-tight">{phase.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Before You Arrive */}
      <section className="px-4 sm:px-6 pb-4 sm:pb-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-5 sm:p-7 border-l-4 border-l-charcoal"
        >
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-10 h-10 rounded-standard bg-charcoal items-center justify-center flex-shrink-0 mt-0.5">
              <GraduationCap size={18} className="text-cream" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap size={14} className="sm:hidden text-charcoal flex-shrink-0" />
                <h2 className="text-sm sm:text-lg font-semibold tracking-tight-sub text-charcoal">Before You Arrive</h2>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-3">
                Coming to college with zero VLSI knowledge? That's completely fine — the roadmap starts from scratch. But if you want to hit the ground running, here are a few things you can do before day one (each takes an evening):
              </p>
              <div className="space-y-1.5 mb-4">
                {[
                  "Watch a 10-min YouTube video on \"What is VLSI?\" — just to know what chip design looks like",
                  "Install WSL2 on Windows (or dual boot Ubuntu) — every VLSI tool runs on Linux",
                  "Brush up on binary, hex, and Boolean algebra — it's the alphabet of digital design",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-charcoal-muted/60 mt-0.5 flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs text-charcoal-muted leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 rounded-standard bg-cream border border-cream-border">
                <span className="text-[10px] sm:text-xs text-charcoal font-medium">Is this doable?</span>
                <span className="text-[10px] sm:text-xs text-charcoal-muted">Yes. Students with focused effort (10-15 hrs/week) go from zero to tape-out in 6-9 months. Thousands have done it before you — you will too.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Roadmap Steps */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto" id="roadmap">
        <div className="space-y-6 sm:space-y-8">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              id={`step-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="card-premium p-5 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-10 h-10 rounded-standard bg-charcoal items-center justify-center flex-shrink-0 mt-0.5">
                  <phase.icon size={18} className="text-cream" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] sm:text-xs font-semibold text-charcoal-muted/50 tracking-wider">{String(i + 1).padStart(2, "0")}</span>
                    <phase.icon size={14} className="sm:hidden text-charcoal flex-shrink-0" />
                    <h2 className="text-sm sm:text-lg font-semibold tracking-tight-sub text-charcoal">{phase.title}</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-4">{phase.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {phase.topics.map((topic, j) => (
                      <span key={j} className="px-2 py-1 text-[10px] sm:text-xs bg-cream border border-cream-border rounded-pill text-charcoal-muted">{topic}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {phase.resources.map((r, j) => (
                      <a
                        key={j}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] sm:text-xs bg-charcoal text-charcoal-offwhite rounded-standard hover:opacity-80 transition-opacity"
                      >
                        {r.label}
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 text-center" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-pill bg-cream border border-cream-border text-[10px] sm:text-xs font-normal text-charcoal mb-8 sm:mb-10">
            <Sparkles size={12} className="sm:hidden" />
            <Sparkles size={14} className="hidden sm:block" />
            <span>Quick Answers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight-heading leading-[1.0] text-charcoal mb-2">FAQs</h2>
          <p className="text-sm sm:text-lg text-charcoal-muted mb-10 sm:mb-14 px-2">Common questions from students starting their VLSI journey.</p>

          <div className="space-y-3 text-left">
            {faqs.map((faq, i) => (
              <div key={i} className="card-premium p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-medium text-charcoal mb-2">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16">
            <Link href="/chat" className="btn-primary text-sm sm:text-base">Ask the ECE Advisor</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-10 sm:py-12 border-t border-cream-border text-center">
        <div className="text-xl sm:text-2xl font-semibold tracking-tight-sub text-charcoal mb-3 sm:mb-4">
          Lu<span className="text-charcoal-muted font-normal">ECE</span>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-muted">© 2026 Department of ECE, Lucknow University. All rights reserved.</p>
        <p className="text-[10px] sm:text-xs text-charcoal-muted/60 mt-3">
          Made by <a href="https://github.com/Vickyrrrrrr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-charcoal-muted transition-colors">Vickyrrrrrr</a>
        </p>
      </footer>
    </main>
  );
}
