"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DiscoveryJob } from "@/src/redux/features/generals/generalsApi";
import JobCard from "@/src/components/jobs/JobCard";
import type { Job } from "@/src/types";

export default function LatestJobsSection({ jobs }: { jobs: DiscoveryJob[] }) {
  const formattedJobs: Job[] = jobs.map((job) => ({
    id: job._id,
    title: job.title,
    company: job.company?.companyName || "Premier Employer",
    companyLogo: job.company?.companyLogo,
    location: job.location || job.locationType || "Global / Remote",
    remote: (job.locationType || "").toLowerCase() === "remote",
    type: job.type || "Full-Time",
    experienceLevel: "Mid-Senior",
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryPeriod: (job.salaryPeriod as any) || "yearly",
    description: `Exciting opportunity for a ${job.title} to join our growing team. Apply now to collaborate with cross-functional peers and deliver high-impact results.`,
    skills: ["Design", "Teamwork", "Agile"],
    status: "active",
    createdAt: job.createdAt,
  }));

  return (
    <section className="border-y border-[#e5e7eb] bg-[#f8fafc] py-16 md:py-20">
      <div className="jh-container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="jh-kicker mb-2">Featured Opportunities</p>
            <h2 className="text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">
              Latest Roles Added
            </h2>
            <p className="mt-1.5 text-xs text-[#596d7e]">
              Handpicked positions from verified employers across the network.
            </p>
          </div>
          <Link
            href="/job"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#eaecf0] bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#111827] hover:bg-neutral-50 transition-colors shadow-2xs"
          >
            View All Openings <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {formattedJobs.slice(0, 6).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
