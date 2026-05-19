/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import SearchSection from "@/src/components/jobs/SearchSection";
import JobFilters from "@/src/components/jobs/JobFilters";
import Pagination from "@/src/components/jobs/Pagination";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Briefcase,
  Sparkles,
  Target,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Building2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import gsap from "gsap";
import { useSearchJobsQuery } from "@/src/redux/features/jobs/jobsApi";
import { truncate, shouldTruncate } from "@/src/lib/truncate";
import {
  jobCategories,
  companySizes,
  postedDateOptions,
  applicantsOptions,
} from "@/src/lib/jobCategories";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiJob {
  _id: string;
  title: string;
  category: string;
  subcategory: string;
  type: string;
  location: string;
  locationType: string;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: string;
  experienceLevel: string;
  description: string;
  skills: string[];
  applicationDeadline: string;
  positions: number;
  isActive: boolean;
  createdAt: string;
  company: {
    _id: string;
    userId: string;
    companyLogo: string;
    companyName: string;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

function formatSalary(min: number, max: number, period: string): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;
  const periodLabel: Record<string, string> = {
    monthly: "/mo",
    yearly: "/yr",
    hourly: "/hr",
  };
  return `${fmt(min)} – ${fmt(max)}${periodLabel[period] ?? ""}`;
}

const TYPE_COLORS: Record<string, string> = {
  "full-time": "bg-[#234C6A]/10 text-[#234C6A] border-[#234C6A]/10",
  "part-time": "bg-[#456882]/10 text-[#234C6A] border-[#456882]/10",
  contract: "bg-[#E3E3E3]/70 text-[#234C6A] border-[#234C6A]/10",
  freelance: "bg-white text-[#234C6A] border-[#234C6A]/10",
  internship: "bg-[#234C6A]/5 text-[#456882] border-[#234C6A]/10",
};

const LOCATION_COLORS: Record<string, string> = {
  remote: "bg-emerald-50 text-emerald-700 border-emerald-100",
  hybrid: "bg-[#E3E3E3]/70 text-[#234C6A] border-[#234C6A]/10",
  onsite: "bg-white text-[#456882] border-[#234C6A]/10",
};

// ─── Job Card ─────────────────────────────────────────────────────────────────

const JobCard = memo(({ job }: { job: ApiJob }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/job/${job._id}`);
  }, [router, job._id]);

  const deadlineDate = useMemo(
    () =>
      new Date(job.applicationDeadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [job.applicationDeadline],
  );

  const isExpiringSoon = useMemo(() => {
    const daysLeft = Math.ceil(
      (new Date(job.applicationDeadline).getTime() - Date.now()) / 86400000,
    );
    return daysLeft <= 7 && daysLeft >= 0;
  }, [job.applicationDeadline]);

  return (
    <div
      onClick={handleClick}
      className="job-card-item group relative cursor-pointer overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-2xl hover:shadow-[#234C6A]/10"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882] scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

      <div className="p-5 sm:p-6">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            {job.company?.companyLogo ? (
              <img
                src={job.company.companyLogo}
                alt={job.company.companyName}
                className="h-14 w-14 rounded-2xl border border-[#234C6A]/10 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] shadow-sm">
                <Building2 className="h-7 w-7 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black tracking-tight text-[#234C6A] transition-colors group-hover:text-[#456882]">
                  {job.title}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#456882]">
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                  {job.company?.companyName || "Unknown Company"}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E3E3E3]/50 text-[#456882] transition group-hover:bg-[#234C6A] group-hover:text-white">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold capitalize ${TYPE_COLORS[job.type] || "bg-white text-[#234C6A] border-[#234C6A]/10"}`}
              >
                <Briefcase className="h-3 w-3" />
                {job.type.replace("-", " ")}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold capitalize ${LOCATION_COLORS[job.locationType] || "bg-white text-[#456882] border-[#234C6A]/10"}`}
              >
                <MapPin className="h-3 w-3" />
                {job.locationType}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-3 py-1 text-xs font-bold text-[#234C6A]">
                <DollarSign className="h-3 w-3" />
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E3E3E3]/55 px-3 py-1 text-xs font-semibold text-[#456882]">
                <Users className="h-3 w-3" />
                {job.positions} {job.positions === 1 ? "opening" : "openings"}
              </span>
            </div>

            <div className="mt-3">
              <p className="text-sm text-[#456882] leading-relaxed inline">
                {isExpanded ? job.description : truncate(job.description, 150)}
              </p>
              {shouldTruncate(job.description, 150) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="ml-2 text-[#234C6A] font-semibold hover:text-[#456882] transition-colors text-xs underline-offset-4 hover:underline"
                >
                  {isExpanded ? "Show Less" : "See More"}
                </button>
              )}
            </div>

            {/* Location text */}
            <p className="mt-3 flex items-center gap-1 text-xs font-medium text-[#456882]/80">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              {job.location}
            </p>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-2.5 py-1 text-xs font-semibold text-[#234C6A]"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="rounded-full bg-[#E3E3E3]/70 px-2.5 py-1 text-xs font-semibold text-[#456882]">
                    +{job.skills.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer row */}
        <div className="mt-5 flex flex-col gap-2 border-t border-[#E3E3E3]/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-1 text-xs font-semibold text-[#456882]/70">
            <Clock className="h-3 w-3" />
            Posted {timeAgo(job.createdAt)}
          </span>
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${isExpiringSoon ? "text-red-500" : "text-[#456882]/70"}`}
          >
            <Clock className="h-3 w-3" />
            Deadline: {deadlineDate}
            {isExpiringSoon && " soon"}
          </span>
        </div>
      </div>
    </div>
  );
});
JobCard.displayName = "JobCard";

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = memo(() => (
  <Card className="rounded-3xl border border-dashed border-[#234C6A]/20 bg-white/80 p-12 text-center shadow-sm">
    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#234C6A]/10">
      <Briefcase className="h-8 w-8 text-[#234C6A]" />
    </div>
    <h3 className="mb-2 text-2xl font-black text-[#234C6A]">No Jobs Found</h3>
    <p className="text-[#456882] max-w-md mx-auto">
      We couldn't find any jobs matching your criteria. Try adjusting your
      filters or search terms.
    </p>
  </Card>
));
EmptyState.displayName = "EmptyState";

