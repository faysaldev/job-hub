"use client";

import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import ApplicantsList from "@/src/components/Recruiter/ApplicantsList";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Users, Sparkles, Filter } from "lucide-react";

const ApplicantsPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Applicant Pipeline</h1>
                <p className="text-white/70 text-sm mt-0.5">
                  Review and manage candidates for your open positions
                </p>
              </div>
            </div>
            <Badge className="bg-white/15 text-white border-white/20 px-4 py-2 text-sm self-start">
              <Filter className="h-4 w-4 mr-2" />
              All Applicants
            </Badge>
          </div>
          <Sparkles className="absolute -bottom-6 -right-6 h-36 w-36 text-white/5" />
        </div>

        {/* Applicants Card */}
        <Card className="border border-[#E3E3E3]/60 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-[#234C6A] to-[#456882]" />
          <div className="p-6 md:p-8">
            <ApplicantsList userId={user?._id} />
          </div>
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default ApplicantsPage;
