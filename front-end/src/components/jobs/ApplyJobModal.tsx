"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Send,
  Loader2,
  FileText,
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useApplyToJobMutation } from "@/src/redux/features/applications/applicationsApi";
import {
  useGetSeekerProfileQuery,
  useUpdateSeekerProfileMutation,
} from "@/src/redux/features/seeker/seekerApi";
import { Checkbox } from "@/src/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/src/lib/utils";

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
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [shouldUpdateProfile, setShouldUpdateProfile] = useState(false);
  const [showBoostSection, setShowBoostSection] = useState(false);
  const [paidAmount, setPaidAmount] = useState<string>("");

  // API Queries and Mutations
  const { data: profileResponse } = useGetSeekerProfileQuery();
  const [updateSeekerProfile] = useUpdateSeekerProfileMutation();
  const [applyToJob, { isLoading }] = useApplyToJobMutation();

  const router = useRouter();
  const profile = (profileResponse as any)?.data;
  const currentResumeUrl = profile?.resume?.resumeLink || profile?.resume || "";
  const currentResumeName = profile?.resume?.resumeName || "My_Resume.pdf";

  const [isEditingResume, setIsEditingResume] = useState(false);

  // Initialize resume URL from profile
  useEffect(() => {
    if (currentResumeUrl && !resumeUrl) {
      setResumeUrl(currentResumeUrl);
    }
  }, [currentResumeUrl, resumeUrl]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeUrl) {
      toast.error("Resume URL is required");
      return;
    }

    if (coverLetter.length < 150) {
      toast.error("Cover letter must be at least 150 characters");
      return;
    }

    try {
      // Get current resume URL from nested structure
      const currentResumeUrl =
        profile?.resume?.resumeLink || profile?.resume || "";

      // Update profile if requested and changed
      if (shouldUpdateProfile && resumeUrl !== currentResumeUrl) {
        await updateSeekerProfile({
          resume: {
            resumeName: "My Resume",
            resumeLink: resumeUrl,
          },
        } as any).unwrap();
      }
      const res = (await applyToJob({
        job_id: jobId,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        paid_amount: paidAmount ? Number(paidAmount) : undefined,
      }).unwrap()) as any;
      if (res?.data?.checkoutData?.checkoutUrl) {
        window.location.href = res?.data?.checkoutData?.checkoutUrl;
      } else {
        toast.success("Application submitted successfully!");
        setOpen(false);
        router.push("/applied-successfully");
        setCoverLetter("");
        setResumeUrl("");
        setPaidAmount("");
        setShowBoostSection(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit application");
    }
  };

  const handleBoost = () => {
    setShowBoostSection(true);
  };

  const handleConfirmBoost = () => {
    if (!paidAmount || Number(paidAmount) <= 0) {
      toast.error("Please enter a valid amount to boost your ranking");
      return;
    }
    setShowBoostSection(false);
    toast.success(`Boost of $${paidAmount} added to your application!`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl font-semibold mb-4 group">
          <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
        <form onSubmit={handleApply} className="relative">
          {/* Top Section - Blurred when boosting */}
          <div
            className={cn(
              "transition-all duration-500",
              showBoostSection &&
                "blur-xl pointer-events-none opacity-30 scale-[0.98]",
            )}
          >
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] p-8 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight">
                  Apply for {jobTitle}
                </DialogTitle>
                <DialogDescription className="text-blue-100/80 font-medium">
                  at {companyName}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-8 pb-0 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-black text-[#234C6A] flex items-center gap-2 uppercase tracking-widest">
                    <LinkIcon className="h-4 w-4" />
                    Resume
                  </Label>

                  {resumeUrl === currentResumeUrl &&
                  currentResumeUrl &&
                  !isEditingResume ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 group/resume">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-green-900 line-clamp-1">
                            {currentResumeName}
                          </p>
                          <p className="text-[10px] font-bold text-green-700/70 uppercase tracking-wider">
                            Current resume on file
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingResume(true)}
                        className="text-green-700 hover:text-green-800 hover:bg-green-100 rounded-lg text-xs font-black"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Input
                        id="resume"
                        placeholder="Paste your latest resume URL"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="rounded-2xl border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]/10 h-14 font-medium"
                        required
                      />
                      {currentResumeUrl && (
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => {
                            setResumeUrl(currentResumeUrl);
                            setIsEditingResume(false);
                          }}
                          className="text-[10px] text-[#234C6A] h-auto p-0 font-black uppercase tracking-widest"
                        >
                          Cancel and use current resume
                        </Button>
                      )}
                    </div>
                  )}

                  {resumeUrl && currentResumeUrl !== resumeUrl && (
                    <div className="flex items-center gap-2 px-1 mt-1 animate-in fade-in duration-500">
                      <Checkbox
                        id="updateProfile"
                        checked={shouldUpdateProfile}
                        onCheckedChange={(checked) =>
                          setShouldUpdateProfile(!!checked)
                        }
                      />
                      <label
                        htmlFor="updateProfile"
                        className="text-[10px] text-[#456882] font-black uppercase tracking-widest cursor-pointer"
                      >
                        Update profile with this resume
                      </label>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="coverLetter"
                    className="text-sm font-black text-[#234C6A] flex items-center gap-2 uppercase tracking-widest"
                  >
                    <FileText className="h-4 w-4" />
                    Cover Letter
                  </Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Why are you a great fit? (Min 150 chars)"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="min-h-[180px] rounded-2xl border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]/10 p-5 leading-relaxed font-medium"
                    required
                  />
                  <div className="flex justify-between items-center px-1">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${coverLetter.length < 150 ? "text-red-500" : "text-emerald-500"}`}
                    >
                      {coverLetter.length < 150
                        ? `${150 - coverLetter.length} more needed`
                        : "Requirement met"}
                    </span>
                    <p className="text-[10px] font-black text-[#456882] uppercase tracking-widest">
                      {coverLetter.length} / 150 min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Boost Section - Not blurred when active */}
          <div className="px-8 py-6">
            <div
              className={cn(
                "p-6 rounded-[32px] border transition-all duration-500 relative overflow-hidden",
                showBoostSection
                  ? "bg-white shadow-2xl border-amber-200 scale-105 z-10"
                  : paidAmount
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100",
              )}
            >
              {showBoostSection ? (
                <div className="animate-in fade-in zoom-in-95 duration-300 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Sparkles className="h-6 w-6 text-amber-600 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#234C6A] uppercase tracking-widest">
                        Boost Ranking
                      </h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Bid for {profile?.name || "Candidate"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-[#234C6A] uppercase tracking-widest ml-1">
                      How much would you like to bid? ($)
                    </Label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">
                        $
                      </div>
                      <Input
                        type="number"
                        placeholder="50"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        className="h-12 pl-10 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-amber-400 focus:ring-amber-400/10 text-lg font-black text-[#234C6A]"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handleConfirmBoost}
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      Confirm Bid
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowBoostSection(false)}
                      className="h-12 px-4 rounded-xl font-black text-gray-400 uppercase tracking-widest text-[10px]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
                      paidAmount ? "bg-emerald-100" : "bg-amber-100",
                    )}
                  >
                    <Sparkles
                      className={cn(
                        "h-6 w-6",
                        paidAmount ? "text-emerald-600" : "text-amber-600",
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={cn(
                        "text-sm font-black uppercase tracking-widest",
                        paidAmount ? "text-emerald-900" : "text-amber-900",
                      )}
                    >
                      {paidAmount
                        ? "Application Boosted!"
                        : "Boost Your Application"}
                    </h4>
                    <p
                      className={cn(
                        "text-xs font-medium mt-1 mb-3",
                        paidAmount
                          ? "text-emerald-700/70"
                          : "text-amber-800/70",
                      )}
                    >
                      {paidAmount
                        ? `You've added $${paidAmount} to rank higher in the recruiter's view.`
                        : "Rank in the top section and get noticed 5x faster."}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBoost}
                      className={cn(
                        "w-full h-10 text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95",
                        paidAmount
                          ? "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          : "bg-white border-amber-200 text-amber-700 hover:bg-amber-100",
                      )}
                    >
                      {paidAmount ? "Edit Boost Amount" : "Boost My Ranking"}
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Blurred when boosting */}
          <div
            className={cn(
              "px-8 pb-8 transition-all duration-500",
              showBoostSection &&
                "blur-xl pointer-events-none opacity-30 scale-[0.98]",
            )}
          >
            <DialogFooter className="gap-3 sm:gap-0 pt-2 border-t border-gray-50 mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-xl h-14 px-8 text-[#456882] font-black uppercase tracking-widest text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-2xl h-14 px-10 bg-[#234C6A] text-white hover:bg-[#1a3a52] font-black text-sm shadow-xl shadow-blue-900/10 min-w-[180px] transition-all active:scale-95"
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
