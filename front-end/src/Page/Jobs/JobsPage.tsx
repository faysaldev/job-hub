/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
  jobCategories,
  companySizes,
  postedDateOptions,
  applicantsOptions,
} from "@/src/lib/jobCategories";

// Extended Job interface for filtering
interface ExtendedJob extends Job {
  category?: string;
  subcategory?: string;
  companySize?: number;
  applicants?: number;
  postedDays?: number;
  salaryMin?: number;
  salaryMax?: number;
}

// Define mock jobs with extended fields for filtering
const mockJobs: ExtendedJob[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $150k",
    posted: "2 days ago",
    description: "We're looking for an experienced Frontend Developer to join our growing team...",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    status: "active",
    category: "technology",
    subcategory: "frontend",
    companySize: 150,
    applicants: 45,
    postedDays: 2,
    salaryMin: 100000,
    salaryMax: 150000,
  },
  {
    id: 2,
    title: "Product Designer",
    company: "DesignStudio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $120k",
    posted: "1 week ago",
    description: "Join our creative team and help shape the future of our products...",
    skills: ["Figma", "UI/UX", "Prototyping"],
    status: "active",
    category: "design",
    subcategory: "product",
    companySize: 45,
    applicants: 78,
    postedDays: 7,
    salaryMin: 90000,
    salaryMax: 120000,
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
    category: "technology",
    subcategory: "backend",
    companySize: 320,
    applicants: 23,
    postedDays: 3,
    salaryMin: 120000,
    salaryMax: 160000,
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
    category: "marketing",
    subcategory: "digital",
    companySize: 85,
    applicants: 56,
    postedDays: 5,
    salaryMin: 80000,
    salaryMax: 110000,
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
    category: "technology",
    subcategory: "devops",
    companySize: 500,
    applicants: 12,
    postedDays: 1,
    salaryMin: 110000,
    salaryMax: 140000,
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
    category: "technology",
    subcategory: "data-science",
    companySize: 200,
    applicants: 89,
    postedDays: 4,
    salaryMin: 130000,
    salaryMax: 170000,
  },
  {
    id: 7,
    title: "UI/UX Designer",
    company: "CreativeMinds",
    location: "Remote",
    type: "Part-time",
    salary: "$60k - $80k",
    posted: "Today",
    description: "Create beautiful and intuitive user interfaces...",
    skills: ["Figma", "Adobe XD", "User Research"],
    status: "active",
    category: "design",
    subcategory: "ui-ux",
    companySize: 25,
    applicants: 5,
    postedDays: 0,
    salaryMin: 60000,
    salaryMax: 80000,
  },
  {
    id: 8,
    title: "Sales Development Representative",
    company: "SalesForce Pro",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$50k - $70k",
    posted: "2 weeks ago",
    description: "Drive sales growth through outbound prospecting...",
    skills: ["CRM", "Cold Calling", "Negotiation"],
    status: "active",
    category: "sales",
    subcategory: "sdr",
    companySize: 1200,
    applicants: 120,
    postedDays: 14,
    salaryMin: 50000,
    salaryMax: 70000,
  },
  {
    id: 9,
    title: "Financial Analyst",
    company: "FinTech Solutions",
    location: "New York, NY",
    type: "Full-time",
    salary: "$85k - $115k",
    posted: "6 days ago",
    description: "Analyze financial data and provide strategic insights...",
    skills: ["Excel", "Financial Modeling", "SQL"],
    status: "active",
    category: "finance",
    subcategory: "financial-analyst",
    companySize: 350,
    applicants: 34,
    postedDays: 6,
    salaryMin: 85000,
    salaryMax: 115000,
  },
  {
    id: 10,
    title: "HR Recruiter",
    company: "TalentHub",
    location: "Remote",
    type: "Full-time",
    salary: "$55k - $75k",
    posted: "3 days ago",
    description: "Source and recruit top talent for our clients...",
    skills: ["Recruiting", "LinkedIn", "Interviewing"],
    status: "active",
    category: "hr",
    subcategory: "recruiting",
    companySize: 60,
    applicants: 28,
    postedDays: 3,
    salaryMin: 55000,
    salaryMax: 75000,
  },
  {
    id: 11,
    title: "Full Stack Developer",
    company: "WebSolutions",
    location: "Seattle, WA",
    type: "Freelance",
    salary: "$75k - $95k",
    posted: "1 week ago",
    description: "Build end-to-end web applications...",
    skills: ["React", "Node.js", "MongoDB"],
    status: "active",
    category: "technology",
    subcategory: "fullstack",
    companySize: 15,
    applicants: 67,
    postedDays: 7,
    salaryMin: 75000,
    salaryMax: 95000,
  },
  {
    id: 12,
    title: "Registered Nurse",
    company: "HealthCare Plus",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$70k - $90k",
    posted: "Today",
    description: "Provide compassionate patient care in our hospital...",
    skills: ["Patient Care", "Medical Records", "CPR"],
    status: "active",
    category: "healthcare",
    subcategory: "nursing",
    companySize: 800,
    applicants: 15,
    postedDays: 0,
    salaryMin: 70000,
    salaryMax: 90000,
  },
];

