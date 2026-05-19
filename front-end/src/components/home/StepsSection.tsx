import React from "react";
import { Card } from "@/src/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function StepsSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              step: "01",
              title: "Search with intent",
              description:
                "Start from keywords, categories, or featured jobs.",
            },
            {
              step: "02",
              title: "Compare the fit",
              description:
                "Review salary, location type, company, and skills faster.",
            },
            {
              step: "03",
              title: "Apply and track",
              description:
                "Continue into your existing application workflow.",
            },
          ].map((item) => (
            <Card
              key={item.step}
              className="fade-up rounded-2xl border border-[#234C6A]/10 bg-white p-8 shadow-sm"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-5xl font-black text-[#234C6A]/15">
                  {item.step}
                </span>
                <CheckCircle className="h-7 w-7 text-[#456882]" />
              </div>
              <h3 className="text-2xl font-black text-[#234C6A]">
                {item.title}
              </h3>
              <p className="mt-3 leading-7 text-[#456882]">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
