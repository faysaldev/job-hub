"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Badge } from "@/src/components/ui/badge";
import {
  Briefcase,
  GraduationCap,
  DollarSign,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Building2,
  Search,
  Grid3X3,
  X,
  Sliders,
} from "lucide-react";
import { jobCategories } from "@/src/lib/jobCategories";

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
  count?: number;
}

interface JobFilterProps {
  // Basic filters
  jobTypes: FilterOption[];
  experienceLevels: FilterOption[];
  salaryRanges: FilterOption[];
  onJobTypeChange: (id: string) => void;
  onExperienceChange: (id: string) => void;
  onSalaryChange: (id: string) => void;

  // Advanced filters
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

  // Selected filters for display
  selectedCategory?: string;
  selectedSubcategory?: string;
  onClearCategory?: () => void;
  onClearSubcategory?: () => void;
  onResetAllFilters?: () => void;

  // Active filter count
  activeFilterCount?: number;
}

const JobFilters = ({
  jobTypes,
  experienceLevels,
  salaryRanges,
  onJobTypeChange,
  onExperienceChange,
  onSalaryChange,
  categories,
  subcategories,
  companySizeFilters,
  postedDateFilters,
  applicantCountFilters,
  onCategoryChange,
  onSubcategoryChange,
  onCompanySizeChange,
  onPostedDateChange,
  onApplicantCountChange,
  selectedCategory,
  selectedSubcategory,
  onClearCategory,
  onClearSubcategory,
  onResetAllFilters,
  activeFilterCount = 0,
}: JobFilterProps) => {
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "category",
    "jobType",
    "experience",
    "salary",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const isSectionExpanded = (section: string) =>
    expandedSections.includes(section);

  const handleResetFilters = () => {
    if (onResetAllFilters) {
      onResetAllFilters();
    } else {
      // Reset basic filters to all checked
      jobTypes.forEach((type) => {
        if (!type.checked) onJobTypeChange(type.id);
      });
      experienceLevels.forEach((level) => {
        if (!level.checked) onExperienceChange(level.id);
      });
      salaryRanges.forEach((range) => {
        if (!range.checked) onSalaryChange(range.id);
      });
    }
  };

  // Get category name from ID
  const getCategoryName = (categoryId: string) => {
    return jobCategories.find((c) => c.id === categoryId)?.name || categoryId;
  };

  // Get subcategory name
  const getSubcategoryName = (categoryId: string, subcategoryId: string) => {
    const category = jobCategories.find((c) => c.id === categoryId);
    return (
      category?.subcategories.find((s) => s.id === subcategoryId)?.name ||
      subcategoryId
    );
  };

  // Filter section component
  const FilterSection = ({
    title,
    icon: Icon,
    sectionId,
    children,
    badge,
  }: {
    title: string;
    icon: React.ElementType;
    sectionId: string;
    children: React.ReactNode;
    badge?: number;
  }) => (
    <div className="border-b border-[#E1E8EF]/80 last:border-0">
      <button
        onClick={() => toggleSection(sectionId)}
        className="flex w-full items-center justify-between rounded-xl px-2 py-4 text-left transition-colors hover:bg-[#163B5C]/5"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#163B5C]" />
          <span className="text-sm font-black text-[#163B5C]">{title}</span>
          {badge && badge > 0 && (
            <Badge className="h-5 rounded-full border-none bg-[#163B5C] px-1.5 py-0 text-xs text-white">
              {badge}
            </Badge>
          )}
        </div>
        {isSectionExpanded(sectionId) ? (
          <ChevronUp className="h-4 w-4 text-[#516C83]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#516C83]" />
        )}
      </button>
      {isSectionExpanded(sectionId) && (
        <div className="space-y-2 pb-4">{children}</div>
      )}
    </div>
  );

  // Checkbox item component
  const CheckboxItem = ({
    item,
    onChange,
  }: {
    item: FilterOption;
    onChange: (id: string) => void;
  }) => (
    <label className="group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[#163B5C]/5">
      <Checkbox
        checked={item.checked}
        onCheckedChange={() => onChange(item.id)}
        className="border-[#163B5C]/30 data-[state=checked]:bg-[#163B5C] data-[state=checked]:border-[#163B5C]"
      />
      <span className="flex-1 text-sm font-medium text-[#516C83] transition-colors group-hover:text-[#163B5C]">
        {item.label}
      </span>
      {item.count !== undefined && (
        <span className="rounded-full bg-[#E1E8EF]/60 px-2 py-0.5 text-xs font-semibold text-[#516C83]/80">
          {item.count}
        </span>
      )}
    </label>
  );

  return (
    <Card className="overflow-hidden rounded-3xl border border-[#163B5C]/10 bg-white/90 shadow-sm backdrop-blur pt-0">
      <div className="border-b border-[#E1E8EF] bg-gradient-to-r from-[#163B5C]/8 to-[#516C83]/8 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#163B5C] to-[#516C83]">
              <Sliders className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-black text-[#163B5C]">Filters</h3>
              {activeFilterCount > 0 && (
                <p className="text-xs font-semibold text-[#516C83]">
                  {activeFilterCount} active
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs font-bold text-[#516C83] hover:bg-[#163B5C]/10 hover:text-[#163B5C]"
            onClick={handleResetFilters}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Active Filters Tags */}
      {(selectedCategory || selectedSubcategory) && (
        <div className="border-b border-[#E1E8EF] bg-[#163B5C]/5 p-4">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-[#516C83]">
            Active Filters
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge className="flex items-center gap-1 rounded-full border-none bg-gradient-to-r from-[#163B5C] to-[#516C83] pr-1 text-white">
                {getCategoryName(selectedCategory)}
                {onClearCategory && (
                  <button
                    onClick={onClearCategory}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            )}
            {selectedSubcategory && selectedCategory && (
              <Badge className="flex items-center gap-1 rounded-full border-none bg-[#516C83] pr-1 text-white">
                {getSubcategoryName(selectedCategory, selectedSubcategory)}
                {onClearSubcategory && (
                  <button
                    onClick={onClearSubcategory}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Category Filter */}
        {categories && onCategoryChange && (
          <FilterSection
            title="Category"
            icon={Grid3X3}
            sectionId="category"
            badge={categories.filter((c) => c.checked).length}
          >
            <div className="max-h-48 overflow-y-auto space-y-1">
              {categories.map((category) => (
                <CheckboxItem
                  key={category.id}
                  item={category}
                  onChange={onCategoryChange}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Job Type */}
        <FilterSection
          title="Job Type"
          icon={Briefcase}
          sectionId="jobType"
          badge={jobTypes.filter((t) => t.checked).length}
        >
          {jobTypes.map((type) => (
            <CheckboxItem
              key={type.id}
              item={type}
              onChange={onJobTypeChange}
            />
          ))}
        </FilterSection>

        {/* Experience Level */}
        <FilterSection
          title="Experience Level"
          icon={GraduationCap}
          sectionId="experience"
          badge={experienceLevels.filter((e) => e.checked).length}
        >
          {experienceLevels.map((level) => (
            <CheckboxItem
              key={level.id}
              item={level}
              onChange={onExperienceChange}
            />
          ))}
        </FilterSection>

        {/* Salary Range */}
        <FilterSection
          title="Salary Range"
          icon={DollarSign}
          sectionId="salary"
          badge={salaryRanges.filter((s) => s.checked).length}
        >
          {salaryRanges.map((range) => (
            <CheckboxItem
              key={range.id}
              item={range}
              onChange={onSalaryChange}
            />
          ))}
        </FilterSection>

        {/* Posted Date */}
        {postedDateFilters && onPostedDateChange && (
          <FilterSection
            title="Date Posted"
            icon={Calendar}
            sectionId="postedDate"
            badge={postedDateFilters.filter((d) => d.checked).length}
          >
            {postedDateFilters.map((date) => (
              <CheckboxItem
                key={date.id}
                item={date}
                onChange={onPostedDateChange}
              />
            ))}
          </FilterSection>
        )}

        {/* Company Size */}
        {companySizeFilters && onCompanySizeChange && (
          <FilterSection
            title="Company Size"
            icon={Building2}
            sectionId="companySize"
            badge={companySizeFilters.filter((c) => c.checked).length}
          >
            {companySizeFilters.map((size) => (
              <CheckboxItem
                key={size.id}
                item={size}
                onChange={onCompanySizeChange}
              />
            ))}
          </FilterSection>
        )}
      </div>

      <div className="border-t border-[#E1E8EF] bg-[#F6F8FB] p-4">
        <div className="rounded-2xl border border-[#163B5C]/10 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-[#163B5C]">
            Instant filters
          </p>
          <p className="mt-1 text-xs leading-5 text-[#516C83]">
            Results update as soon as you change filters or search terms.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default JobFilters;
