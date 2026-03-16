import { HeroSection } from "@/app/components/landing/HeroSection";
import { StatsBar } from "@/app/components/landing/StatsBar";
import { FeaturesSection } from "@/app/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/app/components/landing/HowItWorksSection";
import { PricingSection } from "@/app/components/landing/PricingSection";
import { CTASection } from "@/app/components/landing/CTASection";
import { Footer } from "@/app/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-slate-950 to-cyan-500/20 opacity-60" />
        <div className="absolute top-0 left-[20%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[20%] w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl" />
      </div>

      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
