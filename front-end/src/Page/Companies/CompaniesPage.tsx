"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { useGetAllCompaniesQuery } from "@/src/redux/features/company/companyApi";
import {
  Search, MapPin, Building2, Briefcase, Users,
  ArrowRight, TrendingUp, Sparkles, Globe,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import Link from "next/link";
import gsap from "gsap";

const INDUSTRIES = ["Software Company", "IT Services", "Finance", "Healthcare", "Education", "E-commerce", "Manufacturing"];
const SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

function CompanyCard({ company }: { company: any }) {
  return (
    <Link href={`/company/${company._id}`}>
      <Card className="group h-full p-7 border border-[#E3E3E3]/60 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-2xl hover:border-[#234C6A]/20 rounded-3xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col relative overflow-hidden cursor-pointer">
        {/* top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#234C6A] to-[#456882] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <div className="flex items-start justify-between mb-6">
          <div className="w-18 h-18 p-3 rounded-2xl bg-[#234C6A]/5 border border-[#234C6A]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm overflow-hidden w-16 h-16">
            {company.companyLogo ? (
              <img src={company.companyLogo} alt={company.companyName} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="h-8 w-8 text-[#234C6A]" />
            )}
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase tracking-wide px-3 py-1 rounded-full">
            ● Active
          </Badge>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-black text-[#234C6A] group-hover:text-[#456882] transition-colors">{company.companyName}</h3>
            {company.industries && (
              <p className="text-sm text-[#456882] font-semibold flex items-center gap-1.5 mt-1">
                <Briefcase className="h-3.5 w-3.5 text-[#234C6A]/50" />{company.industries}
              </p>
            )}
          </div>

          <div className="space-y-2">
            {company.companyLocation && (
              <div className="flex items-center gap-2 text-sm text-[#456882]">
                <MapPin className="h-4 w-4 text-[#234C6A]/50 flex-shrink-0" />
                {company.companyLocation}
              </div>
            )}
            {company.companySize && (
              <div className="flex items-center gap-2 text-sm text-[#456882]">
                <Users className="h-4 w-4 text-[#234C6A]/50 flex-shrink-0" />
                {company.companySize} employees
              </div>
            )}
            {company.website && (
              <div className="flex items-center gap-2 text-sm text-[#456882]">
                <Globe className="h-4 w-4 text-[#234C6A]/50 flex-shrink-0" />
                {company.website.replace(/https?:\/\//, "")}
              </div>
            )}
          </div>

          {company.description && (
            <p className="text-sm text-[#456882]/70 line-clamp-2 leading-relaxed">{company.description}</p>
          )}
        </div>

        <div className="mt-5 pt-5 border-t border-[#E3E3E3]/50 flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-[#234C6A]/10 overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${company._id}${i}`} alt="recruit" className="w-full h-full" />
              </div>
            ))}
            <span className="ml-4 text-[10px] font-black text-[#456882] uppercase tracking-widest">Hiring</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-bold text-[#234C6A] group-hover:translate-x-1 transition-transform duration-300">
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
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");

  const { data: response, isLoading } = useGetAllCompaniesQuery({
    search: searchTerm,
    industries: industryFilter !== "all" ? industryFilter : undefined,
    companySize: sizeFilter !== "all" ? sizeFilter : undefined,
  });

  const companies = response?.data?.companies || [];

  useEffect(() => {
    if (!isLoading && companies.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".company-card-item", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, companies.length]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E3E3E3] via-white to-[#E3E3E3]">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6 border border-white/20">
            <TrendingUp className="h-4 w-4 text-blue-300" />
            <span>Discover Top Employers</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
            Work with the Best in the <span className="text-blue-300">Industry</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-medium">
            Explore company profiles, cultures, and open positions at leading organizations worldwide.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="container mx-auto px-6 -mt-8 relative z-20">
        <Card className="p-4 md:p-6 border-none shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
              <Input
                placeholder="Search companies..."
                className="pl-12 h-12 rounded-xl border-[#E3E3E3] bg-[#E3E3E3]/30 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="h-12 pl-4 rounded-xl border border-[#E3E3E3] bg-[#E3E3E3]/30 text-[#234C6A] font-medium focus:outline-none focus:ring-2 focus:ring-[#234C6A]/10"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="all">All Industries</option>
              {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
            <select
              className="h-12 pl-4 rounded-xl border border-[#E3E3E3] bg-[#E3E3E3]/30 text-[#234C6A] font-medium focus:outline-none focus:ring-2 focus:ring-[#234C6A]/10"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="all">All Company Sizes</option>
              {SIZES.map((s) => <option key={s} value={s}>{s} Employees</option>)}
            </select>
            <Button
              onClick={() => { setSearchTerm(""); setIndustryFilter("all"); setSizeFilter("all"); }}
              variant="outline"
              className="h-12 rounded-xl border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/5 font-semibold"
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>

      {/* Results */}
      <main className="container mx-auto px-6 py-14 flex-1" ref={containerRef}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#234C6A]">
              {isLoading ? "Loading..." : `${companies.length} Companies`}
            </h2>
            <p className="text-[#456882] text-sm mt-1">Verified employers across various sectors</p>
          </div>
          <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none font-semibold px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            All Verified
          </Badge>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-3xl bg-white/80 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company: any) => (
              <div key={company._id} className="company-card-item">
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-[#234C6A]/10 rounded-3xl bg-white/40">
            <div className="w-20 h-20 bg-[#234C6A]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search className="h-10 w-10 text-[#234C6A]/30" />
            </div>
            <h3 className="text-2xl font-black text-[#234C6A]">No companies found</h3>
            <p className="text-[#456882] mt-2 max-w-md mx-auto">Try adjusting your filters to find more companies.</p>
            <Button variant="outline" className="mt-6 rounded-xl border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/5"
              onClick={() => { setSearchTerm(""); setIndustryFilter("all"); setSizeFilter("all"); }}>
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
