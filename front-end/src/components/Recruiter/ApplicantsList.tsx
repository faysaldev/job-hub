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
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
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
  const { data: applications = [], isLoading } =
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
          color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
          icon: Clock,
          bgColor: "bg-blue-500",
        };
      case "under_review":
        return {
          label: "Under Review",
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
          icon: Eye,
          bgColor: "bg-yellow-500",
        };
      case "interview":
        return {
          label: "Interview",
          color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
          icon: Star,
          bgColor: "bg-purple-500",
        };
      case "hired":
        return {
          label: "Hired",
          color: "bg-green-500/10 text-green-600 border-green-500/30",
          icon: CheckCircle,
          bgColor: "bg-green-500",
        };
      case "rejected":
        return {
          label: "Rejected",
          color: "bg-red-500/10 text-red-600 border-red-500/30",
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
            className="h-24 w-full animate-pulse bg-gray-100 rounded-2xl border-none"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#234C6A]">Candidate Pipeline</h2>
          <p className="text-xs text-[#456882]">Manage and track your job applications</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-[#456882] font-semibold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
            <Filter className="h-4 w-4" />
            <span>{applications.length} Candidates</span>
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px] rounded-xl border-gray-100 bg-white font-bold text-[#234C6A] focus:ring-[#234C6A]/5">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
              <SelectItem value="all" className="rounded-lg">All Applicants</SelectItem>
              <SelectItem value="applied" className="rounded-lg text-blue-600 font-medium">New Applied</SelectItem>
              <SelectItem value="under_review" className="rounded-lg text-yellow-600 font-medium">Under Review</SelectItem>
              <SelectItem value="interview" className="rounded-lg text-purple-600 font-medium">In Interview</SelectItem>
              <SelectItem value="hired" className="rounded-lg text-green-600 font-medium">Hired</SelectItem>
              <SelectItem value="rejected" className="rounded-lg text-red-600 font-medium">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card className="p-12 text-center border-none bg-white shadow-sm rounded-3xl">
            <div className="mx-auto bg-[#234C6A]/5 w-20 h-20 rounded-3xl flex items-center justify-center mb-6">
              <User className="h-10 w-10 text-[#234C6A]" />
            </div>
            <h3 className="text-2xl font-bold text-[#234C6A] mb-2">
              No applications found
            </h3>
            <p className="text-[#456882] max-w-xs mx-auto leading-relaxed">
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
                className="group p-6 border-none bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 rounded-3xl relative overflow-hidden"
              >
                {/* Decorative Side Bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusConfig.bgColor} opacity-70`}
                />

                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                  <div className="flex gap-5 flex-1 w-full">
                    {/* Applicant Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white shadow-lg overflow-hidden">
                        {applicant?.image ? (
                          <img
                            src={applicant.image}
                            alt={applicant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold">
                            {applicant?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      {app.paid_amount > 0 && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                          <Star className="h-3 w-3 text-white fill-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-[#234C6A] truncate">
                          {applicant?.name}
                        </h3>
                        <Badge
                          className={`${statusConfig.color} border px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        {app.paid_amount > 0 && (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                            ${app.paid_amount} Boosted
                          </Badge>
                        )}
                      </div>

                      <p className="text-[#234C6A] font-semibold flex items-center gap-2 mb-3">
                        <Briefcase className="h-4 w-4 text-[#456882]" />
                        {job?.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#456882]">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{applicant?.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{job?.location || "Remote"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2 w-full lg:w-48">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 w-full border-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A] hover:text-white rounded-xl transition-all h-10 font-bold"
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

                    <div className="flex gap-2 flex-1 w-full">
                      {app.status === "applied" && (
                        <Button
                          size="sm"
                          className="flex-1 bg-[#234C6A] hover:bg-[#234C6A]/90 text-white rounded-xl h-10 font-bold"
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
                          className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl h-10 font-bold"
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
                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-6 animate-in slide-in-from-top-2 duration-300">
                    <div>
                      <h4 className="text-sm font-bold text-[#234C6A] mb-3 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Cover Letter
                      </h4>
                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 text-sm text-[#456882] leading-relaxed italic">
                        "{app.cover_letter}"
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        asChild
                        variant="secondary"
                        className="bg-[#234C6A]/5 hover:bg-[#234C6A]/10 text-[#234C6A] rounded-xl border-none font-bold"
                      >
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-4 w-4 mr-2" /> View Resume
                        </a>
                      </Button>
                    </div>

                    {app.status === "under_review" && (
                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-center justify-between">
                        <p className="text-sm text-yellow-800 font-medium">
                          This candidate is currently being reviewed.
                        </p>
                        <Button
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
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
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[28px] border-none shadow-2xl bg-white">
          <div className="relative p-8">
            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-bl-[100px] -z-10" />
            
            <DialogHeader className="mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4 text-red-600">
                <XCircle className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-bold text-[#234C6A]">
                Reject Candidate?
              </DialogTitle>
              <DialogDescription className="text-[#456882] text-base leading-relaxed">
                Provide a brief explanation for this decision. This note will be shared with the applicant to help them grow.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#234C6A] ml-1">Feedback Note</label>
                <Textarea
                  placeholder="e.g. We're looking for someone with more experience in high-load systems..."
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="min-h-[140px] rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#234C6A] focus:ring-4 focus:ring-[#234C6A]/5 p-4 text-sm transition-all resize-none"
                />
              </div>
            </div>

            <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => setIsRejectionModalOpen(false)}
                className="rounded-xl font-bold text-[#456882] hover:bg-gray-100 px-6"
              >
                Go Back
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 font-bold shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                onClick={() =>
                  selectedAppId &&
                  handleUpdateStatus(selectedAppId, "rejected", rejectionNote)
                }
                disabled={isUpdating}
              >
                {isUpdating ? "Processing..." : "Confirm Rejection"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantsList;
