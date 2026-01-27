"use client";

import { mockUser } from "@/src/components/common/Header";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import JobManagement from "@/src/components/Recruiter/JobManagement";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Plus, ArrowUpRight, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

const JobsPage = () => {
  const user = mockUser;
  const router = useRouter();

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 md:p-8 border-none bg-white shadow-lg rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white shadow-lg">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#234C6A] mb-1">Manage Job Listings</h2>
                <p className="text-[#456882]">Create, edit, and manage your job postings</p>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white group"
              onClick={() => router.push("/recruiter/create-job")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Job
              <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
          <JobManagement userId={user.id} />
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default JobsPage;
