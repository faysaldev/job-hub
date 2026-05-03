"use client";

import JobSeekerProfile from "@/src/components/JobSeeker/JobSeekerProfile";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";

export default function SeekerProfilePage() {
  const { user } = useAuth();

  return (
    <JobSeekerLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <Card className="p-8 border-none bg-white shadow-xl rounded-[32px]">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#234C6A]">Your Profile</h1>
            <p className="text-[#456882] mt-1 font-medium italic">
              Keep your professional identity updated and stand out
            </p>
          </div>
          <JobSeekerProfile userId={user?._id as string} />
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
