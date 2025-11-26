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
  const [jobs, setJobs] = useState<JobWithRecruiter[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const loadJobs = () => {
    // Check if jobs exist in localStorage, otherwise initialize with dummy data
    const storedJobs = localStorage.getItem("jobs");
    if (!storedJobs || JSON.parse(storedJobs).length === 0) {
      // Initialize with dummy data
      const dummyJobs: JobWithRecruiter[] = [
        {
          id: "1",
          recruiterId: userId,
          companyName: "Tech Innovations Inc.",
          title: "Senior Frontend Developer",
          description:
            "We are looking for an experienced frontend developer with expertise in React and TypeScript to join our dynamic team.",
          skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
          experience: "Mid Level",
          location: "Remote",
          type: "Full-time",
          salary: "$100,000 - $130,000",
          salaryMin: 100000,
          salaryMax: 130000,
          deadline: "2025-12-31",
          posted: "2025-11-01",
          postedDate: "2025-11-01",
          status: "active",
          company: "Tech Innovations Inc.",
          responsibilities: [
            "Develop responsive UI components",
            "Collaborate with designers",
            "Mentor junior developers",
          ],
          requirements: [
            "5+ years experience",
            "Strong React knowledge",
            "TypeScript proficiency",
          ],
          benefits: ["Health insurance", "Remote work", "Flexible hours"],
        },
        {
          id: "2",
          recruiterId: userId,
          companyName: "Tech Innovations Inc.",
          title: "Backend Engineer",
          description:
            "Join our backend team to build scalable APIs and services for our enterprise applications.",
          skills: ["Node.js", "Express", "MongoDB", "AWS"],
          experience: "Senior Level",
          location: "San Francisco, CA",
          type: "Full-time",
          salary: "$120,000 - $150,000",
          salaryMin: 120000,
          salaryMax: 150000,
          deadline: "2025-12-15",
          posted: "2025-10-15",
          postedDate: "2025-10-15",
          status: "active",
          company: "Tech Innovations Inc.",
          responsibilities: [
            "Design and implement APIs",
            "Database optimization",
            "System architecture",
          ],
          requirements: [
            "8+ years experience",
            "Node.js expertise",
            "Cloud experience",
          ],
          benefits: ["Stock options", "Gym membership", "Learning budget"],
        },
        {
          id: "3",
          recruiterId: userId,
          companyName: "Tech Innovations Inc.",
          title: "DevOps Specialist",
          description:
            "Help us improve our deployment processes and maintain our cloud infrastructure.",
          skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
          experience: "Senior Level",
          location: "Remote",
          type: "Contract",
          salary: "$80 - $120 per hour",
          salaryMin: 80,
          salaryMax: 120,
          deadline: "2025-11-30",
          posted: "2025-11-10",
          postedDate: "2025-11-10",
          status: "closed",
          company: "Tech Innovations Inc.",
          responsibilities: [
            "Maintain CI/CD pipelines",
            "Cloud infrastructure",
            "Security compliance",
          ],
          requirements: [
            "AWS certification",
            "Docker experience",
            "Infrastructure as code",
          ],
          benefits: ["Flexible schedule", "Remote work", "Equipment allowance"],
        },
      ];
      localStorage.setItem("jobs", JSON.stringify(dummyJobs));
      setJobs(dummyJobs.filter((job) => job.recruiterId === userId));
    } else {
      const allJobs = JSON.parse(storedJobs);
      const userJobs = allJobs.filter(
        (job: JobWithRecruiter) => job.recruiterId === userId
      );
      setJobs(userJobs);
    }
  };

  useEffect(() => {
    // Load jobs from localStorage or set dummy data
    // loadJobs();
  }, [userId, loadJobs]); // Added loadJobs to the dependency array to satisfy eslint

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

    const newJob: JobWithRecruiter = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get("title") as string,
      company: companyName,
      location: formData.get("location") as string,
      type: formData.get("type") as string,
      salary: salaryRange,
      posted: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
      description: formData.get("description") as string,
      skills: (formData.get("skills") as string)
        .split(",")
        .map((s) => s.trim()),
      status: "active",
      recruiterId: userId,
      companyName,
      experience: formData.get("experience") as string,
      salaryMin: min || 0,
      salaryMax: max || 0,
      deadline: formData.get("deadline") as string,
      postedDate: new Date().toISOString(),
      responsibilities: [],
      requirements: [],
      benefits: [],
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
    const updatedJobs = allJobs.filter(
      (job: JobWithRecruiter) => job.id !== jobId
    );
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    loadJobs();
    toast({ title: "Job deleted" });
  };

  const toggleJobStatus = (jobId: string) => {
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const updatedJobs = allJobs.map((job: JobWithRecruiter) =>
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
