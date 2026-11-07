"use client";

import CandidateOffers from "@/src/components/hiring/CandidateOffers";
import AppliedJobs from "@/src/components/JobSeeker/AppliedJobs";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  ArrowRight,
  Send,
  Clock,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function SeekerApplicationsPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <JobSeekerLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8 text-white border border-neutral-800 shadow-xs">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
                <Send className="h-3.5 w-3.5 text-neutral-400" />
                <span>Application Tracker</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Your Applications
              </h1>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-neutral-400">
                Monitor every role you have applied to, review submitted materials, and stay organized.
              </p>
            </div>

            <Button
              className="h-9 rounded-xl bg-white px-5 text-xs font-bold uppercase tracking-wider text-black hover:bg-neutral-100"
              onClick={() => router.push("/job")}
            >
              <Briefcase className="mr-1.5 h-3.5 w-3.5" />
              Browse More Jobs
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="relative z-10 mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {[
              { icon: Shield, label: "Tracked Status" },
              { icon: Clock, label: "Timeline View" },
              { icon: TrendingUp, label: "Career Momentum" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300"
              >
                <Icon className="mr-1.5 inline h-3.5 w-3.5 text-neutral-400" />
                {label}
              </div>
            ))}
          </div>
        </section>

        <CandidateOffers />
        <Card className="overflow-hidden rounded-2xl border border-[#eaecf0] bg-white shadow-xs p-0">
          <div className="border-b border-neutral-100 bg-[#f8fafc] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Application Pipeline
                </p>
                <h2 className="mt-0.5 text-base font-bold text-neutral-950">
                  Roles you have applied for
                </h2>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="p-5 md:p-6">
            <AppliedJobs userId={user?._id as string} />
          </div>
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
