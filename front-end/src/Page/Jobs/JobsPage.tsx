/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/src/components/common/Header";
import { TableLoading } from "@/src/components/feedback/LoadingStates";
import { ErrorState } from "@/src/components/feedback/StateViews";
import Footer from "@/src/components/common/Footer";
import SearchSection from "@/src/components/jobs/SearchSection";
import JobFilters from "@/src/components/jobs/JobFilters";
import Pagination from "@/src/components/jobs/Pagination";
import { CompanyBrandIcon } from "@/src/components/jobs/JobCard";
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
  ChevronDown,
  Heart,
  X,
  MoreHorizontal,
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
  isSponsored?: boolean;
  sponsoredUntil?: string;
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
  "full-time": "bg-neutral-100 text-neutral-800 border-neutral-200",
  "part-time": "bg-neutral-100 text-neutral-800 border-neutral-200",
  contract: "bg-neutral-100 text-neutral-800 border-neutral-200",
  freelance: "bg-white text-neutral-800 border-neutral-200",
  internship: "bg-neutral-50 text-neutral-600 border-neutral-200",
};

const LOCATION_COLORS: Record<string, string> = {
  remote: "bg-emerald-50 text-emerald-700 border-emerald-100",
  hybrid: "bg-neutral-100 text-neutral-800 border-neutral-200",
  onsite: "bg-white text-neutral-600 border-neutral-200",
};

// ─── Job Card (Reference Design) ─────────────────────────────────────────────

