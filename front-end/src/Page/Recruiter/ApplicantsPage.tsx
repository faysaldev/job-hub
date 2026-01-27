"use client";

import { mockUser } from "@/src/components/common/Header";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import ApplicantsList from "@/src/components/Recruiter/ApplicantsList";
import { Card } from "@/src/components/ui/card";
import { Users } from "lucide-react";

const ApplicantsPage = () => {
  const user = mockUser;

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 md:p-8 border-none bg-white shadow-lg rounded-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#234C6A] mb-1">Applicant Pipeline</h2>
              <p className="text-[#456882]">Review and manage candidates for your open positions</p>
            </div>
          </div>
          <ApplicantsList userId={user.id} />
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default ApplicantsPage;
