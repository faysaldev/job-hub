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
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Pitch-Black Hero Header */}
        <section className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8 text-white border border-neutral-800 shadow-xs">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
                <Shield className="h-3.5 w-3.5 text-neutral-400" />
                <span>Interview Calendar</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Recruitment Schedule
              </h1>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-neutral-400">
                Oversee candidate sessions, reschedule meetings, and launch video interviews.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Upcoming", value: upcomingInterviews.length },
                { label: "Complete", value: completedCount },
                { label: "Cancelled", value: cancelledCount },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-center"
                >
                  <p className="text-lg font-bold text-white">{item.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Stats */}
          <div className="space-y-4 lg:col-span-1">
            <Card className="rounded-2xl border border-neutral-800 bg-black p-5 text-white shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Scheduled Queue
              </p>
              <p className="text-2xl font-black mb-3">
                {upcomingInterviews.length}
              </p>
              <div className="space-y-2">
                {upcomingInterviews.slice(0, 3).map((interview: any) => (
                  <div
                    key={interview._id}
                    className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900 p-2.5"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300 shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {interview.start_time}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {interview.interviewee?.name || "Candidate"}
                      </p>
                    </div>
                  </div>
                ))}
                {!upcomingInterviews.length && (
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-neutral-400 text-center">
                    No scheduled sessions.
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                Status Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Scheduled",
                    count: upcomingInterviews.length,
                    color: "bg-black",
                  },
                  {
                    label: "Completed",
                    count: completedCount,
                    color: "bg-emerald-600",
                  },
                  {
                    label: "Cancelled",
                    count: cancelledCount,
                    color: "bg-neutral-300",
                  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                      <span className="text-neutral-600">{stat.label}</span>
                      <span className="text-neutral-900 font-bold">{stat.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
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
          <div className="space-y-4 lg:col-span-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#eaecf0] bg-white py-16 shadow-xs">
                <Loader2 className="h-6 w-6 animate-spin text-neutral-800" />
                <p className="mt-2 text-xs font-medium text-neutral-500">
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
              <Card className="rounded-2xl border border-dashed border-[#eaecf0] bg-white py-16 text-center shadow-xs">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                  <CalendarIcon className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-neutral-950">
                  No Interviews Scheduled
                </h3>
                <p className="mx-auto mt-1 max-w-xs text-xs text-neutral-500">
                  Your schedule is clear. Invitations will appear here once candidates confirm.
                </p>
              </Card>
            )}
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

  const initialDate = interview
    ? new Date(interview.date).toISOString().split("T")[0]
    : "";
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(interview?.start_time || "");
  const [endTime, setEndTime] = useState(interview?.end_time || "");

  useEffect(() => {
    if (interview) {
      setDate(new Date(interview.date).toISOString().split("T")[0]);
      setStartTime(interview.start_time || "");
      setEndTime(interview.end_time || "");
    }
  }, [interview]);

  const handleReschedule = async () => {
    if (!date || !startTime || !endTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all date and time fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await rescheduleInterview({
        interviewId: interview._id,
        date,
        start_time: startTime,
        end_time: endTime,
      }).unwrap();

      toast({
        title: "Success",
        description: "Interview rescheduled successfully.",
      });
      onClose();
    } catch (err: any) {
      toast({
        title: "Reschedule Failed",
        description:
          err?.data?.message ||
          "Could not reschedule interview. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl border border-[#eaecf0] bg-white p-0 overflow-hidden shadow-xl">
        <div className="bg-black p-5 text-white border-b border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              Reschedule Interview
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              New Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-9 rounded-xl border border-[#eaecf0] bg-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-9 rounded-xl border border-[#eaecf0] bg-white text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endTime" className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-9 rounded-xl border border-[#eaecf0] bg-white text-xs"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="bg-neutral-50 px-5 py-3 border-t border-neutral-100 gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 rounded-xl px-4 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={isLoading}
            className="h-8 rounded-xl bg-black px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
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
    <Card className="rounded-2xl border border-[#eaecf0] bg-white p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
            {interview.interviewee?.image ? (
              <img
                src={interview.interviewee.image}
                alt={interview.interviewee.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-500">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-neutral-950 truncate">
              {interview.job_id?.title || "Job Position"}
            </h3>
            <p className="text-xs text-neutral-500 truncate">
              Candidate:{" "}
              <span className="font-semibold text-neutral-900">
                {interview.interviewee?.name || "Candidate"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-md bg-[#f8fafc] px-2.5 py-1 text-xs font-medium text-neutral-700">
            <CalendarIcon className="h-3.5 w-3.5 text-neutral-400" />
            {new Date(interview.date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-[#f8fafc] px-2.5 py-1 text-xs font-medium text-neutral-700">
            <Clock className="h-3.5 w-3.5 text-neutral-400" />
            {interview.start_time}
          </span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
              interview.status === "scheduled"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-neutral-100 text-neutral-600 border border-neutral-200",
            )}
          >
            {interview.status}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-neutral-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          {interview.type === "video" ? (
            <Video className="h-3.5 w-3.5 text-neutral-400" />
          ) : (
            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
          )}
          <span className="font-medium capitalize">
            {interview.type} Interview
          </span>
        </div>
        <div className="flex items-center gap-2">
          {interview.status === "scheduled" && (
            <Button
              variant="outline"
              onClick={onReschedule}
              className="h-8 rounded-lg border-neutral-300 text-neutral-700 text-[10px] font-bold uppercase tracking-wider px-3 hover:bg-neutral-50"
            >
              Reschedule
            </Button>
          )}
          {interview.meet_link && interview.status === "scheduled" && (
            <Button
              onClick={handleLaunchSession}
              className="h-8 rounded-lg bg-black px-3.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
            >
              Launch Session
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
