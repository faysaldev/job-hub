"use client";

import JobSeekerMessages from "@/src/components/JobSeeker/JobSeekerMessages";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";

export default function SeekerMessagesPage() {
  const { user } = useAuth();

  return (
    <JobSeekerLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <Card className="p-0 border-none bg-white shadow-xl rounded-[32px] overflow-hidden h-[calc(100vh-200px)]">
          <JobSeekerMessages userId={user?._id as string} />
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
