"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useGetSingleCompanyQuery } from "@/src/redux/features/company/companyApi";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Target,
  Users2,
  Zap,
  Clock,
  DollarSign,
  Loader2,
  ArrowLeft,
  ArrowUpRight,
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
        gsap.fromTo(
          ".hero-content",
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        );
        gsap.fromTo(
          ".stat-item",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.3,
            ease: "power2.out",
          },
        );
        gsap.fromTo(
          ".main-card",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            delay: 0.5,
            ease: "power2.out",
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, company]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col jobhub-page-bg">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="rounded-3xl border border-[#234C6A]/10 bg-white/90 p-8 text-center shadow-xl shadow-[#234C6A]/8 backdrop-blur">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#234C6A]" />
            <p className="text-sm font-black uppercase tracking-widest text-[#234C6A]">
              Loading Company Profile...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex min-h-screen flex-col jobhub-page-bg">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50">
            <Building2 className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-black text-[#234C6A]">
            Company not found
          </h3>
          <p className="mt-2 max-w-md text-[#456882]">
            We couldn&apos;t find the company profile you&apos;re looking for.
          </p>
          <Link href="/companies" className="mt-8">
            <Button className="h-12 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-8 font-black text-white shadow-lg shadow-[#234C6A]/20">
              <ArrowLeft className="mr-2 h-4 w-4" /> Browse Companies
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = [
    { label: "Company Size", value: company.companySize || "N/A", icon: Users },
    {
      label: "Industry",
      value: company.industries || "Technology",
      icon: Briefcase,
    },
    {
      label: "Location",
      value: company.companyLocation || "Global",
      icon: MapPin,
    },
    {
      label: "Since",
      value: company.createdAt
        ? new Date(company.createdAt).getFullYear()
        : "N/A",
      icon: Calendar,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col jobhub-page-bg"
    >
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#234C6A] pb-36 pt-24 text-white shadow-2xl shadow-[#234C6A]/20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="hero-content container mx-auto px-6 relative z-10">
            <Link
              href="/companies"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/85 backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to companies
            </Link>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
              {/* Logo */}
              <div className="relative group">
                <div className="absolute -inset-1 rounded-[2rem] bg-white/20 opacity-25 blur transition duration-500 group-hover:opacity-40" />
                <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border border-white/20 bg-white p-6 shadow-2xl">
                  {company.companyLogo ? (
                    <img
                      src={company.companyLogo}
                      alt={company.companyName}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-16 w-16 text-[#234C6A]" />
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="flex-1 space-y-5 text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Badge className="flex items-center gap-2 rounded-full border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-xs font-black tracking-wider text-emerald-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                    Verified Employer
                  </Badge>
                  <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white">
                    {company.industries || "Company"}
                  </Badge>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                  {company.companyName}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 text-base font-medium text-white/75 lg:justify-start">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-white/70" />
                    {company.companyLocation || "Global"}
                  </div>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition-colors hover:text-white"
                    >
                      <Globe className="h-5 w-5 text-white/70" />
                      Visit Website
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container relative z-20 mx-auto -mt-24 px-6 pb-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: Stats & Contact */}
            <div className="space-y-6 lg:col-span-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {stats.map((stat, i) => (
                  <Card
                    key={i}
                    className="stat-item group rounded-3xl border border-[#234C6A]/10 bg-white/95 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-xl hover:shadow-[#234C6A]/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#234C6A]/10 transition-colors group-hover:bg-[#234C6A]">
                        <stat.icon className="h-5 w-5 text-[#234C6A] group-hover:text-white transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#456882]">
                          {stat.label}
                        </p>
                        <p className="truncate text-lg font-black text-[#234C6A]">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Contact Card */}
              <Card className="main-card space-y-5 rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
                <h3 className="flex items-center gap-2 text-lg font-black text-[#234C6A]">
                  <Target className="h-5 w-5 text-[#234C6A]" />
                  Contact Details
                </h3>
                <div className="space-y-3">
                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-3 transition-colors hover:bg-[#234C6A]/5"
                    onClick={() => {
                      if (company.userId?.email) {
                        navigator.clipboard.writeText(company.userId.email);
                        toast.success("Email copied!");
                      }
                    }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <Mail className="h-4 w-4 text-[#234C6A]" />
                    </div>
                    <div className="min-w-0 overflow-hidden">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#456882]">
                        Email
                      </p>
                      <p className="truncate text-sm font-bold text-[#234C6A]">
                        {company.userId?.email || "Not available"}
                      </p>
                    </div>
                  </div>
                  {company.userId?.phoneNumber && (
                    <div className="flex items-center gap-3 rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Phone className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#456882]">
                          Phone
                        </p>
                        <p className="text-sm font-bold text-[#234C6A]">
                          {company.userId?.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right: Description & Jobs */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="main-card rounded-3xl border border-[#234C6A]/10 bg-white/95 p-8 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
                <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-[#234C6A]">
                  <ShieldCheck className="h-7 w-7 text-[#234C6A]" />
                  About the Company
                </h2>
                <div className="max-w-none whitespace-pre-line text-base font-medium leading-8 text-[#456882]">
                  {company.description || "No description provided."}
                </div>
              </Card>

              {/* Open Positions */}
              {company.jobs && company.jobs.length > 0 && (
                <Card className="main-card space-y-6 rounded-3xl border border-[#234C6A]/10 bg-white/95 p-8 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-3 text-xl font-black text-[#234C6A]">
                      <Briefcase className="h-6 w-6 text-[#234C6A]" />
                      Open Positions
                    </h2>
                    <Badge className="rounded-full border-none bg-[#234C6A]/10 px-3 py-1 text-xs font-black text-[#234C6A]">
                      {company.jobs.length} Active
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {company.jobs.map((job: any) => (
                      <div
                        key={job._id}
                        className="group rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:shadow-[#234C6A]/10"
                      >
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                          <div className="space-y-2">
                            <h3 className="text-lg font-black text-[#234C6A] transition-colors group-hover:text-[#456882]">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#456882]">
                              <span className="flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2">
                                <MapPin className="h-3.5 w-3.5 text-[#234C6A]" />
                                {job.location || "Remote"} ({job.locationType})
                              </span>
                              <span className="flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2">
                                <Clock className="h-3.5 w-3.5 text-[#234C6A]" />
                                {job.type?.replace("-", " ")}
                              </span>
                              <span className="flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2">
                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                $
                                {(Number(job.salaryMin || 0) / 1000).toFixed(0)}
                                k - $
                                {(Number(job.salaryMax || 0) / 1000).toFixed(0)}
                                k
                              </span>
                            </div>
                          </div>
                          <Link href={`/job/${job._id}`}>
                            <Button className="h-11 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-6 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95">
                              View Details
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Mission & Culture */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="main-card rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A]/10">
                    <Zap className="h-6 w-6 text-amber-500" />
                  </div>
                  <h4 className="mb-2 text-lg font-black text-[#234C6A]">
                    Our Mission
                  </h4>
                  <p className="text-sm font-medium leading-relaxed text-[#456882]">
                    To innovate and lead in the {company.industries} sector
                    through excellence and technology.
                  </p>
                </Card>
                <Card className="main-card rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                    <Users2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h4 className="mb-2 text-lg font-black text-[#234C6A]">
                    Our Culture
                  </h4>
                  <p className="text-sm font-medium leading-relaxed text-[#456882]">
                    We foster a collaborative environment where every team
                    member is empowered to grow.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDetailsPage;
