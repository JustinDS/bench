import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-6 bg-slate-900/50 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Ready to Level Up Your Reviews?
        </h2>
        <p className="text-xl md:text-2xl text-slate-400 mb-10">
          Join thousands of reviewers creating professional benchmarks
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all"
          >
            Start Free Trial
          </Link>
          <Link
            href="/demo"
            className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 hover:border-cyan-400/50 transition-all"
          >
            Schedule Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
