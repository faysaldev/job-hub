"use client";

import { useState } from "react";
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
  Filter,
  ChevronRight,
  User,
  ExternalLink,
  Code,
  Globe,
  Mail,
} from "lucide-react";
import { useGetAllSeekersQuery } from "@/src/redux/features/seeker/seekerApi";

export default function CandidatesListingPage() {
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
  const pagination = seekersData?.data?.pagination;

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key as keyof typeof prev] === value ? "" : value,
    }));
  };

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

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  // Frontend sorting logic since backend might not support all types yet
  const sortedSeekers = [...seekers].sort((a, b) => {
    if (sortBy === "job-type") {
      return (a.jobType || "").localeCompare(b.jobType || "");
    }
    // Default to newest (based on creation date if available, or just keep order)
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="bg-[#234C6A] pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Discover Exceptional <span className="text-blue-400">Talent</span>
          </h1>
          <p className="text-xl text-blue-100/80 max-w-2xl mx-auto font-medium">
            Browse through our curated list of world-class professionals ready
            to take your team to the next level.
          </p>

          <div className="max-w-3xl mx-auto mt-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex flex-col md:flex-row gap-3 p-2 bg-white rounded-[28px] shadow-2xl">
                <div className="flex-1 flex items-center px-4 gap-3">
                  <Search className="h-6 w-6 text-gray-400" />
                  <Input
                    placeholder="Search by name, role, or skills..."
                    className="border-none bg-transparent h-14 text-lg focus-visible:ring-0 placeholder:text-gray-400 font-medium"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="hidden md:block w-px h-10 bg-gray-100 self-center"></div>
                <div className="flex items-center px-4 gap-3">
                  <MapPin className="h-6 w-6 text-gray-400" />
                  <select
                    className="bg-transparent border-none text-gray-600 font-medium focus:ring-0 cursor-pointer"
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange("jobType", e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-14 px-10 rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-bold text-lg shadow-lg transition-all active:scale-95"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-8">
            <div className="p-8 bg-white rounded-[32px] shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#234C6A] flex items-center gap-2">
                  <Filter className="h-5 w-5" /> Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>

              {/* Experience Level */}
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Experience Level
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "Entry Level", value: "entry-level" },
                    { label: "Mid Level", value: "mid-level" },
                    { label: "Senior Level", value: "senior-level" },
                    { label: "Expert", value: "expert" },
                  ].map((level) => (
                    <label
                      key={level.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={filters.experienceLevel === level.value}
                        onChange={() =>
                          handleFilterChange("experienceLevel", level.value)
                        }
                      />
                      <div
                        className={`w-5 h-5 rounded-md border-2 transition-colors flex items-center justify-center ${
                          filters.experienceLevel === level.value
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-200 group-hover:border-blue-500"
                        }`}
                      >
                        {filters.experienceLevel === level.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`font-medium transition-colors ${
                          filters.experienceLevel === level.value
                            ? "text-[#234C6A] font-bold"
                            : "text-gray-600 group-hover:text-[#234C6A]"
                        }`}
                      >
                        {level.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Availability
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "Immediately", value: "immediately" },
                    { label: "1 Week", value: "1-week" },
                    { label: "2 Weeks", value: "2-weeks" },
                    { label: "1 Month", value: "1-month" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={filters.availability === item.value}
                        onChange={() =>
                          handleFilterChange("availability", item.value)
                        }
                      />
                      <div
                        className={`w-5 h-5 rounded-md border-2 transition-colors flex items-center justify-center ${
                          filters.availability === item.value
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-200 group-hover:border-blue-500"
                        }`}
                      >
                        {filters.availability === item.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`font-medium transition-colors ${
                          filters.availability === item.value
                            ? "text-[#234C6A] font-bold"
                            : "text-gray-600 group-hover:text-[#234C6A]"
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Job Preference
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "Remote", value: "remote" },
                    { label: "Hybrid", value: "hybrid" },
                    { label: "On-site", value: "onsite" },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={filters.jobType === type.value}
                        onChange={() => handleFilterChange("jobType", type.value)}
                      />
                      <div
                        className={`w-5 h-5 rounded-md border-2 transition-colors flex items-center justify-center ${
                          filters.jobType === type.value
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-200 group-hover:border-blue-500"
                        }`}
                      >
                        {filters.jobType === type.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`font-medium transition-colors ${
                          filters.jobType === type.value
                            ? "text-[#234C6A] font-bold"
                            : "text-gray-600 group-hover:text-[#234C6A]"
                        }`}
                      >
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-[#234C6A] to-[#456882] border-none rounded-[32px] text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <Star className="h-8 w-8 text-yellow-400 mb-4 fill-yellow-400" />
                <h3 className="text-xl font-bold mb-2">Featured Talent</h3>
                <p className="text-blue-100/70 text-sm mb-6 leading-relaxed">
                  Promote your profile to reach thousands of top employers
                  daily.
                </p>
                <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90 rounded-2xl font-bold h-12 shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                  Upgrade Profile
                </Button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            </Card>
          </aside>

          {/* Candidates List */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 font-medium">
                Showing{" "}
                <span className="text-[#234C6A] font-bold">
                  {sortedSeekers.length}
                </span>{" "}
                exceptional candidates
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 font-medium">
                  Sort by:
                </span>
                <select
                  className="bg-transparent border-none text-[#234C6A] font-bold focus:ring-0 cursor-pointer text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="job-type">Job Type</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                    Discovering Talent...
                  </p>
                </div>
              ) : sortedSeekers.length > 0 ? (
                sortedSeekers.map((s: any) => (
                  <CandidateCard key={s._id} candidate={s} />
                ))
              ) : (
                <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="h-10 w-10 text-gray-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#234C6A]">
                    No candidates found
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Try adjusting your search or filters to find what you're
                    looking for.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: any }) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-500 border-none bg-white shadow-md hover:shadow-2xl rounded-[32px] border border-transparent hover:border-blue-100/50">
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar & Basic Info */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[28px] overflow-hidden border-4 border-gray-50 shadow-inner">
              <img
                src={
                  candidate.userId?.image ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                }
                alt={candidate.userId?.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-[#234C6A] group-hover:text-blue-600 transition-colors">
                  {candidate.userId?.name || "Anonymous Candidate"}
                </h3>
                <p className="text-[#456882] font-bold text-lg">
                  {candidate.designation || "Professional"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <MapPin className="h-4 w-4 text-blue-500" />
                {candidate.userLocation || "Remote"}
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Briefcase className="h-4 w-4 text-blue-500" />
                {candidate.totalExperience || "N/A"} Exp
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="capitalize">
                  {candidate.availability?.replace("-", " ") || "Immediate"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="capitalize">{candidate.jobType || "Remote"}</span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed max-w-2xl line-clamp-2">
              {candidate.aboutMe || "No bio provided."}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {(candidate.skills || []).map((skill: string) => (
                <Badge
                  key={skill}
                  className="bg-blue-50 text-blue-600 border-none px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-tight"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-end gap-6">
          <div className="flex items-center gap-3">
            <Link href={`/candidates/${candidate._id}`}>
              <Button className="rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50 text-[#234C6A] font-bold px-8 h-14 shadow-sm transition-all group-hover:shadow-lg">
                View Profile
              </Button>
            </Link>
            <Button className="rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-bold px-10 h-14 shadow-xl transition-all active:scale-95">
              Hire Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

