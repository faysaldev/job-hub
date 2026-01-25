/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Job } from "@/src/types";
import SearchSection from "@/src/components/jobs/SearchSection";
import JobFilters from "@/src/components/jobs/JobFilters";
import JobCard from "@/src/components/jobs/JobCard";
import Pagination from "@/src/components/jobs/Pagination";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Briefcase,
  TrendingUp,
  Users,
  Sparkles,
  Target,
  Clock,
  Building2,
} from "lucide-react";
import gsap from "gsap";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [jobTypes, setJobTypes] = useState([
    { id: "full-time", label: "Full-time", checked: true },
    { id: "part-time", label: "Part-time", checked: true },
    { id: "freelance", label: "Freelance", checked: true },
  ]);

  const [experienceLevels, setExperienceLevels] = useState([
    { id: "entry", label: "Entry Level", checked: true },
    { id: "mid", label: "Mid Level", checked: true },
    { id: "senior", label: "Senior Level", checked: true },
  ]);

  const [salaryRanges, setSalaryRanges] = useState([
    { id: "0-50", label: "$0 - $50k", checked: true },
    { id: "50-100", label: "$50k - $100k", checked: true },
    { id: "100-150", label: "$100k - $150k", checked: true },
    { id: "150+", label: "$150k+", checked: true },
  ]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stats-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );

      gsap.fromTo(
        ".filters-section",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );

      gsap.fromTo(
        ".job-card-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.3, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [currentPage]);

  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      try {
        const allJobs: any[] = JSON.parse(storedJobs);
        const processedJobs: Job[] = allJobs
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
      } catch (error) {
        console.error("Error parsing jobs from localStorage:", error);
      }
    }
  }, []);

  // Filter jobs based on search terms and filters
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesLocation =
      !locationTerm ||
      job.location.toLowerCase().includes(locationTerm.toLowerCase()) ||
      (locationTerm.toLowerCase().includes("remote") &&
        job.location.toLowerCase().includes("remote"));

    const selectedJobTypes = jobTypes
      .filter((type) => type.checked)
      .map((type) => type.id);
    const matchesJobType =
      selectedJobTypes.length === 0 ||
      selectedJobTypes.length === jobTypes.length ||
      selectedJobTypes.some((type) => job.type.toLowerCase().includes(type));

    return matchesSearch && matchesLocation && matchesJobType;
  });

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const jobListingsElement = document.querySelector(".job-listings");
    if (jobListingsElement) {
      jobListingsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationTerm(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleJobTypeChange = (id: string) => {
    setJobTypes((prev) =>
      prev.map((type) =>
        type.id === id ? { ...type, checked: !type.checked } : type
      )
    );
  };

  const handleExperienceChange = (id: string) => {
    setExperienceLevels((prev) =>
      prev.map((level) =>
        level.id === id ? { ...level, checked: !level.checked } : level
      )
    );
  };

  const handleSalaryChange = (id: string) => {
    setSalaryRanges((prev) =>
      prev.map((range) =>
        range.id === id ? { ...range, checked: !range.checked } : range
      )
    );
  };

  // Stats data
  const stats = [
    { icon: Briefcase, label: "Total Jobs", value: mockJobs.length, color: "from-[#234C6A] to-[#456882]" },
    { icon: Building2, label: "Companies", value: 45, color: "from-blue-500 to-cyan-500" },
    { icon: TrendingUp, label: "New Today", value: 12, color: "from-green-500 to-emerald-500" },
    { icon: Users, label: "Applicants", value: "2.4k", color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1 mx-auto w-full container">
        <SearchSection
          searchTerm={searchTerm}
          locationTerm={locationTerm}
          onSearchChange={handleSearchChange}
          onLocationChange={handleLocationChange}
          onSearch={handleSearch}
          onSearchKeyDown={handleSearchKeyDown}
        />

        {/* Stats Section */}
        <section className="py-6">
          <div className="container px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="stats-card p-4 border-none bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#234C6A]">{stat.value}</p>
                      <p className="text-sm text-[#456882]">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8 md:py-12">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Filters Sidebar */}
              <div className="filters-section md:w-72 flex-shrink-0">
                <div className="sticky top-24">
                  <JobFilters
                    jobTypes={jobTypes}
                    experienceLevels={experienceLevels}
                    salaryRanges={salaryRanges}
                    onJobTypeChange={handleJobTypeChange}
                    onExperienceChange={handleExperienceChange}
                    onSalaryChange={handleSalaryChange}
                  />

                  {/* Quick Tips Card */}
                  <Card className="mt-6 p-5 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5" />
                      <h3 className="font-semibold">Job Search Tips</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Use specific keywords for better results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>Apply early - fresh jobs get more attention</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>

              {/* Job Listings */}
              <div className="flex-1 job-listings">
                {/* Results Header */}
                <Card className="p-4 mb-6 border-none bg-white shadow-md rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#234C6A] mb-1">
                        Available Positions
                      </h2>
                      <p className="text-[#456882]">
                        Showing{" "}
                        <span className="font-semibold text-[#234C6A]">
                          {Math.min(
                            (currentPage - 1) * jobsPerPage + 1,
                            filteredJobs.length
                          )}{" "}
                          -{" "}
                          {Math.min(currentPage * jobsPerPage, filteredJobs.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-[#234C6A]">
                          {filteredJobs.length}
                        </span>{" "}
                        jobs
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-700 border-none">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        {filteredJobs.length} Active
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Jobs List */}
                {currentJobs.length > 0 ? (
                  <div className="space-y-4">
                    {currentJobs.map((job, index) => (
                      <div key={job.id} className="job-card-item">
                        <JobCard job={job} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center border-none bg-white shadow-md rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-[#234C6A]/10 flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-[#234C6A]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#234C6A] mb-2">
                      No Jobs Found
                    </h3>
                    <p className="text-[#456882] max-w-md mx-auto">
                      We could not find any jobs matching your criteria. Try adjusting your filters or search terms.
                    </p>
                  </Card>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalJobs={filteredJobs.length}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
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
