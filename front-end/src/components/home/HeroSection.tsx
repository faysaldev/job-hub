"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  DollarSign,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { Skeleton } from "@/src/components/feedback/LoadingStates";
import type { DiscoveryJob } from "@/src/redux/features/generals/generalsApi";
import JobCard from "@/src/components/jobs/JobCard";
import type { Job } from "@/src/types";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: () => void;
  onTrendingClick: (term: string) => void;
  heroJobs: DiscoveryJob[];
  isLoading: boolean;
  totalCategoryJobs: number;
}

const DEFAULT_TAGS = ["Product Designer", "Artist", "Game Designer", "Designer"];
const LOCATION_OPTIONS = ["All Countries", "United States", "United Kingdom", "Germany", "Remote"];
const JOB_TYPE_OPTIONS = ["Job Type", "Full-time", "Part-time", "Remote", "Contract"];
const SALARY_OPTIONS = ["Salary Range", "$30k - $50k", "$50k - $80k", "$80k - $120k", "$120k+"];

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  onSearch,
  onTrendingClick,
  heroJobs,
  isLoading,
  totalCategoryJobs,
}: HeroSectionProps) {
  const [activeTags, setActiveTags] = useState<string[]>(DEFAULT_TAGS);
  const [selectedLocation, setSelectedLocation] = useState("All Countries");
  const [selectedType, setSelectedType] = useState("Job Type");
  const [selectedSalary, setSelectedSalary] = useState("Salary Range");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const removeTag = (tagToRemove: string) => {
    setActiveTags(activeTags.filter((t) => t !== tagToRemove));
  };

  const addTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (trimmed && !activeTags.includes(trimmed)) {
      setActiveTags([...activeTags, trimmed]);
      setSearchQuery(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        addTag(searchQuery);
        setSearchQuery("");
      }
      onSearch();
    }
  };

  const formattedHeroJobs: Job[] = heroJobs.map((j) => ({
    id: j._id,
    title: j.title,
    company: j.company?.companyName || "Technology Partner",
    companyLogo: j.company?.companyLogo,
    location: j.location || j.locationType || "Global / Remote",
    remote: (j.locationType || "").toLowerCase() === "remote",
    type: j.type || "Full-Time",
    experienceLevel: "Mid-Senior",
    salaryMin: j.salaryMin,
    salaryMax: j.salaryMax,
    salaryPeriod: (j.salaryPeriod as any) || "yearly",
    description: `Join as ${j.title}. Lead cross-functional initiatives, deliver outstanding software, and grow your career.`,
    skills: ["Design", "Product", "Strategy"],
    status: "active",
    createdAt: j.createdAt,
  }));

  return (
    <section className="border-b border-[#e5e7eb] bg-[#f4f6f8] py-12 md:py-16">
      <div className="jh-container">
        {/* Hero Header */}
        <div className="max-w-3xl mb-8">
          <p className="jh-kicker mb-3">Find work. Build your next chapter.</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl leading-tight">
            The right opportunity starts with a better search.
          </h1>
          <p className="mt-3 text-sm text-[#596d7e] leading-relaxed max-w-xl">
            Filter through verified positions, compare competitive salary ranges, and connect directly with hiring teams.
          </p>
        </div>

        {/* Floating Search Bar matching Reference Image */}
        <div className="relative z-20 mb-8 rounded-2xl border border-[#eaecf0] bg-white p-1 sm:p-1.5 shadow-2xs">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            {/* Search icon + Tag chips + text input */}
            <div className="flex flex-1 flex-wrap items-center gap-1.5 px-2 py-0.5 min-h-[34px]">
              <Search className="h-3 w-3 text-neutral-400 shrink-0" aria-hidden="true" />
              {activeTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md border border-neutral-200/70 bg-[#f4f5f7] px-2 py-0.5 text-[10px] font-medium text-neutral-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag} tag`}
                    className="text-neutral-400 hover:text-black transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={activeTags.length ? "Add keyword..." : "Search job title, skills..."}
                className="min-w-[80px] flex-1 bg-transparent text-[10.5px] text-[#111827] placeholder:text-neutral-400 focus:outline-none"
              />
            </div>

            {/* Dropdown Filters Divider */}
            <div className="hidden h-4 w-px bg-neutral-200 lg:block mx-0.5" />

            {/* Location Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "location" ? null : "location")}
                className="flex w-full items-center justify-between gap-1 rounded-md px-1.5 py-1 text-[9px] sm:text-[9.5px] font-medium text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors lg:w-auto"
              >
                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-neutral-400 shrink-0" />
                  <span>{selectedLocation}</span>
                </div>
                <ChevronDown size={9} className="text-neutral-400 shrink-0" />
              </button>
              {activeDropdown === "location" && (
                <div className="absolute left-0 top-full z-50 mt-1 w-32 rounded-lg border border-neutral-200/90 bg-white p-0.5 shadow-md">
                  {LOCATION_OPTIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left rounded-md px-2 py-0.5 text-[9px] font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden h-4 w-px bg-neutral-200 lg:block mx-0.5" />

            {/* Job Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "type" ? null : "type")}
                className="flex w-full items-center justify-between gap-1 rounded-md px-1.5 py-1 text-[9px] sm:text-[9.5px] font-medium text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors lg:w-auto"
              >
                <div className="flex items-center gap-1">
                  <Briefcase size={10} className="text-neutral-400 shrink-0" />
                  <span>{selectedType}</span>
                </div>
                <ChevronDown size={9} className="text-neutral-400 shrink-0" />
              </button>
              {activeDropdown === "type" && (
                <div className="absolute left-0 top-full z-50 mt-1 w-30 rounded-lg border border-neutral-200/90 bg-white p-0.5 shadow-md">
                  {JOB_TYPE_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedType(t);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left rounded-md px-2 py-0.5 text-[9px] font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden h-4 w-px bg-neutral-200 lg:block mx-0.5" />

            {/* Salary Range Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "salary" ? null : "salary")}
                className="flex w-full items-center justify-between gap-1 rounded-md px-1.5 py-1 text-[9px] sm:text-[9.5px] font-medium text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors lg:w-auto"
              >
                <div className="flex items-center gap-1">
                  <DollarSign size={10} className="text-neutral-400 shrink-0" />
                  <span>{selectedSalary}</span>
                </div>
                <ChevronDown size={9} className="text-neutral-400 shrink-0" />
              </button>
              {activeDropdown === "salary" && (
                <div className="absolute left-0 top-full z-50 mt-1 w-30 rounded-lg border border-neutral-200/90 bg-white p-0.5 shadow-md">
                  {SALARY_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedSalary(s);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left rounded-md px-2 py-0.5 text-[9px] font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* START SEARCHING Sleek Black CTA Button matching reference */}
            <button
              type="button"
              onClick={onSearch}
              className="inline-flex h-[26px] items-center justify-center rounded-md bg-black px-2.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-2xs shrink-0"
            >
              Start Searching
            </button>
          </div>
        </div>

        {/* Quick Trending Tags & Count */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#596d7e]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#596d7e]">Popular:</span>
            {["Full Time", "Remote", "Product Design", "Engineering", "AI"].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  addTag(term);
                  onTrendingClick(term);
                }}
                className="rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 hover:border-neutral-300 hover:text-black transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
          {totalCategoryJobs > 0 && (
            <p className="text-xs text-[#596d7e]">
              <strong className="font-bold text-[#111827]">{totalCategoryJobs.toLocaleString()}</strong> open positions currently available
            </p>
          )}
        </div>

        {/* Featured Preview Grid */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#596d7e]">
              Top Picks For Today
            </h2>
            <Link
              href="/job"
              className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:underline"
            >
              Explore all <ArrowRight size={13} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-44 rounded-2xl" />
              <Skeleton className="h-44 rounded-2xl" />
            </div>
          ) : formattedHeroJobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {formattedHeroJobs.slice(0, 2).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
