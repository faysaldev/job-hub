"use client";

import { memo, useRef, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Sparkles, Plus, X } from "lucide-react";
import { ProfileFormValues } from "@/src/types";

interface SkillsSectionProps {
  editing: boolean;
  profileSkills: string[];
}

const SkillsSection = memo(({ editing, profileSkills }: SkillsSectionProps) => {
  const { getValues, setValue } = useFormContext<ProfileFormValues>();
  const skillInputRef = useRef<HTMLInputElement>(null);

  // Only watch skills when editing to avoid re-renders in view mode
  const watchedSkills = useWatch({ name: "skills", defaultValue: [] });

  const addSkill = useCallback(() => {
    const value = skillInputRef.current?.value.trim();
    const currentSkills = getValues("skills") || [];
    if (value && !currentSkills.includes(value)) {
      setValue("skills", [...currentSkills, value], { shouldDirty: true });
      if (skillInputRef.current) skillInputRef.current.value = "";
    }
  }, [getValues, setValue]);

  const removeSkill = useCallback(
    (index: number) => {
      const currentSkills = getValues("skills") || [];
      setValue(
        "skills",
        currentSkills.filter((_, i) => i !== index),
        { shouldDirty: true },
      );
    },
    [getValues, setValue],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    },
    [addSkill],
  );

  return (
    <Card className="p-8 border-[#456882]/30 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#234C6A]/10 rounded-xl">
          <Sparkles className="h-5 w-5 text-[#234C6A]" />
        </div>
        <h3 className="text-xl font-bold text-[#234C6A]">Skills & Expertise</h3>
      </div>

      {editing ? (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {watchedSkills?.map((skill: string, index: number) => (
              <Badge
                key={`${skill}-${index}`}
                className="px-4 py-2 text-sm bg-gradient-to-r from-[#234C6A] to-[#456882] text-white border-none shadow-md flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="hover:text-red-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-3">
            <Input
              ref={skillInputRef}
              placeholder="Add a skill (e.g. React, UI Design)"
              className="flex-1 border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A] h-12 rounded-xl"
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              onClick={addSkill}
              className="bg-[#234C6A] hover:bg-[#456882] h-12 px-6 rounded-xl"
            >
              <Plus className="h-5 w-5 mr-1" /> Add
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {profileSkills?.length > 0 ? (
            profileSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-5 py-2.5 text-base bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20 border-none rounded-xl"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-[#456882] italic">No skills added yet.</p>
          )}
        </div>
      )}
    </Card>
  );
});

SkillsSection.displayName = "SkillsSection";
export default SkillsSection;
