import React from "react";
import { Button } from "@/app/components/ui/button";
import { BarChart3 } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary mb-4">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Beautiful charts, simplified
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Build, customize, and export publication-quality charts in
              seconds. Contextual editing, collaborative-ready, and designed to
              scale from dashboards to presentations.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">Get started — Free</Button>
              <Button variant="outline" size="lg">
                Upgrade to Premium
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <span className="font-medium">Free forever:</span> core chart
              builder & exports • <span className="font-medium">Premium:</span>{" "}
              high-res exports, team seats, and SSO
            </div>
          </div>

          <div>
            <div className="w-full rounded-lg border overflow-hidden shadow-sm">
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                <div className="text-sm text-gray-500 mb-2">Live Preview</div>
                <div className="bg-white border rounded p-4">
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    Interactive chart preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
