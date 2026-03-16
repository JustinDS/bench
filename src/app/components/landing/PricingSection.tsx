import Link from "next/link";
import { Check } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "3 test benches",
        "50 benchmark entries/month",
        "Basic chart themes",
        "PNG export",
        "Community support",
      ],
      cta: "Get Started",
      href: "/signup",
      featured: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For serious reviewers",
      features: [
        "Unlimited test benches",
        "Unlimited benchmarks",
        "Premium themes library",
        "Custom theme creator",
        "All export formats",
        "Interactive embeds",
        "Priority support",
      ],
      cta: "Start Free Trial",
      href: "/signup?plan=pro",
      featured: true,
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For teams and publications",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "White-label branding",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      href: "/contact",
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Pricing
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Choose Your Plan
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Free to start, scale as you grow
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/3 border rounded-2xl p-8 transition-all duration-300 ${
                plan.featured
                  ? "border-cyan-400 bg-cyan-400/5 md:scale-105 shadow-xl shadow-cyan-500/10"
                  : "border-white/5 hover:border-cyan-400/50 hover:-translate-y-1"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 right-8 bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6 pb-6 border-b border-white/5">
                <div className="text-slate-400 font-bold uppercase tracking-wide text-sm mb-2">
                  {plan.name}
                </div>
                <div className="flex items-baseline mb-2">
                  <span
                    className="text-5xl font-bold"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xl text-slate-400 ml-2">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-slate-400">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start gap-3 text-slate-300"
                  >
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 px-6 rounded-lg font-bold transition-all ${
                  plan.featured
                    ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-cyan-400/50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
