import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import type { JobCategory } from "@/src/lib/jobCategories";
export default function CategorySection({ categories }: { categories: JobCategory[] }) {
  return <section className="jh-container py-16 md:py-20" aria-labelledby="categories-heading">
    <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="jh-kicker mb-3">Explore by field</p><h2 id="categories-heading" className="text-3xl font-semibold tracking-tight text-[#162839] md:text-4xl">Find your area of interest</h2><p className="mt-3 text-sm text-[#66798a]">Browse opportunities grouped by career field.</p></div><Link className="jh-button jh-button--outline w-fit" href="/job">Browse all jobs <ArrowRight size={17}/></Link></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{categories.slice(0, 8).map((category)=> <Link href={`/job?category=${encodeURIComponent(category.id)}`} key={category.id} className="jh-panel group flex items-start gap-4 p-5 transition-colors hover:border-[#a0bad0] hover:bg-white">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf3f8] text-[#163b5c]"><BriefcaseBusiness size={20}/></div><div className="min-w-0"><h3 className="font-semibold text-[#162839] group-hover:text-[#163b5c]">{category.name}</h3><p className="mt-1 text-sm text-[#66798a]">{category.count.toLocaleString()} {category.count === 1 ? "open role" : "open roles"}</p></div>
    </Link>)}</div>
  </section>;
}
