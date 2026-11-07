"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, MoreHorizontal, Heart, X, Sparkles } from "lucide-react";
import { Job } from "@/src/types";

interface JobCardProps {
  job: Job;
  onSave?: (id: string | number) => void;
  onDismiss?: (id: string | number) => void;
  isSaved?: boolean;
}

// ─── Branded Company Avatar Icon matching Reference Images ───────────────────

export function CompanyBrandIcon({
  companyName,
  logoUrl,
  id,
  className = "h-10 w-10 sm:h-11 sm:w-11",
}: {
  companyName: string;
  logoUrl?: string;
  id?: string | number;
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  // If company logo is provided and hasn't failed to load, display in pristine rounded container
  if (logoUrl && !imgFailed) {
    return (
      <div
        className={`${className} rounded-xl bg-white border border-[#eaecf0] p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden`}
      >
        <img
          src={logoUrl}
          alt={companyName}
          onError={() => setImgFailed(true)}
          className="h-full w-full object-contain rounded-lg"
        />
      </div>
    );
  }

  // Reference Brand Vector Motifs with crisp geometry & vivid branding
  const lower = (companyName || "").toLowerCase();
  let variant = 0;
  if (lower.includes("unicorn") || lower.includes("magic")) {
    variant = 0; // Emerald Dot Matrix
  } else if (lower.includes("corporate") || lower.includes("business")) {
    variant = 1; // Coral Flower
  } else if (lower.includes("guy")) {
    variant = 2; // Blue Nodes Trinity
  } else if (lower.includes("sintra")) {
    variant = 3; // Violet Sacred Rosette
  } else if (lower.includes("moon")) {
    variant = 4; // Navy Dark XI
  } else if (lower.includes("behance")) {
    variant = 5; // Royal Blue Bē
  } else if (lower.includes("litit")) {
    variant = 6; // Obsidian Emerald Hexagon
  } else if (lower.includes("cow")) {
    variant = 7; // Cyan Network Matrix
  } else {
    let hash = 0;
    const key = companyName + (id || "");
    for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
    variant = Math.abs(hash) % 8;
  }

  switch (variant) {
    case 0:
      // Magic Unicorn - Emerald Dot Matrix
      return (
        <div
          className={`${className} rounded-xl bg-[#20b26c] border border-emerald-600/20 flex items-center justify-center shrink-0 shadow-2xs text-white p-2`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-95">
            <circle cx="5" cy="5" r="2.2" />
            <circle cx="12" cy="5" r="2.2" />
            <circle cx="19" cy="5" r="2.2" />
            <circle cx="5" cy="12" r="2.2" />
            <circle cx="12" cy="12" r="2.2" />
            <circle cx="19" cy="12" r="2.2" />
            <circle cx="5" cy="19" r="2.2" />
            <circle cx="12" cy="19" r="2.2" />
            <circle cx="19" cy="19" r="2.2" />
          </svg>
        </div>
      );
    case 1:
      // Business Corporate Group - Coral Flower
      return (
        <div
          className={`${className} rounded-xl bg-[#f95738] border border-orange-600/20 flex items-center justify-center shrink-0 shadow-2xs text-white p-2`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-95">
            <path d="M12 2C10.5 4.5 10.5 7.5 12 10C13.5 7.5 13.5 4.5 12 2Z" />
            <path d="M12 22C10.5 19.5 10.5 16.5 12 14C13.5 16.5 13.5 19.5 12 22Z" />
            <path d="M2 12C4.5 10.5 7.5 10.5 10 12C7.5 13.5 4.5 13.5 2 12Z" />
            <path d="M22 12C19.5 10.5 16.5 10.5 14 12C16.5 13.5 19.5 13.5 22 12Z" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
      );
    case 2:
      // Guy - Blue Nodes Trinity
      return (
        <div
          className={`${className} rounded-xl bg-[#2563eb] border border-blue-600/20 flex items-center justify-center shrink-0 shadow-2xs text-white p-2`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            <circle cx="12" cy="6" r="2.5" fill="currentColor" />
            <circle cx="6" cy="17" r="2.5" fill="currentColor" />
            <circle cx="18" cy="17" r="2.5" fill="currentColor" />
            <path d="M12 8.5L6.5 15M12 8.5L17.5 15M8.5 17H15.5" />
          </svg>
        </div>
      );
    case 3:
      // Sintra Group - Violet Sacred Rosette
      return (
        <div
          className={`${className} rounded-xl bg-[#6366f1] border border-indigo-600/20 flex items-center justify-center shrink-0 shadow-2xs text-white p-2`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <circle cx="12" cy="5" r="2.5" />
            <circle cx="12" cy="19" r="2.5" />
            <circle cx="5" cy="12" r="2.5" />
            <circle cx="19" cy="12" r="2.5" />
          </svg>
        </div>
      );
    case 4:
      // Moon Active - Navy Dark Stylized "XI"
      return (
        <div
          className={`${className} rounded-xl bg-[#0f172a] border border-slate-700/50 flex items-center justify-center shrink-0 shadow-2xs text-[#38bdf8] p-1.5`}
        >
          <span className="font-black text-xs tracking-tighter">XI</span>
        </div>
      );
    case 5:
      // Behance - Royal Blue "Bē"
      return (
        <div
          className={`${className} rounded-xl bg-[#0057ff] border border-blue-700/30 flex items-center justify-center shrink-0 shadow-2xs text-white p-1.5`}
        >
          <span className="font-extrabold text-xs tracking-tight">Bē</span>
        </div>
      );
    case 6:
      // Litit Group - Obsidian Emerald Hexagon
      return (
        <div
          className={`${className} rounded-xl bg-[#111827] border border-neutral-700/50 flex items-center justify-center shrink-0 shadow-2xs text-[#10b981] p-2`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <polygon points="12,6 17,9.5 17,14.5 12,18 7,14.5 7,9.5" fill="currentColor" />
          </svg>
        </div>
      );
    default:
      // Cow - Cyan Network Matrix
      return (
        <div
          className={`${className} rounded-xl bg-[#0284c7] border border-sky-600/20 flex items-center justify-center shrink-0 shadow-2xs text-white p-2`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            <circle cx="7" cy="7" r="2.8" fill="currentColor" />
            <circle cx="17" cy="7" r="2.8" fill="currentColor" />
            <circle cx="12" cy="17" r="2.8" fill="currentColor" />
            <line x1="7" y1="7" x2="17" y2="7" />
            <line x1="7" y1="7" x2="12" y2="17" />
            <line x1="17" y1="7" x2="12" y2="17" />
          </svg>
        </div>
      );
  }
}

function formatPostedDate(dateStr?: string): string {
  if (!dateStr) return "Recently posted";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatSalaryDisplay(job: Job): string {
  if (job.salary) return job.salary;
  if (job.salaryMin != null && job.salaryMax != null) {
    const min = `$${job.salaryMin}`;
    const period = job.salaryPeriod === "yearly" ? " PA" : job.salaryPeriod === "monthly" ? " PM" : "";
    return `${min}${period}`;
  }
  return "Competitive";
}

const JobCard = ({ job, onSave, onDismiss, isSaved: initialSaved = false }: JobCardProps) => {
  const [saved, setSaved] = useState(initialSaved);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const companyName = typeof job.company === "string" ? job.company : "Company";
  const postedDate = formatPostedDate(job.postedAt || job.posted || (job as any).createdAt);
  const seniority = job.experienceLevel || "Mid-Senior";
  const employmentType = job.remote ? "Remote Job" : job.type || "Full-Time";
  const salaryText = formatSalaryDisplay(job);
  const locationText = (job.location || "Location not provided").toUpperCase();
  const tags = (job.skills && job.skills.length > 0) ? job.skills.slice(0, 3) : ["Design", "UX"];

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    if (onSave) onSave(job.id);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    if (onDismiss) onDismiss(job.id);
  };

  return (
    <article className="jh-card-reference group relative flex flex-col justify-between h-full bg-white border border-[#eaecf0] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
      {/* Top Header: Logo, Title, Company, Action menu */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <CompanyBrandIcon companyName={companyName} logoUrl={job.companyLogo} id={job.id} />
            <div className="min-w-0 pt-0.5">
              <Link href={`/job/${job.id}`} className="block">
                <h3 className="text-sm font-bold text-[#111827] group-hover:text-black transition-colors truncate">
                  {job.title}
                </h3>
              </Link>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-0.5 truncate">
                {companyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Job options"
            className="text-neutral-400 hover:text-neutral-600 p-0.5 shrink-0 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mt-2 mb-2">
          <MapPin size={11} className="shrink-0 text-neutral-400" />
          <span className="truncate">{locationText}</span>
        </div>

        {/* 3-column metadata row */}
        <div className="grid grid-cols-3 gap-1 py-1.5 text-[10.5px] border-y border-neutral-100 my-2">
          <span className="font-semibold text-neutral-700 truncate">{seniority}</span>
          <span className="font-semibold text-neutral-700 truncate text-center capitalize">{employmentType}</span>
          <span className="font-bold text-neutral-900 truncate text-right">{salaryText}</span>
        </div>

        {/* Description snippet */}
        <p className="text-[11.5px] text-[#596d7e] leading-relaxed line-clamp-2 my-2">
          {job.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-[#f3f4f6] text-neutral-600 rounded-md px-2 py-0.5 text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
          {job.isSponsored && (
            <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#15803d] rounded-md px-2 py-0.5 text-[10px] font-semibold">
              <Sparkles size={10} /> Sponsored
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Posted date & Dismiss / Heart icons */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px]">
        <span className="text-neutral-400 font-medium">{postedDate}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss job"
            className="text-neutral-400 hover:text-neutral-700 p-0.5 transition-colors"
          >
            <X size={13} />
          </button>
          <button
            type="button"
            onClick={handleSave}
            aria-label={saved ? "Unsave job" : "Save job"}
            className={`p-0.5 transition-colors ${saved ? "text-red-500 fill-red-500" : "text-neutral-400 hover:text-red-500"}`}
          >
            <Heart size={13} className={saved ? "fill-current text-red-500" : ""} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default JobCard;
