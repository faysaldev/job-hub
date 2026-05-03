"use client";

import AppliedJobs from "@/src/components/JobSeeker/AppliedJobs";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function SeekerApplicationsPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <JobSeekerLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <Card className="p-8 border-none bg-white shadow-xl rounded-[32px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#234C6A]">Your Applications</h1>
              <p className="text-[#456882] mt-1 font-medium italic">
                Track the progress of your professional journey
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl px-8"
              onClick={() => router.push("/job")}
            >
              Browse More Jobs
            </Button>
          </div>
          <AppliedJobs userId={user?._id as string} />
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
