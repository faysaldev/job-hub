import { Filter } from "lucide-react";

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
  return (
    <aside className="w-full md:w-64 space-y-6 p-6 bg-[#E3E3E3]/50 rounded-xl">
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-[#234C6A]">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-[#234C6A]">Job Type</h4>
            <div className="space-y-2">
              {jobTypes.map((type) => (
                <label key={type.id} className="flex items-center gap-2 text-sm text-[#234C6A] cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-[#234C6A]/30 focus:ring-[#234C6A]" 
                    checked={type.checked}
                    onChange={() => onJobTypeChange(type.id)}
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-[#234C6A]">
              Experience Level
            </h4>
            <div className="space-y-2">
              {experienceLevels.map((level) => (
                <label key={level.id} className="flex items-center gap-2 text-sm text-[#234C6A] cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-[#234C6A]/30 focus:ring-[#234C6A]" 
                    checked={level.checked}
                    onChange={() => onExperienceChange(level.id)}
                  />
                  {level.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-[#234C6A]">Salary Range</h4>
            <div className="space-y-2">
              {salaryRanges.map((range) => (
                <label key={range.id} className="flex items-center gap-2 text-sm text-[#234C6A] cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-[#234C6A]/30 focus:ring-[#234C6A]" 
                    checked={range.checked}
                    onChange={() => onSalaryChange(range.id)}
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default JobFilters;