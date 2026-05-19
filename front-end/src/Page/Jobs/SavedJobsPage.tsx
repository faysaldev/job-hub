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
  Send,
  Building2,
  Sparkles,
  ArrowRight,
  Loader2,
  Star,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/src/hooks/use-toast";
import gsap from "gsap";
import {
  useGetUserSavedJobsQuery,
  useDeleteSavedJobMutation,
} from "@/src/redux/features/savedJobs/savedJobsApi";

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
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        );
        gsap.fromTo(
          ".saved-job-card",
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            delay: 0.15,
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
      className="min-h-screen flex flex-col jobhub-page-bg"
    >
      <Header />

      <main className="flex-1 py-10 md:py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="page-header mb-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#234C6A] p-8 text-white shadow-2xl shadow-[#234C6A]/20 md:p-10">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
              <div className="absolute bottom-0 right-0 h-36 w-full bg-gradient-to-t from-black/15 to-transparent" />
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-sm">
                    <Heart className="h-8 w-8 fill-white/50 text-white" />
                  </div>
                  <div>
                    <Badge className="mb-3 rounded-full border-white/15 bg-white/10 text-white">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Your shortlist
                    </Badge>
                    <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                      Saved Jobs
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
                      {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""}{" "}
                      saved. Keep your best opportunities organized and apply
                      when you&apos;re ready.
                    </p>
                  </div>
                </div>
                {savedJobs.length > 0 && (
                  <Badge className="self-start rounded-full border-white/20 bg-white/15 px-4 py-2 text-sm text-white md:self-auto">
                    <Star className="h-4 w-4 mr-2 fill-amber-300 text-amber-300" />
                    {savedJobs.length} Saved
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-[#234C6A]/10 bg-white/90 py-24 shadow-sm backdrop-blur">
              <Loader2 className="h-10 w-10 animate-spin text-[#234C6A] mb-4" />
              <p className="font-bold text-[#234C6A]">
                Loading your saved jobs...
              </p>
              <p className="mt-1 text-sm text-[#456882]">
                Pulling your bookmarked opportunities
              </p>
            </div>
          ) : savedJobs.length === 0 ? (
            <Card className="rounded-3xl border border-dashed border-[#234C6A]/20 bg-white/80 p-10 text-center shadow-sm backdrop-blur md:p-16">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#234C6A]/10 to-[#456882]/10">
                <Bookmark className="h-12 w-12 text-[#234C6A]/40" />
              </div>
              <h3 className="mb-3 text-3xl font-black text-[#234C6A]">
                No Saved Jobs Yet
              </h3>
              <p className="mx-auto mb-8 max-w-sm leading-relaxed text-[#456882]">
                Start exploring jobs and save the ones you&apos;re interested
                in. They&apos;ll appear here for easy access.
              </p>
              <Button
                asChild
                className="h-12 rounded-xl bg-[#234C6A] px-8 font-black text-white shadow-lg shadow-[#234C6A]/15 hover:bg-[#1c405a]"
              >
                <Link href="/job">
                  <Briefcase className="h-4 w-4 mr-2" /> Browse Jobs
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((saved: any) => {
                const job = saved.jobId;
                if (!job) return null;
                return (
                  <Card
                    key={saved._id}
                    className="saved-job-card group relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-2xl hover:shadow-[#234C6A]/10"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882] scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

                    <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#234C6A]/10 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                        {job.company?.companyLogo ? (
                          <img
                            src={job.company.companyLogo}
                            alt={job.company.companyName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#234C6A] to-[#456882]">
                            <Building2 className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={`/job/${job._id}`}>
                              <h3 className="truncate text-xl font-black tracking-tight text-[#234C6A] transition-colors hover:text-[#456882]">
                                {job.title}
                              </h3>
                            </Link>
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#456882]">
                              <Building2 className="h-3.5 w-3.5" />
                              {job.company?.companyName || "Unknown Company"}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemove(job._id);
                            }}
                            disabled={isDeleting}
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E3E3E3]/50 text-[#456882] opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 md:opacity-0 md:group-hover:opacity-100"
                            aria-label="Remove saved job"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-[#456882]">
                          {job.location && (
                            <span className="flex items-center gap-1.5 rounded-full border border-[#234C6A]/10 bg-[#E3E3E3]/50 px-3 py-1 text-xs font-bold">
                              <MapPin className="h-3.5 w-3.5 text-[#234C6A]" />
                              {job.location}
                            </span>
                          )}
                          {job.type && (
                            <span className="flex items-center gap-1.5 rounded-full border border-[#234C6A]/10 bg-white px-3 py-1 text-xs font-bold capitalize">
                              <Briefcase className="h-3.5 w-3.5 text-[#234C6A]" />
                              {job.type}
                            </span>
                          )}
                          {job.salaryMin && job.salaryMax && (
                            <span className="flex items-center gap-1.5 rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-3 py-1 text-xs font-bold text-[#234C6A]">
                              <DollarSign className="h-3.5 w-3.5 text-[#234C6A]" />
                              {formatSalary(job.salaryMin, job.salaryMax)}
                            </span>
                          )}
                          <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[#456882]/70">
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
                          <p className="line-clamp-2 text-sm leading-relaxed text-[#456882]/75">
                            {job.description}
                          </p>
                        )}

                        {job.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {job.skills
                              .slice(0, 5)
                              .map((s: string, i: number) => (
                                <Badge
                                  key={i}
                                  className="rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 text-xs font-semibold text-[#234C6A]"
                                >
                                  {s}
                                </Badge>
                              ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 pt-2">
                          <Link href={`/job/${job._id}`}>
                            <Button
                              variant="outline"
                              className="h-10 rounded-xl border-[#234C6A]/20 text-sm font-bold text-[#234C6A] hover:bg-[#234C6A]/5"
                            >
                              View Details{" "}
                              <ArrowRight className="h-4 w-4 ml-1.5" />
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
            <Card className="mt-8 overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#234C6A] to-[#456882] p-6 text-white shadow-xl shadow-[#234C6A]/15">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">
                      Find More Jobs Like These
                    </h3>
                    <p className="text-sm text-white/70">
                      Discover similar positions based on your saved jobs.
                    </p>
                  </div>
                </div>
                <Link href="/job">
                  <Button className="h-11 flex-shrink-0 rounded-xl bg-white px-6 font-black text-[#234C6A] shadow-lg hover:bg-white/90">
                    Explore Similar Jobs <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SavedJobsPage;
