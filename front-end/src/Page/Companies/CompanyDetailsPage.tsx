"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useGetSingleCompanyQuery } from "@/src/redux/features/company/companyApi";
import {
  Building2, Globe, MapPin, Users, Briefcase, Mail,
  Phone, Calendar, ShieldCheck, Target, Users2, Zap,
  Clock, DollarSign, Loader2, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { toast } from "sonner";
import gsap from "gsap";

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    data: response,
    isLoading,
    error,
  } = useGetSingleCompanyQuery(id as string);
  const company = response?.data;

  useEffect(() => {
    if (!isLoading && company) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".hero-content", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        gsap.fromTo(".stat-item", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3, ease: "power2.out" });
        gsap.fromTo(".main-card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, delay: 0.5, ease: "power2.out" });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, company]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E3E3E3] via-white to-[#E3E3E3] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#234C6A] mb-4" />
          <p className="text-[#234C6A] font-bold uppercase tracking-widest text-sm">
            Loading Company Profile...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E3E3E3] via-white to-[#E3E3E3] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-black text-[#234C6A]">Company not found</h3>
          <p className="text-[#456882] mt-2 max-w-md">
            We couldn&apos;t find the company profile you&apos;re looking for.
          </p>
          <Link href="/companies" className="mt-8">
            <Button className="rounded-xl bg-gradient-to-r from-[#234C6A] to-[#456882] text-white font-bold px-8 h-12 shadow-lg">
              <ArrowLeft className="h-4 w-4 mr-2" /> Browse Companies
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = [
    { label: "Company Size", value: company.companySize || "N/A", icon: Users },
    { label: "Industry", value: company.industries || "Technology", icon: Briefcase },
    { label: "Location", value: company.companyLocation || "Global", icon: MapPin },
    { label: "Since", value: new Date(company.createdAt).getFullYear(), icon: Calendar },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-[#E3E3E3] via-white to-[#E3E3E3] flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] pt-24 pb-40 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[100px] -ml-48 -mb-48" />
          </div>

          <div className="hero-content container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
              {/* Logo */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-white/20 rounded-[36px] blur opacity-25 group-hover:opacity-40 transition duration-500" />
                <div className="relative w-36 h-36 bg-white rounded-[32px] shadow-2xl flex items-center justify-center p-6 border-4 border-white/10">
                  {company.companyLogo ? (
                    <img src={company.companyLogo} alt={company.companyName} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-16 h-16 text-[#234C6A]" />
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <Badge className="bg-green-400/20 text-green-300 border-green-500/30 px-3 py-1 rounded-full font-bold text-xs tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Verified Employer
                  </Badge>
                  <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 rounded-full font-bold text-xs">
                    {company.industries}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {company.companyName}
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-blue-100/80 font-medium text-base">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-300" />
                    {company.companyLocation}
                  </div>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                      <Globe className="h-5 w-5 text-blue-300" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 -mt-24 pb-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Stats & Contact */}
            <div className="lg:col-span-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {stats.map((stat, i) => (
                  <Card key={i} className="stat-item p-5 border border-[#E3E3E3]/60 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#234C6A]/5 flex items-center justify-center group-hover:bg-[#234C6A] transition-colors">
                        <stat.icon className="h-5 w-5 text-[#234C6A] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#456882] uppercase tracking-wider">{stat.label}</p>
                        <p className="text-lg font-black text-[#234C6A]">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Contact Card */}
              <Card className="main-card p-6 border border-[#E3E3E3]/60 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm space-y-5">
                <h3 className="text-lg font-bold text-[#234C6A] flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Contact Details
                </h3>
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#E3E3E3]/30 border border-[#E3E3E3]/50 cursor-pointer hover:bg-[#234C6A]/5 transition-colors"
                    onClick={() => {
                      if (company.userId?.email) {
                        navigator.clipboard.writeText(company.userId.email);
                        toast.success("Email copied!");
                      }
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Mail className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-[#456882] uppercase tracking-wider">Email</p>
                      <p className="text-sm text-[#234C6A] font-bold truncate">{company.userId?.email}</p>
                    </div>
                  </div>
                  {company.userId?.phoneNumber && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E3E3E3]/30 border border-[#E3E3E3]/50">
                      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Phone className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#456882] uppercase tracking-wider">Phone</p>
                        <p className="text-sm text-[#234C6A] font-bold">{company.userId?.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right: Description & Jobs */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="main-card p-8 border border-[#E3E3E3]/60 shadow-xl rounded-3xl bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-[#234C6A] mb-6 flex items-center gap-3">
                  <ShieldCheck className="h-7 w-7 text-blue-500" />
                  About the Company
                </h2>
                <div className="prose prose-blue max-w-none text-[#456882] font-medium leading-relaxed whitespace-pre-line">
                  {company.description || "No description provided."}
                </div>
              </Card>

              {/* Open Positions */}
              {company.jobs && company.jobs.length > 0 && (
                <Card className="main-card p-8 border border-[#E3E3E3]/60 shadow-xl rounded-3xl bg-white/80 backdrop-blur-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#234C6A] flex items-center gap-3">
                      <Briefcase className="h-6 w-6 text-blue-500" />
                      Open Positions
                    </h2>
                    <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none px-3 py-1 rounded-full font-bold text-xs">
                      {company.jobs.length} Active
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {company.jobs.map((job: any) => (
                      <div key={job._id} className="group p-5 rounded-2xl border border-[#E3E3E3]/60 bg-white/60 hover:bg-white hover:shadow-lg hover:border-[#234C6A]/10 transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                          <div className="space-y-2">
                            <h3 className="text-lg font-bold text-[#234C6A] group-hover:text-[#456882] transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[#456882]">
                              <span className="flex items-center gap-1.5 bg-[#E3E3E3]/40 px-2.5 py-1 rounded-lg">
                                <MapPin className="h-3.5 w-3.5 text-[#234C6A]" />
                                {job.location} ({job.locationType})
                              </span>
                              <span className="flex items-center gap-1.5 bg-[#E3E3E3]/40 px-2.5 py-1 rounded-lg">
                                <Clock className="h-3.5 w-3.5 text-[#234C6A]" />
                                {job.type?.replace("-", " ")}
                              </span>
                              <span className="flex items-center gap-1.5 bg-[#E3E3E3]/40 px-2.5 py-1 rounded-lg">
                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                              </span>
                            </div>
                          </div>
                          <Link href={`/job/${job._id}`}>
                            <Button className="rounded-xl bg-gradient-to-r from-[#234C6A] to-[#456882] text-white font-bold px-6 h-11 shadow-md hover:shadow-lg transition-all active:scale-95">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Mission & Culture */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="main-card p-6 border border-[#E3E3E3]/60 shadow-lg rounded-2xl bg-gradient-to-br from-[#234C6A]/5 to-white">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-bold text-[#234C6A] mb-2">Our Mission</h4>
                  <p className="text-[#456882] font-medium text-sm leading-relaxed">
                    To innovate and lead in the {company.industries} sector through excellence and technology.
                  </p>
                </Card>
                <Card className="main-card p-6 border border-[#E3E3E3]/60 shadow-lg rounded-2xl bg-gradient-to-br from-green-50/50 to-white">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                    <Users2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold text-[#234C6A] mb-2">Our Culture</h4>
                  <p className="text-[#456882] font-medium text-sm leading-relaxed">
                    We foster a collaborative environment where every team member is empowered to grow.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDetailsPage;
