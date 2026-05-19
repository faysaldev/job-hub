"use client";

import { useEffect, useState } from "react";
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
  Shield,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { useToast } from "@/src/hooks/use-toast";
import {
  useGetMyInterviewsQuery,
  useRescheduleInterviewMutation,
} from "@/src/redux/features/interviews/interviewsApi";

export default function InterviewSchedulePage() {
  const { data: interviews = [], isLoading } = useGetMyInterviewsQuery({
    role: "interviewer",
  });
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const upcomingInterviews = interviews.filter(
    (i: any) => i.status === "scheduled",
  );
  const pastInterviews = interviews.filter(
    (i: any) => i.status !== "scheduled",
  );
  const completedCount = pastInterviews.filter(
    (i: any) => i.status === "completed",
  ).length;
  const cancelledCount = pastInterviews.filter(
    (i: any) => i.status === "cancelled",
  ).length;

  return (
    <RecruiterLayout>
      <div className="animate-in fade-in mx-auto max-w-7xl space-y-8 duration-700">
        <section className="relative overflow-hidden rounded-3xl bg-[#234C6A] p-7 text-white shadow-2xl shadow-[#234C6A]/20 md:p-9">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span>Recruiter Interview Calendar</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Recruitment Schedule
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/75">
                Oversee candidate interviews, reschedule sessions, and launch
                meetings from one organized calendar workspace.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Upcoming", value: upcomingInterviews.length },
                { label: "Complete", value: completedCount },
                { label: "Canceled", value: cancelledCount },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-sm"
                >
                  <p className="text-2xl font-black">{item.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/65">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Stats */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="overflow-hidden rounded-3xl border-none bg-[#234C6A] p-6 text-white shadow-xl shadow-[#234C6A]/20">
              <p className="mb-1 text-sm font-black uppercase tracking-widest text-white/60">
                Scheduled Queue
              </p>
              <p className="mb-5 text-4xl font-black">
                {upcomingInterviews.length}
              </p>
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 3).map((interview: any) => (
                  <div
                    key={interview._id}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black">
                        {interview.start_time}
                      </p>
                      <p className="max-w-[140px] truncate text-[10px] font-semibold text-white/65">
                        {interview.interviewee?.name || "Candidate"}
                      </p>
                    </div>
                  </div>
                ))}
                {!upcomingInterviews.length && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-white/70">
                    No scheduled sessions yet.
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur">
              <h3 className="mb-5 font-black text-[#234C6A]">
                Status Overview
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Scheduled",
                    count: upcomingInterviews.length,
                    color: "bg-[#234C6A]",
                  },
                  {
                    label: "Completed",
                    count: completedCount,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Cancelled",
                    count: cancelledCount,
                    color: "bg-red-500",
                  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm font-black">
                      <span className="text-[#456882]">{stat.label}</span>
                      <span className="text-[#234C6A]">{stat.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#E3E3E3]">
                      <div
                        className={cn("h-full rounded-full", stat.color)}
                        style={{
                          width: `${
                            stat.count > 0
                              ? (stat.count / (interviews.length || 1)) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Schedule List */}
          <div className="space-y-6 lg:col-span-3">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-[#234C6A]/10 bg-white py-20 shadow-sm">
                  <Loader2 className="h-10 w-10 animate-spin text-[#234C6A]" />
                  <p className="mt-4 font-medium text-[#456882]">
                    Syncing your recruitment schedule...
                  </p>
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
                <div className="rounded-3xl border-2 border-dashed border-[#234C6A]/15 bg-white py-24 text-center shadow-sm">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#234C6A]/5">
                    <CalendarIcon className="h-10 w-10 text-[#456882]/35" />
                  </div>
                  <h3 className="text-2xl font-black text-[#234C6A]">
                    No Interviews Scheduled
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-[#456882]">
                    Your schedule is currently clear. Interviews will appear
                    here once you coordinate with candidates.
                  </p>
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

function RescheduleDialog({
  isOpen,
  onClose,
  interview,
}: {
  isOpen: boolean;
  onClose: () => void;
  interview: any;
}) {
  const { toast } = useToast();
  const [rescheduleInterview, { isLoading }] = useRescheduleInterviewMutation();

  // Format date to YYYY-MM-DD for input
  const initialDate = interview
    ? new Date(interview.date).toISOString().split("T")[0]
    : "";
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(interview?.start_time || "");
  const [endTime, setEndTime] = useState(interview?.end_time || "");

  // Reset state when interview changes or dialog opens
  useEffect(() => {
    if (interview) {
      setDate(new Date(interview.date).toISOString().split("T")[0]);
      setStartTime(interview.start_time);
      setEndTime(interview.end_time);
    }
  }, [interview]);

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
      <DialogContent className="overflow-hidden rounded-3xl border-none bg-white p-8 shadow-2xl sm:max-w-[425px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-[#234C6A] tracking-tight">
            Reschedule Session
          </DialogTitle>
          <p className="text-sm font-medium text-[#456882]">
            Updating session for{" "}
            <span className="font-bold text-[#234C6A]">
              {interview.interviewee?.name}
            </span>
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="ml-1 text-xs font-black uppercase tracking-widest text-[#234C6A]/60">
              Interview Date
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] font-bold text-[#234C6A] focus:ring-[#234C6A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="ml-1 text-xs font-black uppercase tracking-widest text-[#234C6A]/60">
                Start Time
              </Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStartTime(e.target.value)
                }
                className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] font-bold text-[#234C6A] focus:ring-[#234C6A]"
              />
            </div>
            <div className="space-y-2">
              <Label className="ml-1 text-xs font-black uppercase tracking-widest text-[#234C6A]/60">
                End Time
              </Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEndTime(e.target.value)
                }
                className="h-12 rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] font-bold text-[#234C6A] focus:ring-[#234C6A]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8 gap-3 sm:gap-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-2xl font-black text-[#456882] hover:bg-[#234C6A]/5 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={isLoading}
            className="h-12 flex-1 rounded-2xl bg-[#234C6A] px-8 font-black text-white shadow-lg shadow-[#234C6A]/20 transition-all hover:bg-[#456882] active:scale-95 sm:flex-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm Schedule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RecruiterInterviewCard({
  interview,
  onReschedule,
}: {
  interview: any;
  onReschedule: () => void;
}) {
  const handleLaunchSession = () => {
    if (interview.meet_link) {
      window.open(interview.meet_link, "_blank");
    }
  };

  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#234C6A]/25 hover:shadow-xl hover:shadow-[#234C6A]/10">
      <div className="p-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] shadow-sm">
              {interview.interviewee?.image ? (
                <img
                  src={interview.interviewee.image}
                  alt={interview.interviewee.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#234C6A]/5 to-[#456882]/5 text-[#234C6A]">
                  <User className="h-6 w-6" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-black text-[#234C6A] transition-colors group-hover:text-[#456882]">
                {interview.job_id?.title || "Job Title"}
              </h3>
              <p className="text-sm font-medium text-[#456882]">
                Candidate:{" "}
                <span className="font-bold text-[#234C6A]">
                  {interview.interviewee?.name || "Unknown Candidate"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] px-4 py-2">
              <CalendarIcon className="h-4 w-4 text-[#234C6A]" />
              <span className="text-sm font-bold text-[#234C6A]">
                {new Date(interview.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] px-4 py-2">
              <Clock className="h-4 w-4 text-[#234C6A]" />
              <span className="text-sm font-bold text-[#234C6A]">
                {interview.start_time}
              </span>
            </div>
            <Badge
              className={cn(
                "border-none px-3 py-1 rounded-xl text-[10px] font-black uppercase",
                interview.status === "scheduled"
                  ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100"
                  : "bg-[#456882]/10 text-[#456882]",
              )}
            >
              {interview.status}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-[#234C6A]/5"
            >
              <MoreVertical className="h-5 w-5 text-[#456882]" />
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[#234C6A]/10 pt-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-[#456882]">
            {interview.type === "video" ? (
              <Video className="h-4 w-4" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            <span className="font-bold capitalize tracking-tight">
              {interview.type} Interview
            </span>
          </div>
          <div className="flex items-center gap-3">
            {interview.status === "scheduled" && (
              <Button
                variant="outline"
                onClick={onReschedule}
                className="h-10 rounded-2xl border-[#234C6A]/20 text-xs font-black text-[#234C6A] hover:bg-[#234C6A]/5"
              >
                Reschedule
              </Button>
            )}
            {interview.meet_link && interview.status === "scheduled" && (
              <Button
                onClick={handleLaunchSession}
                className="h-10 rounded-2xl bg-[#234C6A] px-6 text-xs font-black text-white shadow-md transition-all hover:bg-[#456882] active:scale-95"
              >
                Launch Session
                <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
