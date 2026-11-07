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
          "w-full h-12 rounded-xl font-semibold mb-4 group transition-all",
          isApplied
            ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:from-transparent hover:to-transparent"
            : "bg-gradient-to-r from-[#163B5C] to-[#516C83] hover:from-[#163B5C]/90 hover:to-[#516C83]/90 text-white"
        )}
      >
        <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
        {isApplied ? "Already Applied" : "Apply Now"}
      </Button>
      <DialogContent className="w-[95vw] sm:max-w-[620px] md:max-w-[680px] bg-white rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
        <form onSubmit={handleApply} className="relative">
          {/* Top Section - Blurred when boosting */}
          <div
            className="transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-[#163B5C] to-[#516C83] p-8 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="break-words max-w-full">Apply for {jobTitle}</span>
                  {isSaved && (
                    <span className="w-fit flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white">
                      ★ Saved
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-blue-100/80 font-medium break-words">
                  at {companyName}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-8 pb-0 space-y-6 max-h-[45vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-black text-[#163B5C] flex items-center gap-2 uppercase tracking-widest">
                    <LinkIcon className="h-4 w-4" />
                    Resume
                  </Label>

                  {resumeUrl ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 group/resume w-full min-w-0">
                      <div className="flex items-center gap-3 min-w-0 w-full">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-green-900 truncate">
                            {uploadedResumeName || currentResumeName}
                          </p>
                          <p className="text-[10px] font-bold text-green-700/70 uppercase tracking-wider truncate">
                            Current resume on file
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in duration-300 w-full min-w-0">
                      <div className="flex items-center gap-3 min-w-0 w-full">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-red-900 truncate">
                            No Resume Uploaded
                          </p>
                          <p className="text-[10px] font-bold text-red-700/70 uppercase tracking-wider truncate">
                            Choose a PDF or DOCX file below
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#163B5C]/20 bg-white px-4 py-2 text-sm font-semibold text-[#163B5C] focus-within:ring-2 focus-within:ring-[#163B5C]">
                    <FileText className="h-4 w-4" /> {isUploadingResume ? "Uploading..." : "Upload or replace resume"}
                    <input type="file" className="sr-only" disabled={isUploadingResume}
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(event) => { void handleResumeFile(event.target.files?.[0]); event.target.value = ""; }} />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="coverLetter"
                    className="text-sm font-black text-[#163B5C] flex items-center gap-2 uppercase tracking-widest"
                  >
                    <FileText className="h-4 w-4" />
                    Cover Letter
                  </Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Why are you a great fit? (Min 150 chars, Max 1300 chars)"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    maxLength={1300}
                    className="min-h-[180px] max-h-[220px] overflow-y-auto rounded-2xl border-[#E1E8EF] focus:border-[#163B5C] focus:ring-[#163B5C]/10 p-5 leading-relaxed font-medium"
                    required
                  />
                  <div className="flex justify-between items-center px-1">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        coverLetter.length < 150
                          ? "text-red-500"
                          : coverLetter.length > 1300
                            ? "text-red-500"
                            : "text-emerald-500"
                      }`}
                    >
                      {coverLetter.length < 150
                        ? `${150 - coverLetter.length} more needed`
                        : coverLetter.length > 1300
                          ? "Limit exceeded"
                          : "Requirement met"}
                    </span>
                    <p className="text-[10px] font-black text-[#516C83] uppercase tracking-widest">
                      {coverLetter.length} / 1300 max
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional, server-priced checkout; no bids or ranking guarantees. */}
          <div className="px-8 py-5">
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 cursor-pointer">
              <input type="checkbox" checked={boostSelected} onChange={(event) => setBoostSelected(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#163B5C]" />
              <span>
                <span className="block text-sm font-semibold text-[#163B5C]">Optional application highlight</span>
                <span className="block text-xs text-slate-600 mt-1">Only charged after confirmed Stripe checkout at the server-set price. It does not guarantee an interview or an offer.</span>
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <DialogFooter className="gap-3 sm:gap-0 pt-2 border-t border-gray-50 mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-xl h-14 px-8 text-[#516C83] font-black uppercase tracking-widest text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || coverLetter.length < 150 || coverLetter.length > 1300 || !resumeUrl}
                className="rounded-2xl h-14 px-10 bg-[#163B5C] text-white hover:bg-[#0C2C48] font-black text-sm shadow-xl shadow-blue-900/10 min-w-[180px] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
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