const JobCard = memo(({ job }: { job: ApiJob }) => {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleClick = useCallback(() => {
    router.push(`/job/${job._id}`);
  }, [router, job._id]);

  if (dismissed) return null;

  const companyName = job.company?.companyName || "Premier Partner";
  const seniority = job.experienceLevel || "Mid-Senior";
  const employmentType =
    job.locationType === "remote"
      ? "Remote Job"
      : job.type
      ? job.type.replace("-", " ")
      : "Full-Time";
  const salaryText = formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod);
  const locationText = (job.location || "Remote").toUpperCase();
  const tags = job.skills?.length ? job.skills.slice(0, 3) : ["Design", "UX"];

  return (
    <article
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target === event.currentTarget) handleClick();
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${job.title} at ${companyName}`}
      className="job-card-item jh-card-reference group relative flex flex-col justify-between h-full bg-white border border-[#eaecf0] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer"
    >
      <div>
        {/* Top Header: Logo, Title, Company, Action menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <CompanyBrandIcon companyName={companyName} logoUrl={job.company?.companyLogo} id={job._id} />
            <div className="min-w-0 pt-0.5">
              <h3 className="text-sm font-bold text-[#111827] group-hover:text-black transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-0.5 truncate">
                {companyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label="Job options"
            className="text-neutral-400 hover:text-neutral-600 p-0.5 shrink-0 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mt-2 mb-2">
          <MapPin size={11} className="shrink-0 text-neutral-400" />
          <span className="truncate">{locationText}</span>
        </div>

        {/* 3-column metadata row */}
        <div className="grid grid-cols-3 gap-1 py-1.5 text-[10.5px] border-y border-neutral-100 my-2">
          <span className="font-semibold text-neutral-700 truncate">{seniority}</span>
          <span className="font-semibold text-neutral-700 truncate text-center capitalize">{employmentType}</span>
          <span className="font-bold text-neutral-900 truncate text-right">{salaryText}</span>
        </div>

        {/* Description snippet */}
        <p className="text-[11.5px] text-[#596d7e] leading-relaxed line-clamp-2 my-2">
          {job.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {tags.map((skill) => (
            <span
              key={skill}
              className="bg-[#f3f4f6] text-neutral-600 rounded-md px-2 py-0.5 text-[10px] font-medium"
            >
              {skill}
            </span>
          ))}
          {job.isSponsored && (
            <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#15803d] rounded-md px-2 py-0.5 text-[10px] font-semibold">
              <Sparkles size={10} /> Sponsored
            </span>
          )}
        </div>
      </div>

      {/* Footer row: Posted date & Dismiss / Heart icons */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px]">
        <span className="text-neutral-400 font-medium">{timeAgo(job.createdAt)}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            aria-label="Dismiss job"
            className="text-neutral-400 hover:text-neutral-700 p-0.5 transition-colors"
          >
            <X size={13} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
            aria-label={saved ? "Unsave job" : "Save job"}
            className={`p-0.5 transition-colors ${saved ? "text-red-500 fill-red-500" : "text-neutral-400 hover:text-red-500"}`}
          >
            <Heart size={13} className={saved ? "fill-current text-red-500" : ""} />
          </button>
        </div>
      </div>
    </article>
  );
});
JobCard.displayName = "JobCard";

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = memo(() => (
  <Card className="rounded-2xl border border-dashed border-[#eaecf0] bg-white p-12 text-center shadow-xs">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
      <Briefcase className="h-8 w-8" />
    </div>
    <h3 className="mb-2 text-xl font-bold text-neutral-900">No Jobs Found</h3>
    <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
      We couldn&apos;t find any jobs matching your criteria. Try adjusting your
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

  // Typing inputs
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("s") || "",
  );
  const [locationInput, setLocationInput] = useState(
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

  // ── Active Filters for API ────────────────────────────────────────────────
  const activeJobTypes = useMemo(
    () => jobTypes.filter((t) => t.checked).map((t) => t.id).join(","),
    [jobTypes],
  );
  const activeExperienceLevels = useMemo(
    () => experienceLevels.filter((e) => e.checked).map((e) => e.id).join(","),
    [experienceLevels],
  );
  const activeSalaryRanges = useMemo(
    () => salaryRanges.filter((s) => s.checked).map((s) => `${s.min}-${s.max}`).join(","),
    [salaryRanges],
  );
  const activeCompanySizes = useMemo(
    () => companySizeFilters.filter((c) => c.checked).map((c) => c.id).join(","),
    [companySizeFilters],
  );
  const activePostedDate = useMemo(() => {
    const checked = postedDateFilters.find((d) => d.checked);
    return checked && checked.id !== "anytime" ? checked.id : undefined;
  }, [postedDateFilters]);

  // ── API Query (server-side search + pagination) ───────────────────────────
  const { data: searchJobsData, isFetching, isError, refetch } = useSearchJobsQuery({
    search: searchTerm,
    location: locationTerm || undefined,
    category: selectedCategory || undefined,
    subcategory: selectedSubcategory || undefined,
    type: activeJobTypes || undefined,
    experienceLevel: activeExperienceLevels || undefined,
    salaryRanges: activeSalaryRanges || undefined,
    companySizes: activeCompanySizes || undefined,
    postedDate: activePostedDate || undefined,
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
  // delegated entirely to backend
  const filteredJobs = apiJobs;

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
    setSearchTerm(searchInput);
    setLocationTerm(locationInput);
    updateURLParams({
      s: searchInput || null,
      location: locationInput || null,
      page: null,
    });
  }, [searchInput, locationInput, updateURLParams]);

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
    setSearchInput("");
    setLocationInput("");
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
      <main id="main-content" className="flex-1 w-full">
         <SearchSection
          searchTerm={searchInput}
          locationTerm={locationInput}
          onSearchChange={(e) => setSearchInput(e.target.value)}
          onLocationChange={(e) => setLocationInput(e.target.value)}
          onSearch={handleSearch}
          onSearchKeyDown={handleSearchKeyDown}
          onTrendingClick={(term) => {
            setSearchInput(term);
            setSearchTerm(term);
            setCurrentPage(1);
            updateURLParams({
              s: term || null,
              location: locationInput || null,
              page: null,
            });
          }}
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

                  {/* Search Recommendations */}
                  <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-black p-5 text-white shadow-sm">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-sm text-white">Search Recommendations</h3>
                    </div>
                    <ul className="space-y-2 text-xs text-neutral-300">
                      <li className="flex items-start gap-2">
                        <Target className="h-3.5 w-3.5 mt-0.5 shrink-0 text-neutral-400" />
                        Use multi-keyword chips for refined precision
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0 text-neutral-400" />
                        Fresh postings receive fastest recruiter review
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Job Listings */}
              <div className="flex-1 job-listings">
                {/* Results header matching reference */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
                      {paginationMeta.totalJobs.toLocaleString()} Jobs Found
                    </h1>
                    {selectedCategory && (
                      <p className="text-xs text-[#596d7e] mt-1">
                        Category:{" "}
                        <span className="font-semibold text-neutral-800">
                          {jobCategories.find((c) => c.id === selectedCategory)?.name ?? selectedCategory}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>Sort by:</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-semibold text-neutral-800 hover:text-black"
                    >
                      Newest Post <ChevronDown size={14} className="text-neutral-400" />
                    </button>
                  </div>
                </div>

                {/* Loading skeleton */}
                {isFetching && <TableLoading rows={5} />}

                {!isFetching && isError && (
                  <ErrorState description="Job listings could not be loaded. Check your connection and try again." onRetry={() => void refetch()} />
                )}

                {/* Jobs list matching reference 2-3 column layout */}
                {!isFetching && !isError && filteredJobs.length > 0 && (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredJobs.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                )}

                {!isFetching && !isError && filteredJobs.length === 0 && <EmptyState />}

                {/* Pagination — driven by API meta */}
                {!isFetching && !isError && paginationMeta.totalPages > 1 && (
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