// ─── Filter state initializers (stable, outside component) ───────────────────

const initJobTypes = () => [
  { id: "full-time", label: "Full-time", checked: true },
  { id: "part-time", label: "Part-time", checked: true },
  { id: "freelance", label: "Freelance", checked: true },
  { id: "contract", label: "Contract", checked: true },
  { id: "internship", label: "Internship", checked: true },
];

const initExperienceLevels = () => [
  { id: "entry", label: "Entry Level", checked: true },
  { id: "junior", label: "Junior", checked: true },
  { id: "mid", label: "Mid Level", checked: true },
  { id: "senior", label: "Senior Level", checked: true },
  { id: "lead", label: "Lead", checked: true },
];

const initSalaryRanges = () => [
  { id: "0-30k", label: "$0 - $30k", checked: false, min: 0, max: 30000 },
  {
    id: "30k-50k",
    label: "$30k - $50k",
    checked: false,
    min: 30000,
    max: 50000,
  },
  {
    id: "50k-75k",
    label: "$50k - $75k",
    checked: false,
    min: 50000,
    max: 75000,
  },
  {
    id: "75k-100k",
    label: "$75k - $100k",
    checked: false,
    min: 75000,
    max: 100000,
  },
  {
    id: "100k-150k",
    label: "$100k - $150k",
    checked: false,
    min: 100000,
    max: 150000,
  },
  { id: "150k+", label: "$150k+", checked: false, min: 150000, max: Infinity },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const Jobs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Search
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("s") || "",
  );
  const [locationTerm, setLocationTerm] = useState(
    () => searchParams.get("location") || "",
  );
  const [currentPage, setCurrentPage] = useState(() =>
    parseInt(searchParams.get("page") || "1", 10),
  );

  // Category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() =>
    searchParams.get("category"),
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    () => searchParams.get("subcategory"),
  );

  // Filters
  const [jobTypes, setJobTypes] = useState(initJobTypes);
  const [experienceLevels, setExperienceLevels] =
    useState(initExperienceLevels);
  const [salaryRanges, setSalaryRanges] = useState(initSalaryRanges);
  const [categoryFilters, setCategoryFilters] = useState(() =>
    jobCategories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      checked: false,
      count: cat.count,
    })),
  );
  const [subcategoryFilters, setSubcategoryFilters] = useState<
    Array<{ id: string; label: string; checked: boolean; count?: number }>
  >([]);
  const [companySizeFilters, setCompanySizeFilters] = useState(() =>
    companySizes.map((s) => ({
      id: s.id,
      label: s.label,
      checked: false,
      min: s.min,
      max: s.max,
    })),
  );
  const [postedDateFilters, setPostedDateFilters] = useState(() =>
    postedDateOptions.map((d) => ({
      id: d.id,
      label: d.label,
      checked: false,
      days: d.days,
    })),
  );
  const [applicantCountFilters, setApplicantCountFilters] = useState(() =>
    applicantsOptions.map((o) => ({
      id: o.id,
      label: o.label,
      checked: false,
      min: o.min,
      max: o.max,
    })),
  );

  // ── API Query (server-side search + pagination) ───────────────────────────
  const { data: searchJobsData, isFetching } = useSearchJobsQuery({
    search: searchTerm,
    category: selectedCategory || undefined,
    subcategory: selectedSubcategory || undefined,
    page: currentPage,
    limit: 10,
  });

  const apiJobs: ApiJob[] = useMemo(
    () => (searchJobsData as any)?.data?.jobs ?? [],
    [searchJobsData],
  );
  const paginationMeta = useMemo(
    () =>
      (searchJobsData as any)?.data?.pagination ?? {
        currentPage: 1,
        totalPages: 1,
        totalJobs: 0,
      },
    [searchJobsData],
  );

  // ── Client-side filters (applied on top of API results) ───────────────────
  const filteredJobs = useMemo(() => {
    return apiJobs.filter((job) => {
      // Job type
      const selectedTypes = jobTypes.filter((t) => t.checked).map((t) => t.id);
      if (selectedTypes.length && selectedTypes.length < jobTypes.length) {
        if (!selectedTypes.includes(job.type)) return false;
      }

      // Salary
      const checkedSalaries = salaryRanges.filter((s) => s.checked);
      if (checkedSalaries.length) {
        const ok = checkedSalaries.some(
          (r) => job.salaryMin <= r.max && job.salaryMax >= r.min,
        );
        if (!ok) return false;
      }

      // Experience
      const checkedExp = experienceLevels
        .filter((e) => e.checked)
        .map((e) => e.id);
      if (checkedExp.length && checkedExp.length < experienceLevels.length) {
        if (!checkedExp.includes(job.experienceLevel)) return false;
      }

      // Location text
      if (locationTerm) {
        const loc = job.location.toLowerCase();
        const lt = locationTerm.toLowerCase();
        if (
          !loc.includes(lt) &&
          !(lt.includes("remote") && job.locationType === "remote")
        )
          return false;
      }

      return true;
    });
  }, [apiJobs, jobTypes, salaryRanges, experienceLevels, locationTerm]);

  // ── URL helpers ───────────────────────────────────────────────────────────
  const updateURLParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value == null || value === "") params.delete(key);
        else params.set(key, value);
      });
      const qs = params.toString();
      router.push(qs ? `/job?${qs}` : "/job", { scroll: false });
    },
    [searchParams, router],
  );

  // ── Subcategory sync ──────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedCategory) {
      const cat = jobCategories.find((c) => c.id === selectedCategory);
      if (cat) {
        setSubcategoryFilters(
          cat.subcategories.map((sub) => ({
            id: sub.id,
            label: sub.name,
            checked: sub.id === selectedSubcategory,
            count: sub.count,
          })),
        );
      }
    } else {
      setSubcategoryFilters([]);
    }
  }, [selectedCategory, selectedSubcategory]);

  // ── GSAP page animation ───────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".job-card-item",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [currentPage, filteredJobs.length]);

  // ── Active filter count ───────────────────────────────────────────────────
  const activeFilterCount = useMemo(
    () =>
      categoryFilters.filter((c) => c.checked).length +
      subcategoryFilters.filter((s) => s.checked).length +
      jobTypes.filter((t) => !t.checked).length +
      experienceLevels.filter((e) => !e.checked).length +
      salaryRanges.filter((s) => s.checked).length +
      companySizeFilters.filter((c) => c.checked).length +
      postedDateFilters.filter((d) => d.checked).length +
      applicantCountFilters.filter((a) => a.checked).length,
    [
      categoryFilters,
      subcategoryFilters,
      jobTypes,
      experienceLevels,
      salaryRanges,
      companySizeFilters,
      postedDateFilters,
      applicantCountFilters,
    ],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    updateURLParams({
      s: searchTerm || null,
      location: locationTerm || null,
      page: null,
    });
  }, [searchTerm, locationTerm, updateURLParams]);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateURLParams({ page: page > 1 ? String(page) : null });
      document
        .querySelector(".job-listings")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [updateURLParams],
  );

  const handleJobTypeChange = useCallback((id: string) => {
    setJobTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)),
    );
  }, []);

  const handleExperienceChange = useCallback((id: string) => {
    setExperienceLevels((prev) =>
      prev.map((e) => (e.id === id ? { ...e, checked: !e.checked } : e)),
    );
  }, []);

  const handleSalaryChange = useCallback((id: string) => {
    setSalaryRanges((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)),
    );
  }, []);

  const handleCategoryChange = useCallback(
    (id: string) => {
      const isChecked = categoryFilters.find((c) => c.id === id)?.checked;
      setCategoryFilters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)),
      );
      if (!isChecked) {
        setSelectedCategory(id);
        setSelectedSubcategory(null);
        updateURLParams({ category: id, subcategory: null, page: null });
      } else if (selectedCategory === id) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSubcategoryFilters([]);
        updateURLParams({ category: null, subcategory: null, page: null });
      }
    },
    [categoryFilters, selectedCategory, updateURLParams],
  );

  const handleSubcategoryChange = useCallback(
    (id: string) => {
      const isChecked = subcategoryFilters.find((s) => s.id === id)?.checked;
      setSubcategoryFilters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
      );
      if (!isChecked) {
        setSelectedSubcategory(id);
        updateURLParams({ subcategory: id, page: null });
      } else if (selectedSubcategory === id) {
        setSelectedSubcategory(null);
        updateURLParams({ subcategory: null, page: null });
      }
    },
    [subcategoryFilters, selectedSubcategory, updateURLParams],
  );

  const handleCompanySizeChange = useCallback((id: string) => {
    setCompanySizeFilters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    );
  }, []);

  const handlePostedDateChange = useCallback((id: string) => {
    setPostedDateFilters((prev) =>
      prev.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d)),
    );
  }, []);

  const handleApplicantCountChange = useCallback((id: string) => {
    setApplicantCountFilters((prev) =>
      prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a)),
    );
  }, []);

  const handleClearCategory = useCallback(() => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setCategoryFilters((prev) => prev.map((c) => ({ ...c, checked: false })));
    setSubcategoryFilters([]);
    updateURLParams({ category: null, subcategory: null, page: null });
  }, [updateURLParams]);

  const handleClearSubcategory = useCallback(() => {
    setSelectedSubcategory(null);
    setSubcategoryFilters((prev) =>
      prev.map((s) => ({ ...s, checked: false })),
    );
    updateURLParams({ subcategory: null, page: null });
  }, [updateURLParams]);

  const handleResetAllFilters = useCallback(() => {
    setSearchTerm("");
    setLocationTerm("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setCategoryFilters((prev) => prev.map((c) => ({ ...c, checked: false })));
    setSubcategoryFilters([]);
    setJobTypes(initJobTypes());
    setExperienceLevels(initExperienceLevels());
    setSalaryRanges(initSalaryRanges());
    setCompanySizeFilters((prev) =>
      prev.map((s) => ({ ...s, checked: false })),
    );
    setPostedDateFilters((prev) => prev.map((d) => ({ ...d, checked: false })));
    setApplicantCountFilters((prev) =>
      prev.map((a) => ({ ...a, checked: false })),
    );
    setCurrentPage(1);
    router.push("/job");
  }, [router]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="min-h-screen flex flex-col jobhub-page-bg">
      <Header />
      <main className="flex-1 w-full">
        <SearchSection
          searchTerm={searchTerm}
          locationTerm={locationTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onLocationChange={(e) => setLocationTerm(e.target.value)}
          onSearch={handleSearch}
          onSearchKeyDown={handleSearchKeyDown}
        />

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              {/* Sidebar */}
              <div className="filters-section lg:w-80 flex-shrink-0">
                <div className="sticky top-24 space-y-5">
                  <JobFilters
                    jobTypes={jobTypes}
                    experienceLevels={experienceLevels}
                    salaryRanges={salaryRanges}
                    onJobTypeChange={handleJobTypeChange}
                    onExperienceChange={handleExperienceChange}
                    onSalaryChange={handleSalaryChange}
                    categories={categoryFilters}
                    subcategories={subcategoryFilters}
                    companySizeFilters={companySizeFilters}
                    postedDateFilters={postedDateFilters}
                    applicantCountFilters={applicantCountFilters}
                    onCategoryChange={handleCategoryChange}
                    onSubcategoryChange={handleSubcategoryChange}
                    onCompanySizeChange={handleCompanySizeChange}
                    onPostedDateChange={handlePostedDateChange}
                    onApplicantCountChange={handleApplicantCountChange}
                    selectedCategory={selectedCategory || undefined}
                    selectedSubcategory={selectedSubcategory || undefined}
                    onClearCategory={handleClearCategory}
                    onClearSubcategory={handleClearSubcategory}
                    onResetAllFilters={handleResetAllFilters}
                    activeFilterCount={activeFilterCount}
                  />

                  {/* Tips */}
                  <Card className="overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#234C6A] to-[#456882] p-5 text-white shadow-xl shadow-[#234C6A]/15">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-black">Job Search Tips</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        Use specific keywords for better results
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        Apply early — fresh jobs get more attention
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>

              {/* Job Listings */}
              <div className="flex-1 job-listings">
                {/* Results header */}
                <Card className="mb-6 overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/90 p-5 shadow-sm backdrop-blur">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="mb-1 text-2xl font-black tracking-tight text-[#234C6A]">
                        {selectedCategory
                          ? `${jobCategories.find((c) => c.id === selectedCategory)?.name ?? "Category"} Jobs`
                          : "Available Positions"}
                        {selectedSubcategory && selectedCategory && (
                          <span className="ml-2 text-base font-semibold text-[#456882]">
                            /{" "}
                            {
                              jobCategories
                                .find((c) => c.id === selectedCategory)
                                ?.subcategories.find(
                                  (s) => s.id === selectedSubcategory,
                                )?.name
                            }
                          </span>
                        )}
                      </h2>
                      <p className="text-sm font-medium text-[#456882]">
                        {isFetching ? (
                          "Loading..."
                        ) : (
                          <>
                            <span className="font-semibold text-[#234C6A]">
                              {filteredJobs.length}
                            </span>{" "}
                            job{filteredJobs.length !== 1 ? "s" : ""} of{" "}
                            <span className="font-semibold text-[#234C6A]">
                              {paginationMeta.totalJobs}
                            </span>{" "}
                            total
                            {activeFilterCount > 0 && (
                              <span className="text-[#456882]/70 ml-1">
                                ({activeFilterCount} filter
                                {activeFilterCount !== 1 ? "s" : ""})
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse inline-block" />
                        {paginationMeta.totalJobs} Active
                      </Badge>
                      {selectedCategory && (
                        <Badge className="rounded-full bg-[#234C6A]/10 text-[#234C6A] border border-[#234C6A]/10">
                          {
                            jobCategories.find((c) => c.id === selectedCategory)
                              ?.name
                          }
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Loading skeleton */}
                {isFetching && (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-[#234C6A]" />
                  </div>
                )}

                {/* Jobs list */}
                {!isFetching && filteredJobs.length > 0 && (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                )}

                {!isFetching && filteredJobs.length === 0 && <EmptyState />}

                {/* Pagination — driven by API meta */}
                {!isFetching && paginationMeta.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={paginationMeta.currentPage}
                      totalPages={paginationMeta.totalPages}
                      totalJobs={paginationMeta.totalJobs}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
