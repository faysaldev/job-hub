"use client";

import { useState, useEffect } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { MapPin, Briefcase, Clock, DollarSign, X } from "lucide-react";
import Link from "next/link";
import { Job } from "@/src/types";
import { toast } from "@/src/hooks/use-toast";

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>(() => {
    // Initialize state from localStorage
    const savedJobsString = localStorage.getItem("savedJobs");

    if (savedJobsString) {
      try {
        return JSON.parse(savedJobsString);
      } catch (error) {
        console.error("Error parsing saved jobs:", error);
        return [];
      }
    }

    return [];
  });

  const handleRemoveJob = (jobId: number) => {
    // Remove job from saved jobs
    const updatedSavedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
    
    toast({
      title: "Job Removed",
      description: "The job has been removed from your saved jobs.",
    });
  };

  const handleClearAll = () => {
    setSavedJobs([]);
    localStorage.removeItem("savedJobs");
    toast({
      title: "All Jobs Cleared",
      description: "All saved jobs have been removed.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#234C6A]">Saved Jobs</h1>
              {savedJobs.length > 0 && (
                <Button
                  variant="outline"
                  className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              )}
            </div>

            {savedJobs.length === 0 ? (
              <Card className="p-12 text-center border-[#456882]/30 bg-white">
                <div className="max-w-md mx-auto">
                  <div className="bg-[#234C6A]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="h-8 w-8 text-[#234C6A]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#234C6A] mb-2">No Saved Jobs</h3>
                  <p className="text-[#234C6A] mb-6">
                    You haven&apos;t saved any jobs yet. Start browsing jobs and save the ones you&apos;re interested in.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                    <Link href="/job">Browse Jobs</Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                <p className="text-[#234C6A]">
                  You have <span className="font-semibold text-[#456882]">{savedJobs.length}</span> saved jobs
                </p>
                
                <div className="space-y-4">
                  {savedJobs.map((job) => (
                    <Card 
                      key={job.id} 
                      className="p-6 border-[#456882]/30 bg-white hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-[#234C6A] hover:text-[#456882] transition-colors">
                                <Link href={`/job/${job.id}`}>
                                  {job.title}
                                </Link>
                              </h3>
                              <p className="text-[#234C6A]">
                                {job.company}
                              </p>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#234C6A]"
                              onClick={() => handleRemoveJob(job.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-[#234C6A]">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.posted}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary"
                                className="bg-[#234C6A]/10 text-[#234C6A] hover:bg-[#234C6A]/20"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10">
                            <Link href={`/job/${job.id}`}>View Details</Link>
                          </Button>
                          <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SavedJobsPage;