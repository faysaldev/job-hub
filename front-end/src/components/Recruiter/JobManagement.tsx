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
import { Job } from "@/src/types";
import { toast } from "@/src/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

const JobManagement = ({ userId }: { userId: string }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    // loadJobs();
  }, [userId]);

  const loadJobs = () => {
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const userJobs = allJobs.filter((job: Job) => job.recruiterId === userId);
    setJobs(userJobs);
  };

  const handleCreateJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const companyProfile = JSON.parse(
      localStorage.getItem("companyProfiles") || "{}"
    )[userId];
    const companyName = companyProfile?.companyName || "Your Company";

    const salaryRange = formData.get("salary") as string;
    const [min, max] = salaryRange
      .split("-")
      .map((s) => parseInt(s.trim().replace(/\D/g, "")));

    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      recruiterId: userId,
      companyName,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      skills: (formData.get("skills") as string)
        .split(",")
        .map((s) => s.trim()),
      experience: formData.get("experience") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as string,
      salary: salaryRange,
      salaryMin: min || 0,
      salaryMax: max || 0,
      deadline: formData.get("deadline") as string,
      postedDate: new Date().toISOString(),
      status: "active",
    };

    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    allJobs.push(newJob);
    localStorage.setItem("jobs", JSON.stringify(allJobs));

    loadJobs();
    setIsCreateDialogOpen(false);
    toast({ title: "Job posted successfully!" });
  };

  const deleteJob = (jobId: string) => {
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const updatedJobs = allJobs.filter((job: Job) => job.id !== jobId);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    loadJobs();
    toast({ title: "Job deleted" });
  };

  const toggleJobStatus = (jobId: string) => {
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const updatedJobs = allJobs.map((job: Job) =>
      job.id === jobId
        ? { ...job, status: job.status === "active" ? "closed" : "active" }
        : job
    );
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    loadJobs();
    toast({ title: "Job status updated" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Job Postings</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="type">Job Type</Label>
                <select
                  id="type"
                  name="type"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="Remote / San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <select
                  id="experience"
                  name="experience"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Lead/Principal">Lead/Principal</option>
                </select>
              </div>
              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  name="salary"
                  required
                  placeholder="$80,000 - $120,000"
                />
              </div>
              <div>
                <Label htmlFor="skills">
                  Required Skills (comma-separated)
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  required
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input id="deadline" name="deadline" type="date" required />
              </div>
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  placeholder="Describe the role, responsibilities, requirements..."
                />
              </div>
              <Button type="submit" className="w-full">
                Post Job
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No job postings yet.</p>
          <p className="text-muted-foreground mt-2">
            Create your first job posting to start receiving applications!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <Badge
                      variant={
                        job.status === "active" ? "default" : "secondary"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    {job.companyName}
                  </p>
                  <p className="text-sm mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{job.type}</Badge>
                    <Badge variant="outline">{job.location}</Badge>
                    <Badge variant="outline">{job.salary}</Badge>
                    <Badge variant="outline">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleJobStatus(job.id)}
                  >
                    {job.status === "active" ? "Close" : "Reopen"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteJob(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobManagement;
