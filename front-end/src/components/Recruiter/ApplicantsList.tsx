"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Clock,
  Eye,
  Star,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  useGetRecruiterApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "@/src/redux/features/applications/applicationsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useRouter } from "next/navigation";

const ApplicantsList = ({ userId }: { userId: string }) => {
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const router = useRouter();

  // API Hooks
  const { data: applications = [], isLoading, isError, error } =
    useGetRecruiterApplicationsQuery({
      status: selectedStatus === "all" ? undefined : selectedStatus,
    });
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateApplicationStatusMutation();

  const handleUpdateStatus = async (
    applicationId: string,
    status: string,
    note?: string,
  ) => {
    try {
      await updateStatus({
        applicationId,
        status: status as any,
        rejection_note: note,
      }).unwrap();

      toast.success(`Application updated to ${status}`);

      if (status === "under_review") {
        router.push("/recruiter/interviews");
      }

      setIsRejectionModalOpen(false);
      setRejectionNote("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "applied":
        return {
          label: "Applied",
          color: "bg-[#234C6A]/5 text-[#234C6A] border-[#234C6A]/15",
          icon: Clock,
          bgColor: "bg-[#234C6A]",
        };
      case "under_review":
        return {
          label: "Under Review",
          color: "bg-amber-50 text-amber-700 border-amber-100",
          icon: Eye,
          bgColor: "bg-amber-500",
        };
      case "interview":
        return {
          label: "Interview",
          color: "bg-indigo-50 text-indigo-700 border-indigo-100",
          icon: Star,
          bgColor: "bg-indigo-500",
        };
      case "hired":
        return {
          label: "Hired",
          color: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: CheckCircle,
          bgColor: "bg-emerald-500",
        };
      case "rejected":
        return {
          label: "Rejected",
          color: "bg-red-50 text-red-700 border-red-100",
          icon: XCircle,
          bgColor: "bg-red-500",
        };
      default:
        return {
          label: status,
          color: "bg-gray-500/10 text-gray-600 border-gray-500/30",
          icon: Clock,
          bgColor: "bg-gray-500",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-6"
          >
            <div className="flex animate-pulse gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[#E3E3E3]" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-2/5 rounded-full bg-[#E3E3E3]" />
                <div className="h-4 w-4/5 rounded-full bg-[#E3E3E3]" />
                <div className="h-4 w-3/5 rounded-full bg-[#E3E3E3]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h3 className="text-lg font-black text-red-700">
          Could not load applicants
        </h3>
        <p className="mt-2 text-sm font-medium text-red-600">
          {(error as any)?.data?.message ||
            "Please refresh the page and try again."}
        </p>
      </Card>
    );
  }

  const statusCounts = applications.reduce(
    (acc: Record<string, number>, app: any) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-[#234C6A]">
            Candidate Pipeline
          </h2>
          <p className="text-sm font-medium text-[#456882]">
            Manage and track your job applications
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <div className="flex items-center gap-2 rounded-2xl border border-[#234C6A]/10 bg-white px-4 py-3 text-sm font-black text-[#234C6A]">
            <Filter className="h-4 w-4" />
            <span>{applications.length} Candidates</span>
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-12 w-full rounded-2xl border-[#234C6A]/10 bg-white font-black text-[#234C6A] focus:ring-[#234C6A]/5 sm:w-[210px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-[#234C6A]/10 shadow-xl">
              <SelectItem value="all" className="rounded-lg font-medium">
                All Applicants
              </SelectItem>
              <SelectItem
                value="applied"
                className="rounded-lg font-medium text-[#234C6A]"
              >
                New Applied
              </SelectItem>
              <SelectItem
                value="under_review"
                className="rounded-lg font-medium text-amber-700"
              >
                Under Review
              </SelectItem>
              <SelectItem
                value="interview"
                className="rounded-lg font-medium text-indigo-700"
              >
                In Interview
              </SelectItem>
              <SelectItem
                value="hired"
                className="rounded-lg font-medium text-emerald-700"
              >
                Hired
              </SelectItem>
              <SelectItem
                value="rejected"
                className="rounded-lg font-medium text-red-700"
              >
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            { label: "Applied", value: statusCounts.applied || 0 },
            { label: "Review", value: statusCounts.under_review || 0 },
            { label: "Interview", value: statusCounts.interview || 0 },
            { label: "Hired", value: statusCounts.hired || 0 },
            { label: "Rejected", value: statusCounts.rejected || 0 },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#234C6A]/10 bg-white p-4"
            >
              <p className="text-2xl font-black text-[#234C6A]">
                {item.value}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#456882]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card className="rounded-3xl border border-dashed border-[#234C6A]/20 bg-[#F8FAFC] p-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#234C6A]/10">
              <User className="h-10 w-10 text-[#234C6A]" />
            </div>
            <h3 className="mb-2 text-2xl font-black text-[#234C6A]">
              No applications found
            </h3>
            <p className="mx-auto max-w-xs leading-relaxed text-[#456882]">
              Try adjusting your filters or wait for more candidates to apply.
            </p>
          </Card>
        ) : (
          applications.map((app: any) => {
            const statusConfig = getStatusConfig(app.status);
            const StatusIcon = statusConfig.icon;
            const applicant = app.applicant;
            const job = app.job_id;

            return (
              <Card
                key={app._id}
                className="group relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#234C6A]/25 hover:shadow-xl hover:shadow-[#234C6A]/10"
              >
                {/* Decorative Side Bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusConfig.bgColor} opacity-70`}
                />

                <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
                  <div className="flex w-full flex-1 gap-5">
                    {/* Applicant Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] text-white shadow-lg shadow-[#234C6A]/20">
                        {applicant?.image ? (
                          <img
                            src={applicant.image}
                            alt={applicant.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-black">
                            {applicant?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      {app.paid_amount > 0 && (
                        <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-amber-400 shadow-sm">
                          <Star className="h-3 w-3 text-white fill-white" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="truncate text-xl font-black tracking-tight text-[#234C6A]">
                          {applicant?.name}
                        </h3>
                        <Badge
                          className={`${statusConfig.color} rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        {app.paid_amount > 0 && (
                          <Badge className="rounded-full border-amber-200 bg-amber-50 text-[10px] font-black uppercase tracking-wider text-amber-700">
                            ${app.paid_amount} Boosted
                          </Badge>
                        )}
                      </div>

                      <p className="mb-4 flex items-center gap-2 font-black text-[#234C6A]">
                        <Briefcase className="h-4 w-4 text-[#456882]" />
                        {job?.title}
                      </p>

                      <div className="grid grid-cols-1 gap-3 text-xs font-semibold text-[#456882] sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-2xl bg-[#F8FAFC] px-3 py-2">
                          <Mail className="h-3.5 w-3.5 text-[#234C6A]" />
                          <span>{applicant?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl bg-[#F8FAFC] px-3 py-2">
                          <MapPin className="h-3.5 w-3.5 text-[#234C6A]" />
                          <span>{job?.location || "Remote"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full gap-2 lg:w-52 lg:flex-col">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-full flex-1 rounded-2xl border-[#234C6A]/20 font-black text-[#234C6A] transition-all hover:bg-[#234C6A]/5"
                      onClick={() =>
                        setExpandedAppId(
                          expandedAppId === app._id ? null : app._id,
                        )
                      }
                    >
                      {expandedAppId === app._id
                        ? "Hide Details"
                        : "View Application"}
                    </Button>

                    <div className="flex w-full flex-1 gap-2">
                      {app.status === "applied" && (
                        <Button
                          size="sm"
                          className="h-10 flex-1 rounded-2xl bg-[#234C6A] font-black text-white hover:bg-[#456882]"
                          onClick={() =>
                            handleUpdateStatus(app._id, "under_review")
                          }
                          disabled={isUpdating}
                        >
                          Review
                        </Button>
                      )}
                      {app.status !== "rejected" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 flex-1 rounded-2xl font-black text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => {
                            setSelectedAppId(app._id);
                            setIsRejectionModalOpen(true);
                          }}
                          disabled={isUpdating}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedAppId === app._id && (
                  <div className="animate-in slide-in-from-top-2 mt-6 space-y-6 border-t border-[#234C6A]/10 pt-6 duration-300">
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-[#234C6A]">
                        <MessageSquare className="h-4 w-4" /> Cover Letter
                      </h4>
                      <div className="rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-5 text-sm font-medium leading-relaxed text-[#456882]">
                        {app.cover_letter || "No cover letter provided."}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        asChild
                        variant="secondary"
                        className="rounded-2xl border-none bg-[#234C6A]/5 font-black text-[#234C6A] hover:bg-[#234C6A]/10"
                      >
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="mr-2 h-4 w-4" /> View Resume
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>

                    {app.status === "under_review" && (
                      <div className="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-medium text-amber-800">
                          This candidate is currently being reviewed.
                        </p>
                        <Button
                          size="sm"
                          className="rounded-2xl bg-amber-600 text-white hover:bg-amber-700"
                          onClick={() => router.push("/recruiter/interviews")}
                        >
                          Setup Interview
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Rejection Modal */}
      <Dialog
        open={isRejectionModalOpen}
        onOpenChange={setIsRejectionModalOpen}
      >
        <DialogContent className="overflow-hidden rounded-3xl border-none bg-white p-0 shadow-2xl sm:max-w-[500px]">
          <div className="relative p-8">
            {/* Subtle background accent */}
            <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-bl-[100px] bg-red-50/50" />

            <DialogHeader className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <XCircle className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-black text-[#234C6A]">
                Reject Candidate?
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed text-[#456882]">
                Provide a brief explanation for this decision. This note will be
                shared with the applicant to help them grow.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="ml-1 text-sm font-black text-[#234C6A]">
                  Feedback Note
                </label>
                <Textarea
                  placeholder="e.g. We're looking for someone with more experience in high-load systems..."
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="min-h-[140px] resize-none rounded-2xl border-[#234C6A]/10 bg-[#F8FAFC] p-4 text-sm transition-all focus:border-[#234C6A] focus:bg-white focus:ring-4 focus:ring-[#234C6A]/5"
                />
              </div>
            </div>

            <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => setIsRejectionModalOpen(false)}
                className="rounded-2xl px-6 font-black text-[#456882] hover:bg-[#234C6A]/5"
              >
                Go Back
              </Button>
              <Button
                className="rounded-2xl bg-red-600 px-8 font-black text-white shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5 hover:bg-red-700 active:translate-y-0"
                onClick={() =>
                  selectedAppId &&
                  handleUpdateStatus(selectedAppId, "rejected", rejectionNote)
                }
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantsList;
