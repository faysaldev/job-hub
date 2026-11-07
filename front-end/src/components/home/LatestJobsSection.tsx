import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import type { DiscoveryJob } from "@/src/redux/features/generals/generalsApi";
export default function LatestJobsSection({ jobs }: { jobs: DiscoveryJob[] }) {
  return <section className="border-y border-[#e1e8ef] bg-white py-16 md:py-20"><div className="jh-container">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="jh-kicker mb-3">Currently available</p><h2 className="text-3xl font-semibold tracking-tight text-[#162839] md:text-4xl">Roles worth a closer look</h2><p className="mt-3 text-sm text-[#66798a]">A selection of open jobs from the platform.</p></div><Link href="/job" className="jh-button jh-button--outline">View all jobs <ArrowRight size={16}/></Link></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{jobs.slice(0, 6).map(job=><Link key={job._id} href={`/job/${job._id}`} className="jh-panel group block p-6 transition-colors hover:border-[#a0bad0]">
      <div className="mb-5 flex gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf3f8] text-[#163b5c]"><Building2 size={20}/></div><div className="min-w-0"><h3 className="line-clamp-2 font-semibold text-[#162839] group-hover:text-[#163b5c]">{job.title}</h3><p className="mt-1 truncate text-sm text-[#66798a]">{job.company?.companyName || "Company"}</p></div></div>
      <div className="flex flex-wrap gap-2">{job.type && <span className="rounded-full bg-[#edf3f8] px-3 py-1 text-xs text-[#516c83]">{job.type}</span>}{job.locationType && <span className="rounded-full bg-[#edf3f8] px-3 py-1 text-xs text-[#516c83]">{job.locationType}</span>}</div>
      <div className="mt-6 flex items-center justify-between border-t border-[#e1e8ef] pt-4 text-sm text-[#66798a]"><span className="inline-flex max-w-[80%] items-center gap-1 truncate"><MapPin size={15}/>{job.location || "Location not provided"}</span><ArrowRight size={17} className="text-[#163b5c]"/></div>
    </Link>)}</div>
  </div></section>;
}
