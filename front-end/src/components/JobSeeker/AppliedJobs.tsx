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
} from "lucide-react";
import { Application } from "@/src/types";
import Link from "next/link";
import gsap from "gsap";

interface AppliedJob extends Omit<Application, 'jobSeekerId' | 'jobSeekerName' | 'jobId' | 'resumeUrl' | 'profileUrl'> {
  jobId: string;
}

const AppliedJobs = ({ userId }: { userId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const dummyApplications: AppliedJob[] = [
    {
      id: "1",
      jobId: "1",
      jobTitle: "Senior Frontend Developer",
      companyName: "TechCorp Inc.",
      appliedDate: "2024-11-20",
      coverLetter: "I am excited to apply for this position as I have extensive experience with React and TypeScript, which aligns perfectly with your requirements.",
      status: "shortlisted",
      paymentAmount: 25
    },
    {
      id: "2",
      jobId: "2",
      jobTitle: "Product Designer",
      companyName: "DesignStudio",
      appliedDate: "2024-11-18",
      coverLetter: "With 5 years of product design experience and a strong portfolio, I believe I can contribute significantly to your design team.",
      status: "reviewed",
      paymentAmount: 10
    },
    {
      id: "3",
      jobId: "3",
      jobTitle: "Backend Engineer",
      companyName: "DataFlow",
      appliedDate: "2024-11-15",
      coverLetter: "My expertise in Node.js and cloud infrastructure makes me a great fit for this backend position. Excited about your innovative projects.",
      status: "pending",
      paymentAmount: 0
    },
    {
      id: "4",
      jobId: "4",
      jobTitle: "DevOps Engineer",
      companyName: "CloudSystems",
      appliedDate: "2024-11-10",
      coverLetter: "I have hands-on experience with Docker, Kubernetes, and CI/CD pipelines that align with your tech stack requirements.",
      status: "rejected",
      paymentAmount: 50
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".application-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
          icon: Clock,
          bgColor: "bg-yellow-500",
        };
      case "reviewed":
        return {
          color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
          icon: Eye,
          bgColor: "bg-blue-500",
        };
      case "shortlisted":
        return {
          color: "bg-green-500/10 text-green-600 border-green-500/30",
          icon: Star,
          bgColor: "bg-green-500",
        };
      case "rejected":
        return {
          color: "bg-red-500/10 text-red-600 border-red-500/30",
          icon: XCircle,
          bgColor: "bg-red-500",
        };
      default:
        return {
          color: "bg-gray-500/10 text-gray-600 border-gray-500/30",
          icon: Clock,
          bgColor: "bg-gray-500",
        };
    }
  };

  if (dummyApplications.length === 0) {
    return (
      <Card className="p-12 text-center bg-white border-none shadow-lg rounded-2xl">
        <div className="w-20 h-20 rounded-full bg-[#234C6A]/10 flex items-center justify-center mx-auto mb-6">
          <Briefcase className="h-10 w-10 text-[#234C6A]" />
        </div>
        <h3 className="text-xl font-bold text-[#234C6A] mb-2">No Applications Yet</h3>
        <p className="text-[#456882] mb-6">
          Start browsing jobs and apply to get started!
        </p>
        <Button
          asChild
          className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl"
        >
          <Link href="/job">
            Browse Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {dummyApplications.map((app) => {
        const statusConfig = getStatusConfig(app.status);
        const StatusIcon = statusConfig.icon;

        return (
          <Card
            key={app.id}
            className="application-card p-6 bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group overflow-hidden relative"
          >
            {/* Status indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${statusConfig.bgColor}`} />

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex gap-4 flex-1">
                {/* Company avatar */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {app.companyName.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#234C6A] group-hover:text-[#456882] transition-colors">
                        {app.jobTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-[#456882] mt-1">
                        <Building2 className="h-4 w-4" />
                        <span>{app.companyName}</span>
                      </div>
                    </div>
                    <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
                      <StatusIcon className="h-3 w-3" />
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#456882]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                    </div>
                    {app.paymentAmount !== undefined && app.paymentAmount > 0 && (
                      <div className="flex items-center gap-1 text-[#234C6A] font-medium">
                        <DollarSign className="h-4 w-4" />
                        <span>${app.paymentAmount.toFixed(2)} boost</span>
                      </div>
                    )}
                  </div>

                  {app.coverLetter && (
                    <p className="text-sm text-[#456882] mt-3 line-clamp-2 leading-relaxed">
                      {app.coverLetter}
                    </p>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-[#234C6A] hover:bg-[#234C6A]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                asChild
              >
                <Link href={`/job/${app.jobId}`}>
                  View Job
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AppliedJobs;