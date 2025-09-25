"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

const premiumFeatures = [
  "High-resolution exports (print-ready)",
  "Team seats & collaboration",
  "Priority support",
  "SSO and SAML (enterprise)",
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const premiumPrice = billing === "monthly" ? "R500" : "R5000";
  const per = billing === "monthly" ? "/mo" : "/yr";

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h3 className="text-2xl font-semibold">Simple pricing that scales</h3>
          <p className="text-gray-600 mt-2">
            Start for free and upgrade when you need advanced exports, team
            seats, or enterprise features.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center rounded-md bg-white p-1 border">
            <button
              className={`px-4 py-2 rounded ${
                billing === "monthly"
                  ? "bg-primary text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded ${
                billing === "yearly" ? "bg-primary text-white" : "text-gray-600"
              }`}
              onClick={() => setBilling("yearly")}
            >
              Yearly (save 33%)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                $0<span className="text-sm font-normal">/mo</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Great for individuals and small projects.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li>• Chart builder & templates</li>
                <li>• Manual exports (SVG)</li>
                <li>• Single-user account</li>
              </ul>

              <div className="mt-6">
                <Button size="sm">Create free account</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative">
            <div className="absolute -top-4 right-4 bg-amber-400 text-white text-xs px-2 py-1 rounded">
              Popular
            </div>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold">
                {premiumPrice}
                <span className="text-xl font-medium ml-2">{per}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                For teams and power users who need pro features.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {premiumFeatures.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>

              <div className="mt-6 flex gap-2">
                <Button size="sm">Start free trial</Button>
                <Button variant="outline" size="sm">
                  Contact sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
