"use client";

import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import CompanyProfile from "@/src/components/Recruiter/CompanyProfile";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Building2, ShieldCheck, Sparkles, BarChart3 } from "lucide-react";

const CompanyPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Pitch-Black Hero Header */}
        <section className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8 text-white border border-neutral-800 shadow-xs">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
                <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
                <span>Verified Company Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Company Profile
              </h1>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-neutral-400">
                Manage your employer brand, identity, location, and public hiring presence.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-center">
                <Building2 className="mx-auto mb-1 h-4 w-4 text-neutral-300" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Identity
                </p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-center">
                <BarChart3 className="mx-auto mb-1 h-4 w-4 text-neutral-300" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Branding
                </p>
              </div>
            </div>
          </div>
        </section>

        <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-7 shadow-xs">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Employer Brand
                </p>
                <h2 className="text-base font-bold text-neutral-950">
                  Company Presence
                </h2>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
              <ShieldCheck className="h-3.5 w-3.5 text-neutral-600" />
              Profile controls
            </div>
          </div>
          <CompanyProfile userId={user._id} />
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default CompanyPage;
