"use client";

import JobSeekerMessages from "@/src/components/JobSeeker/JobSeekerMessages";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useAuth } from "@/src/hooks/useAuth";
import { Card } from "@/src/components/ui/card";
import { MessageSquare, Sparkles, Shield, Search, Send } from "lucide-react";

export default function SeekerMessagesPage() {
  const { user } = useAuth();

  return (
    <JobSeekerLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-[#234C6A] p-7 text-white shadow-2xl shadow-[#234C6A]/20 md:p-9">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <MessageSquare className="h-4 w-4" />
                <span>Recruiter Inbox</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Professional Messages
              </h1>
              <p className="mt-3 max-w-2xl text-[16px] font-medium leading-7 text-white/75">
                Keep recruiter conversations organized, responsive, and easy to
                follow from first message to final decision.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
              {[
                { icon: Shield, label: "Private Chats" },
                { icon: Search, label: "Search Threads" },
                { icon: Send, label: "Fast Replies" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-white/90 backdrop-blur-sm"
                >
                  <Icon className="mr-1 inline h-3 w-3" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <Sparkles className="absolute -bottom-8 -right-8 h-40 w-40 text-white/5" />
        </section>

        <Card className="h-[calc(100vh-300px)] min-h-[640px] overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-0 shadow-2xl shadow-[#234C6A]/10 backdrop-blur">
          <JobSeekerMessages userId={user?._id as string} />
        </Card>
      </div>
    </JobSeekerLayout>
  );
}
