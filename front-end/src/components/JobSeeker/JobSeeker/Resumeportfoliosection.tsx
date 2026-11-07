"use client";

import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ExternalLink, Mail, Briefcase, Upload } from "lucide-react";
import { useUploadFileMutation } from "@/src/redux/features/assets/assetsApi";
import { useOpenAsset } from "@/src/components/assets/SecureAssetLink";
import { toast } from "sonner";
import { ProfileFormValues } from "@/src/types";

interface ResumePortfolioSectionProps {
  editing: boolean;
  profileData: any;
}

const ResumePortfolioSection = memo(
  ({ editing, profileData }: ResumePortfolioSectionProps) => {
    const { register, setValue, watch } = useFormContext<ProfileFormValues>();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
    const { openAsset } = useOpenAsset();
    const selectedResume = watch("resume");
    const uploadResume = async (file?: File) => {
      if (!file) return;
      try {
        const result = await uploadFile({ file, kind: "resume" }).unwrap();
        setValue("resume", result.data.url, { shouldDirty: true, shouldValidate: true });
        toast.success("Resume stored securely. Save your profile to attach it.");
      } catch (error: any) { toast.error(error?.data?.message || error?.error || "Resume upload failed"); }
    };

    return (
      <Card className="p-8 border-[#516C83]/30 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#163B5C]/10 rounded-xl">
            <ExternalLink className="h-5 w-5 text-[#163B5C]" />
          </div>
          <h3 className="text-xl font-bold text-[#163B5C]">
            Documents & Professional Links
          </h3>
        </div>

        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#163B5C]">
                Resume (PDF or DOCX, max 10 MB)
              </label>
              <label className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-[#516C83]/30 bg-[#F6F8FB] px-4 text-sm font-semibold text-[#163B5C] focus-within:ring-2 focus-within:ring-[#163B5C]">
                <Upload className="h-4 w-4" /> {isUploading ? "Uploading securely..." : "Choose resume file"}
                <input type="file" className="sr-only" disabled={isUploading}
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => { void uploadResume(event.target.files?.[0]); event.target.value = ""; }} />
              </label>
              {selectedResume?.startsWith("asset:") && <p className="text-xs text-[#516C83]">Private document ready to save</p>}
              <label className="text-xs text-[#516C83]">Or keep an existing HTTPS resume link</label>
              <Input
                {...register("resume")}
                placeholder="https://..."
                className="border-[#516C83]/30 rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#163B5C]">
                Personal Website/Portfolio
              </label>
              <Input
                {...register("website")}
                placeholder="https://yourportfolio.com"
                className="border-[#516C83]/30 rounded-xl h-12"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Button
              variant="outline"
              onClick={() => { if (profileData?.resume?.resumeLink) void openAsset(profileData.resume.resumeLink); }}
              className="h-16 flex items-center justify-start gap-4 border-2 border-[#163B5C] text-[#163B5C] hover:bg-[#163B5C]/5 rounded-2xl group transition-all"
              disabled={!profileData?.resume?.resumeLink}
            >
              <div className="w-10 h-10 rounded-xl bg-[#163B5C] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">View Resume</p>
                <p className="text-xs text-[#516C83]">
                  {profileData?.resume?.resumeLink
                    ? (profileData.resume.resumeLink.startsWith("asset:") ? "Private file" : "External link")
                    : "No resume uploaded"}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                profileData?.portfolio &&
                window.open(profileData.portfolio, "_blank")
              }
              className="h-16 flex items-center justify-start gap-4 border-2 border-[#516C83] text-[#163B5C] hover:bg-[#516C83]/5 rounded-2xl group transition-all"
              disabled={!profileData?.portfolio}
            >
              <div className="w-10 h-10 rounded-xl bg-[#516C83] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">Portfolio Website</p>
                <p className="text-xs text-[#516C83]">
                  {profileData?.portfolio ? "Visit site" : "No link added"}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
            </Button>
          </div>
        )}
      </Card>
    );
  },
);

ResumePortfolioSection.displayName = "ResumePortfolioSection";
export default ResumePortfolioSection;
