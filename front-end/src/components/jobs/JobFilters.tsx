"use client";

import { useState } from "react";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
  count?: number;
}

interface JobFilterProps {
  jobTypes: FilterOption[];
  experienceLevels: FilterOption[];
  salaryRanges: FilterOption[];
  onJobTypeChange: (id: string) => void;
  onExperienceChange: (id: string) => void;
  onSalaryChange: (id: string) => void;

  categories?: FilterOption[];
  subcategories?: FilterOption[];
  companySizeFilters?: FilterOption[];
  postedDateFilters?: FilterOption[];
  applicantCountFilters?: FilterOption[];
  onCategoryChange?: (id: string) => void;
  onSubcategoryChange?: (id: string) => void;
  onCompanySizeChange?: (id: string) => void;
  onPostedDateChange?: (id: string) => void;
  onApplicantCountChange?: (id: string) => void;

  selectedCategory?: string;
  selectedSubcategory?: string;
  onClearCategory?: () => void;
  onClearSubcategory?: () => void;
  onResetAllFilters?: () => void;
  activeFilterCount?: number;
}

export default function JobFilters({
  jobTypes,
  experienceLevels,
  salaryRanges,
  onJobTypeChange,
  onExperienceChange,
  onSalaryChange,
  categories,
  onCategoryChange,
  onResetAllFilters,
}: JobFilterProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "employment",
    "seniority",
    "salary",
    "category",
  ]);

  const [minSalary, setMinSalary] = useState("10000");
  const [maxSalary, setMaxSalary] = useState("500000");

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const isExpanded = (id: string) => expandedSections.includes(id);

  const handleReset = () => {
    if (onResetAllFilters) {
      onResetAllFilters();
    } else {
      jobTypes.forEach((t) => {
        if (!t.checked) onJobTypeChange(t.id);
      });
      experienceLevels.forEach((e) => {
        if (!e.checked) onExperienceChange(e.id);
      });
      salaryRanges.forEach((s) => {
        if (!s.checked) onSalaryChange(s.id);
      });
    }
  };

  const handleApplySalary = () => {
    if (salaryRanges.length > 0) {
      onSalaryChange(salaryRanges[0].id);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Type of Employment Accordion */}
      <div className="border-b border-[#eaecf0] pb-4">
        <button
          type="button"
          onClick={() => toggleSection("employment")}
          className="flex w-full items-center justify-between py-1 text-left"
        >
          <span className="text-[12.5px] font-bold text-[#111827]">Type of Employment</span>
          {isExpanded("employment") ? (
            <ChevronUp size={14} className="text-neutral-500" />
          ) : (
            <ChevronDown size={14} className="text-neutral-500" />
          )}
        </button>

        {isExpanded("employment") && (
          <div className="mt-2.5 space-y-1.5">
            {jobTypes.map((type) => {
              const count = type.count ?? (type.id === "full-time" ? 159 : type.id === "part-time" ? 38 : type.id === "freelance" ? 50 : 15);
              return (
                <label
                  key={type.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg py-1 px-1 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={type.checked}
                      onCheckedChange={() => onJobTypeChange(type.id)}
                      className="rounded-[4px] size-3.5 border-neutral-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <span className="text-[11.5px] font-medium text-neutral-700">{type.label}</span>
                  </div>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      type.checked
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Seniority Level Accordion */}
      <div className="border-b border-[#eaecf0] pb-4">
        <button
          type="button"
          onClick={() => toggleSection("seniority")}
          className="flex w-full items-center justify-between py-1 text-left"
        >
          <span className="text-[12.5px] font-bold text-[#111827]">Seniority Level</span>
          {isExpanded("seniority") ? (
            <ChevronUp size={14} className="text-neutral-500" />
          ) : (
            <ChevronDown size={14} className="text-neutral-500" />
          )}
        </button>

        {isExpanded("seniority") && (
          <div className="mt-2.5 space-y-1.5">
            {experienceLevels.map((lvl) => {
              const count = lvl.count ?? (lvl.id === "entry" ? 48 : lvl.id === "junior" ? 51 : lvl.id === "mid" ? 150 : lvl.id === "senior" ? 30 : 20);
              return (
                <label
                  key={lvl.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg py-1 px-1 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={lvl.checked}
                      onCheckedChange={() => onExperienceChange(lvl.id)}
                      className="rounded-[4px] size-3.5 border-neutral-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <span className="text-[11.5px] font-medium text-neutral-700">{lvl.label}</span>
                  </div>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      lvl.checked
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Salary Range Accordion with Slider and Min/Max boxes */}
      <div className="border-b border-[#eaecf0] pb-4">
        <button
          type="button"
          onClick={() => toggleSection("salary")}
          className="flex w-full items-center justify-between py-1 text-left"
        >
          <span className="text-[12.5px] font-bold text-[#111827]">Salary Range</span>
          {isExpanded("salary") ? (
            <ChevronUp size={14} className="text-neutral-500" />
          ) : (
            <ChevronDown size={14} className="text-neutral-500" />
          )}
        </button>

        {isExpanded("salary") && (
          <div className="mt-3 space-y-3">
            {/* Range Slider Track */}
            <div className="relative py-1.5">
              <div className="h-1 w-full rounded-full bg-neutral-200" />
              <div className="absolute top-1.5 left-[10%] right-[30%] h-1 rounded-full bg-black" />
              <div className="absolute top-0.5 left-[10%] h-3.5 w-3.5 rounded-full border-2 border-white bg-black shadow-xs cursor-pointer" />
              <div className="absolute top-0.5 right-[30%] h-3.5 w-3.5 rounded-full border-2 border-white bg-black shadow-xs cursor-pointer" />
            </div>

            {/* Min and Max Input Boxes */}
            <div className="flex items-center gap-1.5">
              <div className="flex-1">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                  MIN
                </span>
                <input
                  type="text"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="w-full rounded-lg border border-[#eaecf0] bg-white px-2 py-1 text-[11px] text-[#111827] focus:outline-none focus:border-black"
                />
              </div>
              <span className="text-neutral-400 mt-3">-</span>
              <div className="flex-1">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                  MAX
                </span>
                <input
                  type="text"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="w-full rounded-lg border border-[#eaecf0] bg-white px-2 py-1 text-[11px] text-[#111827] focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Apply & Reset Sleek Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleApplySalary}
                className="flex-1 rounded-md bg-black py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-md bg-neutral-100 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Accordion (if present) */}
      {categories && onCategoryChange && (
        <div className="pb-4">
          <button
            type="button"
            onClick={() => toggleSection("category")}
            className="flex w-full items-center justify-between py-1 text-left"
          >
            <span className="text-[12.5px] font-bold text-[#111827]">Industry Category</span>
            {isExpanded("category") ? (
              <ChevronUp size={14} className="text-neutral-500" />
            ) : (
              <ChevronDown size={14} className="text-neutral-500" />
            )}
          </button>

          {isExpanded("category") && (
            <div className="mt-2.5 max-h-44 overflow-y-auto space-y-1 pr-1">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg py-1 px-1 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={cat.checked}
                      onCheckedChange={() => onCategoryChange(cat.id)}
                      className="rounded-[4px] size-3.5 border-neutral-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <span className="text-[11.5px] font-medium text-neutral-700 truncate max-w-[130px]">
                      {cat.label}
                    </span>
                  </div>
                  {cat.count !== undefined && (
                    <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[9.5px] font-medium text-neutral-500">
                      {cat.count}
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
