"use client";

import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Briefcase,
  User,
} from "lucide-react";
import { MOCK_INTERVIEWS } from "@/src/constants/mockInterviews";
import { cn } from "@/src/lib/utils";

import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";

export default function JobSeekerInterviewsPage() {
  const upcomingInterviews = MOCK_INTERVIEWS.filter(
    (i) => i.status === "scheduled"
  );
  const pastInterviews = MOCK_INTERVIEWS.filter(
    (i) => i.status !== "scheduled"
  );

  return (
    <JobSeekerLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#234C6A] tracking-tight">
              Interview Schedule
            </h1>
            <p className="text-[#456882] mt-1 font-medium">
              Manage and track all your upcoming recruitment sessions
            </p>
          </div>
          <Badge className="w-fit h-fit px-4 py-1.5 rounded-full bg-[#234C6A]/5 text-[#234C6A] border-none text-sm font-bold">
            {upcomingInterviews.length} Upcoming Sessions
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Upcoming Interviews List */}
          <div className="xl:col-span-2 space-y-6">
            <section>
              <h2 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#234C6A] rounded-full" />
                Upcoming Interviews
              </h2>

              <div className="space-y-4">
                {upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview) => (
                    <InterviewCard key={interview._id} interview={interview} />
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <CalendarIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No upcoming interviews scheduled yet.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-gray-300 rounded-full" />
                Past & Others
              </h2>
              <div className="space-y-4 opacity-70 grayscale-[0.5]">
                {pastInterviews.map((interview) => (
                  <InterviewCard key={interview._id} interview={interview} isPast />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Quick Stats */}
          <div className="space-y-6">
            <Card className="p-6 border-none shadow-xl bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-[32px] relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="font-bold text-xl mb-1">Interview Prep</h3>
                  <p className="text-white/80 text-sm mb-6">Master your next technical session with our curated resources.</p>
                  <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90 rounded-2xl font-bold py-6 shadow-lg transition-all duration-300 active:scale-95">
                    View Prep Material
                  </Button>
               </div>
               <CalendarIcon className="absolute -bottom-8 -right-8 h-40 w-40 text-white/10 rotate-12" />
            </Card>

            <Card className="p-6 border-none shadow-lg rounded-[32px] bg-white">
              <h3 className="font-bold text-[#234C6A] mb-4">Quick Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-blue-50">
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-black text-blue-700">{MOCK_INTERVIEWS.length}</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-green-50">
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Success</p>
                    <p className="text-2xl font-black text-green-700">85%</p>
                 </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </JobSeekerLayout>
  );
}

function InterviewCard({ interview, isPast = false }: { interview: any, isPast?: boolean }) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-500 border-none",
      isPast ? "bg-gray-50 shadow-sm" : "bg-white shadow-xl hover:shadow-2xl hover:-translate-y-1"
    )} style={{ borderRadius: '28px' }}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
             <div className="flex flex-col items-center justify-center p-3 w-16 h-16 rounded-2xl bg-[#234C6A]/5 text-[#234C6A]">
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                   {new Date(interview.date).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-2xl font-black leading-none">
                   {new Date(interview.date).getDate()}
                </span>
             </div>
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <h3 className="text-xl font-bold text-[#234C6A] group-hover:text-[#456882] transition-colors">
                     {interview.job_id.title}
                   </h3>
                   <Badge className={cn(
                     "border-none px-2 py-0 h-5 text-[10px] font-black uppercase rounded-md",
                     interview.status === 'scheduled' ? "bg-green-50 text-green-600" : "bg-gray-200 text-gray-500"
                   )}>
                      {interview.status}
                   </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-[#456882] font-medium">
                   <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 opacity-70" />
                      {interview.start_time} - {interview.end_time}
                   </div>
                   <div className="flex items-center gap-1.5">
                      {interview.type === 'video' ? <Video className="h-4 w-4 opacity-70" /> : <MapPin className="h-4 w-4 opacity-70" />}
                      <span className="capitalize">{interview.type} Interview</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end mr-2">
                <p className="text-[10px] font-bold text-[#456882] uppercase opacity-60">Interviewer</p>
                <p className="text-sm font-bold text-[#234C6A]">{interview.interviewer.name}</p>
             </div>
             <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100 flex-shrink-0">
                {interview.interviewer.image ? (
                   <img src={interview.interviewer.image} alt={interview.interviewer.name} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="h-5 w-5" />
                   </div>
                )}
             </div>
             <Button size="icon" variant="ghost" className="rounded-full hover:bg-[#234C6A]/5">
                <MoreVertical className="h-5 w-5 text-[#456882]" />
             </Button>
          </div>
        </div>

        {!isPast && interview.meet_link && (
           <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
              <p className="text-xs text-[#456882] font-medium italic truncate max-w-[200px] sm:max-w-md">
                 "{interview.note}"
              </p>
              <Button asChild className="bg-[#234C6A] hover:bg-[#234C6A]/90 text-white rounded-xl px-6 py-2 h-10 shadow-lg shadow-[#234C6A]/20 transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0">
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
