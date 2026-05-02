"use client";

import { useState, useEffect, useRef } from "react";
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
  X,
  Heart,
  Trash2,
  Bookmark,
  Send,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Job } from "@/src/types";
import { toast } from "@/src/hooks/use-toast";
import gsap from "gsap";
import {
  useGetUserSavedJobsQuery,
  useDeleteSavedJobMutation,
} from "@/src/redux/features/savedJobs/savedJobsApi";
import { Loader2 } from "lucide-react";

const SavedJobsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // API Queries and Mutations
  const {
    data: apiResponse,
    isLoading: isFetching,
    error,
  } = useGetUserSavedJobsQuery();
  const [deleteSavedJob, { isLoading: isDeleting }] =
    useDeleteSavedJobMutation();

  // Extract saved jobs from response
  const savedJobs = (apiResponse as any)?.data || [];

  // GSAP animations
  useEffect(() => {
    if (!isFetching && savedJobs.length > 0) {
      const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        ".stats-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        ".saved-job-card",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.4,
          ease: "power2.out",
        },
      );
    }, containerRef);

      return () => ctx.revert();
    }
  }, [savedJobs]);

  const handleRemoveJob = async (jobId: string) => {
    try {
      await deleteSavedJob(jobId).unwrap();
      toast({
        title: "Success",
        description: "Job removed from saved list",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to remove job",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = () => {
    // This could be implemented with a bulk delete mutation if needed
    toast({
      title: "Coming Soon",
      description: "Clear all functionality will be available soon.",
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="page-header mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-[#234C6A]">
                        Saved Jobs
                      </h1>
                      <p className="text-[#456882]">
                        Jobs you are interested in
                      </p>
                    </div>
                  </div>
                </div>

                {savedJobs.length > 0 && (
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleClearAll}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Content Section */}
            {isFetching ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
                <Loader2 className="h-10 w-10 animate-spin text-[#234C6A] mb-4" />
                <p className="text-[#456882] font-medium">Loading your saved jobs...</p>
              </div>
            ) : savedJobs.length === 0 ? (
              <Card className="p-12 text-center border-none bg-white shadow-lg rounded-2xl">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#234C6A]/10 to-[#456882]/10 flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="h-10 w-10 text-[#234C6A]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#234C6A] mb-3">
                    No Saved Jobs Yet
                  </h3>
                  <p className="text-[#456882] mb-8">
                    Start exploring jobs and save the ones you are interested
                    in. They will appear here for easy access.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white h-12 px-8"
                  >
                    <Link href="/job">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((saved: any) => {
                  const job = saved.jobId;
                  if (!job) return null;

                  return (
                    <Card
                      key={saved._id}
                      className="saved-job-card group relative p-6 border-none bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(35,76,106,0.1)] rounded-2xl hover:shadow-[0_8px_30px_-4px_rgba(35,76,106,0.2)] transition-all duration-300 overflow-hidden"
                    >
                      {/* Decorative Accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#234C6A] to-[#456882] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Company Logo */}
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E3E3E3]/50 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          {job.company?.companyLogo ? (
                            <img
                              src={job.company.companyLogo}
                              alt={job.company.companyName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-8 w-8 text-[#234C6A]" />
                          )}
                        </div>

                        {/* Job Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/job/${job._id}`}>
                                <h3 className="text-xl font-semibold text-[#234C6A] hover:text-[#456882] transition-colors">
                                  {job.title}
                                </h3>
                              </Link>
                              <p className="text-[#456882] font-medium">
                                {job.company?.companyName || "Unknown Company"}
                              </p>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting}
                              className="text-[#456882] hover:text-red-500 hover:bg-red-50"
                              onClick={() => handleRemoveJob(job._id)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>

                          {/* Job Meta */}
                          <div className="flex flex-wrap gap-4 text-sm text-[#456882]">
                            <span className="flex items-center gap-1.5 bg-[#E3E3E3]/50 px-2 py-1 rounded-md">
                              <MapPin className="h-3.5 w-3.5 text-[#234C6A]" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1.5 bg-[#E3E3E3]/50 px-2 py-1 rounded-md">
                              <Briefcase className="h-3.5 w-3.5 text-[#234C6A]" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1.5 bg-[#E3E3E3]/50 px-2 py-1 rounded-md">
                              <DollarSign className="h-3.5 w-3.5 text-[#234C6A]" />
                              ${job.salaryMin} - ${job.salaryMax}
                            </span>
                            <span className="flex items-center gap-1.5 ml-auto text-xs font-medium">
                              <Clock className="h-3 w-3" />
                              Saved {new Date(saved.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Description */}
                          {job.description && (
                            <p className="text-sm text-[#456882]/80 line-clamp-2 leading-relaxed">
                              {job.description}
                            </p>
                          )}

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2">
                            {job.skills?.slice(0, 5).map((skill: string, index: number) => (
                              <Badge
                                key={index}
                                className="bg-[#234C6A]/10 text-[#234C6A] border-none"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-2">
                            <Link href={`/job/${job._id}`}>
                              <Button
                                variant="outline"
                                className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                              >
                                View Details
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                            <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                              <Send className="h-4 w-4 mr-2" />
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}      {/* Recommendation Card */}
            {savedJobs.length > 0 && (
              <Card className="mt-8 p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        Find More Jobs Like These
                      </h3>
                      <p className="text-white/80 text-sm">
                        Based on your saved jobs, we have found 24 similar
                        positions
                      </p>
                    </div>
                  </div>
                  <Link href="/job">
                    <Button className="bg-white text-[#234C6A] hover:bg-white/90">
                      Explore Similar Jobs
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SavedJobsPage;
