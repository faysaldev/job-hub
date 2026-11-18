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
  Shield,
} from "lucide-react";
import { useGetJobByIdQuery, useGetJobsQuery } from "@/src/redux/features/jobs/jobsApi";
import { useSaveJobMutation, useDeleteSavedJobMutation } from "@/src/redux/features/savedJobs/savedJobsApi";
import { useGetSavedJobIdsQuery } from "@/src/redux/features/generals/generalsApi";
import { formatJobSalary, relatedJobs } from "@/src/lib/jobPresentation";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "sonner";
import ApplyJobModal from "@/src/components/jobs/ApplyJobModal";
import ReportJobButton from "@/src/components/jobs/ReportJobButton";
import gsap from "gsap";


interface PopulatedJob {
  _id: string;
  title: string;
  category?: string;
  subcategory?: string;
  bannerUrl?: string;
  company:
    | string
    | {
        _id?: string;
        userId?: string;
        companyName: string;
        companyLogo?: string;
        industries?: string;
        companyLocation?: string;
        website?: string;
        verification?: { status?: string };
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

/** Uses the existing public search endpoint; never shows an empty recommendation card. */
function RelatedJobsCard({ job }: { job: PopulatedJob }) {
  const { data, isFetching, isError } = useGetJobsQuery({ limit: 24 });
  const candidates = relatedJobs(job, data?.data?.jobs || [], 3);
  return (
    <Card className="jd-card rounded-3xl border border-[#163B5C]/10 bg-white p-6 shadow-sm">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-black text-[#163B5C]">
        <Sparkles className="h-5 w-5" /> Similar opportunities
      </h3>
      <p className="mb-4 text-sm text-[#516C83]">Other open roles you may want to explore.</p>
      {isFetching && !data ? <p role="status" className="text-sm text-[#516C83]">Finding related positions…</p> : null}
      {isError ? <p role="status" className="mb-3 text-sm text-[#516C83]">Recommendations are temporarily unavailable.</p> : null}
      {!isFetching && !isError && candidates.length === 0 ? (
        <p className="mb-3 text-sm text-[#516C83]">No other open roles are available right now.</p>
      ) : null}
      <ul className="space-y-2">
        {candidates.map(candidate => (
          <li key={candidate._id || candidate.id}>
            <Link href={`/job/${candidate._id || candidate.id}`} className="block rounded-xl border border-[#163B5C]/10 p-3 transition-colors hover:bg-[#F6F8FB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163B5C]">
              <span className="block text-sm font-bold text-[#163B5C]">{candidate.title}</span>
              <span className="mt-1 block text-xs text-[#516C83]">{candidate.location || candidate.locationType || 'Location not specified'} · {formatJobSalary(candidate.salaryMin, candidate.salaryMax, candidate.salaryPeriod, true)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/job" className="mt-4 inline-flex text-sm font-bold text-[#163B5C] underline underline-offset-4 hover:text-[#516C83]">
        Browse all jobs
      </Link>
    </Card>
  );
}

const JobDetailsPage = () => {
  const params = useParams();
  const details = params?.details as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: apiResponse, isLoading, error, refetch } = useGetJobByIdQuery(details);
  const { isAuthenticated } = useAuth();
  const { data: savedJobIds = [], isFetching: loadingSavedState } = useGetSavedJobIdsQuery(undefined, { skip: !isAuthenticated });
  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
  const [deleteSavedJob, { isLoading: isRemoving }] = useDeleteSavedJobMutation();

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".jd-card",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col jobhub-page-bg">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-3xl border border-[#163B5C]/10 bg-white/90 p-10 text-center shadow-xl">
            <div className="w-16 h-16 border-4 border-[#163B5C]/20 border-t-[#163B5C] rounded-full animate-spin mx-auto mb-4" />
            <p className="font-bold text-[#163B5C]">Loading job details...</p>
            <p className="mt-1 text-sm text-[#516C83]">
              Preparing the role overview
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // A network outage or 503 is not a missing job. Offer a real recovery action.
    const status = "status" in error ? error.status : undefined;
    if (status === 404) notFound();
    return (
      <div className="min-h-screen flex flex-col jobhub-page-bg">
        <Header />
        <main className="flex-1 mx-auto flex max-w-xl flex-col items-center justify-center px-5 py-24 text-center" role="alert">
          <Briefcase className="mb-5 h-12 w-12 text-[#516C83]" aria-hidden="true" />
          <h1 className="text-2xl font-black text-[#163B5C]">Job details are temporarily unavailable</h1>
          <p className="mt-3 text-[#516C83]">Your connection or the jobs service may be unavailable. You can retry without losing your place.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => void refetch()} className="bg-[#163B5C] text-white">Try again</Button>
            <Button asChild variant="outline"><Link href="/job">Browse jobs</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  const job = apiResponse?.data as PopulatedJob | undefined;
  if (!job) notFound();

  const companyObj = typeof job.company === "object" ? job.company : null;
  const companyName =
    companyObj?.companyName ||
    (typeof job.company === "string" ? job.company : "Unknown Company");
  const companyLogo = companyObj?.companyLogo;
  const companyId = companyObj?._id;
  const salaryRange = formatJobSalary(job.salaryMin, job.salaryMax, job.salaryPeriod);
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : job.posted || "Recently";

  const isSaved = savedJobIds.includes(job._id);
  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in as a seeker to save this role.");
      return;
    }
    if (loadingSavedState || isSaving || isRemoving) return;
    try {
      if (isSaved) {
        await deleteSavedJob(job._id).unwrap();
        toast.success("Removed from your saved jobs");
      } else {
        await saveJob({ jobId: job._id }).unwrap();
        toast.success("Job saved");
      }
    } catch (e: any) {
      toast.error(e?.data?.message || "Unable to update saved jobs. Please try again.");
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
    <div className="min-h-screen flex flex-col jobhub-page-bg">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#163B5C] pt-10 pb-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute left-10 top-28 hidden h-28 w-56 rotate-[-8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
          <div className="absolute bottom-16 right-10 hidden h-32 w-64 rotate-[8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/job"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>

          {job.bannerUrl && <img src={job.bannerUrl} alt={`Banner for ${job.title}`} className="mb-8 h-52 w-full rounded-3xl object-cover" />}

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-sm">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-white" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="rounded-full border border-emerald-300/20 bg-emerald-400/15 text-emerald-100">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse inline-block" />
                    Actively Hiring
                  </Badge>
                  <Badge className="rounded-full bg-white/10 text-white border-white/20 capitalize">
                    {job.type}
                  </Badge>
                  {job.locationType && (
                    <Badge className="rounded-full bg-white/10 text-white border-white/20 capitalize">
                      {job.locationType}
                    </Badge>
                  )}
                </div>
                <h1 className="mb-4 max-w-4xl text-3xl font-black tracking-tight text-white md:text-5xl">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white/80">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                    <Building2 className="h-4 w-4" />
                    {companyName}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                    <DollarSign className="h-4 w-4" />
                    {salaryRange}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                    <CalendarDays className="h-4 w-4" />
                    Posted {postedDate}
                  </span>
                  {job.positions && (
                    <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                      <Users className="h-4 w-4" />
                      {job.positions}{" "}
                      {job.positions === 1 ? "opening" : "openings"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                className={`rounded-xl border-white/25 bg-white/10 text-white hover:bg-white/15 ${
                  isSaved ? "border-white/50" : ""
                }`}
                onClick={handleSave}
                disabled={isSaving || isRemoving || (isAuthenticated && loadingSavedState)}
                aria-pressed={isSaved}
                aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
              >
                {isSaving || isRemoving || (isAuthenticated && loadingSavedState) ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      isSaved ? "fill-white" : ""
                    }`}
                  />
                )}
                {isSaving ? "Saving..." : isRemoving ? "Removing..." : (isAuthenticated && loadingSavedState) ? "Checking..." : isSaved ? "Saved · Remove" : "Save"}
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-white/25 bg-white/10 text-white hover:bg-white/15"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
          <ReportJobButton jobId={job._id} />
        </div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="container mx-auto px-4 -mt-20 relative z-20 pb-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            {/* Skills */}
            <Card className="jd-card rounded-3xl border border-[#163B5C]/10 bg-white/90 p-6 shadow-sm backdrop-blur">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-[#163B5C]">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#163B5C]/10">
                  <Sparkles className="h-5 w-5 text-[#163B5C]" />
                </span>
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <Badge
                    key={i}
                    className="rounded-full border border-[#163B5C]/10 bg-[#163B5C]/5 px-4 py-1.5 font-bold text-[#163B5C] transition-colors hover:bg-[#163B5C]/10"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Description */}
            <Card className="jd-card rounded-3xl border border-[#163B5C]/10 bg-white/90 p-7 shadow-sm backdrop-blur">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-[#163B5C]">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#163B5C]/10">
                  <Briefcase className="h-5 w-5 text-[#163B5C]" />
                </span>
                About This Role
              </h3>
              <p className="whitespace-pre-line leading-8 text-[#516C83]">
                {job.description}
              </p>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card className="jd-card rounded-3xl border border-[#163B5C]/10 bg-white/90 p-7 shadow-sm backdrop-blur">
                <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-[#163B5C]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#163B5C]/10">
                    <CheckCircle className="h-5 w-5 text-[#163B5C]" />
                  </span>
                  Responsibilities
                </h3>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-2xl bg-[#F6F8FB] p-4 text-[#516C83]"
                    >
                      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#163B5C]/10">
                        <CheckCircle className="h-3.5 w-3.5 text-[#163B5C]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card className="jd-card rounded-3xl border border-[#163B5C]/10 bg-white/90 p-7 shadow-sm backdrop-blur">
                <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-[#163B5C]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#163B5C]/10">
                    <Award className="h-5 w-5 text-[#163B5C]" />
                  </span>
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {job.requirements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-2xl bg-[#F6F8FB] p-4 text-[#516C83]"
                    >
                      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#163B5C]/10">
                        <CheckCircle className="h-3.5 w-3.5 text-[#163B5C]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Card className="jd-card rounded-3xl border border-[#163B5C]/10 bg-white/90 p-7 shadow-sm backdrop-blur">
                <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-[#163B5C]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#163B5C]/10">
                    <Award className="h-5 w-5 text-[#163B5C]" />
                  </span>
                  Benefits & Perks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                      <span className="text-sm font-semibold text-[#163B5C]">
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right */}
          <div className="space-y-5">
            {/* Apply */}
            <Card className="jd-card sticky top-24 overflow-hidden rounded-3xl border border-[#163B5C]/10 bg-white/95 p-6 shadow-xl shadow-[#163B5C]/10 backdrop-blur">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#163B5C] to-[#516C83]" />
              <div className="mb-5 mt-2 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#163B5C] text-white">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#163B5C]">
                    Apply for this Position
                  </h3>
                  <p className="mt-1 text-sm text-[#516C83]">
                    Join {companyName} and be part of an amazing team.
                  </p>
                </div>
              </div>
              <ApplyJobModal
                jobId={job._id}
                jobTitle={job.title}
                companyName={companyName}
              />
              <div className="mt-4 text-center">
                <span className="rounded-full bg-[#E1E8EF]/60 px-3 py-1.5 text-xs font-semibold text-[#516C83]">
                  LinkedIn Apply - Coming Soon
                </span>
              </div>
              <div className="mt-5 pt-5 border-t border-[#E1E8EF]/50 space-y-3">
                {[
                  {
                    label: "Openings",
                    value: job.positions
                      ? `${job.positions} position${job.positions !== 1 ? "s" : ""}`
                      : "N/A",
                  },
                  { label: "Posted", value: postedDate },
                  { label: "Type", value: job.type },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-2xl bg-[#F6F8FB] px-4 py-3 text-sm"
                  >
                    <span className="text-[#516C83]">{row.label}</span>
                    <span className="font-bold capitalize text-[#163B5C]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Company */}
            <Card className="jd-card rounded-3xl border border-[#163B5C]/10 bg-white/90 p-6 shadow-sm backdrop-blur">
              <h3 className="mb-4 text-lg font-black text-[#163B5C]">
                About {companyName}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#163B5C] to-[#516C83]">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-black text-[#163B5C]">{companyName}</p>
                  {companyObj?.industries && <p className="text-sm text-[#516C83]">{companyObj.industries}</p>}
                </div>
              </div>
              <div className="mb-5 space-y-2 text-sm text-[#516C83]">
                {companyObj?.verification?.status === "verified" && (
                  <div className="flex items-center gap-2 rounded-2xl bg-[#F6F8FB] px-4 py-3">
                    <Shield className="h-4 w-4 text-[#163B5C]" /> Verified employer
                  </div>
                )}
                {companyObj?.website && /^https?:\/\//i.test(companyObj.website) && (
                  <a href={companyObj.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-2xl bg-[#F6F8FB] px-4 py-3 text-[#163B5C] underline underline-offset-2">
                    <Globe className="h-4 w-4" /> Company website
                  </a>
                )}
                <div className="flex items-center gap-2 rounded-2xl bg-[#F6F8FB] px-4 py-3">
                  <MapPin className="h-4 w-4 text-[#163B5C]" /> {companyObj?.companyLocation || job.location}
                </div>
              </div>
              {companyId && (
                <Link
                  href={`/company/${companyId}`}
                  className="flex items-center gap-1.5 text-sm font-bold text-[#163B5C] hover:underline"
                >
                  <Clock className="h-4 w-4" /> View Company Profile
                </Link>
              )}
            </Card>

            {/* Related open roles share the public /job search; no separate API. */}
            <RelatedJobsCard job={job} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetailsPage;
