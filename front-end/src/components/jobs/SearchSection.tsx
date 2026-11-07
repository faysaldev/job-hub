"use client";

import { useState } from "react";
import { Search, MapPin, Briefcase, DollarSign, ChevronDown, X } from "lucide-react";

interface SearchSectionProps {
  searchTerm: string;
  locationTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent) => void;
  onTrendingClick?: (term: string) => void;
}

const DEFAULT_CHIPS = ["Product Designer", "Artist", "Game Designer", "Designer"];
const LOCATION_OPTIONS = ["All Countries", "United States", "Germany", "Estonia", "Remote"];
const JOB_TYPES = ["Job Type", "Full Time", "Part Time", "Remote", "Contract"];
const SALARY_RANGES = ["Salary Range", "$30k - $50k", "$50k - $80k", "$80k - $120k", "$120k+"];

const SearchSection = ({
  searchTerm,
  locationTerm,
  onSearchChange,
  onLocationChange,
  onSearch,
  onSearchKeyDown,
  onTrendingClick,
}: SearchSectionProps) => {
  const [chips, setChips] = useState<string[]>(DEFAULT_CHIPS);
  const [selectedLocation, setSelectedLocation] = useState(locationTerm || "All Countries");
  const [selectedType, setSelectedType] = useState("Job Type");
  const [selectedSalary, setSelectedSalary] = useState("Salary Range");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const removeChip = (chipToRemove: string) => {
    setChips(chips.filter((c) => c !== chipToRemove));
  };

  const addChip = (chipText: string) => {
    const trimmed = chipText.trim();
    if (trimmed && !chips.includes(trimmed)) {
      setChips([...chips, trimmed]);
      if (onTrendingClick) onTrendingClick(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      addChip(searchTerm);
      onSearchKeyDown(e);
    } else {
      onSearchKeyDown(e);
    }
  };

  return (
    <section className="bg-[#f4f6f8] pt-5 pb-3">
      <div className="jh-container">
        {/* Sleek Floating Reference Search Bar */}
        <div className="rounded-2xl border border-[#eaecf0] bg-white p-1 sm:p-1.5 shadow-2xs">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            {/* Search Input with Removable Chips */}
            <div className="flex flex-1 flex-wrap items-center gap-1.5 px-2 py-0.5 min-h-[34px]">
              <Search className="h-3 w-3 text-neutral-400 shrink-0" aria-hidden="true" />
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1 rounded-md border border-neutral-200/70 bg-[#f4f5f7] px-2 py-0.5 text-[10px] font-medium text-neutral-700"
                >
                  {chip}
                  <button
                    type="button"
                    onClick={() => removeChip(chip)}
                    aria-label={`Remove ${chip}`}
                    className="text-neutral-400 hover:text-black transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={chips.length ? "Add keyword..." : "Search job title, skills..."}
                value={searchTerm}
                onChange={onSearchChange}
                onKeyDown={handleKeyDown}
                className="min-w-[80px] flex-1 bg-transparent text-[10.5px] text-[#111827] placeholder:text-neutral-400 focus:outline-none"
              />
            </div>

            <div className="hidden h-4 w-px bg-neutral-200 lg:block mx-0.5" />

            {/* Location Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "location" ? null : "location")}
                className="flex w-full items-center justify-between gap-1 rounded-md px-1.5 py-1 text-[9px] sm:text-[9.5px] font-medium text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors lg:w-auto"
              >
                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-neutral-400 shrink-0" />
                  <span>{selectedLocation}</span>
                </div>
                <ChevronDown size={9} className="text-neutral-400 shrink-0" />
              </button>
              {activeDropdown === "location" && (
                <div className="absolute left-0 top-full z-50 mt-1 w-32 rounded-lg border border-neutral-200/90 bg-white p-0.5 shadow-md">
                  {LOCATION_OPTIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setActiveDropdown(null);
                        const evt = { target: { value: loc === "All Countries" ? "" : loc } } as any;
                        onLocationChange(evt);
                      }}
                      className="w-full text-left rounded-md px-2 py-0.5 text-[9px] font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden h-4 w-px bg-neutral-200 lg:block mx-0.5" />

            {/* Job Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "type" ? null : "type")}
                className="flex w-full items-center justify-between gap-1 rounded-md px-1.5 py-1 text-[9px] sm:text-[9.5px] font-medium text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors lg:w-auto"
              >
                <div className="flex items-center gap-1">
                  <Briefcase size={10} className="text-neutral-400 shrink-0" />
                  <span>{selectedType}</span>
                </div>
                <ChevronDown size={9} className="text-neutral-400 shrink-0" />
              </button>
              {activeDropdown === "type" && (
                <div className="absolute left-0 top-full z-50 mt-1 w-30 rounded-lg border border-neutral-200/90 bg-white p-0.5 shadow-md">
                  {JOB_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedType(t);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left rounded-md px-2 py-0.5 text-[9px] font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden h-4 w-px bg-neutral-200 lg:block mx-0.5" />

            {/* Salary Range Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "salary" ? null : "salary")}
                className="flex w-full items-center justify-between gap-1 rounded-md px-1.5 py-1 text-[9px] sm:text-[9.5px] font-medium text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors lg:w-auto"
              >
                <div className="flex items-center gap-1">
                  <DollarSign size={10} className="text-neutral-400 shrink-0" />
                  <span>{selectedSalary}</span>
                </div>
                <ChevronDown size={9} className="text-neutral-400 shrink-0" />
              </button>
              {activeDropdown === "salary" && (
                <div className="absolute left-0 top-full z-50 mt-1 w-30 rounded-lg border border-neutral-200/90 bg-white p-0.5 shadow-md">
                  {SALARY_RANGES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedSalary(s);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left rounded-md px-2 py-0.5 text-[9px] font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* START SEARCHING Sleek Black Button matching reference */}
            <button
              type="button"
              onClick={onSearch}
              className="inline-flex h-[26px] items-center justify-center rounded-md bg-black px-2.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-2xs shrink-0"
            >
              Start Searching
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
