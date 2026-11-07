"use client";

import { useEffect, useRef } from "react";
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
  Heart,
  Trash2,
  Bookmark,
  Building2,
  Sparkles,
  ArrowRight,
  Loader2,
  Star,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/src/hooks/use-toast";
import gsap from "gsap";
import {
  useGetUserSavedJobsQuery,
  useDeleteSavedJobMutation,
} from "@/src/redux/features/savedJobs/savedJobsApi";
import { CompanyBrandIcon } from "@/src/components/jobs/JobCard";

function formatSalary(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  return `${fmt(min)} - ${fmt(max)}`;
}

const SavedJobsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: apiResponse, isLoading } = useGetUserSavedJobsQuery();
  const [deleteSavedJob, { isLoading: isDeleting }] =
    useDeleteSavedJobMutation();
  const savedJobs = (apiResponse as any)?.data || [];

  useEffect(() => {
    if (!isLoading && savedJobs.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".page-header",
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        );
        gsap.fromTo(
          ".saved-job-card",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            delay: 0.1,
            ease: "power2.out",
          },
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, savedJobs.length]);

  const handleRemove = async (jobId: string) => {
    try {
      await deleteSavedJob(jobId).unwrap();
      toast({ title: "Removed", description: "Job removed from saved list" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to remove",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col bg-[#f8fafc]"
    >
      <Header />

      <main className="flex-1 py-8 sm:py-10">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Pitch-Black Header Card */}
          <div className="page-header mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8 text-white border border-neutral-800 shadow-xs">
              <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-white">
                    <Heart className="h-6 w-6 fill-white/80 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                        <Bookmark className="h-3 w-3 mr-1" />
                        Your shortlist
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      Saved Jobs
                    </h1>
                    <p className="mt-1 max-w-xl text-xs sm:text-sm text-neutral-400">
                      {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""}{" "}
                      saved. Keep your bookmarked opportunities organized and apply when ready.
                    </p>
                  </div>
                </div>

                {savedJobs.length > 0 && (
                  <div className="self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-neutral-200">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {savedJobs.length} Saved
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#eaecf0] bg-white py-20 shadow-xs">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-800 mb-3" />
              <p className="font-bold text-neutral-900 text-sm">
                Loading your saved jobs...
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Pulling your bookmarked opportunities
              </p>
            </div>
          ) : savedJobs.length === 0 ? (
            <Card className="rounded-2xl border border-dashed border-[#eaecf0] bg-white p-10 sm:p-16 text-center shadow-xs">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                <Bookmark className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-neutral-900">
                No Saved Jobs Yet
              </h2>
              <p className="mx-auto mb-6 max-w-md text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Start exploring jobs and bookmark the ones that stand out. They will appear here for easy access.
              </p>
              <Button
                asChild
                className="h-9 rounded-xl bg-black px-6 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-neutral-800"
              >
                <Link href="/job">
                  <Briefcase className="h-3.5 w-3.5 mr-2" /> Browse Jobs
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-3.5">
              {savedJobs.map((saved: any) => {
                const job = saved.jobId;
                if (!job) return null;
                const companyName = job.company?.companyName || "Unknown Company";

                return (
                  <Card
                    key={saved._id}
                    className="saved-job-card group relative overflow-hidden rounded-2xl border border-[#eaecf0] bg-white p-4 sm:p-5 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <CompanyBrandIcon
                        companyName={companyName}
                        logoUrl={job.company?.companyLogo}
                        id={job._id}
                        className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl shrink-0"
                      />

                      <div className="flex-1 min-w-0 w-full space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={`/job/${job._id}`}>
                              <h3 className="truncate text-base font-bold text-neutral-950 hover:text-neutral-700 transition-colors">
                                {job.title}
                              </h3>
                            </Link>
                            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                              <Building2 className="h-3 w-3 text-neutral-400" />
                              {companyName}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemove(job._id);
                            }}
                            disabled={isDeleting}
                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            aria-label="Remove saved job"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {job.location && (
                            <span className="flex items-center gap-1 rounded-md bg-[#f8fafc] px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                              <MapPin className="h-3 w-3 text-neutral-400" />
                              {job.location}
                            </span>
                          )}
                          {job.type && (
                            <span className="flex items-center gap-1 rounded-md bg-[#f8fafc] px-2 py-0.5 text-[11px] font-medium text-neutral-600 capitalize">
                              <Briefcase className="h-3 w-3 text-neutral-400" />
                              {job.type}
                            </span>
                          )}
                          {job.salaryMin && job.salaryMax && (
                            <span className="flex items-center gap-1 rounded-md bg-[#f8fafc] px-2 py-0.5 text-[11px] font-bold text-neutral-900">
                              <DollarSign className="h-3 w-3 text-neutral-400" />
                              {formatSalary(job.salaryMin, job.salaryMax)}
                            </span>
                          )}
                          <span className="ml-auto flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
                            <Clock className="h-3 w-3" />
                            Saved{" "}
                            {new Date(saved.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>

                        {job.description && (
                          <p className="line-clamp-2 text-xs text-neutral-500 leading-relaxed">
                            {job.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-3 pt-1">
                          <div className="flex flex-wrap gap-1.5">
                            {job.skills?.slice(0, 4).map((s: string, i: number) => (
                              <span
                                key={i}
                                className="rounded-md bg-[#f3f4f6] text-neutral-600 text-[10px] font-medium px-2 py-0.5"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          <Link href={`/job/${job._id}`}>
                            <Button
                              className="h-8 rounded-lg bg-black text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider px-3.5"
                            >
                              View Details
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Recommendation CTA */}
          {savedJobs.length > 0 && (
            <div className="mt-8 rounded-2xl border border-neutral-800 bg-black p-6 text-white shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Find More Jobs Like These
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Explore similar positions based on your saved shortlist.
                    </p>
                  </div>
                </div>
                <Link href="/job">
                  <Button className="h-8 rounded-lg bg-white text-black hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider px-4">
                    Explore Similar Jobs <ArrowRight className="h-3 w-3 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SavedJobsPage;
