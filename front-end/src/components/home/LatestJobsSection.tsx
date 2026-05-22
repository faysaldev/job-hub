/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Clock, DollarSign, MapPin, TrendingUp } from "lucide-react";
import { formatRelativeTime, formatSalary } from "@/src/utils/helper";

interface LatestJobsSectionProps {
  jobs: any[];
}

export default function LatestJobsSection({ jobs }: LatestJobsSectionProps) {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="fade-up mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-4 bg-[#234C6A]/10 text-[#234C6A] border-none">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending now
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#234C6A]">
              Latest premium openings
            </h2>
            <p className="mt-3 max-w-2xl text-[#456882]">
              Real roles from your API, displayed as polished cards built
              for scanning and quick action.
            </p>
          </div>
          <Button
            asChild
            className="rounded-xl bg-[#234C6A] text-white hover:bg-[#1c405a]"
          >
            <Link href="/job">
              Browse all jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.slice(0, 6).map((job: any) => (
            <Link key={job._id} href={`/job/${job._id}`}>
              <Card className="stagger-item group h-full rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-6 transition hover:-translate-y-1 hover:border-[#234C6A]/25 hover:bg-white hover:shadow-xl">
                <div className="flex items-start gap-4">
                  {job.company?.companyLogo ? (
                    <Image
                      src={job.company.companyLogo}
                      alt={job.company.companyName || job.title}
                      width={52}
                      height={52}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#234C6A] text-lg font-black text-white">
                      {job.company?.companyName?.[0] || "J"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-black text-[#234C6A] group-hover:text-[#456882]">
                      {job.title}
                    </h3>
                    <p className="truncate text-sm font-semibold text-[#456882]">
                      {job.company?.companyName || "Verified company"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge className="bg-white text-[#234C6A] border border-[#234C6A]/10 capitalize">
                    {job.type}
                  </Badge>
                  <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none capitalize">
                    {job.locationType}
                  </Badge>
                </div>

                <div className="mt-5 space-y-3 text-sm text-[#456882]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#234C6A]" />
                    <span className="truncate">
                      {job.location || "Flexible location"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#234C6A]" />
                    <span>
                      {formatSalary(
                        job.salaryMin,
                        job.salaryMax,
                        job.salaryPeriod,
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#E3E3E3] pt-4">
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#456882]">
                    <Clock className="h-3.5 w-3.5" />
                    {formatRelativeTime(job.createdAt)}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-black text-[#234C6A]">
                    View
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
