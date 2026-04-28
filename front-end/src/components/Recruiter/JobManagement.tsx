import { useState, useEffect } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { toast } from "@/src/hooks/use-toast";
import {
  Plus,
  Trash2,
  Edit3,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Job } from "@/src/types";
import {
  useGetJobsByAuthorQuery,
  useDeleteJobMutation,
  useUpdateJobMutation,
  useCreateJobMutation,
} from "@/src/redux/features/jobs/jobsApi";

// Define a new type that matches the component's usage instead of extending
interface JobWithRecruiter {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  skills: string[];
  status: "active" | "closed";
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  recruiterId: string;
  companyName: string;
  experience: string;
  salaryMin: number;
  salaryMax: number;
  deadline: string;
  postedDate: string;
}

const JobManagement = ({ userId }: { userId: string }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsIsError,
    error: jobsError,
  } = useGetJobsByAuthorQuery(userId);

  const [deleteJobMutation] = useDeleteJobMutation();
  const [updateJobMutation] = useUpdateJobMutation();
  const [createJobMutation] = useCreateJobMutation();

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const salaryRange = formData.get("salary") as string;
    const [min, max] = salaryRange
      .split("-")
      .map((s) => parseInt(s.trim().replace(/\D/g, "")));

    const jobData: Partial<Job> = {
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      location: formData.get("location") as string,
      experienceLevel: formData.get("experience") as string,
      salaryMin: min || 0,
      salaryMax: max || 0,
      description: formData.get("description") as string,
      skills: (formData.get("skills") as string)
        .split(",")
        .map((s) => s.trim()),
      applicationDeadline: formData.get("deadline") as string,
      // Default fields for now
      category: "engineering",
      subcategory: "software",
      locationType: "onsite",
      salaryPeriod: "yearly",
      positions: 1,
      requirements: [],
      responsibilities: [],
      benefits: [],
    };

    try {
      await createJobMutation(jobData).unwrap();
      setIsCreateDialogOpen(false);
      toast({ title: "Job posted successfully!" });
    } catch (error) {
      toast({
        title: "Failed to post job",
        variant: "destructive",
      });
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      await deleteJobMutation(jobId).unwrap();
      toast({ title: "Job deleted successfully" });
    } catch (error) {
      toast({
        title: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newActive = currentStatus !== "active";
      await updateJobMutation({
        jobId,
        body: { isActive: newActive },
      }).unwrap();
      toast({
        title: `Job ${newActive ? "activated" : "closed"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Failed to update job status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#234C6A]">
            Your Job Postings
          </h2>
          <p className="text-[#234C6A]/70 mt-1">
            Manage all your active and closed job listings
          </p>
        </div>
      </div>

      {!jobsData?.data || jobsData.data.length === 0 ? (
        <Card className="p-12 text-center border-[#456882]/30 bg-white">
          <div className="mx-auto bg-[#234C6A]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-[#234C6A]" />
          </div>
          <h3 className="text-xl font-semibold text-[#234C6A] mb-2">
            No job postings yet
          </h3>
          <p className="text-[#234C6A]/70 mb-4">
            Create your first job posting to start receiving applications!
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-[#456882]/30 rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-[#234C6A]">
                  Create New Job Posting
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-[#234C6A]">
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="Senior Software Engineer"
                    className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-[#234C6A]">
                    Job Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    required
                    className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="location" className="text-[#234C6A]">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    required
                    placeholder="Remote / San Francisco, CA"
                    className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                </div>
                <div>
                  <Label htmlFor="experience" className="text-[#234C6A]">
                    Experience Level
                  </Label>
                  <select
                    id="experience"
                    name="experience"
                    required
                    className="flex h-10 w-full rounded-md border border-[#456882]/30 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead/Principal">Lead/Principal</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="salary" className="text-[#234C6A]">
                    Salary Range
                  </Label>
                  <Input
                    id="salary"
                    name="salary"
                    required
                    placeholder="$80,000 - $120,000"
                    className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                </div>
                <div>
                  <Label htmlFor="skills" className="text-[#234C6A]">
                    Required Skills (comma-separated)
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    required
                    placeholder="React, TypeScript, Node.js"
                    className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline" className="text-[#234C6A]">
                    Application Deadline
                  </Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    required
                    className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-[#234C6A]">
                    Job Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    placeholder="Describe the role, responsibilities, requirements..."
                    className="border-[#456882]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                >
                  Post Job
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobsData?.data?.map((job: any) => {
            const status = job.isActive !== false ? "active" : "closed";
            return (
              <Card
                key={job._id}
                className="p-6 border-[#456882]/30 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-[#234C6A] hover:text-[#456882] transition-colors">
                        {job.title}
                      </h3>
                      <Badge
                        variant={status === "active" ? "default" : "secondary"}
                        className={`${
                          status === "active"
                            ? "bg-[#234C6A]/10 text-[#234C6A] border-[#234C6A]/30"
                            : "bg-[#456882]/10 text-[#456882] border-[#456882]/30"
                        }`}
                      >
                        {status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#234C6A]/70 mb-4">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {job.salaryMin} - {job.salaryMax} {job.salaryPeriod}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Deadline:{" "}
                          {new Date(
                            job.applicationDeadline,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#234C6A]/90 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.skills?.map((skill: string, index: number) => (
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

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10 flex items-center gap-2"
                      onClick={() => toggleJobStatus(job._id, status)}
                    >
                      <Edit3 className="h-4 w-4" />
                      {status === "active" ? "Close" : "Reopen"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => deleteJob(job._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobManagement;
