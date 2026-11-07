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
import { CompanyBrandIcon } from "@/src/components/jobs/JobCard";
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
          ".stat-item",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
        gsap.fromTo(
          ".main-card",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            delay: 0.1,
            ease: "power2.out",
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, company]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8fafc]">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-4">
          <div className="rounded-2xl border border-[#eaecf0] bg-white p-8 text-center shadow-xs max-w-xs w-full">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-neutral-800" />
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
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
      <div className="flex min-h-screen flex-col bg-[#f8fafc]">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            <Building2 className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-neutral-950">
            Company not found
          </h2>
          <p className="mt-1 max-w-md text-xs text-neutral-500">
            We couldn&apos;t find the company profile you&apos;re looking for.
          </p>
          <Link href="/companies" className="mt-6">
            <Button className="h-9 rounded-xl bg-black px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Browse Companies
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = [
    { label: "Company Size", value: company.companySize ? `${company.companySize} employees` : "Not specified", icon: Users },
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
      label: "Founded",
      value: company.createdAt
        ? new Date(company.createdAt).getFullYear()
        : "N/A",
      icon: Calendar,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col bg-[#f8fafc]"
    >
      <Header />

      <main className="flex-1">
        {/* Pitch-Black Hero Header */}
        <section className="relative overflow-hidden bg-black text-white pt-8 pb-20 border-b border-neutral-800">
          <div className="container mx-auto max-w-5xl px-4 relative z-10">
            <Link
              href="/companies"
              className="mb-6 inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to companies
            </Link>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <CompanyBrandIcon
                companyName={company.companyName}
                logoUrl={company.companyLogo}
                id={company._id}
                className="h-20 w-20 rounded-2xl shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Verified Employer
                  </span>
                  <span className="rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 text-[11px] font-medium text-neutral-200">
                    {company.industries || "Company"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  {company.companyName}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                    {company.companyLocation || "Global"}
                  </div>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {company.website.replace(/https?:\/\//, "")}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container relative z-20 mx-auto max-w-5xl -mt-10 px-4 pb-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: Stats & Contact */}
            <div className="space-y-4 lg:col-span-1">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                {stats.map((stat, i) => (
                  <Card
                    key={i}
                    className="stat-item rounded-2xl border border-[#eaecf0] bg-white p-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 shrink-0">
                        <stat.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {stat.label}
                        </p>
                        <p className="truncate text-xs font-bold text-neutral-900 mt-0.5">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Contact Card */}
              <Card className="main-card space-y-3 rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  <Target className="h-3.5 w-3.5 text-neutral-500" />
                  Contact Info
                </h3>
                <div className="space-y-2">
                  <div
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-neutral-100 bg-[#f8fafc] p-2.5 transition-colors hover:bg-neutral-100"
                    onClick={() => {
                      if (company.userId?.email) {
                        navigator.clipboard.writeText(company.userId.email);
                        toast.success("Email copied!");
                      }
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-2xs shrink-0">
                      <Mail className="h-3.5 w-3.5 text-neutral-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Email
                      </p>
                      <p className="truncate text-xs font-bold text-neutral-900">
                        {company.userId?.email || "Not public"}
                      </p>
                    </div>
                  </div>
                  {company.userId?.phoneNumber && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-neutral-100 bg-[#f8fafc] p-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-2xs shrink-0">
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Phone
                        </p>
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {company.userId?.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right: Description & Jobs */}
            <div className="space-y-5 lg:col-span-2">
              <Card className="main-card rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-6 shadow-xs">
                <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-neutral-900">
                  <ShieldCheck className="h-5 w-5 text-neutral-700" />
                  About the Company
                </h2>
                <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-neutral-600">
                  {company.description || "No company description provided."}
                </div>
              </Card>

              {/* Open Positions */}
              {company.jobs && company.jobs.length > 0 && (
                <Card className="main-card space-y-4 rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900">
                      <Briefcase className="h-4 w-4 text-neutral-700" />
                      Open Positions
                    </h2>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-neutral-800">
                      {company.jobs.length} Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    {company.jobs.map((job: any) => (
                      <div
                        key={job._id}
                        className="rounded-xl border border-neutral-100 bg-[#f8fafc] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-neutral-900">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-neutral-400" />
                              {job.location || "Remote"} ({job.locationType})
                            </span>
                            <span className="flex items-center gap-1 capitalize">
                              <Clock className="h-3 w-3 text-neutral-400" />
                              {job.type?.replace("-", " ")}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-neutral-900">
                              <DollarSign className="h-3 w-3 text-neutral-400" />
                              ${(Number(job.salaryMin || 0) / 1000).toFixed(0)}k - $
                              {(Number(job.salaryMax || 0) / 1000).toFixed(0)}k
                            </span>
                          </div>
                        </div>
                        <Link href={`/job/${job._id}`}>
                          <Button className="h-8 rounded-lg bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider px-3.5 shrink-0">
                            View Details
                            <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Mission & Culture */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="main-card rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-neutral-900">
                    Our Mission
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    To innovate and deliver quality in the {company.industries || "technology"} domain through focused teamwork and purpose.
                  </p>
                </Card>
                <Card className="main-card rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                    <Users2 className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold text-neutral-900">
                    Our Culture
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    We foster an inclusive and transparent work environment where team members can thrive and do their best work.
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
