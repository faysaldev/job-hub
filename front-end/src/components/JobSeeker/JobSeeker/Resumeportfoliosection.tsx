"use client";

import { memo } from "react";
import { useFormContext } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ExternalLink, Mail, Briefcase } from "lucide-react";
import { ProfileFormValues } from "@/src/types";

interface ResumePortfolioSectionProps {
  editing: boolean;
  profileData: any;
}

const ResumePortfolioSection = memo(
  ({ editing, profileData }: ResumePortfolioSectionProps) => {
    const { register, watch } = useFormContext<ProfileFormValues>();

    return (
      <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#234C6A]/10 rounded-xl">
            <ExternalLink className="h-5 w-5 text-[#234C6A]" />
          </div>
          <h3 className="text-xl font-bold text-[#234C6A]">
            Documents & Professional Links
          </h3>
        </div>

        {editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#234C6A]">
                Resume URL (Google Drive/Dropbox)
              </label>
              <Input
                {...register("resume")}
                placeholder="https://..."
                className="border-[#456882]/30 rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#234C6A]">
                Personal Website/Portfolio
              </label>
              <Input
                {...register("website")}
                placeholder="https://yourportfolio.com"
                className="border-[#456882]/30 rounded-xl h-12"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              variant="outline"
              onClick={() =>
                profileData?.resume?.resumeLink &&
                window.open(profileData.resume.resumeLink, "_blank")
              }
              className="h-16 flex items-center justify-start gap-4 border-2 border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/5 rounded-2xl group transition-all"
              disabled={!profileData?.resume?.resumeLink}
            >
              <div className="w-10 h-10 rounded-xl bg-[#234C6A] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">View Resume</p>
                <p className="text-xs text-[#456882]">
                  {profileData?.resume?.resumeLink
                    ? "External Link"
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
              className="h-16 flex items-center justify-start gap-4 border-2 border-[#456882] text-[#234C6A] hover:bg-[#456882]/5 rounded-2xl group transition-all"
              disabled={!profileData?.portfolio}
            >
              <div className="w-10 h-10 rounded-xl bg-[#456882] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">Portfolio Website</p>
                <p className="text-xs text-[#456882]">
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
