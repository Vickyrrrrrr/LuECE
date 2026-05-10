import Navbar from "@/components/Navbar";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import CutoffTabs from "@/components/CutoffTabs";
import { ECE_DATA } from "@/lib/data";
import { Sparkles, BookOpen, Building2, GraduationCap, TrendingUp, MessageSquare, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-32 flex flex-col items-center text-center">

        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-pill bg-cream border border-cream-border text-[10px] sm:text-xs font-normal text-charcoal mb-6 sm:mb-8">
          <Sparkles size={12} className="sm:hidden" />
          <Sparkles size={14} className="hidden sm:block" />
          <span>Department of Electronics & Communication Engineering</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight-hero leading-[1.1] text-charcoal mb-6 sm:mb-8 max-w-4xl px-2">
          Your Future in ECE Starts at Lucknow University.
        </h1>
        
        <p className="text-base sm:text-xl text-charcoal-muted max-w-2xl mb-10 sm:mb-12 leading-relaxed px-2">
          The official guide for first-year students. Discover the curriculum, infrastructure, and your career path in the heart of Lucknow.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none justify-center mb-16 sm:mb-24">
          <Link href="/chat" className="btn-primary text-sm sm:text-base">Ask the ECE Advisor</Link>
          <a href="#overview" className="btn-ghost text-sm sm:text-base">Explore</a>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 w-full max-w-5xl py-10 sm:py-12 border-y border-cream-border">
          <div className="text-center">
            <h3 className="text-3xl sm:text-5xl font-semibold tracking-tight-heading text-charcoal mb-1 sm:mb-2">11</h3>
            <p className="text-[10px] sm:text-sm text-charcoal-muted uppercase tracking-widest font-normal">Labs</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl sm:text-5xl font-semibold tracking-tight-heading text-charcoal mb-1 sm:mb-2">52+</h3>
            <p className="text-[10px] sm:text-sm text-charcoal-muted uppercase tracking-widest font-normal">Internships</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl sm:text-5xl font-semibold tracking-tight-heading text-charcoal mb-1 sm:mb-2">70</h3>
            <p className="text-[10px] sm:text-sm text-charcoal-muted uppercase tracking-widest font-normal">Computer Nodes</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl sm:text-5xl font-semibold tracking-tight-heading text-charcoal mb-1 sm:mb-2">9</h3>
            <p className="text-[10px] sm:text-sm text-charcoal-muted uppercase tracking-widest font-normal">Faculty</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-4xl mx-auto" id="overview">
        <div className="card-premium divide-y divide-cream-border">
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6" id="curriculum">
            <BookOpen className="mt-0.5 text-charcoal flex-shrink-0" size={18} />
            <div>
              <h3 className="text-base sm:text-lg font-normal mb-1">{ECE_DATA.curriculum.title}</h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.curriculum.summary}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6" id="infrastructure">
            <Building2 className="mt-0.5 text-charcoal flex-shrink-0" size={18} />
            <div>
              <h3 className="text-base sm:text-lg font-normal mb-1">{ECE_DATA.infrastructure.title}</h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.infrastructure.summary}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6" id="placements">
            <TrendingUp className="mt-0.5 text-charcoal flex-shrink-0" size={18} />
            <div>
              <h3 className="text-base sm:text-lg font-normal mb-1">{ECE_DATA.placements.title}</h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.placements.summary}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Card */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-4xl mx-auto">
        <div className="card-premium" id="faculty">
          <div className="p-4 sm:p-6">
            <GraduationCap className="mb-3 sm:mb-4 text-charcoal" size={18} />
            <h3 className="text-base sm:text-lg font-normal mb-1 sm:mb-1.5">{ECE_DATA.faculty.title}</h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.faculty.summary}</p>
          </div>
        </div>
      </section>

      {/* Chat CTA */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-pill bg-cream border border-cream-border text-[10px] sm:text-xs font-normal text-charcoal mb-5 sm:mb-6">
            <MessageSquare size={12} className="sm:hidden" />
            <MessageSquare size={14} className="hidden sm:block" />
            <span>AI-Powered Assistant</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight-heading leading-[1.0] text-charcoal mb-3 sm:mb-4">Have a Question?</h2>
          <p className="text-sm sm:text-lg text-charcoal-muted mb-6 sm:mb-8 px-2">Ask the ECE Advisor about curriculum, placements, faculty, cutoffs, or anything about the department.</p>
          <Link href="/chat" className="btn-primary text-sm sm:text-base">Open ECE Advisor</Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-cream-border">
        <FAQ />
      </section>

      {/* Cutoff Section */}
      <CutoffTabs />

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-10 sm:py-12 border-t border-cream-border text-center">
        <div className="text-xl sm:text-2xl font-semibold tracking-tight-sub text-charcoal mb-3 sm:mb-4">
          Lu<span className="text-charcoal-muted font-normal">ECE</span>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-muted">© 2026 Department of ECE, Lucknow University. All rights reserved.</p>
        <p className="text-[10px] sm:text-xs text-charcoal-muted/60 mt-3">Made by <a href="https://github.com/Vickyrrrrrr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-charcoal-muted transition-colors">Vickyrrrrrr</a></p>
      </footer>
    </main>
  );
}
