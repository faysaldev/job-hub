import React from "react";
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="pb-20 lg:pb-24">
      <div className="container mx-auto px-4">
        <Card className="fade-up overflow-hidden rounded-[2rem] border-none bg-[#234C6A] p-8 text-white shadow-2xl shadow-[#234C6A]/20 md:p-12 lg:p-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Badge className="mb-5 bg-white/10 text-white border-white/15">
                Start today
              </Badge>
              <h2 className="max-w-3xl text-3xl md:text-5xl font-black tracking-tight">
                Ready to discover your next opportunity?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
                Join JobHub, browse live openings, and keep moving toward a
                better role with a cleaner premium experience.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-xl bg-white px-8 font-black text-[#234C6A] hover:bg-[#E3E3E3]"
              >
                <Link href="/auth">
                  Get started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-xl border-white/30 bg-transparent px-8 font-black text-white hover:bg-white/10"
              >
                <Link href="/job">Browse jobs</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
