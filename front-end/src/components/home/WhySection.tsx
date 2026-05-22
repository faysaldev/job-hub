import React from "react";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Shield, TrendingUp, Zap } from "lucide-react";

export default function WhySection() {
  return (
    <section className="bg-[#234C6A] py-20 lg:py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="fade-up">
            <Badge className="mb-5 bg-white/10 text-white border-white/15">
              Why JobHub
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              A cleaner way to discover, compare, and apply.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              Keep the job search focused with verified roles, readable job
              cards, category browsing, and a premium application path.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Quick apply",
                description: "Move from discovery to application faster.",
              },
              {
                icon: Shield,
                title: "Verified data",
                description: "Use your existing backend as the source.",
              },
              {
                icon: TrendingUp,
                title: "Better matches",
                description: "Search and browse around real categories.",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="stagger-item rounded-2xl border border-white/10 bg-white/10 p-6 text-white shadow-none backdrop-blur-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
