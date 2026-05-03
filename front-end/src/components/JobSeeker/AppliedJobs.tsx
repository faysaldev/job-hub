"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Building2,
  Calendar,
  DollarSign,
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
import gsap from "gsap";
import { useGetUserApplicationsQuery } from "@/src/redux/features/applications/applicationsApi";
import { truncate } from "@/src/lib/truncate";

const AppliedJobs = ({ userId }: { userId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: applications = [], isLoading } = useGetUserApplicationsQuery();

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
          color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
          icon: Clock,
          bgColor: "bg-blue-500",
        };
      case "under_review":
        return {
          label: "Under Review",
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
          icon: Eye,
          bgColor: "bg-yellow-500",
        };
      case "interview":
        return {
          label: "Interviewing",
          color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
          icon: Star,
          bgColor: "bg-purple-500",
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
          color: "bg-gray-500/10 text-gray-600 border-gray-500/30",
          icon: Clock,
          bgColor: "bg-gray-500",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="p-6 border-none bg-white/50 animate-pulse rounded-2xl h-32"
          />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Card className="p-12 text-center bg-white/80 backdrop-blur-md border-none shadow-xl rounded-3xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#234C6A]/5 to-[#456882]/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#234C6A]/10 to-[#456882]/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <Briefcase className="h-12 w-12 text-[#234C6A]" />
          </div>
          <h3 className="text-2xl font-bold text-[#234C6A] mb-3">
            No Applications Yet
          </h3>
          <p className="text-[#456882] mb-8 max-w-sm mx-auto leading-relaxed">
            Your career journey starts here! Browse thousands of opportunities
            and find your dream job today.
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl h-12 px-8 shadow-lg shadow-[#234C6A]/20 transition-all hover:-translate-y-1"
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
            className="application-card group relative p-6 border-none bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(35,76,106,0.1)] rounded-2xl hover:shadow-[0_8px_30px_-4px_rgba(35,76,106,0.2)] transition-all duration-500 overflow-hidden"
          >
            {/* Status indicator bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${statusConfig.bgColor} opacity-70`}
            />

            {/* Decorative Accent */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex gap-6 flex-1 w-full">
                {/* Company Logo */}
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E3E3E3]/50 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  {company?.companyLogo ? (
                    <img
                      src={company.companyLogo}
                      alt={company.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#234C6A]/5 to-[#456882]/5 flex items-center justify-center font-bold text-[#234C6A] text-xl">
                      {company?.companyName?.charAt(0) || "C"}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <Link href={`/job/${job._id}`}>
                        <h3 className="text-xl font-bold text-[#234C6A] group-hover:text-[#456882] transition-colors leading-tight">
                          {job.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 text-[#456882] mt-1.5 font-medium">
                        <Building2 className="h-4 w-4" />
                        <span>
                          {company?.companyName || "Company Info Unavailable"}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={`${statusConfig.color} border px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Application Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#456882]">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {job.type && (
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md capitalize">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{job.type}</span>
                      </div>
                    )}
                    {app.paid_amount > 0 && (
                      <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200/50 text-[10px] font-bold uppercase tracking-tighter">
                        <Sparkles className="h-3 w-3" />
                        <span>${app.paid_amount} Priority</span>
                      </div>
                    )}
                    {app.resume_url && (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded-md text-[10px] font-bold transition-colors"
                      >
                        <FileText className="h-3 w-3" />
                        View Resume
                      </a>
                    )}
                  </div>

                  {app.cover_letter && (
                    <div className="relative group/letter">
                      <p className="text-xs text-[#456882]/80 leading-relaxed bg-gray-50/30 p-3 rounded-xl border border-gray-100/50 italic">
                        "{truncate(app.cover_letter, 120)}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex md:flex-col items-center gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 md:w-full border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A] hover:text-white rounded-xl transition-all"
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
