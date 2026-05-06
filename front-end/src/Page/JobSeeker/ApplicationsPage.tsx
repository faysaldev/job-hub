"use client";

import AppliedJobs from "@/src/components/JobSeeker/AppliedJobs";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { Briefcase, ArrowRight, Sparkles, Send } from "lucide-react";

export default function SeekerApplicationsPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <JobSeekerLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                <Send className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Your Applications</h1>
                <p className="text-white/70 text-sm mt-0.5">
                  Track the progress of your professional journey
                </p>
              </div>
            </div>
            <Button
              className="bg-white text-[#234C6A] hover:bg-white/90 rounded-xl px-6 font-semibold shadow-lg self-start"
              onClick={() => router.push("/job")}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Browse More Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <Sparkles className="absolute -bottom-6 -right-6 h-36 w-36 text-white/5" />
        </div>

        {/* Applications Card */}
        <Card className="border border-[#E3E3E3]/60 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-[#234C6A] to-[#456882]" />
          <div className="p-6 md:p-8">
            <AppliedJobs userId={user?._id as string} />
          </div>
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
