"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { useGetAllCompaniesQuery } from "@/src/redux/features/company/companyApi";
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  Users,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Globe,
  Shield,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import Link from "next/link";
import gsap from "gsap";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { ErrorState } from "@/src/components/feedback/StateViews";

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
    <Link href={`/company/${company._id}`}>
      <Card className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#163B5C]/10 bg-white/90 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#163B5C]/25 hover:shadow-2xl hover:shadow-[#163B5C]/10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#163B5C] to-[#516C83] scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

        <div className="flex items-start mb-6">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#163B5C]/10 bg-[#163B5C]/5 p-3 shadow-sm transition-transform duration-300 group-hover:scale-105">
            {company.companyLogo ? (
              <img
                src={company.companyLogo}
                alt={company.companyName}
                className="h-16 w-16 rounded-full object-contain"
              />
            ) : (
              <Building2 className="h-8 w-8 text-[#163B5C]" />
            )}
          </div>

        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-black tracking-tight text-[#163B5C] transition-colors group-hover:text-[#516C83]">
              {company.companyName}
            </h3>
            {company.industries && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#516C83]">
                <Briefcase className="h-3.5 w-3.5 text-[#163B5C]" />
                {company.industries}
              </p>
            )}
          </div>

          <div className="space-y-2">
            {company.companyLocation && (
              <div className="flex items-center gap-2 rounded-2xl bg-[#F6F8FB] px-3 py-2 text-sm text-[#516C83]">
                <MapPin className="h-4 w-4 flex-shrink-0 text-[#163B5C]" />
                {company.companyLocation}
              </div>
            )}
            {company.companySize && (
              <div className="flex items-center gap-2 rounded-2xl bg-[#F6F8FB] px-3 py-2 text-sm text-[#516C83]">
                <Users className="h-4 w-4 flex-shrink-0 text-[#163B5C]" />
                {company.companySize} employees
              </div>
            )}
            {company.website && (
              <div className="flex items-center gap-2 rounded-2xl bg-[#F6F8FB] px-3 py-2 text-sm text-[#516C83]">
                <Globe className="h-4 w-4 flex-shrink-0 text-[#163B5C]" />
                {company.website.replace(/https?:\/\//, "")}
              </div>
            )}
          </div>

          {company.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-[#516C83]/75">
              {company.description}
            </p>
          )}
        </div>

        <div className="mt-5 pt-5 border-t border-[#E1E8EF]/50 flex items-center justify-end">
          <span className="flex items-center gap-1 text-sm font-black text-[#163B5C] transition-transform duration-300 group-hover:translate-x-1">
            Profile <ArrowRight className="h-4 w-4" />
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
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, companies.length]);

  return (
    <div className="min-h-screen flex flex-col jobhub-page-bg">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#163B5C] pt-32 pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/15 to-transparent" />
          <div className="absolute left-10 top-28 hidden h-28 w-56 rotate-[-8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
          <div className="absolute bottom-16 right-10 hidden h-32 w-64 rotate-[8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4 text-white" />
            <span>Discover Top Employers</span>
          </div>
          <h1 className="mx-auto mb-4 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
            Discover companies building the future of work.
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-8 text-white/75">
            Explore employer profiles, industries, locations, and team
            sizes with a premium company discovery experience.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <Card className="rounded-3xl border border-[#163B5C]/10 bg-white/95 p-4 shadow-2xl shadow-[#163B5C]/10 backdrop-blur-xl md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83]" />
              <Input
                placeholder="Search companies..."
                aria-label="Search companies"
                className="h-12 rounded-2xl border-transparent bg-[#F4F7F8] pl-12 text-[#163B5C] placeholder:text-[#516C83]/60 focus:border-[#163B5C]/15 focus:bg-white focus:ring-2 focus:ring-[#163B5C]/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="h-12 rounded-2xl border border-transparent bg-[#F4F7F8] pl-4 font-semibold text-[#163B5C] focus:outline-none focus:ring-2 focus:ring-[#163B5C]/10"
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
              className="h-12 rounded-2xl border border-transparent bg-[#F4F7F8] pl-4 font-semibold text-[#163B5C] focus:outline-none focus:ring-2 focus:ring-[#163B5C]/10"
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
              className="h-12 rounded-2xl border-[#163B5C]/20 font-black text-[#163B5C] hover:bg-[#163B5C]/5"
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>

      {/* Results */}
      <main id="main-content" className="container mx-auto px-6 py-14 flex-1" ref={containerRef}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#163B5C]">
              {isLoading ? "Loading..." : `${companies.length} Companies`}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#516C83]">
              Explore employer profiles across industries
            </p>
          </div>

        </div>

        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="jh-skeleton h-80 rounded-xl border border-[#e1e8ef]"
              />
            ))}
          </div>
        ) : isError ? (
          <ErrorState description="Company profiles could not be loaded." onRetry={() => void refetch()} />
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company: any) => (
              <div key={company._id} className="company-card-item">
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-[#163B5C]/15 bg-white/70 py-24 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#163B5C]/10">
              <Search className="h-10 w-10 text-[#163B5C]/30" />
            </div>
            <h3 className="text-2xl font-black text-[#163B5C]">
              No companies found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[#516C83]">
              Try adjusting your filters to find more companies.
            </p>
            <Button
              variant="outline"
              className="mt-6 rounded-xl border-[#163B5C]/20 font-bold text-[#163B5C] hover:bg-[#163B5C]/5"
              onClick={() => {
                setSearchTerm("");
                setIndustryFilter("all");
                setSizeFilter("all");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CompaniesPage;
