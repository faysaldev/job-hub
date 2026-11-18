import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="jh-container py-16 md:py-20">
      <div className="flex flex-col justify-between gap-6 rounded-2xl bg-black p-8 text-white md:flex-row md:items-center md:p-12 shadow-sm">
        <div>
          <span className="inline-block rounded-md bg-[#dcfce7] px-2.5 py-0.5 text-[11px] font-bold text-[#15803d]">
            Get Started
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Accelerate Your Next Career Milestone.
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-300">
            Join thousands of professionals and high-growth employers on JobHub today.
          </p>
        </div>
        <Link
          href="/auth"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white px-4 text-[11px] font-bold uppercase tracking-wider text-black hover:bg-neutral-100 transition-colors shadow-2xs"
        >
          Create Free Account
          <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}
