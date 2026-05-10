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
      <section className="relative px-6 py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100 rounded-full blur-[120px]" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-cream border border-cream-border text-xs font-normal text-charcoal mb-8">
          <Sparkles size={14} className="text-charcoal" />
          <span>Department of Electronics & Communication Engineering</span>
        </div>

        <h1 className="text-6xl font-semibold tracking-tight-hero leading-[1.1] text-charcoal mb-8 max-w-4xl">
          Your Future in ECE Starts at Lucknow University.
        </h1>
        
        <p className="text-xl text-charcoal-muted max-w-2xl mb-12 leading-relaxed">
          The official guide for first-year students. Discover the curriculum, infrastructure, and your career path in the heart of Lucknow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-24">
          <Link href="/chat" className="btn-primary">Ask the ECE Advisor</Link>
          <a href="#overview" className="btn-ghost">Explore</a>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-5xl py-12 border-y border-cream-border">
          <div className="text-center">
            <h3 className="text-5xl font-semibold tracking-tight-heading text-charcoal mb-2">11</h3>
            <p className="text-sm text-charcoal-muted uppercase tracking-widest font-normal">Labs</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-semibold tracking-tight-heading text-charcoal mb-2">52+</h3>
            <p className="text-sm text-charcoal-muted uppercase tracking-widest font-normal">Internships</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-semibold tracking-tight-heading text-charcoal mb-2">70</h3>
            <p className="text-sm text-charcoal-muted uppercase tracking-widest font-normal">Computer Nodes</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-semibold tracking-tight-heading text-charcoal mb-2">9</h3>
            <p className="text-sm text-charcoal-muted uppercase tracking-widest font-normal">Faculty</p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="px-6 py-24 max-w-4xl mx-auto" id="overview">
        <div className="card-premium divide-y divide-cream-border">
          <div className="flex items-start gap-4 p-6" id="curriculum">
            <BookOpen className="mt-0.5 text-charcoal flex-shrink-0" size={22} />
            <div>
              <h3 className="text-lg font-normal mb-1.5">{ECE_DATA.curriculum.title}</h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.curriculum.summary}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6" id="infrastructure">
            <Building2 className="mt-0.5 text-charcoal flex-shrink-0" size={22} />
            <div>
              <h3 className="text-lg font-normal mb-1.5">{ECE_DATA.infrastructure.title}</h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.infrastructure.summary}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6" id="placements">
            <TrendingUp className="mt-0.5 text-charcoal flex-shrink-0" size={22} />
            <div>
              <h3 className="text-lg font-normal mb-1.5">{ECE_DATA.placements.title}</h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.placements.summary}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Card */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="card-premium" id="faculty">
          <div className="p-6">
            <GraduationCap className="mb-4 text-charcoal" size={22} />
            <h3 className="text-lg font-normal mb-1.5">{ECE_DATA.faculty.title}</h3>
            <p className="text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.faculty.summary}</p>
          </div>
        </div>
      </section>

      {/* Chat CTA */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-cream border border-cream-border text-xs font-normal text-charcoal mb-6">
            <MessageSquare size={14} />
            <span>AI-Powered Assistant</span>
          </div>
          <h2 className="text-5xl font-semibold tracking-tight-heading leading-[1.0] text-charcoal mb-4">Have a Question?</h2>
          <p className="text-lg text-charcoal-muted mb-8">Ask the ECE Advisor about curriculum, placements, faculty, cutoffs, or anything about the department.</p>
          <Link href="/chat" className="btn-primary">Open ECE Advisor</Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-24 border-t border-cream-border">
        <FAQ />
      </section>

      {/* Cutoff Section */}
      <CutoffTabs />

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-cream-border text-center">
        <div className="text-2xl font-semibold tracking-tight-sub text-charcoal mb-4">
          Lu<span className="text-charcoal-muted font-normal">ECE</span>
        </div>
        <p className="text-sm text-charcoal-muted">© 2026 Department of ECE, Lucknow University. All rights reserved.</p>
      </footer>
    </main>
  );
}
