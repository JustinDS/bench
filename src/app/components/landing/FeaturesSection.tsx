export function FeaturesSection() {
  const features = [
    {
      icon: "🔧",
      title: "Custom Test Benches",
      description:
        "Build and manage multiple test configurations. Track GPU, CPU, RAM, cooling, and complete system builds with detailed component specs.",
    },
    {
      icon: "📊",
      title: "Smart Data Input",
      description:
        "Log FPS, temperatures, power draw, and custom metrics. Organize tests by game, benchmark suite, or workload with automatic validation.",
    },
    {
      icon: "📈",
      title: "Beautiful Graphs",
      description:
        "Auto-generate publication-ready charts from your data. Choose from professional themes or create custom designs that match your brand.",
    },
    {
      icon: "🎨",
      title: "Theme Library",
      description:
        "Access pre-made chart themes or design your own. Consistent branding across all visualizations with one-click application.",
    },
    {
      icon: "🔄",
      title: "Comparative Analysis",
      description:
        "Compare multiple components side-by-side. Generate delta charts, performance rankings, and value-per-dollar analysis automatically.",
    },
    {
      icon: "📤",
      title: "Export & Share",
      description:
        "Export graphs as PNG, SVG, or PDF. Share interactive charts with viewers or embed them directly into your content.",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Features
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Everything You Need
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Professional tools designed for serious hardware testing and data
            visualization
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/3 border border-white/5 rounded-2xl p-8 hover:bg-white/5 hover:border-cyan-400/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl" />

              {/* Icon */}
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center text-2xl mb-6">
                {feature.icon}
              </div>

              {/* Content */}
              <h3
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
