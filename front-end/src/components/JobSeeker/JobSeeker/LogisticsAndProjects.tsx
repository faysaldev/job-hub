"use client";

import { memo } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Briefcase,
  Clock,
  Layers,
  Map,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Layout,
  Star,
} from "lucide-react";
import { ProfileFormValues } from "@/src/types";

export const LogisticsSection = memo(({ editing }: { editing: boolean }) => {
  const { register, watch } = useFormContext<ProfileFormValues>();
  const totalExperience = watch("totalExperience");
  const experienceLevel = watch("experienceLevel");
  const availability = watch("availability");
  const jobType = watch("jobType");

  return (
    <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#234C6A]/10 rounded-xl">
          <Layers className="h-5 w-5 text-[#234C6A]" />
        </div>
        <h3 className="text-xl font-bold text-[#234C6A]">Career Logistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Total Experience */}
        <div className="space-y-3">
          <label className="text-sm font-black text-[#456882] uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Total Experience
          </label>
          {editing ? (
            <Input
              {...register("totalExperience")}
              placeholder="e.g. 5+ Years"
              className="border-[#456882]/30 rounded-xl focus:ring-[#234C6A] h-12"
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold text-[#234C6A]">
              {totalExperience || "Not specified"}
            </div>
          )}
        </div>

        {/* Experience Level */}
        <div className="space-y-3">
          <label className="text-sm font-black text-[#456882] uppercase tracking-wider flex items-center gap-2">
            <Star className="h-4 w-4" /> Seniority Level
          </label>
          {editing ? (
            <select
              {...register("experienceLevel")}
              className="w-full h-12 px-4 border border-[#456882]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234C6A] bg-white text-[#234C6A] font-medium"
            >
              <option value="">Select Level</option>
              <option value="entry-level">Entry Level</option>
              <option value="mid-level">Mid Level</option>
              <option value="senior-level">Senior Level</option>
              <option value="expert">Expert / Principal</option>
            </select>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold text-[#234C6A] capitalize">
              {experienceLevel?.replace("-", " ") || "Not specified"}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <label className="text-sm font-black text-[#456882] uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4" /> Availability
          </label>
          {editing ? (
            <select
              {...register("availability")}
              className="w-full h-12 px-4 border border-[#456882]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234C6A] bg-white text-[#234C6A] font-medium"
            >
              <option value="">Select Availability</option>
              <option value="immediately">Immediately</option>
              <option value="1-week">1 Week</option>
              <option value="2-weeks">2 Weeks</option>
              <option value="1-month">1 Month</option>
            </select>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold text-[#234C6A] capitalize">
              {availability?.replace("-", " ") || "Not specified"}
            </div>
          )}
        </div>

        {/* Job Type */}
        <div className="space-y-3">
          <label className="text-sm font-black text-[#456882] uppercase tracking-wider flex items-center gap-2">
            <Map className="h-4 w-4" /> Job Preference
          </label>
          {editing ? (
            <select
              {...register("jobType")}
              className="w-full h-12 px-4 border border-[#456882]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#234C6A] bg-white text-[#234C6A] font-medium"
            >
              <option value="">Select Type</option>
              <option value="remote">Remote Only</option>
              <option value="onsite">On-site Only</option>
              <option value="hybrid">Hybrid</option>
            </select>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold text-[#234C6A] capitalize">
              {jobType || "Not specified"}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});
LogisticsSection.displayName = "LogisticsSection";

export const ProjectsSection = memo(({ editing }: { editing: boolean }) => {
  const { register, control } = useFormContext<ProfileFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "recentProjects",
  });

  return (
    <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#234C6A]/10 rounded-xl">
            <Layout className="h-5 w-5 text-[#234C6A]" />
          </div>
          <h3 className="text-xl font-bold text-[#234C6A]">Recent Projects</h3>
        </div>
        {editing && (
          <Button
            type="button"
            onClick={() =>
              append({ project_name: "", description: "", live_url: "" })
            }
            className="bg-[#234C6A] hover:bg-[#456882] rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative p-6 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:border-blue-100 hover:shadow-md"
          >
            {editing && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}

            <div className="space-y-4">
              {editing ? (
                <>
                  <Input
                    {...register(`recentProjects.${index}.project_name`)}
                    placeholder="Project Name"
                    className="font-bold text-lg border-[#456882]/30"
                  />
                  <textarea
                    {...register(`recentProjects.${index}.description`)}
                    placeholder="Brief project description..."
                    className="w-full p-3 text-sm border border-[#456882]/30 rounded-xl focus:ring-[#234C6A] h-24 bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    <Input
                      {...register(`recentProjects.${index}.live_url`)}
                      placeholder="https://..."
                      className="text-sm border-[#456882]/30"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-black text-[#234C6A]">
                      {field.project_name}
                    </h4>
                    {field.live_url && (
                      <a
                        href={field.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white rounded-lg shadow-sm text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-[#456882] text-sm leading-relaxed">
                    {field.description}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}

        {fields.length === 0 && !editing && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <Layout className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No projects added yet.</p>
          </div>
        )}
      </div>
    </Card>
  );
});
ProjectsSection.displayName = "ProjectsSection";

export const SocialLinksSection = memo(({ editing }: { editing: boolean }) => {
  const { register, watch } = useFormContext<ProfileFormValues>();
  const linkedin = watch("socialProfiles.linkedin");
  const github = watch("socialProfiles.github");
  const twitter = watch("socialProfiles.twitter");

  return (
    <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#234C6A]/10 rounded-xl">
          <Github className="h-5 w-5 text-[#234C6A]" />
        </div>
        <h3 className="text-xl font-bold text-[#234C6A]">Online Presence</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Linkedin className="h-4 w-4 text-[#0A66C2]" />
            <span className="text-xs font-black text-[#456882] uppercase">LinkedIn</span>
          </div>
          {editing ? (
            <Input
              {...register("socialProfiles.linkedin")}
              placeholder="LinkedIn Profile URL"
              className="border-[#456882]/30 rounded-xl h-12"
            />
          ) : (
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              <span className="text-sm font-medium text-[#234C6A] truncate">
                {linkedin || "Not linked"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Github className="h-4 w-4 text-[#181717]" />
            <span className="text-xs font-black text-[#456882] uppercase">GitHub</span>
          </div>
          {editing ? (
            <Input
              {...register("socialProfiles.github")}
              placeholder="GitHub Profile URL"
              className="border-[#456882]/30 rounded-xl h-12"
            />
          ) : (
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              <span className="text-sm font-medium text-[#234C6A] truncate">
                {github || "Not linked"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Twitter className="h-4 w-4 text-[#1DA1F2]" />
            <span className="text-xs font-black text-[#456882] uppercase">Twitter / X</span>
          </div>
          {editing ? (
            <Input
              {...register("socialProfiles.twitter")}
              placeholder="Twitter Profile URL"
              className="border-[#456882]/30 rounded-xl h-12"
            />
          ) : (
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              <span className="text-sm font-medium text-[#234C6A] truncate">
                {twitter || "Not linked"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});
SocialLinksSection.displayName = "SocialLinksSection";
