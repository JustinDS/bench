export function StatsBar() {
  const stats = [
    { number: "50K+", label: "Benchmarks Created" },
    { number: "2,500+", label: "Active Reviewers" },
    { number: "15K+", label: "Components Tested" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/5 py-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div
              className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {stat.number}
            </div>
            <div className="text-sm md:text-base text-slate-400 font-semibold">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
