"use client";

import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import JobSeekerMessages from "@/src/components/JobSeeker/JobSeekerMessages";
import { useAuth } from "@/src/hooks/useAuth";

/** Uses the same secure conversation transport and attachment permissions as candidates. */
export default function RecruiterMessagesPage() {
  const { user } = useAuth();
  return (
    <RecruiterLayout>
      <main className="mx-auto max-w-7xl space-y-5">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-[#163B5C]">Candidate messages</h1>
          <p className="mt-1 text-sm text-slate-500">Discuss applications and exchange private documents securely.</p>
        </header>
        <div className="h-[calc(100vh-240px)] min-h-[540px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <JobSeekerMessages userId={user?._id || ""} viewerRole="recruiter" />
        </div>
      </main>
    </RecruiterLayout>
  );
}
