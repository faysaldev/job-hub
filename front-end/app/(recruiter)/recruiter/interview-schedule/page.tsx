"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  MoreVertical,
  User,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { useToast } from "@/src/hooks/use-toast";
import { 
  useGetMyInterviewsQuery, 
  useRescheduleInterviewMutation 
} from "@/src/redux/features/interviews/interviewsApi";

export default function RecruiterInterviewSchedulePage() {
  const { data: interviews = [], isLoading } = useGetMyInterviewsQuery({ role: "interviewer" });
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const upcomingInterviews = interviews.filter((i: any) => i.status === "scheduled");
  const pastInterviews = interviews.filter((i: any) => i.status !== "scheduled");

  return (
    <RecruiterLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#234C6A] tracking-tight">
              Recruitment Schedule
            </h1>
            <p className="text-[#456882] mt-1 font-medium">
              Oversee and manage candidate interview sessions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                className="pl-10 rounded-xl bg-white border-gray-100 w-[240px]"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-gray-100 text-[#234C6A] font-bold"
            >
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-none shadow-xl bg-[#234C6A] text-white rounded-[32px]">
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-1">
                Scheduled Today
              </p>
              <p className="text-4xl font-black mb-4">
                {upcomingInterviews.length}
              </p>
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 3).map((interview: any) => (
                   <div key={interview._id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/10">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                         <Clock className="h-4 w-4" />
                      </div>
                      <div>
                         <p className="text-xs font-bold">{interview.start_time}</p>
                         <p className="text-[10px] opacity-70 truncate max-w-[120px]">
                            {interview.interviewee?.name || "Candidate"}
                         </p>
                      </div>
                   </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-none shadow-lg rounded-[32px] bg-white">
              <h3 className="font-bold text-[#234C6A] mb-4">Status Overview</h3>
              <div className="space-y-4">
                {[
                  { label: "Scheduled", count: upcomingInterviews.length, color: "bg-blue-500" },
                  { label: "Completed", count: pastInterviews.filter((i: any) => i.status === 'completed').length, color: "bg-green-500" },
                  { label: "Cancelled", count: pastInterviews.filter((i: any) => i.status === 'cancelled').length, color: "bg-red-500" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between items-center text-sm font-bold mb-1.5">
                      <span className="text-[#456882]">{stat.label}</span>
                      <span className="text-[#234C6A]">{stat.count}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", stat.color)}
                        style={{ width: `${stat.count > 0 ? (stat.count / (interviews.length || 1)) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Schedule List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                className="rounded-xl bg-[#234C6A] text-white hover:bg-[#234C6A]/90 font-bold px-6"
              >
                Upcoming
              </Button>
              <Button
                variant="ghost"
                className="rounded-xl text-[#456882] hover:bg-gray-100 font-bold px-6"
              >
                History
              </Button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                 <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] shadow-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#234C6A]" />
                    <p className="mt-4 text-[#456882] font-medium italic">Syncing your recruitment schedule...</p>
                 </div>
              ) : interviews.length > 0 ? (
                interviews.map((interview: any) => (
                  <RecruiterInterviewCard
                    key={interview._id}
                    interview={interview}
                    onReschedule={() => {
                      setSelectedInterview(interview);
                      setIsRescheduleOpen(true);
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 shadow-sm">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CalendarIcon className="h-10 w-10 text-gray-200" />
                   </div>
                   <h3 className="text-2xl font-bold text-[#234C6A]">No Interviews Scheduled</h3>
                   <p className="text-[#456882] mt-2 max-w-sm mx-auto">Your schedule is currently clear. Interviews will appear here once you coordinate with candidates.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RescheduleDialog 
        isOpen={isRescheduleOpen} 
        onClose={() => setIsRescheduleOpen(false)} 
        interview={selectedInterview} 
      />
    </RecruiterLayout>
  );
}

function RescheduleDialog({ isOpen, onClose, interview }: { isOpen: boolean, onClose: () => void, interview: any }) {
  const { toast } = useToast();
  const [rescheduleInterview, { isLoading }] = useRescheduleInterviewMutation();
  
  // Format date to YYYY-MM-DD for input
  const initialDate = interview ? new Date(interview.date).toISOString().split('T')[0] : '';
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(interview?.start_time || '');
  const [endTime, setEndTime] = useState(interview?.end_time || '');

  // Reset state when interview changes or dialog opens
  useState(() => {
    if (interview) {
      setDate(new Date(interview.date).toISOString().split('T')[0]);
      setStartTime(interview.start_time);
      setEndTime(interview.end_time);
    }
  });

  const handleReschedule = async () => {
    try {
      await rescheduleInterview({
        interviewId: interview._id,
        date,
        start_time: startTime,
        end_time: endTime,
      }).unwrap();
      
      toast({
        title: "Session Rescheduled",
        description: "The interview time has been updated successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to reschedule the interview. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!interview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl p-8 bg-white overflow-hidden">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-[#234C6A] tracking-tight">
             Reschedule Session
          </DialogTitle>
          <p className="text-sm text-[#456882] font-medium">
             Updating session for <span className="font-bold text-[#234C6A]">{interview.interviewee?.name}</span>
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-[#234C6A]/60 ml-1">Interview Date</Label>
            <Input 
              type="date" 
              value={date} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 font-bold text-[#234C6A] focus:ring-[#234C6A]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#234C6A]/60 ml-1">Start Time</Label>
              <Input 
                type="time" 
                value={startTime} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 font-bold text-[#234C6A] focus:ring-[#234C6A]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#234C6A]/60 ml-1">End Time</Label>
              <Input 
                type="time" 
                value={endTime} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
                className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 font-bold text-[#234C6A] focus:ring-[#234C6A]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8 gap-3 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-2xl font-bold text-[#456882] hover:bg-gray-100 flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReschedule} 
            disabled={isLoading}
            className="rounded-2xl bg-[#234C6A] hover:bg-[#234C6A]/90 text-white font-black px-8 h-12 shadow-lg shadow-[#234C6A]/20 transition-all active:scale-95 flex-1 sm:flex-none"
          >
            {isLoading ? "Updating..." : "Confirm Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RecruiterInterviewCard({ interview, onReschedule }: { interview: any, onReschedule: () => void }) {
  const handleLaunchSession = () => {
    if (interview.meet_link) {
      window.open(interview.meet_link, '_blank');
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 border-none bg-white shadow-md hover:shadow-xl rounded-[28px] border border-transparent hover:border-blue-100/50">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 shadow-sm flex-shrink-0">
              {interview.interviewee?.image ? (
                <img
                  src={interview.interviewee.image}
                  alt={interview.interviewee.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#234C6A]/5 to-[#456882]/5 flex items-center justify-center text-[#234C6A]">
                  <User className="h-6 w-6" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#234C6A] group-hover:text-[#456882] transition-colors">
                {interview.job_id?.title || "Job Title"}
              </h3>
              <p className="text-sm text-[#456882] font-medium">
                Candidate:{" "}
                <span className="text-[#234C6A] font-bold">{interview.interviewee?.name || "Unknown Candidate"}</span>
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
            <Badge
              className={cn(
                "border-none px-3 py-1 rounded-xl text-[10px] font-black uppercase",
                interview.status === "scheduled"
                  ? "bg-green-100 text-green-700 shadow-sm shadow-green-100"
                  : "bg-gray-100 text-gray-500",
              )}
            >
              {interview.status}
            </Badge>
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-[#456882]" />
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#456882] text-sm">
            {interview.type === "video" ? (
              <Video className="h-4 w-4" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            <span className="capitalize font-bold tracking-tight">{interview.type} Interview</span>
          </div>
          <div className="flex items-center gap-3">
            {interview.status === 'scheduled' && (
              <Button
                variant="outline"
                onClick={onReschedule}
                className="rounded-xl border-gray-100 text-[#234C6A] font-bold text-xs h-9 hover:bg-gray-50"
              >
                Reschedule
              </Button>
            )}
            {interview.meet_link && interview.status === 'scheduled' && (
               <Button 
                onClick={handleLaunchSession}
                className="bg-[#234C6A] hover:bg-[#234C6A]/90 text-white rounded-xl font-bold text-xs h-9 px-6 shadow-md transition-all active:scale-95"
               >
                 Launch Session
               </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
