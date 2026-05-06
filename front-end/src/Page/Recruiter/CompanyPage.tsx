"use client";

import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import CompanyProfile from "@/src/components/Recruiter/CompanyProfile";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Building2, ShieldCheck, Sparkles } from "lucide-react";

const CompanyPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-xs font-semibold uppercase tracking-widest">Verified Company</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Company Profile</h1>
              <p className="text-white/70 text-sm mt-1">
                Manage your company information, branding, and employer presence
              </p>
            </div>
          </div>
          <Sparkles className="absolute -bottom-6 -right-6 h-40 w-40 text-white/5" />
        </div>

        {/* Profile Form Card */}
        <Card className="border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-[#234C6A] to-[#456882]" />
          <div className="p-8">
            <CompanyProfile userId={user._id} />
          </div>
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default CompanyPage;
