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
  Search,
  Filter,
} from "lucide-react";
import { MOCK_INTERVIEWS } from "@/src/constants/mockInterviews";
import { cn } from "@/src/lib/utils";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { Input } from "@/src/components/ui/input";

export default function RecruiterInterviewSchedulePage() {
  return (
    <RecruiterLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#234C6A] tracking-tight">
              Recruitment Schedule
            </h1>
            <p className="text-[#456882] mt-1 font-medium">
              Oversee and manage all scheduled candidate interviews
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search candidates..." className="pl-10 rounded-xl bg-white border-gray-100 w-[240px]" />
             </div>
             <Button variant="outline" className="rounded-xl border-gray-100 text-[#234C6A] font-bold">
                <Filter className="h-4 w-4 mr-2" /> Filter
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Stats */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 border-none shadow-xl bg-[#234C6A] text-white rounded-[32px]">
                 <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-1">Today's Sessions</p>
                 <p className="text-4xl font-black mb-4">4</p>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10">
                       <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                          <Clock className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="text-xs font-bold">10:00 AM</p>
                          <p className="text-[10px] opacity-70">John Doe • Frontend</p>
                       </div>
                    </div>
                 </div>
              </Card>

              <Card className="p-6 border-none shadow-lg rounded-[32px] bg-white">
                 <h3 className="font-bold text-[#234C6A] mb-4">Status Overview</h3>
                 <div className="space-y-4">
                    {[
                       { label: 'Scheduled', count: 12, color: 'bg-blue-500' },
                       { label: 'Completed', count: 45, color: 'bg-green-500' },
                       { label: 'Cancelled', count: 3, color: 'bg-red-500' },
                    ].map((stat) => (
                       <div key={stat.label}>
                          <div className="flex justify-between items-center text-sm font-bold mb-1.5">
                             <span className="text-[#456882]">{stat.label}</span>
                             <span className="text-[#234C6A]">{stat.count}</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                             <div className={cn("h-full rounded-full", stat.color)} style={{ width: `${(stat.count / 60) * 100}%` }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>
           </div>

           {/* Main Schedule List */}
           <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                 <Button variant="ghost" className="rounded-xl bg-[#234C6A] text-white hover:bg-[#234C6A]/90 font-bold px-6">
                    Upcoming
                 </Button>
                 <Button variant="ghost" className="rounded-xl text-[#456882] hover:bg-gray-100 font-bold px-6">
                    History
                 </Button>
              </div>

              <div className="space-y-4">
                 {MOCK_INTERVIEWS.map((interview) => (
                    <RecruiterInterviewCard key={interview._id} interview={interview} />
                 ))}
              </div>
           </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}

function RecruiterInterviewCard({ interview }: { interview: any }) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-500 border-none bg-white shadow-md hover:shadow-xl rounded-[28px]">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 shadow-sm flex-shrink-0">
                {interview.interviewer.image ? (
                   <img src={interview.interviewer.image} alt={interview.interviewer.name} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <User className="h-6 w-6" />
                   </div>
                )}
             </div>
             <div>
                <h3 className="text-lg font-bold text-[#234C6A] group-hover:text-[#456882] transition-colors">
                   {interview.job_id.title}
                </h3>
                <p className="text-sm text-[#456882] font-medium">
                   Candidate: <span className="text-[#234C6A] font-bold">Candidate Name</span>
                </p>
             </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#234C6A]" />
                <span className="text-sm font-bold text-[#234C6A]">
                   {new Date(interview.date).toLocaleDateString()}
                </span>
             </div>
             <div className="px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#234C6A]" />
                <span className="text-sm font-bold text-[#234C6A]">
                   {interview.start_time}
                </span>
             </div>
             <Badge className={cn(
                "border-none px-3 py-1 rounded-xl text-[10px] font-black uppercase",
                interview.status === 'scheduled' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
             )}>
                {interview.status}
             </Badge>
             <Button size="icon" variant="ghost" className="rounded-full">
                <MoreVertical className="h-5 w-5 text-[#456882]" />
             </Button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[#456882] text-sm">
              {interview.type === 'video' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              <span className="capitalize">{interview.type}</span>
           </div>
           <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-gray-100 text-[#234C6A] font-bold text-xs h-9">
                 Reschedule
              </Button>
              <Button className="bg-[#234C6A] hover:bg-[#234C6A]/90 text-white rounded-xl font-bold text-xs h-9 px-6 shadow-md">
                 Launch Session
              </Button>
           </div>
        </div>
      </div>
    </Card>
  );
}
