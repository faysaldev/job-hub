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
  Star,
  User,
  Globe,
  CheckCircle,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import { useGetAllSeekersQuery } from "@/src/redux/features/seeker/seekerApi";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import gsap from "gsap";

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
    <div className="space-y-3">
      <h4 className="text-xs font-black uppercase tracking-widest text-[#456882]">
        {title}
      </h4>
      <div className="space-y-2">
        {options.map((opt) => {
          const checked = active === opt.value;
          return (
            <label
              key={opt.value}
              className="group flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-[#234C6A]/5"
            >
              <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={() => onChange(opt.value)}
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all duration-200 ${checked ? "border-[#234C6A] bg-[#234C6A]" : "border-[#E3E3E3] group-hover:border-[#234C6A]/50"}`}
              >
                {checked && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <span
                className={`text-sm transition-colors ${checked ? "font-black text-[#234C6A]" : "font-semibold text-[#456882] group-hover:text-[#234C6A]"}`}
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
    <Card className="group relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-2xl hover:shadow-[#234C6A]/10">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#234C6A] to-[#456882] transition-transform duration-300 group-hover:scale-x-100" />
      <div className="p-8">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <div className="relative shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-[#234C6A]/5 p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src={
                  candidate.userId?.image ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${candidate.userId?.name || "U"}`
                }
                alt={candidate.userId?.name}
                className="h-full w-full rounded-[1.25rem] object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-2xl border-2 border-white bg-emerald-500 shadow-md">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-black tracking-tight text-[#234C6A] transition-colors group-hover:text-[#456882]">
                  {candidate.userId?.name || "Anonymous Candidate"}
                </h3>
                <p className="mt-1 font-semibold text-[#456882]">
                  {candidate.designation || "Professional"}
                </p>
              </div>
              <Badge className="self-start rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-3 py-1 text-xs font-black capitalize text-[#234C6A]">
                {candidate.experienceLevel || "Professional"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-[#456882]">
              {candidate.userLocation && (
                <span className="flex items-center gap-1.5 rounded-full bg-[#F4F7F8] px-3 py-1.5 font-semibold">
                  <MapPin className="h-4 w-4 text-[#234C6A]" />
                  {candidate.userLocation}
                </span>
              )}
              {candidate.totalExperience && (
                <span className="flex items-center gap-1.5 rounded-full bg-[#F4F7F8] px-3 py-1.5 font-semibold">
                  <Briefcase className="h-4 w-4 text-[#234C6A]" />
                  {candidate.totalExperience} exp
                </span>
              )}
              {candidate.availability && (
                <span className="flex items-center gap-1.5 rounded-full bg-[#F4F7F8] px-3 py-1.5 font-semibold">
                  <Clock className="h-4 w-4 text-[#234C6A]" />
                  {candidate.availability.replace("-", " ")}
                </span>
              )}
              {candidate.jobType && (
                <span className="flex items-center gap-1.5 rounded-full bg-[#F4F7F8] px-3 py-1.5 font-semibold">
                  <Globe className="h-4 w-4 text-[#234C6A]" />
                  {candidate.jobType}
                </span>
              )}
            </div>

            {candidate.aboutMe && (
              <p className="line-clamp-2 text-sm leading-7 text-[#456882]/85">
                {candidate.aboutMe}
              </p>
            )}

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 5).map((s) => (
                  <Badge
                    key={s}
                    className="rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-3 py-1 text-xs font-bold text-[#234C6A]"
                  >
                    {s}
                  </Badge>
                ))}
                {skills.length > 5 && (
                  <Badge className="rounded-full border-none bg-[#E3E3E3]/80 px-3 py-1 text-xs font-bold text-[#456882]">
                    +{skills.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-end gap-3 border-t border-[#E3E3E3]/70 pt-5 sm:flex-row sm:items-center">
          <Link href={`/candidates/${candidate._id}`}>
            <Button
              variant="outline"
              className="h-11 rounded-2xl border-[#234C6A]/20 px-6 font-black text-[#234C6A] hover:bg-[#234C6A]/5"
            >
              View Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button className="h-11 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-8 font-black text-white shadow-lg shadow-[#234C6A]/15 transition-all hover:from-[#1c405a] hover:to-[#3b5a71] active:scale-[0.99]">
            Hire Now
          </Button>
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
  const [sortBy, setSortBy] = useState("newest");

  const { data: seekersData, isLoading } = useGetAllSeekersQuery({
    search: searchQuery,
    ...filters,
  });
  const seekers = seekersData?.data?.seekers || [];

  const sortedSeekers = [...seekers].sort((a, b) =>
    sortBy === "job-type"
      ? (a.jobType || "").localeCompare(b.jobType || "")
      : 0,
  );

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
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [sortedSeekers.length]);

  return (
    <div className="min-h-screen flex flex-col jobhub-page-bg">
      <Header />

      <section className="relative overflow-hidden bg-[#234C6A] pt-32 pb-28 md:pt-40 md:pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute left-8 top-28 hidden h-28 w-64 rotate-[-8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
          <div className="absolute bottom-14 right-10 hidden h-32 w-72 rotate-[7deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Discover Exceptional Talent</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
              Find qualified candidates for your next great hire.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-white/75">
              Browse verified professionals by role, availability, location,
              experience, and work preference in a premium recruiter experience.
            </p>

            <div className="mx-auto mt-10 max-w-4xl">
              <div className="rounded-3xl border border-white/15 bg-white/95 p-3 shadow-2xl shadow-black/15 backdrop-blur-xl">
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#456882]" />
                    <Input
                      placeholder="Search by name, role, or skills..."
                      className="h-14 rounded-2xl border-transparent bg-[#F4F7F8] pl-12 text-base text-[#234C6A] placeholder:text-[#456882]/55 focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setSearchQuery(searchInput)
                      }
                    />
                  </div>
                  <Button
                    onClick={() => setSearchQuery(searchInput)}
                    className="h-14 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-8 font-black text-white shadow-lg shadow-[#234C6A]/20 transition-all hover:from-[#1c405a] hover:to-[#3b5a71] active:scale-[0.99]"
                  >
                    Search Talent
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: Shield, label: "Verified Talent" },
                { icon: Clock, label: "Availability Signals" },
                { icon: Briefcase, label: "Role-Based Search" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-white/90 backdrop-blur-sm"
                >
                  <Icon className="mr-2 inline h-4 w-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto flex-1 px-6 py-14" ref={containerRef}>
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="shrink-0 space-y-6 lg:w-80">
            <Card className="overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
              <div className="border-b border-[#E3E3E3]/70 bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#234C6A] text-white">
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-[#234C6A]">Filters</h3>
                      <p className="text-xs font-semibold text-[#456882]">
                        Narrow your talent pool
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="rounded-xl px-3 py-2 text-xs font-black text-[#456882] transition-colors hover:bg-[#234C6A]/10 hover:text-[#234C6A]"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="space-y-6 divide-y divide-[#E3E3E3]/70 p-5">
                <FilterGroup
                  title="Experience Level"
                  options={FILTER_OPTIONS.experienceLevel}
                  active={filters.experienceLevel}
                  onChange={(v) => handleFilterChange("experienceLevel", v)}
                />
                <div className="pt-6">
                  <FilterGroup
                    title="Availability"
                    options={FILTER_OPTIONS.availability}
                    active={filters.availability}
                    onChange={(v) => handleFilterChange("availability", v)}
                  />
                </div>
                <div className="pt-6">
                  <FilterGroup
                    title="Job Preference"
                    options={FILTER_OPTIONS.jobType}
                    active={filters.jobType}
                    onChange={(v) => handleFilterChange("jobType", v)}
                  />
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#234C6A] to-[#456882] p-6 text-white shadow-xl shadow-[#234C6A]/20">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[3rem] bg-white/10" />
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Star className="h-6 w-6 fill-white text-white" />
                </div>
                <h3 className="text-xl font-black">Featured Talent</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Highlight top candidates and build faster hiring shortlists
                  for your recruiter workflow.
                </p>
                <Button className="mt-5 h-11 w-full rounded-2xl bg-white font-black text-[#234C6A] hover:bg-[#E3E3E3]">
                  Upgrade Profile
                </Button>
              </div>
            </Card>
          </aside>

          <div className="flex-1">
            <Card className="mb-6 rounded-3xl border border-[#234C6A]/10 bg-white/95 p-5 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
                    Candidate Directory
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-[#234C6A]">
                    {isLoading ? (
                      "Loading talent..."
                    ) : (
                      <>
                        {sortedSeekers.length}{" "}
                        <span className="text-base font-semibold text-[#456882]">
                          candidates found
                        </span>
                      </>
                    )}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-[#456882]">
                    Verified professionals across roles, locations, and work
                    preferences
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-[#234C6A]/10 bg-[#F4F7F8] px-4 py-3">
                  <Users className="h-4 w-4 text-[#456882]" />
                  <select
                    className="cursor-pointer border-none bg-transparent text-sm font-black text-[#234C6A] outline-none focus:ring-0"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="job-type">Job Type</option>
                  </select>
                </div>
              </div>
            </Card>

            {isLoading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-3xl border border-[#234C6A]/10 bg-white/80 shadow-sm"
                  />
                ))}
              </div>
            ) : sortedSeekers.length > 0 ? (
              <div className="space-y-5">
                {sortedSeekers.map((s: any) => (
                  <div key={s._id} className="candidate-card-item">
                    <CandidateCard candidate={s} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="rounded-3xl border border-dashed border-[#234C6A]/20 bg-white/80 p-12 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#234C6A]/10">
                  <User className="h-9 w-9 text-[#234C6A]/50" />
                </div>
                <h3 className="mb-2 text-2xl font-black text-[#234C6A]">
                  No candidates found
                </h3>
                <p className="mx-auto max-w-sm text-[#456882]">
                  Try adjusting your search or filters to discover more talent.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-2xl border-[#234C6A]/20 font-black text-[#234C6A] hover:bg-[#234C6A]/5"
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
