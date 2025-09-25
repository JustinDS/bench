import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Check } from "lucide-react";

const features = [
  {
    title: "Contextual editing",
    description:
      "Click any element to edit labels, values, colors, and groups.",
  },
  {
    title: "Category colors",
    description: "Optional category system to manage colors across bars.",
  },
  {
    title: "High-quality exports",
    description: "Export layered SVGs or PSD-ready files for design tools.",
  },
  {
    title: "Templates & presets",
    description: "Start quickly from curated chart templates.",
  },
];

export default function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">
            Everything you need to visualize data
          </h2>
          <p className="text-gray-600 mt-2">
            Powerful, yet approachable chart tools for teams and creators.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{f.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
