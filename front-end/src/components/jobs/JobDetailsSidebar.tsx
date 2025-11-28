"use client";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  DollarSign,
  Users,
  Building2,
  Star,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Job } from "@/src/types";
import { toast } from "@/src/hooks/use-toast";
import JobApplicationDialog from "./JobApplicationDialog";

interface JobDetailsSidebarProps {
  job: Job;
}

const JobDetailsSidebar = ({ job }: JobDetailsSidebarProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveJob = () => {
    // Get saved jobs from localStorage
    const savedJobsString = localStorage.getItem("savedJobs");
    const savedJobs: Job[] = savedJobsString ? JSON.parse(savedJobsString) : [];

    // Check if job is already saved
    const jobIndex = savedJobs.findIndex((savedJob) => savedJob.id === job.id);

    if (jobIndex === -1) {
      // Add job to saved jobs
      savedJobs.push(job);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      setIsSaved(true);
      toast({
        title: "Job Saved!",
        description: `${job.title} has been added to your saved jobs.`,
      });
    } else {
      // Remove job from saved jobs
      savedJobs.splice(jobIndex, 1);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      setIsSaved(false);
      toast({
        title: "Job Removed",
        description: `${job.title} has been removed from your saved jobs.`,
      });
    }
  };

  const handleApply = (resume: File | null) => {
    if (resume) {
      // In a real application, you would submit the application to the backend
      toast({
        title: "Application Submitted!",
        description: `Your application for ${job.title} has been submitted.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Please upload a resume to apply for this job.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Apply Card */}
      <Card className="p-6 bg-white border-[#456882]/30 sticky top-20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-[#234C6A]">
            <DollarSign className="h-6 w-6" />
            {job.salary}
          </div>
          <JobApplicationDialog jobTitle={job.title} onApply={handleApply} />
          <Button
            variant="outline"
            className="w-full border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
            onClick={handleSaveJob}
          >
            {isSaved ? (
              <span className="flex items-center justify-center gap-2">
                <BookmarkCheck className="h-4 w-4" /> Saved
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Bookmark className="h-4 w-4" /> Save Job
              </span>
            )}
          </Button>
        </div>
      </Card>

      {/* Company Info */}
      <Card className="p-6 bg-white border-[#456882]/30">
        <h3 className="font-semibold mb-4 text-[#234C6A]">
          About {job.company}
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-[#234C6A]">
            <Users className="h-4 w-4" />
            <span>500-1000 employees</span>
          </div>
          <div className="flex items-center gap-2 text-[#234C6A]">
            <Building2 className="h-4 w-4" />
            <span>Technology & Software</span>
          </div>
          <div className="flex items-center gap-2 text-[#234C6A]">
            <Star className="h-4 w-4 fill-current text-[#456882]" />
            <span>4.5/5 company rating</span>
          </div>
        </div>
        <Link href={`/company/${job.company.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}>
          <Button
            variant="link"
            className="mt-4 px-0 text-[#234C6A] hover:text-[#456882]"
          >
            View company profile
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default JobDetailsSidebar;
