"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Search, MapPin, Briefcase, Star, Filter,
  User, Globe, CheckCircle, Clock, Users, Sparkles,
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
  title, options, active, onChange,
}: { title: string; options: { label: string; value: string }[]; active: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-black uppercase tracking-widest text-[#456882]">{title}</h4>
      <div className="space-y-2">
        {options.map((opt) => {
          const checked = active === opt.value;
          return (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="hidden" checked={checked} onChange={() => onChange(opt.value)} />
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${checked ? "border-[#234C6A] bg-[#234C6A]" : "border-[#E3E3E3] group-hover:border-[#234C6A]/50"}`}>
                {checked && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className={`text-sm font-medium transition-colors ${checked ? "text-[#234C6A] font-bold" : "text-[#456882] group-hover:text-[#234C6A]"}`}>
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
    <Card className="group relative overflow-hidden border border-[#E3E3E3]/60 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-2xl hover:border-[#234C6A]/20 rounded-3xl transition-all duration-500">
      {/* top hover accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#234C6A] to-[#456882] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[#E3E3E3]/50 shadow-lg group-hover:scale-105 transition-transform duration-500">
              <img
                src={candidate.userId?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${candidate.userId?.name || "U"}`}
                alt={candidate.userId?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-xl border-2 border-white flex items-center justify-center shadow-md">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-xl font-black text-[#234C6A] group-hover:text-[#456882] transition-colors">
                  {candidate.userId?.name || "Anonymous Candidate"}
                </h3>
                <p className="text-[#456882] font-semibold">{candidate.designation || "Professional"}</p>
              </div>
              <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none font-semibold self-start">
                {candidate.experienceLevel || "Professional"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#456882]">
              {candidate.userLocation && (
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#234C6A]" />{candidate.userLocation}</span>
              )}
              {candidate.totalExperience && (
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-[#234C6A]" />{candidate.totalExperience} exp</span>
              )}
              {candidate.availability && (
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#234C6A]" />{candidate.availability.replace("-", " ")}</span>
              )}
              {candidate.jobType && (
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-[#234C6A]" />{candidate.jobType}</span>
              )}
            </div>

            {candidate.aboutMe && (
              <p className="text-sm text-[#456882]/80 line-clamp-2 leading-relaxed">{candidate.aboutMe}</p>
            )}

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 5).map((s) => (
                  <Badge key={s} className="bg-[#234C6A]/5 text-[#234C6A] border border-[#234C6A]/10 font-medium text-xs">
                    {s}
                  </Badge>
                ))}
                {skills.length > 5 && (
                  <Badge className="bg-[#E3E3E3] text-[#456882] border-none text-xs">+{skills.length - 5}</Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[#E3E3E3]/50 flex flex-col sm:flex-row sm:items-center justify-end gap-3">
          <Link href={`/candidates/${candidate._id}`}>
            <Button variant="outline" className="rounded-xl border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/5 font-semibold px-6">
              View Profile
            </Button>
          </Link>
          <Button className="rounded-xl bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white font-bold px-8 shadow-lg transition-all active:scale-95">
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
  const [filters, setFilters] = useState({ experienceLevel: "", availability: "", jobType: "", totalExperience: "", location: "" });
  const [sortBy, setSortBy] = useState("newest");

  const { data: seekersData, isLoading } = useGetAllSeekersQuery({ search: searchQuery, ...filters });
  const seekers = seekersData?.data?.seekers || [];

  const sortedSeekers = [...seekers].sort((a, b) =>
    sortBy === "job-type" ? (a.jobType || "").localeCompare(b.jobType || "") : 0
  );

  const handleFilterChange = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: prev[key as keyof typeof prev] === value ? "" : value }));

  const clearFilters = () => { setFilters({ experienceLevel: "", availability: "", jobType: "", totalExperience: "", location: "" }); setSearchQuery(""); setSearchInput(""); };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".candidate-card-item", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" });
    }, containerRef);
    return () => ctx.revert();
  }, [sortedSeekers.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E3E3E3] via-white to-[#E3E3E3]">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6 border border-white/20">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Discover Exceptional Talent</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
            Find Your Next <span className="text-blue-300">Hire</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium mb-10">
            Browse world-class professionals ready to take your team to the next level.
          </p>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 gap-3">
                <Search className="h-5 w-5 text-[#456882]" />
                <Input
                  placeholder="Search by name, role, or skills..."
                  className="border-none bg-transparent h-12 text-base focus-visible:ring-0 placeholder:text-[#456882]/50"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchInput)}
                />
              </div>
              <Button
                onClick={() => setSearchQuery(searchInput)}
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#234C6A] to-[#456882] text-white font-bold shadow-lg transition-all active:scale-95"
              >
                Search Talent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wave */}
      <div className="-mt-px">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full block">
          <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H0Z" fill="white" />
        </svg>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-10" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            <Card className="p-6 border border-[#E3E3E3]/60 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#234C6A] flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h3>
                <button onClick={clearFilters} className="text-xs font-bold text-[#456882] hover:text-[#234C6A] transition-colors">
                  Clear all
                </button>
              </div>
              <div className="space-y-6 divide-y divide-[#E3E3E3]/50">
                <FilterGroup title="Experience Level" options={FILTER_OPTIONS.experienceLevel} active={filters.experienceLevel} onChange={(v) => handleFilterChange("experienceLevel", v)} />
                <div className="pt-6">
                  <FilterGroup title="Availability" options={FILTER_OPTIONS.availability} active={filters.availability} onChange={(v) => handleFilterChange("availability", v)} />
                </div>
                <div className="pt-6">
                  <FilterGroup title="Job Preference" options={FILTER_OPTIONS.jobType} active={filters.jobType} onChange={(v) => handleFilterChange("jobType", v)} />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <Star className="h-7 w-7 text-amber-300 mb-3 fill-amber-300" />
                <h3 className="text-lg font-bold mb-2">Featured Talent</h3>
                <p className="text-white/70 text-sm mb-5 leading-relaxed">Promote your profile to reach thousands of top employers daily.</p>
                <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90 rounded-xl font-bold h-11 transition-all active:scale-95">
                  Upgrade Profile
                </Button>
              </div>
            </Card>
          </aside>

          {/* List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#234C6A] font-bold text-lg">
                  {isLoading ? "Loading..." : <><span className="text-2xl">{sortedSeekers.length}</span> candidates found</>}
                </p>
                <p className="text-sm text-[#456882]">Verified professionals across all industries</p>
              </div>
              <div className="flex items-center gap-3 bg-white border border-[#E3E3E3] rounded-xl px-4 py-2 shadow-sm">
                <Users className="h-4 w-4 text-[#456882]" />
                <select className="bg-transparent border-none text-sm text-[#234C6A] font-semibold focus:ring-0 cursor-pointer" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="job-type">Job Type</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-52 rounded-3xl bg-white/80 animate-pulse shadow-sm" />
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
              <Card className="p-16 text-center border border-dashed border-[#234C6A]/20 bg-white/60 rounded-3xl shadow-sm">
                <div className="w-20 h-20 bg-[#234C6A]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <User className="h-10 w-10 text-[#234C6A]/40" />
                </div>
                <h3 className="text-2xl font-bold text-[#234C6A] mb-2">No candidates found</h3>
                <p className="text-[#456882] max-w-sm mx-auto">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                <Button variant="outline" className="mt-6 border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/5" onClick={clearFilters}>
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
