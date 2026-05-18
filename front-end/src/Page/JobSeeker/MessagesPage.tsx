"use client";

import JobSeekerMessages from "@/src/components/JobSeeker/JobSeekerMessages";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";

export default function SeekerMessagesPage() {
  const { user } = useAuth();

  return (
    <JobSeekerLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
              <p className="text-white/70 text-sm mt-0.5">
                Communicate with recruiters and track your conversations
              </p>
            </div>
          </div>
          <Sparkles className="absolute -bottom-6 -right-6 h-36 w-36 text-white/5" />
        </div>

        {/* Messages Card */}
        <Card className="p-0 border border-[#E3E3E3]/60 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden h-[calc(100vh-280px)]">
          <JobSeekerMessages userId={user?._id as string} />
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
