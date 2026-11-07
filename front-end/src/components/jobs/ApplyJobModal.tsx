"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import {
  Send,
  Loader2,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { useApplyToJobMutation } from "@/src/redux/features/applications/applicationsApi";
import { useUploadFileMutation } from "@/src/redux/features/assets/assetsApi";
import {
  useGetSeekerProfileQuery,
} from "@/src/redux/features/seeker/seekerApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/hooks/useAuth";
import { useAppSelector } from "@/src/redux/hooks";
import {
  selectAppliedJobIds,
  selectSavedJobIds,
} from "@/src/redux/features/generals/generalsSlice";

interface ApplyJobModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export default function ApplyJobModal({
  jobId,
  jobTitle,
  companyName,
}: ApplyJobModalProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const appliedJobIds = useAppSelector(selectAppliedJobIds);
  const savedJobIds = useAppSelector(selectSavedJobIds);
  const isApplied = appliedJobIds?.includes(jobId);
  const isSaved = savedJobIds?.includes(jobId);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [boostSelected, setBoostSelected] = useState(false);

  // API Queries and Mutations
  const { data: profileResponse } = useGetSeekerProfileQuery(undefined, { skip: !isAuthenticated });
  const [applyToJob, { isLoading }] = useApplyToJobMutation();
  const [uploadFile, { isLoading: isUploadingResume }] = useUploadFileMutation();
  const [uploadedResumeName, setUploadedResumeName] = useState("");
  const handleResumeFile = async (file?: File) => {
    if (!file) return;
    try {
      const uploaded = await uploadFile({ file, kind: "resume" }).unwrap();
      setResumeUrl(uploaded.data.url);
      setUploadedResumeName(uploaded.data.fileName);
      toast.success("Resume uploaded privately");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.error || "Unable to upload resume");
    }
  };

  const router = useRouter();
  const profile = (profileResponse as any)?.data;
  const currentResumeUrl = profile?.resume?.resumeLink || profile?.resume || "";
  const currentResumeName = profile?.resume?.resumeName || "My_Resume.pdf";

  // Initialize resume URL from profile
  useEffect(() => {
    if (currentResumeUrl && !resumeUrl) {
      setResumeUrl(currentResumeUrl);
    }
  }, [currentResumeUrl, resumeUrl]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeUrl) {
      toast.error("Upload a resume or select one from your profile");
      return;
    }

    if (coverLetter.length < 150) {
      toast.error("Cover letter must be at least 150 characters");
      return;
    }

    if (coverLetter.length > 1300) {
      toast.error("Cover letter must not exceed 1300 characters");
      return;
    }

    try {
      const res = (await applyToJob({
        job_id: jobId,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        boost: boostSelected,
      }).unwrap()) as any;
      if (res?.data?.checkoutData?.checkoutUrl) {
        window.location.href = res?.data?.checkoutData?.checkoutUrl;
      } else {
        if (res?.data?.paymentUnavailable) {
          toast.warning("Application submitted, but the optional payment is unavailable.");
        } else toast.success("Application submitted successfully!");
        setOpen(false);
        router.push("/applied-successfully");
        setCoverLetter("");
        setResumeUrl("");
        setBoostSelected(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit application");
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job.");
      router.push("/auth");
      return;
    }
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={handleApplyClick}
        disabled={isApplied}
        className={cn(
          "w-full h-10 rounded-xl font-bold uppercase tracking-wider text-xs mb-3 group transition-all",
          isApplied
            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            : "bg-black hover:bg-neutral-800 text-white shadow-xs"
        )}
      >
        <Send className="h-3.5 w-3.5 mr-2 group-hover:translate-x-0.5 transition-transform" />
        {isApplied ? "Already Applied" : "Apply Now"}
      </Button>
      <DialogContent className="w-[95vw] sm:max-w-[600px] bg-white rounded-2xl border border-[#eaecf0] shadow-xl p-0 overflow-hidden">
        <form onSubmit={handleApply} className="relative">
          <div className="bg-black p-6 text-white border-b border-neutral-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tight flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="break-words max-w-full">Apply for {jobTitle}</span>
                {isSaved && (
                  <span className="w-fit flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-200">
                    ★ Saved
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="text-neutral-400 text-xs font-medium break-words">
                at {companyName}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-5 max-h-[50vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-900 flex items-center gap-2 uppercase tracking-wider">
                  <LinkIcon className="h-3.5 w-3.5" />
                  Resume
                </Label>

                {resumeUrl ? (
                  <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 w-full min-w-0">
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-emerald-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-emerald-900 truncate">
                          {uploadedResumeName || currentResumeName}
                        </p>
                        <p className="text-[10px] font-semibold text-emerald-700/80 uppercase tracking-wider truncate">
                          Current resume on file
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 w-full min-w-0">
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <div className="w-9 h-9 rounded-lg bg-neutral-200 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-neutral-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          No Resume Uploaded
                        </p>
                        <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider truncate">
                          Choose a PDF or DOCX file below
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 transition-colors">
                  <FileText className="h-3.5 w-3.5" /> {isUploadingResume ? "Uploading..." : "Upload or replace resume"}
                  <input
                    type="file"
                    className="sr-only"
                    disabled={isUploadingResume}
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) => {
                      void handleResumeFile(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="coverLetter"
                  className="text-xs font-bold text-neutral-900 flex items-center gap-2 uppercase tracking-wider"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Cover Letter
                </Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Why are you a great fit? (Min 150 chars, Max 1300 chars)"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  maxLength={1300}
                  className="min-h-[140px] max-h-[200px] overflow-y-auto rounded-xl border-[#eaecf0] focus:border-black focus:ring-black/10 p-4 leading-relaxed text-xs sm:text-sm"
                  required
                />
                <div className="flex justify-between items-center px-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      coverLetter.length < 150
                        ? "text-red-500"
                        : coverLetter.length > 1300
                          ? "text-red-500"
                          : "text-emerald-600"
                    }`}
                  >
                    {coverLetter.length < 150
                      ? `${150 - coverLetter.length} more chars needed`
                      : coverLetter.length > 1300
                        ? "Limit exceeded"
                        : "Requirement met"}
                  </span>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {coverLetter.length} / 1300 max
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optional highlight checkout */}
          <div className="px-6 py-3 border-t border-neutral-100">
            <label className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-[#f8fafc] p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={boostSelected}
                onChange={(event) => setBoostSelected(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-black rounded"
              />
              <span>
                <span className="block text-xs font-bold text-neutral-900">Optional application highlight</span>
                <span className="block text-[11px] text-neutral-500 mt-0.5">
                  Direct highlight charged after Stripe checkout. Does not guarantee an interview.
                </span>
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100">
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-xl h-9 px-4 text-neutral-600 hover:text-black font-bold uppercase tracking-wider text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || coverLetter.length < 150 || coverLetter.length > 1300 || !resumeUrl}
                className="rounded-xl h-9 px-5 bg-black text-white hover:bg-neutral-800 font-bold uppercase tracking-wider text-xs shadow-xs min-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Submit Application
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
