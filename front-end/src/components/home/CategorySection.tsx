/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

interface CategorySectionProps {
  categories: any[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="fade-up mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-4 bg-[#234C6A]/10 text-[#234C6A] border-none">
              Browse categories
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#234C6A]">
              Explore jobs by specialty
            </h2>
            <p className="mt-3 max-w-2xl text-[#456882]">
              Category counts are connected to your backend stats, so this
              section stays fresh as new roles are added.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A] hover:text-white"
          >
            <Link href="/job">
              View all categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/job?category=${category.id}`}
              className="stagger-item group"
            >
              <Card className="h-full overflow-hidden rounded-2xl border border-[#234C6A]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-xl">
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} shadow-lg`}
                  >
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#456882] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
                <h3 className="text-lg font-black text-[#234C6A]">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm font-semibold text-[#456882]">
                  {(category.count || 0).toLocaleString()} open jobs
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
