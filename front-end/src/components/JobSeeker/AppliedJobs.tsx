"use client";
import { SecureAssetLink } from "@/src/components/assets/SecureAssetLink";

import { useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Building2,
  Calendar,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Briefcase,
  ArrowRight,
  Sparkles,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { TableLoading } from "@/src/components/feedback/LoadingStates";
import { ErrorState } from "@/src/components/feedback/StateViews";
import gsap from "gsap";
import { useGetUserApplicationsQuery } from "@/src/redux/features/applications/applicationsApi";
import { truncate } from "@/src/lib/truncate";

const AppliedJobs = ({ userId }: { userId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: applications = [], isLoading, isError, refetch } = useGetUserApplicationsQuery();

  useEffect(() => {
    if (!isLoading && applications.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".application-card",
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.2)",
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, applications]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "applied":
        return {
          label: "Applied",
          color: "bg-[#163B5C]/10 text-[#163B5C] border-[#163B5C]/15",
          icon: Clock,
          bgColor: "bg-[#163B5C]",
        };
      case "under_review":
        return {
          label: "Under Review",
          color: "bg-[#516C83]/10 text-[#163B5C] border-[#516C83]/20",
          icon: Eye,
          bgColor: "bg-[#516C83]",
        };
      case "interview":
        return {
          label: "Interviewing",
          color: "bg-[#163B5C]/10 text-[#163B5C] border-[#163B5C]/15",
          icon: Star,
          bgColor: "bg-[#163B5C]",
        };
      case "hired":
        return {
          label: "Hired",
          color: "bg-green-500/10 text-green-600 border-green-500/30",
          icon: CheckCircle,
          bgColor: "bg-green-500",
        };
      case "rejected":
        return {
          label: "Rejected",
          color: "bg-red-500/10 text-red-600 border-red-500/30",
          icon: XCircle,
          bgColor: "bg-red-500",
        };
      default:
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          color: "bg-[#E1E8EF]/70 text-[#516C83] border-[#163B5C]/10",
          icon: Clock,
          bgColor: "bg-[#516C83]",
        };
    }
  };

  if (isLoading) return <TableLoading rows={4} />;
  if (isError) return <ErrorState description="Your applications could not be loaded." onRetry={() => void refetch()} />;

  if (applications.length === 0) {
    return (
      <Card className="group relative overflow-hidden rounded-3xl border border-dashed border-[#163B5C]/20 bg-[#F6F8FB] p-12 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#163B5C]/5 to-[#516C83]/5" />
        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#163B5C]/10 transition-transform duration-300 group-hover:scale-105">
            <Briefcase className="h-12 w-12 text-[#163B5C]" />
          </div>
          <h3 className="mb-3 text-2xl font-black text-[#163B5C]">
            No Applications Yet
          </h3>
          <p className="mx-auto mb-8 max-w-sm leading-relaxed text-[#516C83]">
            Your career journey starts here! Browse available opportunities
            and find your dream job today.
          </p>
          <Button
            asChild
            className="h-12 rounded-2xl bg-gradient-to-r from-[#163B5C] to-[#516C83] px-8 font-black text-white shadow-lg shadow-[#163B5C]/20 transition-all hover:from-[#0C2C48] hover:to-[#3b5a71]"
          >
            <Link href="/job">
              Find My Next Role
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="space-y-5">
      {applications.map((app: any) => {
        const job = app.job_id;
        if (!job) return null;

        const statusConfig = getStatusConfig(app.status);
        const StatusIcon = statusConfig.icon;
        const company = job.company;

        return (
          <Card
            key={app._id}
            className="application-card group relative overflow-hidden rounded-3xl border border-[#163B5C]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#163B5C]/25 hover:shadow-2xl hover:shadow-[#163B5C]/10"
          >
            {/* Status indicator bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${statusConfig.bgColor} opacity-70`}
            />

            {/* Decorative Accent */}
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
              <div className="flex w-full flex-1 gap-5">
                {/* Company Logo */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#163B5C]/10 bg-[#F6F8FB] p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {company?.companyLogo ? (
                    <img
                      src={company.companyLogo}
                      alt={company.companyName}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#163B5C]/5 text-xl font-black text-[#163B5C]">
                      {company?.companyName?.charAt(0) || "C"}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <Link href={`/job/${job._id}`}>
                        <h3 className="text-xl font-black leading-tight tracking-tight text-[#163B5C] transition-colors group-hover:text-[#516C83]">
                          {job.title}
                        </h3>
                      </Link>
                      <div className="mt-1.5 flex items-center gap-2 font-semibold text-[#516C83]">
                        <Building2 className="h-4 w-4" />
                        <span>
                          {company?.companyName || "Company Info Unavailable"}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={`${statusConfig.color} flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Application Meta */}
                  <div className="flex flex-wrap items-center gap-2 text-sm text-[#516C83]">
                    <div className="flex items-center gap-1.5 rounded-full bg-[#F4F7F8] px-3 py-1.5 font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {job.type && (
                      <div className="flex items-center gap-1.5 rounded-full bg-[#F4F7F8] px-3 py-1.5 font-semibold capitalize">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{job.type}</span>
                      </div>
                    )}
                    {app.boostPaymentStatus === "paid" && app.paid_amount > 0 && (
                      <div className="flex items-center gap-1.5 rounded-full border border-[#163B5C]/10 bg-[#163B5C]/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#163B5C]">
                        <Sparkles className="h-3 w-3" />
                        <span>${app.paid_amount} Priority</span>
                      </div>
                    )}
                    {app.resume_url && (
                      <SecureAssetLink
                        reference={app.resume_url}
                        className="flex items-center gap-1.5 rounded-full bg-[#516C83]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#163B5C] transition-colors hover:bg-[#516C83]/15"
                      >
                        <FileText className="h-3 w-3" />
                        View Resume
                      </SecureAssetLink>
                    )}
                  </div>

                  {app.cover_letter && (
                    <div className="relative group/letter">
                      <p className="rounded-2xl border border-[#163B5C]/8 bg-[#F6F8FB] p-3 text-xs italic leading-relaxed text-[#516C83]/85">
                        "{truncate(app.cover_letter, 120)}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex w-full items-center gap-2 md:w-auto md:flex-col">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 flex-1 rounded-2xl border-[#163B5C]/20 font-black text-[#163B5C] transition-all hover:bg-[#163B5C] hover:text-white md:w-full"
                  asChild
                >
                  <Link href={`/job/${job._id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Details
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AppliedJobs;
