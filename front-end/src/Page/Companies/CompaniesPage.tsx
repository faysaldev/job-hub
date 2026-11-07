"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { useGetAllCompaniesQuery } from "@/src/redux/features/company/companyApi";
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  ArrowRight,
  TrendingUp,
  Globe,
  Building2,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import Link from "next/link";
import gsap from "gsap";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { ErrorState } from "@/src/components/feedback/StateViews";
import { CompanyBrandIcon } from "@/src/components/jobs/JobCard";

const INDUSTRIES = [
  "Software Company",
  "IT Services",
  "Finance",
  "Healthcare",
  "Education",
  "E-commerce",
  "Manufacturing",
];
const SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

function CompanyCard({ company }: { company: any }) {
  return (
    <Link href={`/company/${company._id}`} className="block h-full">
      <Card className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div>
          {/* Header */}
          <div className="flex items-start gap-3.5 mb-3.5">
            <CompanyBrandIcon
              companyName={company.companyName}
              logoUrl={company.companyLogo}
              id={company._id}
              className="h-12 w-12 rounded-xl shrink-0"
            />
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-sm font-bold text-neutral-950 group-hover:text-black transition-colors truncate">
                {company.companyName}
              </h3>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate">
                {company.industries || "Technology Partner"}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5 my-3">
            {company.companyLocation && (
              <div className="flex items-center gap-2 rounded-lg bg-[#f8fafc] px-2.5 py-1.5 text-xs text-neutral-600">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
                <span className="truncate">{company.companyLocation}</span>
              </div>
            )}
            {company.companySize && (
              <div className="flex items-center gap-2 rounded-lg bg-[#f8fafc] px-2.5 py-1.5 text-xs text-neutral-600">
                <Users className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
                <span>{company.companySize} employees</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-center gap-2 rounded-lg bg-[#f8fafc] px-2.5 py-1.5 text-xs text-neutral-600">
                <Globe className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
                <span className="truncate">{company.website.replace(/https?:\/\//, "")}</span>
              </div>
            )}
          </div>

          {company.description && (
            <p className="line-clamp-2 text-xs text-neutral-500 leading-relaxed mb-3">
              {company.description}
            </p>
          )}
        </div>

        <div className="mt-2 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Employer Profile</span>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black group-hover:text-neutral-600 transition-colors">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

const CompaniesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm);
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");

  const { data: response, isLoading, isFetching, isError, refetch } = useGetAllCompaniesQuery({
    search: debouncedSearch,
    industries: industryFilter !== "all" ? industryFilter : undefined,
    companySize: sizeFilter !== "all" ? sizeFilter : undefined,
  });

  const companies = response?.data?.companies || [];

  useEffect(() => {
    if (!isLoading && companies.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".company-card-item",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, companies.length]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-black text-white pt-14 pb-20 border-b border-neutral-800 text-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
            <TrendingUp className="h-3.5 w-3.5 text-neutral-400" />
            <span>Discover Top Employers</span>
          </div>
          <h1 className="mx-auto mb-2 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Companies building the future of work.
          </h1>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-neutral-400">
            Explore verified employer profiles, team sizes, and open opportunities.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="container mx-auto max-w-5xl px-4 -mt-7 relative z-20">
        <Card className="rounded-2xl border border-[#eaecf0] bg-white p-3.5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search companies..."
                aria-label="Search companies"
                className="h-9 rounded-xl border border-neutral-200 bg-white pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              aria-label="Filter by industry"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="all">All Industries</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            <select
              className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              aria-label="Filter by company size"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="all">All Company Sizes</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} Employees
                </option>
              ))}
            </select>
            <Button
              onClick={() => {
                setSearchTerm("");
                setIndustryFilter("all");
                setSizeFilter("all");
              }}
              variant="outline"
              className="h-9 rounded-xl border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50"
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>

      {/* Results */}
      <main id="main-content" className="container mx-auto max-w-5xl px-4 py-10 flex-1" ref={containerRef}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              {isLoading ? "Searching..." : `${companies.length} Companies Found`}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Explore employer profiles across industries
            </p>
          </div>
        </div>

        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl border border-[#eaecf0] bg-white animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <ErrorState description="Company profiles could not be loaded." onRetry={() => void refetch()} />
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company: any) => (
              <div key={company._id} className="company-card-item">
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="rounded-2xl border border-dashed border-[#eaecf0] bg-white py-16 text-center shadow-xs">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-neutral-950">
              No companies found
            </h3>
            <p className="mx-auto mt-1 max-w-xs text-xs text-neutral-500">
              Try adjusting your search terms or filters.
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-xl border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50"
              onClick={() => {
                setSearchTerm("");
                setIndustryFilter("all");
                setSizeFilter("all");
              }}
            >
              Clear All Filters
            </Button>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CompaniesPage;
