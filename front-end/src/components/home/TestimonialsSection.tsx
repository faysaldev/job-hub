import React from "react";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="fade-up mb-10 text-center">
          <Badge className="mb-4 bg-[#234C6A]/10 text-[#234C6A] border-none">
            Career proof
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#234C6A]">
            A smoother search feels different.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              quote:
                "The job cards are easy to scan, and the role details feel much clearer than a typical job board.",
              name: "Sarah Johnson",
              role: "Frontend Engineer",
            },
            {
              quote:
                "I can quickly understand company, location, salary, and job type before opening the full listing.",
              name: "Michael Chen",
              role: "Product Designer",
            },
            {
              quote:
                "The premium layout makes the platform feel trustworthy and faster for real hiring decisions.",
              name: "Emily Davis",
              role: "Recruiting Lead",
            },
          ].map((testimonial) => (
            <Card
              key={testimonial.name}
              className="stagger-item rounded-3xl border border-[#234C6A]/10 bg-white p-7 shadow-sm"
            >
              <div className="mb-5 flex gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-[#234C6A] text-[#234C6A]"
                    />
                  ))}
              </div>
              <p className="leading-7 text-[#456882]">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E3E3E3] font-black text-[#234C6A]">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="font-black text-[#234C6A]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[#456882]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
