"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  MapPin, Briefcase, Clock, DollarSign, X,
  Heart, Trash2, Bookmark, Send, Building2,
  Sparkles, ArrowRight, Loader2, Star,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/src/hooks/use-toast";
import gsap from "gsap";
import {
  useGetUserSavedJobsQuery,
  useDeleteSavedJobMutation,
} from "@/src/redux/features/savedJobs/savedJobsApi";

function formatSalary(min: number, max: number) {
  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

const SavedJobsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: apiResponse, isLoading } = useGetUserSavedJobsQuery();
  const [deleteSavedJob, { isLoading: isDeleting }] = useDeleteSavedJobMutation();
  const savedJobs = (apiResponse as any)?.data || [];

  useEffect(() => {
    if (!isLoading && savedJobs.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".page-header", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        gsap.fromTo(".saved-job-card", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out" });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isLoading, savedJobs.length]);

  const handleRemove = async (jobId: string) => {
    try {
      await deleteSavedJob(jobId).unwrap();
      toast({ title: "Removed", description: "Job removed from saved list" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.data?.message || "Failed to remove", variant: "destructive" });
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-gradient-to-b from-[#E3E3E3] via-white to-[#E3E3E3]">
      <Header />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Header */}
          <div className="page-header mb-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl p-8 text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                    <Heart className="h-7 w-7 text-white fill-white/50" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Saved Jobs</h1>
                    <p className="text-white/70 text-sm mt-0.5">
                      {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved • Tap to apply anytime
                    </p>
                  </div>
                </div>
                {savedJobs.length > 0 && (
                  <Badge className="bg-white/15 text-white border-white/20 px-4 py-2 text-sm self-start">
                    <Star className="h-4 w-4 mr-2 fill-amber-300 text-amber-300" />
                    {savedJobs.length} Saved
                  </Badge>
                )}
              </div>
              <Sparkles className="absolute -bottom-6 -right-6 h-36 w-36 text-white/5" />
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white/80 rounded-3xl shadow-sm border border-[#E3E3E3]">
              <Loader2 className="h-10 w-10 animate-spin text-[#234C6A] mb-4" />
              <p className="text-[#456882] font-medium">Loading your saved jobs...</p>
            </div>
          ) : savedJobs.length === 0 ? (
            <Card className="p-16 text-center border border-dashed border-[#234C6A]/15 bg-white/60 rounded-3xl shadow-sm">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#234C6A]/10 to-[#456882]/10 flex items-center justify-center mx-auto mb-6">
                <Bookmark className="h-12 w-12 text-[#234C6A]/40" />
              </div>
              <h3 className="text-2xl font-bold text-[#234C6A] mb-3">No Saved Jobs Yet</h3>
              <p className="text-[#456882] mb-8 max-w-sm mx-auto leading-relaxed">
                Start exploring jobs and save the ones you&apos;re interested in — they&apos;ll appear here for easy access.
              </p>
              <Button asChild className="bg-gradient-to-r from-[#234C6A] to-[#456882] text-white h-12 px-8 rounded-xl font-bold shadow-lg">
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
                  <Card key={saved._id} className="saved-job-card group relative border border-[#E3E3E3]/60 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl rounded-2xl transition-all duration-300 overflow-hidden">
                    {/* Left accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#234C6A] to-[#456882] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="p-6 flex flex-col lg:flex-row lg:items-start gap-5">
                      {/* Logo */}
                      <div className="w-16 h-16 rounded-2xl bg-white border border-[#E3E3E3]/60 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {job.company?.companyLogo
                          ? <img src={job.company.companyLogo} alt={job.company.companyName} className="w-full h-full object-cover" />
                          : <Building2 className="h-8 w-8 text-[#234C6A]" />}
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link href={`/job/${job._id}`}>
                              <h3 className="text-lg font-bold text-[#234C6A] hover:text-[#456882] transition-colors">{job.title}</h3>
                            </Link>
                            <p className="text-[#456882] font-medium text-sm">{job.company?.companyName || "Unknown Company"}</p>
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); handleRemove(job._id); }}
                            disabled={isDeleting}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full flex items-center justify-center text-[#456882]/50 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-[#456882]">
                          {job.location && (
                            <span className="flex items-center gap-1.5 bg-[#E3E3E3]/50 px-2.5 py-1 rounded-lg">
                              <MapPin className="h-3.5 w-3.5 text-[#234C6A]" />{job.location}
                            </span>
                          )}
                          {job.type && (
                            <span className="flex items-center gap-1.5 bg-[#E3E3E3]/50 px-2.5 py-1 rounded-lg">
                              <Briefcase className="h-3.5 w-3.5 text-[#234C6A]" />{job.type}
                            </span>
                          )}
                          {job.salaryMin && job.salaryMax && (
                            <span className="flex items-center gap-1.5 bg-[#E3E3E3]/50 px-2.5 py-1 rounded-lg">
                              <DollarSign className="h-3.5 w-3.5 text-[#234C6A]" />{formatSalary(job.salaryMin, job.salaryMax)}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-xs text-[#456882]/60 ml-auto">
                            <Clock className="h-3 w-3" />
                            Saved {new Date(saved.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>

                        {job.description && (
                          <p className="text-sm text-[#456882]/70 line-clamp-2 leading-relaxed">{job.description}</p>
                        )}

                        {job.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {job.skills.slice(0, 5).map((s: string, i: number) => (
                              <Badge key={i} className="bg-[#234C6A]/5 text-[#234C6A] border border-[#234C6A]/10 text-xs font-medium">{s}</Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-3 pt-2">
                          <Link href={`/job/${job._id}`}>
                            <Button variant="outline" className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/5 rounded-xl text-sm h-9">
                              View Details <ArrowRight className="h-4 w-4 ml-1.5" />
                            </Button>
                          </Link>
                          <Link href={`/job/${job._id}`}>
                            <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] text-white rounded-xl text-sm h-9 hover:from-[#234C6A]/90 hover:to-[#456882]/90 shadow-md">
                              <Send className="h-3.5 w-3.5 mr-1.5" /> Apply Now
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
            <Card className="mt-8 p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Find More Jobs Like These</h3>
                    <p className="text-white/70 text-sm">Discover similar positions based on your saved jobs</p>
                  </div>
                </div>
                <Link href="/job">
                  <Button className="bg-white text-[#234C6A] hover:bg-white/90 font-bold rounded-xl px-6 h-11 shadow-lg flex-shrink-0">
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
