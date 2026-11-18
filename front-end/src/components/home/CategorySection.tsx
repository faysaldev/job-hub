import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import type { JobCategory } from "@/src/lib/jobCategories";

export default function CategorySection({ categories }: { categories: JobCategory[] }) {
  return (
    <section className="jh-container py-16 md:py-20" aria-labelledby="categories-heading">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="jh-kicker mb-2">Explore By Field</p>
          <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">
            Browse Popular Categories
          </h2>
          <p className="mt-1.5 text-xs text-[#596d7e]">
            Discover opportunities grouped by specialized disciplines and technical domains.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#eaecf0] bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#111827] hover:bg-neutral-50 transition-colors shadow-2xs"
          href="/job"
        >
          View All Fields <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.slice(0, 8).map((category) => (
          <Link
            href={`/job?category=${encodeURIComponent(category.id)}`}
            key={category.id}
            className="group flex flex-col justify-between rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-800 group-hover:bg-black group-hover:text-white transition-colors">
                <BriefcaseBusiness size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#111827] group-hover:text-black transition-colors truncate">
                  {category.name}
                </h3>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
              <span className="inline-flex items-center rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-[11px] font-semibold text-[#15803d]">
                {category.count.toLocaleString()} {category.count === 1 ? "role" : "roles"}
              </span>
              <ArrowRight size={14} className="text-neutral-400 group-hover:text-black transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
