/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Job } from "@/src/types";
import SearchSection from "@/src/components/jobs/SearchSection";
import JobFilters from "@/src/components/jobs/JobFilters";
import JobCard from "@/src/components/jobs/JobCard";
import Pagination from "@/src/components/jobs/Pagination";

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
  const jobsPerPage = 5; // Number of jobs to show per page

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

  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      try {
        const allJobs: any[] = JSON.parse(storedJobs);
        // Type check and ensure all jobs have required properties
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

        // setJobs(processedJobs);
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

  // Filter jobs based on search terms and filters
  const filteredJobs = mockJobs.filter((job) => {
    // Apply search term filter
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Apply location filter
    const matchesLocation =
      !locationTerm ||
      job.location.toLowerCase().includes(locationTerm.toLowerCase()) ||
      (locationTerm.toLowerCase().includes("remote") &&
        job.location.toLowerCase().includes("remote"));

    // Apply job type filter
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
    // Scroll to top of job listings when changing pages
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
    // This will trigger the useEffect to filter jobs
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

  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
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

        {/* Results Section */}
        <section className="py-8 md:py-12">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Filters Sidebar */}
              <div className="md:w-64 flex-shrink-0">
                <JobFilters
                  jobTypes={jobTypes}
                  experienceLevels={experienceLevels}
                  salaryRanges={salaryRanges}
                  onJobTypeChange={handleJobTypeChange}
                  onExperienceChange={handleExperienceChange}
                  onSalaryChange={handleSalaryChange}
                />
              </div>

              {/* Job Listings */}
              <div className="flex-1 job-listings">
                <div className="mb-6">
                  <p className="text-[#234C6A]">
                    Showing{" "}
                    <span className="font-semibold text-[#456882]">
                      {Math.min(
                        (currentPage - 1) * jobsPerPage + 1,
                        filteredJobs.length
                      )}{" "}
                      to{" "}
                      {Math.min(currentPage * jobsPerPage, filteredJobs.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#456882]">
                      {filteredJobs.length}
                    </span>{" "}
                    jobs
                  </p>
                </div>

                <div className="space-y-4">
                  {currentJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

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
