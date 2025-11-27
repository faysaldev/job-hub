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

  // Dummy data initialization
  useEffect(() => {
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
        {
          id: "4",
          recruiterId: userId,
          companyName: "Tech Innovations Inc.",
          title: "UX/UI Designer",
          description:
            "Create beautiful user interfaces and experiences for our web and mobile applications.",
          skills: ["Figma", "Sketch", "Prototyping", "User Research"],
          experience: "Mid Level",
          location: "Remote",
          type: "Full-time",
          salary: "$90,000 - $110,000",
          salaryMin: 90000,
          salaryMax: 110000,
          deadline: "2025-12-01",
          posted: "2025-11-05",
          postedDate: "2025-11-05",
          status: "active",
          company: "Tech Innovations Inc.",
          responsibilities: [
            "Design user interfaces",
            "Conduct user research",
            "Create prototypes",
            "Collaborate with developers",
          ],
          requirements: [
            "Portfolio required",
            "3+ years design experience",
            "Figma expertise",
          ],
          benefits: ["Creative environment", "Remote work", "Flexible hours"],
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
  }, [userId]);

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

    // Reload jobs after creation
    const updatedJobs = allJobs.filter(
      (job: JobWithRecruiter) => job.recruiterId === userId
    );
    setJobs(updatedJobs);

    setIsCreateDialogOpen(false);
    toast({ title: "Job posted successfully!" });
  };

  const deleteJob = (jobId: string) => {
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const updatedJobs = allJobs.filter(
      (job: JobWithRecruiter) => job.id !== jobId
    );
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    // Update local state
    const userJobs = updatedJobs.filter(
      (job: JobWithRecruiter) => job.recruiterId === userId
    );
    setJobs(userJobs);

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

    // Update local state
    const userJobs = updatedJobs.filter(
      (job: JobWithRecruiter) => job.recruiterId === userId
    );
    setJobs(userJobs);

    toast({ title: "Job status updated" });
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
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
      </div>

      {jobs.length === 0 ? (
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
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="p-6 border-[#456882]/30 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[#234C6A] hover:text-[#456882] transition-colors">
                      {job.title}
                    </h3>
                    <Badge
                      variant={
                        job.status === "active" ? "default" : "secondary"
                      }
                      className={`${
                        job.status === "active"
                          ? "bg-[#234C6A]/10 text-[#234C6A] border-[#234C6A]/30"
                          : "bg-[#456882]/10 text-[#456882] border-[#456882]/30"
                      }`}
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-[#234C6A] mb-3">{job.companyName}</p>

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
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-[#234C6A]/90 mb-4 line-clamp-2">
                    {job.description}
                  </p>

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

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10 flex items-center gap-2"
                    onClick={() => toggleJobStatus(job.id)}
                  >
                    <Edit3 className="h-4 w-4" />
                    {job.status === "active" ? "Close" : "Reopen"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => deleteJob(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
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