const Jobs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const containerRef = useRef<HTMLDivElement>(null);

  // URL-based category/subcategory selection
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

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
    { id: "0-30k", label: "$0 - $30k", checked: false, min: 0, max: 30000 },
    { id: "30k-50k", label: "$30k - $50k", checked: false, min: 30000, max: 50000 },
    { id: "50k-75k", label: "$50k - $75k", checked: false, min: 50000, max: 75000 },
    { id: "75k-100k", label: "$75k - $100k", checked: false, min: 75000, max: 100000 },
    { id: "100k-150k", label: "$100k - $150k", checked: false, min: 100000, max: 150000 },
    { id: "150k+", label: "$150k+", checked: false, min: 150000, max: Infinity },
  ]);

  // Category filters
  const [categoryFilters, setCategoryFilters] = useState(
    jobCategories.map(cat => ({
      id: cat.id,
      label: cat.name,
      checked: false,
      count: cat.count,
    }))
  );

  // Subcategory filters (based on selected category)
  const [subcategoryFilters, setSubcategoryFilters] = useState<Array<{
    id: string;
    label: string;
    checked: boolean;
    count?: number;
  }>>([]);

  // Company size filters
  const [companySizeFilters, setCompanySizeFilters] = useState(
    companySizes.map(size => ({
      id: size.id,
      label: size.label,
      checked: false,
      min: size.min,
      max: size.max,
    }))
  );

  // Posted date filters
  const [postedDateFilters, setPostedDateFilters] = useState(
    postedDateOptions.map(date => ({
      id: date.id,
      label: date.label,
      checked: false,
      days: date.days,
    }))
  );

  // Applicant count filters
  const [applicantCountFilters, setApplicantCountFilters] = useState(
    applicantsOptions.map(opt => ({
      id: opt.id,
      label: opt.label,
      checked: false,
      min: opt.min,
      max: opt.max,
    }))
  );

  // Helper function to update URL with current filters
  const updateURLParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/job?${queryString}` : "/job", { scroll: false });
  }, [searchParams, router]);

  // Read URL parameters on mount and when URL changes
  useEffect(() => {
    // Search term
    const searchParam = searchParams.get("s");
    if (searchParam !== null) {
      setSearchTerm(searchParam);
    }

    // Location
    const locationParam = searchParams.get("location");
    if (locationParam !== null) {
      setLocationTerm(locationParam);
    }

    // Category
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCategoryFilters(prev => prev.map(cat => ({
        ...cat,
        checked: cat.id === categoryParam,
      })));

      // Load subcategories for the selected category
      const category = jobCategories.find(c => c.id === categoryParam);
      if (category) {
        const subcategoryParam = searchParams.get("subcategory");
        setSubcategoryFilters(
          category.subcategories.map(sub => ({
            id: sub.id,
            label: sub.name,
            checked: sub.id === subcategoryParam,
            count: sub.count,
          }))
        );
        if (subcategoryParam) {
          setSelectedSubcategory(subcategoryParam);
        }
      }
    }

    // Job types
    const jobTypesParam = searchParams.get("types");
    if (jobTypesParam) {
      const selectedTypes = jobTypesParam.split(",");
      setJobTypes(prev => prev.map(type => ({
        ...type,
        checked: selectedTypes.includes(type.id),
      })));
    }

    // Salary ranges
    const salaryParam = searchParams.get("salary");
    if (salaryParam) {
      const selectedSalaries = salaryParam.split(",");
      setSalaryRanges(prev => prev.map(range => ({
        ...range,
        checked: selectedSalaries.includes(range.id),
      })));
    }

    // Company size
    const companySizeParam = searchParams.get("companySize");
    if (companySizeParam) {
      const selectedSizes = companySizeParam.split(",");
      setCompanySizeFilters(prev => prev.map(size => ({
        ...size,
        checked: selectedSizes.includes(size.id),
      })));
    }

    // Posted date
    const postedDateParam = searchParams.get("posted");
    if (postedDateParam) {
      const selectedDates = postedDateParam.split(",");
      setPostedDateFilters(prev => prev.map(date => ({
        ...date,
        checked: selectedDates.includes(date.id),
      })));
    }

    // Applicant count
    const applicantsParam = searchParams.get("applicants");
    if (applicantsParam) {
      const selectedApplicants = applicantsParam.split(",");
      setApplicantCountFilters(prev => prev.map(count => ({
        ...count,
        checked: selectedApplicants.includes(count.id),
      })));
    }

    // Page number
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10) || 1);
    }
  }, [searchParams]);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = jobCategories.find(c => c.id === selectedCategory);
      if (category) {
        setSubcategoryFilters(
          category.subcategories.map(sub => ({
            id: sub.id,
            label: sub.name,
            checked: sub.id === selectedSubcategory,
            count: sub.count,
          }))
        );
      }
    } else {
      setSubcategoryFilters([]);
    }
  }, [selectedCategory, selectedSubcategory]);

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

  // Calculate active filter count
  const activeFilterCount =
    categoryFilters.filter(c => c.checked).length +
    subcategoryFilters.filter(s => s.checked).length +
    jobTypes.filter(t => !t.checked).length +
    experienceLevels.filter(e => !e.checked).length +
    salaryRanges.filter(s => s.checked).length +
    companySizeFilters.filter(c => c.checked).length +
    postedDateFilters.filter(d => d.checked).length +
    applicantCountFilters.filter(a => a.checked).length;

  // Filter jobs based on all criteria
  const filteredJobs = mockJobs.filter((job) => {
    // Search term filter
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Location filter
    const matchesLocation =
      !locationTerm ||
      job.location.toLowerCase().includes(locationTerm.toLowerCase()) ||
      (locationTerm.toLowerCase().includes("remote") &&
        job.location.toLowerCase().includes("remote"));

    // Job type filter
    const selectedJobTypes = jobTypes.filter((type) => type.checked).map((type) => type.id);
    const matchesJobType =
      selectedJobTypes.length === 0 ||
      selectedJobTypes.length === jobTypes.length ||
      selectedJobTypes.some((type) => job.type.toLowerCase().includes(type));

    // Category filter
    const selectedCategories = categoryFilters.filter(c => c.checked).map(c => c.id);
    const matchesCategory =
      selectedCategories.length === 0 ||
      (job.category && selectedCategories.includes(job.category));

    // Subcategory filter
    const selectedSubcategories = subcategoryFilters.filter(s => s.checked).map(s => s.id);
    const matchesSubcategory =
      selectedSubcategories.length === 0 ||
      (job.subcategory && selectedSubcategories.includes(job.subcategory));

    // Salary range filter
    const selectedSalaries = salaryRanges.filter(s => s.checked);
    const matchesSalary =
      selectedSalaries.length === 0 ||
      selectedSalaries.some(range => {
        const jobMin = job.salaryMin || 0;
        const jobMax = job.salaryMax || Infinity;
        return jobMin <= range.max && jobMax >= range.min;
      });

    // Company size filter
    const selectedSizes = companySizeFilters.filter(s => s.checked);
    const matchesCompanySize =
      selectedSizes.length === 0 ||
      selectedSizes.some(size => {
        const companySize = job.companySize || 0;
        return companySize >= size.min && companySize <= size.max;
      });

    // Posted date filter
    const selectedDates = postedDateFilters.filter(d => d.checked);
    const matchesPostedDate =
      selectedDates.length === 0 ||
      selectedDates.some(date => {
        const postedDays = job.postedDays ?? Infinity;
        return date.days === Infinity || postedDays <= date.days;
      });

    // Applicant count filter
    const selectedApplicants = applicantCountFilters.filter(a => a.checked);
    const matchesApplicants =
      selectedApplicants.length === 0 ||
      selectedApplicants.some(opt => {
        const applicants = job.applicants || 0;
        return applicants >= opt.min && applicants <= opt.max;
      });

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType &&
      matchesCategory &&
      matchesSubcategory &&
      matchesSalary &&
      matchesCompanySize &&
      matchesPostedDate &&
      matchesApplicants
    );
  });

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Update URL with page number
    updateURLParams({
      page: pageNumber > 1 ? String(pageNumber) : null,
    });
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
    updateURLParams({
      s: searchTerm || null,
      location: locationTerm || null,
      page: null,
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleJobTypeChange = (id: string) => {
    const newJobTypes = jobTypes.map((type) =>
      type.id === id ? { ...type, checked: !type.checked } : type
    );
    setJobTypes(newJobTypes);

    // Update URL
    const checkedTypes = newJobTypes.filter(t => t.checked).map(t => t.id);
    const allChecked = checkedTypes.length === jobTypes.length;
    updateURLParams({
      types: allChecked ? null : checkedTypes.join(",") || null,
      page: null,
    });
  };

  const handleExperienceChange = (id: string) => {
    setExperienceLevels((prev) =>
      prev.map((level) =>
        level.id === id ? { ...level, checked: !level.checked } : level
      )
    );
  };

  const handleSalaryChange = (id: string) => {
    const newSalaryRanges = salaryRanges.map((range) =>
      range.id === id ? { ...range, checked: !range.checked } : range
    );
    setSalaryRanges(newSalaryRanges);

    // Update URL
    const checkedSalaries = newSalaryRanges.filter(s => s.checked).map(s => s.id);
    updateURLParams({
      salary: checkedSalaries.length > 0 ? checkedSalaries.join(",") : null,
      page: null,
    });
  };

  // Category filter handler
  const handleCategoryChange = (id: string) => {
    const currentlyChecked = categoryFilters.find(c => c.id === id)?.checked;

    setCategoryFilters((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, checked: !cat.checked } : cat
      )
    );

    if (!currentlyChecked) {
      setSelectedCategory(id);
      // Load subcategories
      const category = jobCategories.find(c => c.id === id);
      if (category) {
        setSubcategoryFilters(
          category.subcategories.map(sub => ({
            id: sub.id,
            label: sub.name,
            checked: false,
            count: sub.count,
          }))
        );
      }
      // Update URL
      updateURLParams({
        category: id,
        subcategory: null,
        page: null,
      });
    } else {
      // If unchecking, clear category selection
      if (selectedCategory === id) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSubcategoryFilters([]);
        // Update URL
        updateURLParams({
          category: null,
          subcategory: null,
          page: null,
        });
      }
    }
  };

  // Subcategory filter handler
  const handleSubcategoryChange = (id: string) => {
    const currentlyChecked = subcategoryFilters.find(s => s.id === id)?.checked;

    setSubcategoryFilters((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, checked: !sub.checked } : sub
      )
    );

    if (!currentlyChecked) {
      setSelectedSubcategory(id);
      // Update URL
      updateURLParams({
        subcategory: id,
        page: null,
      });
    } else if (selectedSubcategory === id) {
      setSelectedSubcategory(null);
      // Update URL
      updateURLParams({
        subcategory: null,
        page: null,
      });
    }
  };

  // Company size filter handler
  const handleCompanySizeChange = (id: string) => {
    const newSizes = companySizeFilters.map((size) =>
      size.id === id ? { ...size, checked: !size.checked } : size
    );
    setCompanySizeFilters(newSizes);

    // Update URL
    const checkedSizes = newSizes.filter(s => s.checked).map(s => s.id);
    updateURLParams({
      companySize: checkedSizes.length > 0 ? checkedSizes.join(",") : null,
      page: null,
    });
  };

  // Posted date filter handler
  const handlePostedDateChange = (id: string) => {
    const newDates = postedDateFilters.map((date) =>
      date.id === id ? { ...date, checked: !date.checked } : date
    );
    setPostedDateFilters(newDates);

    // Update URL
    const checkedDates = newDates.filter(d => d.checked).map(d => d.id);
    updateURLParams({
      posted: checkedDates.length > 0 ? checkedDates.join(",") : null,
      page: null,
    });
  };

  // Applicant count filter handler
  const handleApplicantCountChange = (id: string) => {
    const newCounts = applicantCountFilters.map((count) =>
      count.id === id ? { ...count, checked: !count.checked } : count
    );
    setApplicantCountFilters(newCounts);

    // Update URL
    const checkedCounts = newCounts.filter(c => c.checked).map(c => c.id);
    updateURLParams({
      applicants: checkedCounts.length > 0 ? checkedCounts.join(",") : null,
      page: null,
    });
  };

  // Clear category selection
  const handleClearCategory = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setCategoryFilters((prev) => prev.map((cat) => ({ ...cat, checked: false })));
    setSubcategoryFilters([]);
    // Update URL
    updateURLParams({
      category: null,
      subcategory: null,
      page: null,
    });
  };

  // Clear subcategory selection
  const handleClearSubcategory = () => {
    setSelectedSubcategory(null);
    setSubcategoryFilters((prev) => prev.map((sub) => ({ ...sub, checked: false })));
    // Update URL
    updateURLParams({
      subcategory: null,
      page: null,
    });
  };

  // Reset all filters
  const handleResetAllFilters = useCallback(() => {
    setSearchTerm("");
    setLocationTerm("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setCategoryFilters((prev) => prev.map((cat) => ({ ...cat, checked: false })));
    setSubcategoryFilters([]);
    setJobTypes((prev) => prev.map((type) => ({ ...type, checked: true })));
    setExperienceLevels((prev) => prev.map((level) => ({ ...level, checked: true })));
    setSalaryRanges((prev) => prev.map((range) => ({ ...range, checked: false })));
    setCompanySizeFilters((prev) => prev.map((size) => ({ ...size, checked: false })));
    setPostedDateFilters((prev) => prev.map((date) => ({ ...date, checked: false })));
    setApplicantCountFilters((prev) => prev.map((count) => ({ ...count, checked: false })));
    setCurrentPage(1);
    // Clear all URL params
    router.push("/job");
  }, [router]);

  // Calculate stats based on filtered results
  const uniqueCompanies = new Set(filteredJobs.map(job => job.company)).size;
  const newToday = filteredJobs.filter(job => job.postedDays === 0).length;
  const totalApplicants = filteredJobs.reduce((sum, job) => sum + (job.applicants || 0), 0);

  // Stats data
  const stats = [
    { icon: Briefcase, label: "Matching Jobs", value: filteredJobs.length, color: "from-[#234C6A] to-[#456882]" },
    { icon: Building2, label: "Companies", value: uniqueCompanies, color: "from-blue-500 to-cyan-500" },
    { icon: TrendingUp, label: "New Today", value: newToday, color: "from-green-500 to-emerald-500" },
    { icon: Users, label: "Applicants", value: totalApplicants > 1000 ? `${(totalApplicants/1000).toFixed(1)}k` : totalApplicants, color: "from-purple-500 to-pink-500" },
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
                    categories={categoryFilters}
                    subcategories={subcategoryFilters}
                    companySizeFilters={companySizeFilters}
                    postedDateFilters={postedDateFilters}
                    applicantCountFilters={applicantCountFilters}
                    onCategoryChange={handleCategoryChange}
                    onSubcategoryChange={handleSubcategoryChange}
                    onCompanySizeChange={handleCompanySizeChange}
                    onPostedDateChange={handlePostedDateChange}
                    onApplicantCountChange={handleApplicantCountChange}
                    selectedCategory={selectedCategory || undefined}
                    selectedSubcategory={selectedSubcategory || undefined}
                    onClearCategory={handleClearCategory}
                    onClearSubcategory={handleClearSubcategory}
                    onResetAllFilters={handleResetAllFilters}
                    activeFilterCount={activeFilterCount}
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
                        {selectedCategory
                          ? `${jobCategories.find(c => c.id === selectedCategory)?.name || "Category"} Jobs`
                          : "Available Positions"}
                        {selectedSubcategory && selectedCategory && (
                          <span className="text-[#456882] font-normal text-base ml-2">
                            / {jobCategories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name}
                          </span>
                        )}
                      </h2>
                      <p className="text-[#456882]">
                        Showing{" "}
                        <span className="font-semibold text-[#234C6A]">
                          {filteredJobs.length > 0
                            ? `${Math.min((currentPage - 1) * jobsPerPage + 1, filteredJobs.length)} - ${Math.min(currentPage * jobsPerPage, filteredJobs.length)}`
                            : "0"}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-[#234C6A]">
                          {filteredJobs.length}
                        </span>{" "}
                        jobs
                        {activeFilterCount > 0 && (
                          <span className="text-[#456882]/70 ml-1">
                            ({activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} applied)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-green-100 text-green-700 border-none">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        {filteredJobs.length} Active
                      </Badge>
                      {selectedCategory && (
                        <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none">
                          {jobCategories.find(c => c.id === selectedCategory)?.name}
                        </Badge>
                      )}
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
