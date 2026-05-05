"use client";

import { useState } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { useGetAllCompaniesQuery } from "@/src/redux/features/company/companyApi";
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  Users,
  Filter,
  ArrowRight,
  TrendingUp,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");

  const { data: response, isLoading } = useGetAllCompaniesQuery({
    search: searchTerm,
    industries: industryFilter !== "all" ? industryFilter : undefined,
    companySize: sizeFilter !== "all" ? sizeFilter : undefined,
  });

  const companies = response?.data?.companies || [];

  const industries = [
    "Software Company",
    "IT Services",
    "Finance",
    "Healthcare",
    "Education",
    "E-commerce",
    "Manufacturing",
  ];

  const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[100px] -ml-48 -mb-48" />
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <Badge className="bg-blue-400/20 text-blue-200 border-blue-400/30 px-4 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-widest mb-6">
              <TrendingUp className="h-3 w-3 mr-2" />
              Discover Top Employers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Work with the best in the <span className="text-blue-300">Industry</span>
            </h1>
            <p className="text-blue-100/70 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Explore company profiles, cultures, and open positions at leading organizations around the globe.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="container mx-auto px-6 -mt-10 relative z-20">
          <Card className="p-4 md:p-8 border-none shadow-2xl rounded-[32px] bg-white/95 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#234C6A] transition-colors" />
                <Input
                  placeholder="Search company name..."
                  className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10 transition-all text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="lg:col-span-1">
                <select
                  className="w-full h-14 pl-4 pr-10 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#234C6A]/10 transition-all text-[#234C6A] font-medium appearance-none cursor-pointer"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                >
                  <option value="all">All Industries</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-1">
                <select
                  className="w-full h-14 pl-4 pr-10 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#234C6A]/10 transition-all text-[#234C6A] font-medium appearance-none cursor-pointer"
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                >
                  <option value="all">All Company Sizes</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size} Employees
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-1">
                <Button className="w-full h-14 rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-black text-lg shadow-xl shadow-blue-900/10 transition-all active:scale-95 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Results Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-[#234C6A] tracking-tight">
                Showing {companies.length} Companies
              </h2>
              <p className="text-[#456882] font-medium mt-1">
                Verified employers across various sectors
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] rounded-[32px] bg-white animate-pulse shadow-sm" />
              ))}
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company: any) => (
                <Link key={company._id} href={`/company/${company._id}`}>
                  <Card className="group h-full p-8 border-none shadow-xl hover:shadow-2xl rounded-[40px] bg-white transition-all duration-500 hover:-translate-y-2 flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-20 h-20 rounded-[28px] bg-blue-50/50 p-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm overflow-hidden border border-blue-50">
                        {company.companyLogo ? (
                          <img
                            src={company.companyLogo}
                            alt={company.companyName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="h-10 w-10 text-[#234C6A]" />
                        )}
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-tighter">
                        Active Hiring
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-[#234C6A] group-hover:text-blue-600 transition-colors duration-300 mb-2">
                        {company.companyName}
                      </h3>
                      <p className="text-[#456882] font-semibold text-sm flex items-center gap-1.5 mb-6">
                        <Briefcase className="h-4 w-4 text-blue-500/70" />
                        {company.industries}
                      </p>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                          <MapPin className="h-4 w-4 text-red-400" />
                          {company.companyLocation}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                          <Users className="h-4 w-4 text-blue-400" />
                          {company.companySize} Employees
                        </div>
                      </div>

                      <div className="line-clamp-2 text-gray-500 text-sm leading-relaxed mb-8">
                        {company.description}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center -space-x-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm"
                          >
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${company._id}${i}`}
                              alt="user"
                              className="w-full h-full"
                            />
                          </div>
                        ))}
                        <span className="ml-5 text-[10px] font-black text-[#456882] uppercase tracking-widest">
                          +12 Recruits
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto hover:bg-transparent text-[#234C6A] font-black group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2"
                      >
                        Profile
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[40px] shadow-sm border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-[#234C6A]">No companies found</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                We couldn't find any companies matching your current search criteria. Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                className="mt-8 rounded-2xl px-8 h-12 border-gray-200 text-[#234C6A] font-bold"
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CompaniesPage;
