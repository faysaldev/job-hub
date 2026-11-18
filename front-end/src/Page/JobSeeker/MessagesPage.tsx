"use client";

import JobSeekerMessages from "@/src/components/JobSeeker/JobSeekerMessages";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { MessageSquare, Shield, Search, Send } from "lucide-react";

export default function SeekerMessagesPage() {
  const { user } = useAuth();

  return (
    <JobSeekerLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8 text-white border border-neutral-800 shadow-xs">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
                <MessageSquare className="h-3.5 w-3.5 text-neutral-400" />
                <span>Recruiter Inbox</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Professional Messages
              </h1>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-neutral-400">
                Keep recruiter conversations organized, responsive, and easy to follow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { icon: Shield, label: "Private Chats" },
                { icon: Search, label: "Search Threads" },
                { icon: Send, label: "Fast Replies" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300"
                >
                  <Icon className="mr-1.5 inline h-3.5 w-3.5 text-neutral-400" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Card className="h-[calc(100vh-280px)] min-h-[580px] overflow-hidden rounded-2xl border border-[#eaecf0] bg-white p-0 shadow-xs">
          <JobSeekerMessages userId={user?._id as string} />
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
