import Link from "next/link";

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6 animate-fade-in-up"
          style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.03em" }}
        >
          Professional{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Benchmarking
          </span>
          <br />
          Made Simple
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
          Build test benches, track performance data, and create stunning
          visualizations. The complete platform for hardware reviewers and
          enthusiasts.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
          <Link
            href="/signup"
            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all"
          >
            Start Free Trial
          </Link>
          <Link
            href="#how-it-works"
            className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 hover:border-cyan-400/50 transition-all"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
