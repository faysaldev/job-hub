import React from "react";
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Building2, Users } from "lucide-react";

export default function PathsSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="fade-up mb-10 max-w-3xl">
          <Badge className="mb-4 bg-[#234C6A]/10 text-[#234C6A] border-none">
            Choose your path
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#234C6A]">
            Built for candidates and hiring teams.
          </h2>
          <p className="mt-3 text-[#456882]">
            A premium job portal should feel useful from both sides of the
            marketplace. These entry points keep the next action clear.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {[
            {
              icon: Users,
              title: "For job seekers",
              description:
                "Browse verified roles, save opportunities, apply faster, and manage your career flow from one focused dashboard.",
              href: "/job",
              action: "Explore jobs",
              points: [
                "Live openings",
                "Saved jobs",
                "Application tracking",
              ],
            },
            {
              icon: Building2,
              title: "For recruiters",
              description:
                "Post roles, review candidates, manage applicants, and keep hiring activity organized without changing your backend flow.",
              href: "/auth",
              action: "Start hiring",
              points: [
                "Candidate discovery",
                "Job posting",
                "Recruiter tools",
              ],
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="stagger-item group overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-8 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/20">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-black text-[#234C6A]">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-[#456882]">
                    {item.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.points.map((point) => (
                      <span
                        key={point}
                        className="rounded-full border border-[#234C6A]/10 bg-white px-3 py-1 text-xs font-bold text-[#456882]"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                  <Button
                    asChild
                    className="mt-6 rounded-xl bg-[#234C6A] text-white hover:bg-[#1c405a]"
                  >
                    <Link href={item.href}>
                      {item.action}
                      <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
