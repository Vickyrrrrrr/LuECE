import Navbar from "@/components/Navbar";
import Chat from "@/components/Chat";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-semibold tracking-tight-heading leading-[1.0] text-charcoal mb-4">ECE Advisor</h2>
          <p className="text-lg text-charcoal-muted">Ask anything about LU's ECE department — curriculum, placements, faculty, cutoffs, and more.</p>
        </div>
        <Chat />
      </section>
    </main>
  );
}
