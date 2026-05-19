/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { ArrowRight, Clock, MapPin, Search, Sparkles, TrendingUp } from "lucide-react";
import { formatRelativeTime, formatSalary } from "@/src/utils/helper";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onTrendingClick: (term: string) => void;
  heroJobs: any[];
  topJobsCount: number;
  totalCategoryJobs: number;
  categoriesCount: number;
}

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  onSearch,
  onKeyDown,
  onTrendingClick,
  heroJobs,
  topJobsCount,
  totalCategoryJobs,
  categoriesCount,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#234C6A]/10 bg-[#F8FAFC]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#234C6A10_1px,transparent_1px),linear-gradient(to_bottom,#234C6A0D_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#E3E3E3]/80 to-transparent" />
        <div className="absolute bottom-0 right-0 h-40 w-full bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="container mx-auto relative z-10 px-4 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-10 xl:gap-14 items-center">
          <div className="hero-content">
            <Badge className="mb-6 w-fit bg-white text-[#234C6A] border border-[#234C6A]/10 px-4 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 mr-2 text-[#456882]" />
              Premium hiring marketplace for modern teams
            </Badge>

            <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.02] tracking-tight text-[#234C6A]">
              Find the role that moves your career forward.
            </h1>

            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-8 text-[#456882]">
              Search verified jobs, compare top companies, and apply with a
              smoother job portal built around real opportunities from your
              current JobHub data.
            </p>

            <div className="mt-8 max-w-2xl rounded-2xl border border-[#234C6A]/10 bg-white p-2 shadow-2xl shadow-[#234C6A]/10">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex min-h-14 flex-1 items-center gap-3 rounded-xl bg-[#F4F7F8] px-4">
                  <Search className="h-5 w-5 text-[#456882]" />
                  <input
                    type="text"
                    placeholder="Search by title, keyword, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="w-full bg-transparent text-[#234C6A] outline-none placeholder:text-[#456882]/60"
                  />
                </div>
                <Button
                  size="lg"
                  onClick={onSearch}
                  className="h-14 rounded-xl bg-[#234C6A] px-7 font-bold text-white shadow-lg shadow-[#234C6A]/20 hover:bg-[#1c405a]"
                >
                  Search Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {[
                "Remote",
                "Frontend",
                "Full Stack",
                "Product",
                "Design",
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => onTrendingClick(term)}
                  className="rounded-full border border-[#234C6A]/10 bg-white px-4 py-2 text-sm font-semibold text-[#456882] transition hover:border-[#234C6A]/25 hover:text-[#234C6A]"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                {
                  value:
                    totalCategoryJobs > 0
                      ? `${totalCategoryJobs.toLocaleString()}+`
                      : "10K+",
                  label: "Open roles",
                },
                {
                  value: `${topJobsCount || 100}+`,
                  label: "Featured jobs",
                },
                {
                  value: `${categoriesCount}+`,
                  label: "Categories",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#234C6A]/10 bg-white/80 p-4 shadow-sm"
                >
                  <p className="text-2xl font-black text-[#234C6A]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#456882]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel relative hidden lg:block">
            <div className="absolute -top-10 -left-10 h-full w-full rounded-3xl bg-gradient-to-br from-[#234C6A]/10 to-transparent" />

            <div className="relative space-y-4">
              {heroJobs.length > 0
                ? heroJobs.map((job: any, i: number) => (
                    <Link
                      key={job._id}
                      href={`/job/${job._id}`}
                      className="block"
                    >
                      <Card
                        className={`group cursor-pointer rounded-2xl border border-[#E3E3E3] bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-xl ${
                          i === 1 ? "ml-8" : i === 2 ? "ml-4" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-5">
                          <div className="flex min-w-0 gap-4">
                            {job.company?.companyLogo ? (
                              <Image
                                src={job.company.companyLogo}
                                alt={job.company.companyName || job.title}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-xl object-cover shadow-md"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] text-lg font-bold text-white">
                                {job.company?.companyName?.[0] || "J"}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate font-semibold text-[#234C6A] transition-colors group-hover:text-[#456882]">
                                  {job.title}
                                </h3>
                                <Badge className="shrink-0 bg-[#E3E3E3] text-[#234C6A] border-none text-xs capitalize">
                                  {job.locationType}
                                </Badge>
                              </div>
                              <p className="text-sm text-[#456882]">
                                {job.company?.companyName ||
                                  "Verified company"}
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-[#456882]">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="max-w-[150px] truncate">
                                    {job.location || "Flexible"}
                                  </span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatRelativeTime(job.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-semibold text-[#234C6A]">
                              {formatSalary(
                                job.salaryMin,
                                job.salaryMax,
                                job.salaryPeriod,
                              )}
                            </p>
                            <p className="text-xs capitalize text-[#456882]">
                              {job.type}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                : [0, 1, 2].map((i) => (
                    <Card
                      key={i}
                      className={`animate-pulse rounded-2xl border-none bg-white p-5 shadow-lg ${
                        i === 1 ? "ml-8" : i === 2 ? "ml-4" : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-xl bg-[#E3E3E3]" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 rounded bg-[#E3E3E3]" />
                          <div className="h-3 w-1/2 rounded bg-[#E3E3E3]" />
                        </div>
                      </div>
                    </Card>
                  ))}
            </div>

            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-4 py-3 text-white shadow-xl">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">
                  {topJobsCount || 0}+ top jobs available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
