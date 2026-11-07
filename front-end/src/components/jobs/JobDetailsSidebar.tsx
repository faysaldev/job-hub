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


  return (
    <div className="space-y-6">
      {/* Apply Card */}
      <Card className="p-6 bg-white border-[#516C83]/30 sticky top-20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-[#163B5C]">
            <DollarSign className="h-6 w-6" />
            {job.salary}
          </div>
          <JobApplicationDialog jobId={String(job.id)} jobTitle={job.title} companyName={job.company} />
          <Button
            variant="outline"
            className="w-full border-[#163B5C] text-[#163B5C] hover:bg-[#163B5C]/10"
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
      <Card className="p-6 bg-white border-[#516C83]/30">
        <h3 className="font-semibold mb-4 text-[#163B5C]">
          About {job.company}
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-[#163B5C]">
            <Users className="h-4 w-4" />
            <span>500-1000 employees</span>
          </div>
          <div className="flex items-center gap-2 text-[#163B5C]">
            <Building2 className="h-4 w-4" />
            <span>Technology & Software</span>
          </div>
          <div className="flex items-center gap-2 text-[#163B5C]">
            <Star className="h-4 w-4 fill-current text-[#516C83]" />
            <span>4.5/5 company rating</span>
          </div>
        </div>
        <Link href={`/company/${job.company.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}>
          <Button
            variant="link"
            className="mt-4 px-0 text-[#163B5C] hover:text-[#516C83]"
          >
            View company profile
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default JobDetailsSidebar;
