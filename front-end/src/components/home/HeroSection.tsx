import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, MapPin, Search } from "lucide-react";
import { Skeleton } from "@/src/components/feedback/LoadingStates";
import type { DiscoveryJob } from "@/src/redux/features/generals/generalsApi";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: () => void;
  onTrendingClick: (term: string) => void;
  heroJobs: DiscoveryJob[];
  isLoading: boolean;
  totalCategoryJobs: number;
}
export default function HeroSection({ searchQuery, setSearchQuery, onSearch, onTrendingClick, heroJobs, isLoading, totalCategoryJobs }: HeroSectionProps) {
  return <section className="border-b border-[#e1e8ef] bg-white py-16 md:py-20 lg:py-24">
    <div className="jh-container grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
      <div>
        <p className="jh-kicker mb-5">Find work. Build your next chapter.</p>
        <h1 className="max-w-[700px] text-[clamp(2.6rem,5vw,4.6rem)] font-semibold leading-[1.08] tracking-[-.045em] text-[#162839]">The right opportunity starts with a better search.</h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-[#66798a] md:text-lg">Explore available jobs, compare what matters and manage your applications in one place.</p>
        <form role="search" onSubmit={(event) => { event.preventDefault(); onSearch(); }} className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-[#dce5ec] bg-white p-2 shadow-[0_12px_50px_-25px_rgba(22,59,92,.28)] sm:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 px-3 text-[#66798a]">
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">Job title or keyword</span>
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full bg-transparent text-sm text-[#162839] placeholder:text-[#8b9aa8] focus:outline-none" placeholder="Job title, skill or keyword" type="search" />
          </label>
          <button className="jh-button min-h-12 px-6" type="submit">Search jobs <ArrowRight size={17} /></button>
        </form>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[#66798a]"><span>Try:</span>{["Remote", "Design", "Engineering"].map((term) => <button type="button" key={term} onClick={() => onTrendingClick(term)} className="rounded-full border border-[#e1e8ef] px-3 py-1.5 text-xs font-medium text-[#516c83] hover:border-[#9fb6c9] hover:bg-[#f6f8fb]">{term}</button>)}</div>
        {totalCategoryJobs > 0 && <p className="mt-8 text-sm text-[#66798a]"><strong className="font-semibold text-[#163b5c]">{totalCategoryJobs.toLocaleString()}</strong> current jobs across listed categories</p>}
      </div>
      <div className="relative rounded-[24px] border border-[#e1e8ef] bg-[#f6f8fb] p-5 md:p-7">
        <div className="mb-6 flex items-center justify-between"><div><p className="jh-kicker">Explore openings</p><h2 className="mt-1 text-lg font-semibold text-[#162839]">Jobs to explore</h2></div><BriefcaseBusiness className="text-[#163b5c]" size={22}/></div>
        <div className="space-y-3">{isLoading ? Array.from({ length: 3 }, (_, i) => <div className="jh-panel space-y-3 p-4" key={i}><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>) : heroJobs.length ? heroJobs.map((job) => <Link href={`/job/${job._id}`} key={job._id} className="group flex items-start gap-3 rounded-xl border border-[#e1e8ef] bg-white p-4 transition-colors hover:border-[#a4bbc9]">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#edf3f8] text-[#163b5c]"><Building2 size={19}/></div>
          <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold text-[#162839] group-hover:text-[#163b5c]">{job.title}</h3><p className="mt-1 truncate text-xs text-[#66798a]">{job.company?.companyName || "Company"}</p><p className="mt-2 flex items-center gap-1 text-xs text-[#66798a]"><MapPin size={12}/>{job.location || job.locationType || "Location not listed"}</p></div><ArrowRight className="mt-1 text-[#9aacbb]" size={17}/>
        </Link>) : <div className="jh-panel p-6 text-sm text-[#66798a]">No open roles are featured right now. Browse all job listings to see current openings.</div>}</div>
        <Link href="/job" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#163b5c] hover:underline">View all jobs <ArrowRight size={16}/></Link>
      </div>
    </div>
  </section>;
}
