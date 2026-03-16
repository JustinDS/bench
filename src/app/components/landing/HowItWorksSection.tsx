export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Build Your Test Bench",
      description:
        "Add all your components - GPUs, CPUs, motherboards, RAM, cooling, and more. Save multiple configurations for different testing scenarios.",
    },
    {
      number: "02",
      title: "Run Tests & Input Data",
      description:
        "Select your active test bench and create test entries. Log FPS, temperatures, benchmarks scores, or any custom metrics you need to track.",
    },
    {
      number: "03",
      title: "Generate Visualizations",
      description:
        "Choose which tests to include, select a theme, and let the platform auto-generate professional charts. Customize colors, labels, and formatting.",
    },
    {
      number: "04",
      title: "Export & Publish",
      description:
        "Download high-resolution images for articles, share interactive charts with viewers, or embed live graphs directly into your website.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-6 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Workflow
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            How It Works
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            From test bench to publication in minutes
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 md:space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start"
            >
              {/* Step Number */}
              <div
                className="text-5xl md:text-6xl font-bold text-cyan-400 opacity-30 leading-none"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {step.number}
              </div>

              {/* Step Content */}
              <div>
                <h3
                  className="text-2xl md:text-3xl font-bold mb-3"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
