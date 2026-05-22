"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  User,
  Sparkles,
  Loader2,
  Shield,
  Briefcase,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import gsap from "gsap";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useGetMyInterviewsQuery } from "@/src/redux/features/interviews/interviewsApi";

export default function JobSeekerInterviewsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: interviews = [], isLoading } = useGetMyInterviewsQuery({
    role: "interviewee",
  });

  const upcomingInterviews = interviews.filter(
    (i: any) => i.status === "scheduled",
  );
  const pastInterviews = interviews.filter(
    (i: any) => i.status !== "scheduled",
  );

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".interview-header",
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        );
        gsap.fromTo(
          ".interview-card",
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            delay: 0.2,
            ease: "power2.out",
          },
        );
        gsap.fromTo(
          ".sidebar-card",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            delay: 0.35,
            ease: "power2.out",
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading]);

  return (
    <JobSeekerLayout>
      <div ref={containerRef} className="mx-auto max-w-7xl space-y-8">
        <section className="interview-header relative overflow-hidden rounded-3xl bg-[#234C6A] p-7 text-white shadow-2xl shadow-[#234C6A]/20 md:p-9">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <CalendarIcon className="h-4 w-4" />
                <span>Interview Schedule</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Stay ready for every interview.
              </h1>
              <p className="mt-3 max-w-2xl text-[16px] font-medium leading-7 text-white/75">
                Manage upcoming sessions, meeting links, interviewer details,
                and past interview history in one focused view.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
              {[
                { icon: CalendarIcon, label: `${interviews.length} Total` },
                { icon: Clock, label: `${upcomingInterviews.length} Upcoming` },
                { icon: Shield, label: "Prepared" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-white/90 backdrop-blur-sm"
                >
                  <Icon className="mr-2 inline h-4 w-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <Sparkles className="absolute -bottom-8 -right-8 h-40 w-40 text-white/5" />
        </section>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card className="overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-xl shadow-[#234C6A]/8 backdrop-blur pt-0">
              <div className="border-b border-[#E3E3E3]/70 bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
                      Upcoming
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-[#234C6A]">
                      Scheduled interviews
                    </h2>
                  </div>
                  {upcomingInterviews.length > 0 && (
                    <Badge className="rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-3 py-1 font-black text-[#234C6A]">
                      <Clock className="mr-2 h-4 w-4" />
                      {upcomingInterviews.length}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4 p-5 md:p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] py-20">
                    <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#234C6A]" />
                    <p className="font-semibold text-[#456882]">
                      Synchronizing your schedule...
                    </p>
                  </div>
                ) : upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview: any) => (
                    <InterviewCard key={interview._id} interview={interview} />
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-[#234C6A]/20 bg-[#F8FAFC] py-20 text-center">
                    <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-[#456882]/35" />
                    <h3 className="mb-1 text-lg font-black text-[#234C6A]">
                      No Upcoming Interviews
                    </h3>
                    <p className="mx-auto max-w-sm text-sm text-[#456882]">
                      Your schedule is clear. Interviews will appear here once
                      recruiters schedule them.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {pastInterviews.length > 0 && (
              <Card className="overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-sm backdrop-blur">
                <div className="border-b border-[#E3E3E3]/70 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
                    History
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[#234C6A]">
                    Past & other interviews
                  </h2>
                </div>
                <div className="space-y-4 p-5 opacity-80 md:p-6">
                  {pastInterviews.map((interview: any) => (
                    <InterviewCard
                      key={interview._id}
                      interview={interview}
                      isPast
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            <Card className="sidebar-card relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#234C6A] to-[#456882] p-6 text-white shadow-xl shadow-[#234C6A]/20">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[3rem] bg-white/10" />
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black">Interview Prep</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Review your profile, resume, and role details before your next
                  session.
                </p>
                <Button className="mt-5 h-11 w-full rounded-2xl bg-white font-black text-[#234C6A] hover:bg-[#E3E3E3]">
                  View Prep Material
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <CalendarIcon className="absolute -bottom-8 -right-8 h-40 w-40 rotate-12 text-white/10" />
            </Card>

            <Card className="sidebar-card rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur">
              <h3 className="mb-4 font-black text-[#234C6A]">
                Quick Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#234C6A]/5 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#456882]">
                    Total
                  </p>
                  <p className="text-3xl font-black text-[#234C6A]">
                    {interviews.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    Upcoming
                  </p>
                  <p className="text-3xl font-black text-emerald-700">
                    {upcomingInterviews.length}
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </JobSeekerLayout>
  );
}

function InterviewCard({
  interview,
  isPast = false,
}: {
  interview: any;
  isPast?: boolean;
}) {
  return (
    <Card
      className={cn(
        "interview-card group relative overflow-hidden rounded-3xl border border-[#234C6A]/10 p-5 transition-all duration-300",
        isPast
          ? "bg-[#F8FAFC] shadow-sm"
          : "bg-white shadow-sm hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-2xl hover:shadow-[#234C6A]/10",
      )}
    >
      {!isPast && (
        <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#234C6A] to-[#456882] transition-transform duration-300 group-hover:scale-x-100" />
      )}

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A]">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
              {new Date(interview.date).toLocaleString("default", {
                month: "short",
              })}
            </span>
            <span className="text-2xl font-black leading-none">
              {new Date(interview.date).getDate()}
            </span>
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-[#234C6A] transition-colors group-hover:text-[#456882]">
                {interview.job_id?.title || "Interview"}
              </h3>
              <Badge
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide",
                  interview.status === "scheduled"
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-[#234C6A]/10 bg-[#E3E3E3]/70 text-[#456882]",
                )}
              >
                {interview.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#456882]">
              <div className="flex items-center gap-1.5 rounded-full bg-[#F4F7F8] px-3 py-1.5">
                <Clock className="h-4 w-4 text-[#234C6A]" />
                {interview.start_time} - {interview.end_time}
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#F4F7F8] px-3 py-1.5">
                {interview.type === "video" ? (
                  <Video className="h-4 w-4 text-[#234C6A]" />
                ) : (
                  <MapPin className="h-4 w-4 text-[#234C6A]" />
                )}
                <span className="capitalize">{interview.type} Interview</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end sm:flex">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#456882]/60">
              Interviewer
            </p>
            <p className="text-sm font-black text-[#234C6A]">
              {interview.interviewer?.name || "TBD"}
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] shadow-sm">
            {interview.interviewer?.image ? (
              <img
                src={interview.interviewer.image}
                alt={interview.interviewer.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-[#456882]" />
            )}
          </div>
        </div>
      </div>

      {!isPast && interview.meet_link && (
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#E3E3E3]/70 pt-5">
          {interview.note && (
            <p className="max-w-[200px] truncate text-xs font-medium italic text-[#456882] sm:max-w-md">
              &ldquo;{interview.note}&rdquo;
            </p>
          )}
          <Button
            asChild
            className="ml-auto h-10 shrink-0 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-5 font-black text-white shadow-lg shadow-[#234C6A]/15 hover:from-[#1c405a] hover:to-[#3b5a71]"
          >
            <a
              href={interview.meet_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Session <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </Card>
  );
}
