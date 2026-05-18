"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Calendar as CalendarIcon, Clock, Video, MapPin,
  ExternalLink, User, Sparkles, Loader2,
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
        gsap.fromTo(".interview-header", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        gsap.fromTo(".interview-card", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out" });
        gsap.fromTo(".sidebar-card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, delay: 0.4, ease: "power2.out" });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading]);

  return (
    <JobSeekerLayout>
      <div ref={containerRef} className="max-w-7xl mx-auto space-y-6">
        {/* Hero Banner */}
        <div className="interview-header relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                <CalendarIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Interview Schedule</h1>
                <p className="text-white/70 text-sm mt-0.5">
                  Manage and track all your upcoming recruitment sessions
                </p>
              </div>
            </div>
            {upcomingInterviews.length > 0 && (
              <Badge className="bg-white/15 text-white border-white/20 px-4 py-2 text-sm self-start">
                <Clock className="h-4 w-4 mr-2" />
                {upcomingInterviews.length} Upcoming
              </Badge>
            )}
          </div>
          <Sparkles className="absolute -bottom-6 -right-6 h-36 w-36 text-white/5" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Upcoming Interviews List */}
          <div className="xl:col-span-2 space-y-6">
            <section>
              <h2 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#234C6A] rounded-full" />
                Upcoming Interviews
              </h2>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-[#E3E3E3]/60">
                    <Loader2 className="h-10 w-10 animate-spin text-[#234C6A] mb-4" />
                    <p className="text-[#456882] font-medium">
                      Synchronizing your schedule...
                    </p>
                  </div>
                ) : upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview: any) => (
                    <InterviewCard key={interview._id} interview={interview} />
                  ))
                ) : (
                  <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[#E3E3E3]">
                    <CalendarIcon className="h-12 w-12 text-[#E3E3E3] mx-auto mb-4" />
                    <h3 className="font-bold text-[#234C6A] text-lg mb-1">No Upcoming Interviews</h3>
                    <p className="text-[#456882] text-sm max-w-sm mx-auto">
                      Your schedule is clear. Interviews will appear here once recruiters schedule them.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {pastInterviews.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#E3E3E3] rounded-full" />
                  Past & Others
                </h2>
                <div className="space-y-4 opacity-70">
                  {pastInterviews.map((interview: any) => (
                    <InterviewCard key={interview._id} interview={interview} isPast />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sidebar-card p-6 border-none shadow-xl bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1">Interview Prep</h3>
                <p className="text-white/80 text-sm mb-6">
                  Master your next technical session with our curated resources.
                </p>
                <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90 rounded-xl font-bold shadow-lg">
                  View Prep Material
                </Button>
              </div>
              <CalendarIcon className="absolute -bottom-8 -right-8 h-40 w-40 text-white/10 rotate-12" />
            </Card>

            <Card className="sidebar-card p-6 border-none shadow-lg rounded-2xl bg-white">
              <h3 className="font-bold text-[#234C6A] mb-4">Quick Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#234C6A]/5">
                  <p className="text-[10px] text-[#234C6A] font-bold uppercase tracking-wider">Total</p>
                  <p className="text-2xl font-black text-[#234C6A]">{interviews.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50">
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Upcoming</p>
                  <p className="text-2xl font-black text-green-700">{upcomingInterviews.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </JobSeekerLayout>
  );
}

function InterviewCard({ interview, isPast = false }: { interview: any; isPast?: boolean }) {
  return (
    <Card
      className={cn(
        "interview-card group relative overflow-hidden transition-all duration-300 border border-[#E3E3E3]/60",
        isPast
          ? "bg-gray-50 shadow-sm"
          : "bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-0.5",
      )}
      style={{ borderRadius: "20px" }}
    >
      {/* Left accent */}
      {!isPast && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#234C6A] to-[#456882] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="flex flex-col items-center justify-center p-3 w-16 h-16 rounded-2xl bg-[#234C6A]/5 text-[#234C6A]">
              <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                {new Date(interview.date).toLocaleString("default", { month: "short" })}
              </span>
              <span className="text-2xl font-black leading-none">
                {new Date(interview.date).getDate()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-[#234C6A] group-hover:text-[#456882] transition-colors">
                  {interview.job_id?.title || "Interview"}
                </h3>
                <Badge
                  className={cn(
                    "border-none px-2 py-0 h-5 text-[10px] font-black uppercase rounded-md",
                    interview.status === "scheduled"
                      ? "bg-green-50 text-green-600"
                      : "bg-[#E3E3E3] text-[#456882]",
                  )}
                >
                  {interview.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-[#456882] font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#234C6A]/60" />
                  {interview.start_time} - {interview.end_time}
                </div>
                <div className="flex items-center gap-1.5">
                  {interview.type === "video" ? (
                    <Video className="h-4 w-4 text-[#234C6A]/60" />
                  ) : (
                    <MapPin className="h-4 w-4 text-[#234C6A]/60" />
                  )}
                  <span className="capitalize">{interview.type} Interview</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <p className="text-[10px] font-bold text-[#456882] uppercase opacity-60">Interviewer</p>
              <p className="text-sm font-bold text-[#234C6A]">{interview.interviewer?.name || "TBD"}</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100 flex-shrink-0">
              {interview.interviewer?.image ? (
                <img src={interview.interviewer.image} alt={interview.interviewer.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>
        </div>

        {!isPast && interview.meet_link && (
          <div className="mt-6 pt-6 border-t border-[#E3E3E3]/60 flex items-center justify-between gap-4">
            {interview.note && (
              <p className="text-xs text-[#456882] font-medium italic truncate max-w-[200px] sm:max-w-md">
                &ldquo;{interview.note}&rdquo;
              </p>
            )}
            <Button
              asChild
              className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl px-6 h-10 shadow-lg transition-all hover:scale-105 active:scale-95 flex-shrink-0 ml-auto"
            >
              <a href={interview.meet_link} target="_blank" rel="noopener noreferrer">
                Join Session <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
