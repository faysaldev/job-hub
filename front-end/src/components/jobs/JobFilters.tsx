"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import {
  Filter,
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
import { jobCategories, companySizes, postedDateOptions } from "@/src/lib/jobCategories";

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
    "salary"
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => expandedSections.includes(section);

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
    return jobCategories.find(c => c.id === categoryId)?.name || categoryId;
  };

  // Get subcategory name
  const getSubcategoryName = (categoryId: string, subcategoryId: string) => {
    const category = jobCategories.find(c => c.id === categoryId);
    return category?.subcategories.find(s => s.id === subcategoryId)?.name || subcategoryId;
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
    <div className="border-b border-[#E3E3E3] last:border-0">
      <button
        onClick={() => toggleSection(sectionId)}
        className="w-full flex items-center justify-between py-4 px-1 text-left hover:bg-[#234C6A]/5 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#234C6A]" />
          <span className="text-sm font-semibold text-[#234C6A]">{title}</span>
          {badge && badge > 0 && (
            <Badge className="bg-[#234C6A] text-white border-none text-xs px-1.5 py-0 h-5">
              {badge}
            </Badge>
          )}
        </div>
        {isSectionExpanded(sectionId) ? (
          <ChevronUp className="h-4 w-4 text-[#456882]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#456882]" />
        )}
      </button>
      {isSectionExpanded(sectionId) && (
        <div className="pb-4 space-y-2">
          {children}
        </div>
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
    <label className="flex items-center gap-3 py-1.5 px-1 cursor-pointer group rounded-lg hover:bg-[#234C6A]/5 transition-colors">
      <Checkbox
        checked={item.checked}
        onCheckedChange={() => onChange(item.id)}
        className="border-[#234C6A]/30 data-[state=checked]:bg-[#234C6A] data-[state=checked]:border-[#234C6A]"
      />
      <span className="flex-1 text-sm text-[#456882] group-hover:text-[#234C6A] transition-colors">
        {item.label}
      </span>
      {item.count !== undefined && (
        <span className="text-xs text-[#456882]/70">
          ({item.count})
        </span>
      )}
    </label>
  );

  return (
    <Card className="border-none bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[#234C6A]/5 to-[#456882]/5 border-b border-[#E3E3E3]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center">
              <Sliders className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#234C6A]">Filters</h3>
              {activeFilterCount > 0 && (
                <p className="text-xs text-[#456882]">{activeFilterCount} active</p>
              )}
            </div>
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

      {/* Active Filters Tags */}
      {(selectedCategory || selectedSubcategory) && (
        <div className="p-4 border-b border-[#E3E3E3] bg-[#234C6A]/5">
          <p className="text-xs font-semibold text-[#456882] mb-2">Active Filters</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge className="bg-gradient-to-r from-[#234C6A] to-[#456882] text-white border-none flex items-center gap-1 pr-1">
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
              <Badge className="bg-[#456882] text-white border-none flex items-center gap-1 pr-1">
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
            badge={categories.filter(c => c.checked).length}
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

        {/* Subcategory Filter - Only show if category is selected */}
        {subcategories && subcategories.length > 0 && onSubcategoryChange && (
          <FilterSection
            title="Specialization"
            icon={Search}
            sectionId="subcategory"
            badge={subcategories.filter(s => s.checked).length}
          >
            <div className="max-h-48 overflow-y-auto space-y-1">
              {subcategories.map((sub) => (
                <CheckboxItem
                  key={sub.id}
                  item={sub}
                  onChange={onSubcategoryChange}
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
          badge={jobTypes.filter(t => t.checked).length}
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
          badge={experienceLevels.filter(e => e.checked).length}
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
          badge={salaryRanges.filter(s => s.checked).length}
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
            badge={postedDateFilters.filter(d => d.checked).length}
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
            badge={companySizeFilters.filter(c => c.checked).length}
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

        {/* Applicant Count */}
        {applicantCountFilters && onApplicantCountChange && (
          <FilterSection
            title="Applicants"
            icon={Users}
            sectionId="applicantCount"
            badge={applicantCountFilters.filter(a => a.checked).length}
          >
            {applicantCountFilters.map((count) => (
              <CheckboxItem
                key={count.id}
                item={count}
                onChange={onApplicantCountChange}
              />
            ))}
          </FilterSection>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E3E3E3] bg-[#FAFAFA]">
        <Button
          className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
          onClick={() => {
            // This could trigger a search/filter action
          }}
        >
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

export default JobFilters;
