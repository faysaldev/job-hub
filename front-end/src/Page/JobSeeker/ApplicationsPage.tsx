"use client";

import AppliedJobs from "@/src/components/JobSeeker/AppliedJobs";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  ArrowRight,
  Sparkles,
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
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-[#234C6A] p-7 text-white shadow-2xl shadow-[#234C6A]/20 md:p-9">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <Send className="h-4 w-4" />
                <span>Application Tracker</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Your Applications
              </h1>
              <p className="mt-3 max-w-2xl text-[16px] font-medium leading-7 text-white/75">
                Monitor every role you have applied to, review submitted
                materials, and keep your next move organized.
              </p>
            </div>

            <Button
              className="h-12 rounded-2xl bg-white px-6 font-black text-[#234C6A] hover:bg-[#E3E3E3]"
              onClick={() => router.push("/job")}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Browse More Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Shield, label: "Tracked Status" },
              { icon: Clock, label: "Timeline View" },
              { icon: TrendingUp, label: "Career Momentum" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-white/90 backdrop-blur-sm"
              >
                <Icon className="mr-2 inline h-3 w-4" />
                {label}
              </div>
            ))}
          </div>
          <Sparkles className="absolute -bottom-8 -right-8 h-40 w-40 text-white/5" />
        </section>

        <Card className="overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-2xl shadow-[#234C6A]/10 backdrop-blur pt-0">
          <div className="border-b border-[#E3E3E3]/70 bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
                  Application Pipeline
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#234C6A]">
                  Roles you have applied for
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/15">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="p-5 md:p-7">
            <AppliedJobs userId={user?._id as string} />
          </div>
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
