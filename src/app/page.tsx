import Features from "./components/features/features";
import Hero from "./components/hero/hero";
import Pricing from "./components/pricing/pricing";

// app/page.tsx
export default function HomePage() {
  return (
    <main className="bg-gray-50 text-gray-900">
      <Hero />
      <Features />
      <Pricing />
    </main>
  );
}
