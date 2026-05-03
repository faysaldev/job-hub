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
      const currentResumeUrl = profile?.resume?.resumeLink || profile?.resume || "";

      // Update profile if requested and changed
      if (shouldUpdateProfile && resumeUrl !== currentResumeUrl) {
        await updateSeekerProfile({
          resume: {
            resumeName: "My Resume",
            resumeLink: resumeUrl,
          },
        } as any).unwrap();
      }
      await applyToJob({
        job_id: jobId,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
      }).unwrap();

      toast.success("Application submitted successfully!");
      setOpen(false);
      setCoverLetter("");
      setResumeUrl("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit application");
    }
  };

  const handleBoost = () => {
    // Navigate to a payment/ranking page as requested
    router.push(`/applications/boost?jobId=${jobId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl font-semibold mb-4 group">
          <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Apply for {jobTitle}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              at {companyName}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleApply} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#234C6A] flex items-center gap-2">
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
                      <p className="text-sm font-bold text-green-900 line-clamp-1">
                        {currentResumeName}
                      </p>
                      <p className="text-[10px] text-green-700">
                        Current resume on file
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingResume(true)}
                    className="text-green-700 hover:text-green-800 hover:bg-green-100 rounded-lg text-xs font-bold"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input
                    id="resume"
                    placeholder="Paste your latest resume URL (e.g., Google Drive link)"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="rounded-xl border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]/10 h-12"
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
                      className="text-[10px] text-[#234C6A] h-auto p-0 font-bold"
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
                    className="text-[10px] text-[#456882] font-medium cursor-pointer"
                  >
                    Update my profile with this latest resume
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="coverLetter"
                className="text-sm font-semibold text-[#234C6A] flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Cover Letter (Min. 150 chars)
              </Label>
              <Textarea
                id="coverLetter"
                placeholder="Why are you a great fit for this role? (Minimum 150 characters)"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[150px] rounded-xl border-[#E3E3E3] focus:border-[#234C6A] focus:ring-[#234C6A]/10 p-4 leading-relaxed"
                required
              />
              <div className="flex justify-between items-center px-1">
                <span
                  className={`text-[10px] font-bold ${coverLetter.length < 150 ? "text-red-500" : "text-green-500"}`}
                >
                  {coverLetter.length < 150
                    ? `${150 - coverLetter.length} more characters needed`
                    : "Character limit met"}
                </span>
                <p className="text-[10px] text-[#456882]">
                  {coverLetter.length} / 150 minimum
                </p>
              </div>
            </div>
          </div>

          {/* Boost Application Section */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-900">
                  Boost Your Application
                </h4>
                <p className="text-xs text-amber-800/70 mb-3">
                  Rank your application in the top section and get noticed 5x faster by the recruiter.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBoost}
                  className="w-full bg-white border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 h-9 text-xs font-bold rounded-lg"
                >
                  Boost My Ranking
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl h-12 px-8 text-[#456882]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl h-12 px-8 bg-[#234C6A] text-white hover:bg-[#234C6A]/90 min-w-[140px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
