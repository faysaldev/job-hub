/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Filter,
} from "lucide-react";
import Link from "next/link";

import { Job } from "@/src/types";

// Define mock jobs with the required status field
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $150k",
    posted: "2 days ago",
    description:
      "We're looking for an experienced Frontend Developer to join our growing team...",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    status: "active",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "DesignStudio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $120k",
    posted: "1 week ago",
    description:
      "Join our creative team and help shape the future of our products...",
    skills: ["Figma", "UI/UX", "Prototyping"],
    status: "active",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "DataFlow",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    posted: "3 days ago",
    description: "Build scalable backend systems for our enterprise clients...",
    skills: ["Node.js", "PostgreSQL", "AWS"],
    status: "active",
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "GrowthLabs",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $110k",
    posted: "5 days ago",
    description: "Lead our marketing initiatives and drive user acquisition...",
    skills: ["SEO", "Content Strategy", "Analytics"],
    status: "active",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudSystems",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110k - $140k",
    posted: "1 day ago",
    description: "Manage our cloud infrastructure and deployment pipelines...",
    skills: ["Docker", "Kubernetes", "CI/CD"],
    status: "active",
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "AI Innovations",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$130k - $170k",
    posted: "4 days ago",
    description: "Apply machine learning to solve complex business problems...",
    skills: ["Python", "TensorFlow", "SQL"],
    status: "active",
  },
];

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      try {
        const allJobs: any[] = JSON.parse(storedJobs);
        // Type check and ensure all jobs have required properties
        const validJobs: Job[] = allJobs
          .filter(
            (job) =>
              typeof job.id === "number" &&
              typeof job.title === "string" &&
              typeof job.company === "string" &&
              typeof job.location === "string" &&
              typeof job.type === "string" &&
              typeof job.salary === "string" &&
              typeof job.posted === "string" &&
              typeof job.description === "string" &&
              Array.isArray(job.skills)
          )
          .map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            salary: job.salary,
            posted: job.posted,
            description: job.description,
            skills: job.skills,
            status: job.status || ("active" as const),
          }));

        // setJobs(validJobs);
      } catch (error) {
        console.error("Error parsing jobs from localStorage:", error);
        // Fallback to mock data if parsing fails
        // setJobs(mockJobs);
      }
    } else {
      // Use mock data if no stored jobs
      // setJobs(mockJobs);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-auto container">
        {/* Search Section */}
        <section className=" border-b border-border py-12">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Find Your Dream Job
            </h1>
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="pl-10 h-12 bg-background"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="City, state, or remote"
                  className="pl-10 h-12 bg-background"
                />
              </div>
              <Button className="h-12 px-8 bg-accent hover:bg-accent/90">
                Search Jobs
              </Button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="w-full md:w-64 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Job Type</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Full-time
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Part-time
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Freelance
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Experience Level
                      </h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Entry Level
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Mid Level
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Senior Level
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Salary Range</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          $0 - $50k
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          $50k - $100k
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          $100k - $150k
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          $150k+
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Job Listings */}
              <div className="flex-1">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                      {jobs.length}
                    </span>{" "}
                    jobs
                  </p>
                </div>

                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link key={job.id} href={`/job/${job.id}`}>
                      <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <div>
                              <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-muted-foreground">
                                {job.company}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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

                            <p className="text-muted-foreground line-clamp-2">
                              {job.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Button variant="outline" className="md:ml-4">
                            View Details
                          </Button>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
