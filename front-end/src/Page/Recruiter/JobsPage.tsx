"use client";

import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import JobManagement from "@/src/components/Recruiter/JobManagement";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Plus,
  ArrowUpRight,
  Briefcase,
  Shield,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

const JobsPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-[#234C6A] p-7 text-white shadow-2xl shadow-[#234C6A]/20 md:p-9">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span>Recruiter Job Board</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Manage Job Listings
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/75">
                Keep every open role polished, current, and ready for the right
                candidates.
              </p>
            </div>
            <Button
              className="h-12 rounded-2xl bg-white px-6 font-black text-[#234C6A] hover:bg-[#E3E3E3]"
              onClick={() => router.push("/recruiter/create-job")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Job
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <Card className="relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-xl shadow-[#234C6A]/8 backdrop-blur md:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882]" />
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/20">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#456882]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#456882]">
                    Published Roles
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-[#234C6A]">
                  Your Hiring Workspace
                </h2>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#234C6A]/10 bg-[#234C6A]/5 px-4 py-3 text-sm font-black text-[#234C6A]">
              <BarChart3 className="h-4 w-4" />
              Live management
            </div>
          </div>
          <JobManagement userId={user?._id} />
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default JobsPage;
