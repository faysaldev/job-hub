import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Filter,
  Briefcase,
  GraduationCap,
  DollarSign,
  RotateCcw,
} from "lucide-react";

interface JobFilterProps {
  jobTypes: { id: string; label: string; checked: boolean }[];
  experienceLevels: { id: string; label: string; checked: boolean }[];
  salaryRanges: { id: string; label: string; checked: boolean }[];
  onJobTypeChange: (id: string) => void;
  onExperienceChange: (id: string) => void;
  onSalaryChange: (id: string) => void;
}

const JobFilters = ({
  jobTypes,
  experienceLevels,
  salaryRanges,
  onJobTypeChange,
  onExperienceChange,
  onSalaryChange,
}: JobFilterProps) => {
  const handleResetFilters = () => {
    jobTypes.forEach((type) => {
      if (!type.checked) onJobTypeChange(type.id);
    });
    experienceLevels.forEach((level) => {
      if (!level.checked) onExperienceChange(level.id);
    });
    salaryRanges.forEach((range) => {
      if (!range.checked) onSalaryChange(range.id);
    });
  };

  return (
    <Card className="border-none bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5 border-b border-[#E3E3E3]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-[#234C6A]">Filters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#456882] hover:text-[#234C6A] hover:bg-[#234C6A]/10 text-xs"
            onClick={handleResetFilters}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Job Type */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-[#234C6A]" />
            <h4 className="text-sm font-semibold text-[#234C6A]">Job Type</h4>
          </div>
          <div className="space-y-3">
            {jobTypes.map((type) => (
              <label
                key={type.id}
                className="flex items-center gap-3 text-sm text-[#456882] cursor-pointer group"
              >
                <Checkbox
                  checked={type.checked}
                  onCheckedChange={() => onJobTypeChange(type.id)}
                  className="border-[#234C6A]/30 data-[state=checked]:bg-[#234C6A] data-[state=checked]:border-[#234C6A]"
                />
                <span className="group-hover:text-[#234C6A] transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E3E3E3]" />

        {/* Experience Level */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-[#234C6A]" />
            <h4 className="text-sm font-semibold text-[#234C6A]">
              Experience Level
            </h4>
          </div>
          <div className="space-y-3">
            {experienceLevels.map((level) => (
              <label
                key={level.id}
                className="flex items-center gap-3 text-sm text-[#456882] cursor-pointer group"
              >
                <Checkbox
                  checked={level.checked}
                  onCheckedChange={() => onExperienceChange(level.id)}
                  className="border-[#234C6A]/30 data-[state=checked]:bg-[#234C6A] data-[state=checked]:border-[#234C6A]"
                />
                <span className="group-hover:text-[#234C6A] transition-colors">
                  {level.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E3E3E3]" />

        {/* Salary Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-[#234C6A]" />
            <h4 className="text-sm font-semibold text-[#234C6A]">
              Salary Range
            </h4>
          </div>
          <div className="space-y-3">
            {salaryRanges.map((range) => (
              <label
                key={range.id}
                className="flex items-center gap-3 text-sm text-[#456882] cursor-pointer group"
              >
                <Checkbox
                  checked={range.checked}
                  onCheckedChange={() => onSalaryChange(range.id)}
                  className="border-[#234C6A]/30 data-[state=checked]:bg-[#234C6A] data-[state=checked]:border-[#234C6A]"
                />
                <span className="group-hover:text-[#234C6A] transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobFilters;
