import Navbar from "@/components/Navbar";
import Chat from "@/components/Chat";
import FAQ from "@/components/FAQ";
import { ECE_DATA } from "@/lib/data";
import { Sparkles, BookOpen, Building2, GraduationCap, TrendingUp } from "lucide-react";

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
            <button className="btn-primary">Start Exploring</button>
          <button className="btn-ghost">View Syllabus</button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-5xl py-12 border-y border-cream-border">
          <div className="text-center">
            <h3 className="text-5xl font-semibold tracking-tight-heading text-charcoal mb-2">15+</h3>
            <p className="text-sm text-charcoal-muted uppercase tracking-widest font-normal">Core Partners</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-semibold tracking-tight-heading text-charcoal mb-2">85%</h3>
            <p className="text-sm text-charcoal-muted uppercase tracking-widest font-normal">Placement Rate</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-semibold tracking-tight-heading text-charcoal mb-2">24/7</h3>
            <p className="text-sm text-charcoal-muted uppercase tracking-widest font-normal">Lab Access</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-semibold tracking-tight-heading text-charcoal mb-2">40+</h3>
            <p className="text-sm text-charcoal-muted uppercase tracking-widest font-normal">Expert Faculty</p>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="px-6 py-24" id="chat">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-semibold tracking-tight-heading leading-[1.0] text-charcoal mb-4">Ask the ECE Advisor</h2>
          <p className="text-lg text-charcoal-muted">An AI-powered assistant trained on LU's ECE department data.</p>
        </div>
        <Chat />
      </section>

      {/* Feature Cards */}
      <section className="px-6 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="card-premium" id="curriculum">
          <BookOpen className="mb-4 text-charcoal" size={32} />
          <h3 className="text-xl font-normal leading-[1.25] mb-3">{ECE_DATA.curriculum.title}</h3>
          <p className="text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.curriculum.content}</p>
        </div>
        <div className="card-premium" id="infrastructure">
          <Building2 className="mb-4 text-charcoal" size={32} />
          <h3 className="text-xl font-normal leading-[1.25] mb-3">{ECE_DATA.infrastructure.title}</h3>
          <p className="text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.infrastructure.content}</p>
        </div>
        <div className="card-premium" id="faculty">
          <GraduationCap className="mb-4 text-charcoal" size={32} />
          <h3 className="text-xl font-normal leading-[1.25] mb-3">{ECE_DATA.faculty.title}</h3>
          <p className="text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.faculty.content}</p>
        </div>
        <div className="card-premium" id="placements">
          <TrendingUp className="mb-4 text-charcoal" size={32} />
          <h3 className="text-xl font-normal leading-[1.25] mb-3">{ECE_DATA.placements.title}</h3>
          <p className="text-sm text-charcoal-muted leading-relaxed">{ECE_DATA.placements.content}</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-24 border-t border-cream-border">
        <FAQ />
      </section>

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
