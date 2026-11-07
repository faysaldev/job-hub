"use client";

import { useEffect, useRef } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  CheckCircle,
  Share2,
  Heart,
  ArrowLeft,
  Users,
  Globe,
  Sparkles,
  Award,
  Loader2,
  CalendarDays,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useGetJobByIdQuery } from "@/src/redux/features/jobs/jobsApi";
import { useSaveJobMutation } from "@/src/redux/features/savedJobs/savedJobsApi";
import { toast } from "sonner";
import ApplyJobModal from "@/src/components/jobs/ApplyJobModal";
import ReportJobButton from "@/src/components/jobs/ReportJobButton";
import { CompanyBrandIcon } from "@/src/components/jobs/JobCard";
import gsap from "gsap";
import { selectSavedJobIds } from "@/src/redux/features/generals/generalsSlice";
import { useSelector } from "react-redux";

interface PopulatedJob {
  _id: string;
  title: string;
  company:
    | string
    | {
        _id?: string;
        userId?: string;
        companyName: string;
        companyLogo?: string;
      };
  location: string;
  type: string;
  locationType?: string;
  positions?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: string;
  salary?: string;
  posted?: string;
  createdAt?: string;
  description: string;
  skills: string[];
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
}

const JobDetailsPage = () => {
  const params = useParams();
  const details = params?.details as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: apiResponse, isLoading, error } = useGetJobByIdQuery(details);
  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
  const savedJobIds = useSelector(selectSavedJobIds);

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".jd-card",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-2xl border border-[#eaecf0] bg-white p-10 text-center shadow-xs max-w-sm w-full">
            <div className="w-10 h-10 border-2 border-neutral-300 border-t-black rounded-full animate-spin mx-auto mb-4" />
            <p className="font-bold text-neutral-900 text-sm">Loading job details...</p>
            <p className="mt-1 text-xs text-neutral-500">Preparing the role overview</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const job = apiResponse?.data as PopulatedJob | undefined;
  if (error || !job) notFound();

  const companyObj = typeof job.company === "object" ? job.company : null;
  const companyName =
    companyObj?.companyName ||
    (typeof job.company === "string" ? job.company : "Unknown Company");
  const companyLogo = companyObj?.companyLogo;
  const companyId = companyObj?._id;
  const salaryRange =
    job.salaryMin && job.salaryMax
      ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} / ${job.salaryPeriod || "monthly"}`
      : job.salary || "Not specified";
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : job.posted || "Recently";

  const isSaved = savedJobIds?.includes(job._id);

  const handleSave = async () => {
    try {
      await saveJob({ jobId: details }).unwrap();
      toast.success("Job saved!");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save job.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share)
        await navigator.share({ title: job.title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />

      {/* Hero Header matching pitch-black theme */}
      <section className="relative overflow-hidden bg-black text-white pt-8 pb-24 border-b border-neutral-800">
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <Link
            href="/job"
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <CompanyBrandIcon
                companyName={companyName}
                logoUrl={companyLogo}
                id={job._id}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shrink-0"
              />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Actively Hiring
                  </span>
                  <Badge className="rounded-full bg-neutral-800 text-neutral-200 border-neutral-700 capitalize text-[11px] font-medium px-2.5 py-0.5">
                    {job.type}
                  </Badge>
                  {job.locationType && (
                    <Badge className="rounded-full bg-neutral-800 text-neutral-200 border-neutral-700 capitalize text-[11px] font-medium px-2.5 py-0.5">
                      {job.locationType}
                    </Badge>
                  )}
                </div>

                <h1 className="mb-3 max-w-3xl text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-medium text-neutral-300">
                  <span className="flex items-center gap-1.5 rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-white">
                    <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                    {companyName}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 font-semibold text-neutral-100">
                    <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
                    {salaryRange}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Posted {postedDate}
                  </span>
                  {job.positions && (
                    <span className="flex items-center gap-1.5 rounded-lg bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-300">
                      <Users className="h-3.5 w-3.5 text-neutral-400" />
                      {job.positions} {job.positions === 1 ? "opening" : "openings"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 flex-wrap self-start shrink-0 pt-1">
              <Button
                variant="outline"
                className={`h-9 rounded-xl border-neutral-700 bg-neutral-900 text-neutral-200 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 hover:text-white ${
                  isSaved ? "border-red-500/30 text-red-400 bg-red-500/10" : ""
                }`}
                onClick={handleSave}
                disabled={isSaving || isSaved}
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Heart
                    className={`h-3.5 w-3.5 mr-1.5 ${
                      isSaved ? "fill-red-400 text-red-400" : ""
                    }`}
                  />
                )}
                {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                className="h-9 rounded-xl border-neutral-700 bg-neutral-900 text-neutral-200 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 hover:text-white"
                onClick={handleShare}
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-800/80">
            <ReportJobButton jobId={job._id} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main
        ref={containerRef}
        className="container mx-auto max-w-6xl px-4 -mt-12 relative z-20 pb-16 flex-1"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <Card className="jd-card rounded-2xl border border-[#eaecf0] bg-white p-6 shadow-xs">
                <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-neutral-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-[#f3f4f6] text-neutral-700 px-3 py-1 text-xs font-medium border border-neutral-200/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* About This Role */}
            <Card className="jd-card rounded-2xl border border-[#eaecf0] bg-white p-6 sm:p-7 shadow-xs">
              <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-neutral-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                  <Briefcase className="h-4 w-4" />
                </span>
                About This Role
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                {job.description}
              </p>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card className="jd-card rounded-2xl border border-[#eaecf0] bg-white p-6 sm:p-7 shadow-xs">
                <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-neutral-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  Key Responsibilities
                </h2>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl bg-[#f8fafc] border border-neutral-100 p-3.5 text-xs sm:text-sm text-neutral-700 leading-normal"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card className="jd-card rounded-2xl border border-[#eaecf0] bg-white p-6 sm:p-7 shadow-xs">
                <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-neutral-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                    <Award className="h-4 w-4" />
                  </span>
                  Requirements
                </h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl bg-[#f8fafc] border border-neutral-100 p-3.5 text-xs sm:text-sm text-neutral-700 leading-normal"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Benefits & Perks */}
            {job.benefits && job.benefits.length > 0 && (
              <Card className="jd-card rounded-2xl border border-[#eaecf0] bg-white p-6 sm:p-7 shadow-xs">
                <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-neutral-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                    <Award className="h-4 w-4" />
                  </span>
                  Benefits & Perks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {job.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl bg-[#f8fafc] border border-neutral-100 p-3.5 text-xs sm:text-sm font-medium text-neutral-800"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Apply & Overview */}
          <div className="space-y-6">
            {/* Apply Action Card */}
            <Card className="jd-card sticky top-20 overflow-hidden rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-6 shadow-xs">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Apply for this Position
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Join {companyName} and take the next step.
                  </p>
                </div>
              </div>

              <ApplyJobModal
                jobId={job._id}
                jobTitle={job.title}
                companyName={companyName}
              />

              <div className="mt-3 text-center">
                <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Direct recruiter delivery
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2">
                {[
                  {
                    label: "Openings",
                    value: job.positions
                      ? `${job.positions} position${job.positions !== 1 ? "s" : ""}`
                      : "1 position",
                  },
                  { label: "Posted", value: postedDate },
                  { label: "Job Type", value: job.type },
                  { label: "Salary", value: salaryRange },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-3.5 py-2.5 text-xs"
                  >
                    <span className="text-neutral-500 font-medium">{row.label}</span>
                    <span className="font-bold capitalize text-neutral-900">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Company Info */}
            <Card className="jd-card rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-6 shadow-xs">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-400">
                About the Company
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <CompanyBrandIcon
                  companyName={companyName}
                  logoUrl={companyLogo}
                  id={job._id}
                  className="h-12 w-12 rounded-xl shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-neutral-900 truncate text-sm">
                    {companyName}
                  </p>
                  <p className="text-xs text-neutral-500">Hiring Organization</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-neutral-600 mb-4">
                <div className="flex items-center gap-2 rounded-xl bg-[#f8fafc] px-3.5 py-2.5">
                  <ShieldCheck className="h-4 w-4 text-neutral-700 shrink-0" />
                  <span>Verified employer</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#f8fafc] px-3.5 py-2.5">
                  <MapPin className="h-4 w-4 text-neutral-700 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
              </div>

              {companyId && (
                <Link
                  href={`/company/${companyId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black hover:text-neutral-600 transition-colors"
                >
                  <Clock className="h-3.5 w-3.5" /> View Company Profile
                </Link>
              )}
            </Card>

            {/* Similar Jobs Callout */}
            <Card className="jd-card rounded-2xl border border-neutral-800 bg-black p-6 text-white shadow-xs">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-white">More Jobs Like This</h3>
              <p className="mb-4 text-xs leading-relaxed text-neutral-400">
                Explore similar positions matching your profile and background.
              </p>
              <Link href="/job">
                <Button className="w-full h-9 rounded-xl bg-white text-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider">
                  Browse Similar Jobs
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetailsPage;
