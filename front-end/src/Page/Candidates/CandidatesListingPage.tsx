"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Search,
  MapPin,
  Briefcase,
  User,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  SlidersHorizontal,
  Globe,
} from "lucide-react";
import { useGetAllSeekersQuery } from "@/src/redux/features/seeker/seekerApi";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import gsap from "gsap";
import { ErrorState } from "@/src/components/feedback/StateViews";

const FILTER_OPTIONS = {
  experienceLevel: [
    { label: "Entry Level", value: "entry-level" },
    { label: "Mid Level", value: "mid-level" },
    { label: "Senior Level", value: "senior-level" },
    { label: "Expert", value: "expert" },
  ],
  availability: [
    { label: "Immediately", value: "immediately" },
    { label: "1 Week", value: "1-week" },
    { label: "2 Weeks", value: "2-weeks" },
    { label: "1 Month", value: "1-month" },
  ],
  jobType: [
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
    { label: "On-site", value: "onsite" },
  ],
};

function FilterGroup({
  title,
  options,
  active,
  onChange,
}: {
  title: string;
  options: { label: string; value: string }[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
        {title}
      </h4>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const checked = active === opt.value;
          return (
            <label
              key={opt.value}
              className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-50"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => onChange(opt.value)}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                  checked ? "border-black bg-black text-white" : "border-neutral-300 group-hover:border-neutral-400"
                }`}
              >
                {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>
              <span
                className={`text-xs transition-colors ${
                  checked ? "font-bold text-neutral-950" : "font-medium text-neutral-600 group-hover:text-neutral-900"
                }`}
              >
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: any }) {
  const skills: string[] = candidate.skills || [];
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shrink-0">
          <img
            src={
              candidate.userId?.image ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${candidate.userId?.name || "U"}`
            }
            alt={candidate.userId?.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 w-full space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/candidates/${candidate._id}`}>
                <h3 className="text-sm font-bold text-neutral-950 group-hover:text-black transition-colors truncate">
                  {candidate.userId?.name || "Anonymous Candidate"}
                </h3>
              </Link>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate">
                {candidate.designation || "Professional"}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-700 capitalize">
              {candidate.experienceLevel || "Professional"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
            {candidate.userLocation && (
              <span className="flex items-center gap-1 rounded-md bg-[#f8fafc] px-2 py-0.5 text-[11px] font-medium">
                <MapPin className="h-3 w-3 text-neutral-400" />
                {candidate.userLocation}
              </span>
            )}
            {candidate.totalExperience && (
              <span className="flex items-center gap-1 rounded-md bg-[#f8fafc] px-2 py-0.5 text-[11px] font-medium">
                <Briefcase className="h-3 w-3 text-neutral-400" />
                {candidate.totalExperience} exp
              </span>
            )}
            {candidate.availability && (
              <span className="flex items-center gap-1 rounded-md bg-[#f8fafc] px-2 py-0.5 text-[11px] font-medium">
                <Clock className="h-3 w-3 text-neutral-400" />
                {candidate.availability.replace("-", " ")}
              </span>
            )}
            {candidate.jobType && (
              <span className="flex items-center gap-1 rounded-md bg-[#f8fafc] px-2 py-0.5 text-[11px] font-medium capitalize">
                <Globe className="h-3 w-3 text-neutral-400" />
                {candidate.jobType}
              </span>
            )}
          </div>

          {candidate.aboutMe && (
            <p className="line-clamp-2 text-xs text-neutral-500 leading-relaxed">
              {candidate.aboutMe}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-[#f3f4f6] text-neutral-600 text-[10px] font-medium px-2 py-0.5"
                >
                  {s}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="rounded-md bg-[#f3f4f6] text-neutral-400 text-[10px] font-medium px-1.5 py-0.5">
                  +{skills.length - 4}
                </span>
              )}
            </div>

            <Link href={`/candidates/${candidate._id}`}>
              <Button
                className="h-8 rounded-lg bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider px-3.5"
              >
                View Profile
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function CandidatesListingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    experienceLevel: "",
    availability: "",
    jobType: "",
    totalExperience: "",
    location: "",
  });

  const { data: seekersData, isLoading, isError, refetch } = useGetAllSeekersQuery({
    search: searchQuery,
    ...filters,
  });
  const seekers = seekersData?.data?.seekers || [];

  const handleFilterChange = (key: string, value: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key as keyof typeof prev] === value ? "" : value,
    }));

  const clearFilters = () => {
    setFilters({
      experienceLevel: "",
      availability: "",
      jobType: "",
      totalExperience: "",
      location: "",
    });
    setSearchQuery("");
    setSearchInput("");
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".candidate-card-item",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [seekers.length]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-black text-white pt-14 pb-20 border-b border-neutral-800 text-center">
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
            <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
            <span>Discover Exceptional Talent</span>
          </div>
          <h1 className="mx-auto mb-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Find qualified candidates for your next role.
          </h1>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-neutral-400 mb-6">
            Search candidates by role, availability, location, and technical skill sets.
          </p>

          <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-2 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search by name, role, or skills..."
                  aria-label="Search candidates"
                  className="h-9 border-0 bg-transparent pl-9 text-xs text-white placeholder:text-neutral-500 focus-visible:ring-0"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
              </div>
              <Button
                onClick={() => setSearchQuery(searchInput)}
                className="h-8 rounded-xl bg-white text-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider px-4"
              >
                Search Talent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main id="main-content" className="container mx-auto max-w-5xl px-4 py-10 flex-1" ref={containerRef}>
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="shrink-0 space-y-4 lg:w-64">
            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-neutral-700" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Filters</h3>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-4">
                <FilterGroup
                  title="Experience Level"
                  options={FILTER_OPTIONS.experienceLevel}
                  active={filters.experienceLevel}
                  onChange={(v) => handleFilterChange("experienceLevel", v)}
                />
                <FilterGroup
                  title="Availability"
                  options={FILTER_OPTIONS.availability}
                  active={filters.availability}
                  onChange={(v) => handleFilterChange("availability", v)}
                />
                <FilterGroup
                  title="Work Preference"
                  options={FILTER_OPTIONS.jobType}
                  active={filters.jobType}
                  onChange={(v) => handleFilterChange("jobType", v)}
                />
              </div>
            </Card>

            <Card className="rounded-2xl border border-neutral-800 bg-black p-5 text-white shadow-xs">
              <h3 className="text-xs font-bold text-white mb-1">Hiring for a role?</h3>
              <p className="text-[11px] text-neutral-400 leading-normal mb-3">
                Post positions and manage candidate pipelines from your employer dashboard.
              </p>
              <Link href="/auth">
                <Button className="w-full h-8 rounded-lg bg-white text-black hover:bg-neutral-100 text-[10px] font-bold uppercase tracking-wider">
                  Get Started
                </Button>
              </Link>
            </Card>
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-neutral-900">
                {isLoading ? "Searching..." : `${seekers.length} Candidates Available`}
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-36 rounded-2xl border border-[#eaecf0] bg-white animate-pulse"
                  />
                ))}
              </div>
            ) : isError ? (
              <ErrorState description="Candidate profiles could not be loaded." onRetry={() => void refetch()} />
            ) : seekers.length > 0 ? (
              <div className="space-y-3">
                {seekers.map((s: any) => (
                  <div key={s._id} className="candidate-card-item">
                    <CandidateCard candidate={s} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="rounded-2xl border border-dashed border-[#eaecf0] bg-white p-12 text-center shadow-xs">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                  <User className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-neutral-950">
                  No candidates found
                </h3>
                <p className="mx-auto mt-1 max-w-xs text-xs text-neutral-500">
                  Try adjusting your search criteria or resetting filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
