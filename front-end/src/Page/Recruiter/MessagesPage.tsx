"use client";

import { mockUser } from "@/src/components/common/Header";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import Messages from "@/src/components/common/AppCommon/Message";
import { Card } from "@/src/components/ui/card";
import { MessageSquare } from "lucide-react";

const MessagesPage = () => {
  const user = mockUser;

  if (!user) return null;

  return (
    <RecruiterLayout>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 md:p-8 border-none bg-white shadow-lg rounded-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
              <MessageSquare className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#234C6A] mb-1">Messages</h2>
              <p className="text-[#456882]">Communicate with candidates and team members</p>
            </div>
          </div>
          <Messages userId={user.id} />
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default MessagesPage;
