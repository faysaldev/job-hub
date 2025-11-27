import { notFound } from "next/navigation";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Job } from "@/src/types";
import JobDetailsHeader from "@/src/components/jobs/JobDetailsHeader";
import JobDetailsSection from "@/src/components/jobs/JobDetailsSection";
import JobDetailsSidebar from "@/src/components/jobs/JobDetailsSidebar";
import JobDetailsList from "@/src/components/jobs/JobDetailsList";

// Define the type for the page props

// Function to fetch job data by ID
async function getJobById(id: number): Promise<Job | null> {
  // In a real application, this would be an API call to your backend
  // Example: const response = await fetch(`${process.env.API_URL}/jobs/${id}`);

  // For now, we'll return mock data to simulate the API call
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
        "We're looking for an experienced Frontend Developer to join our growing team and help build the next generation of web applications.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL"],
      status: "active",
      responsibilities: [
        "Develop and maintain high-quality web applications",
        "Collaborate with designers and backend developers",
        "Write clean, maintainable, and well-documented code",
        "Participate in code reviews and technical discussions",
        "Mentor junior developers and contribute to team growth",
      ],
      requirements: [
        "5+ years of experience in frontend development",
        "Strong proficiency in React and TypeScript",
        "Experience with modern CSS frameworks",
        "Understanding of web performance optimization",
        "Excellent communication and collaboration skills",
      ],
      benefits: [
        "Competitive salary and equity package",
        "Health, dental, and vision insurance",
        "Flexible work schedule and remote work options",
        "Professional development budget",
        "401(k) matching program",
      ],
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
        "Join our creative team and help shape the future of our products.",
      skills: ["Figma", "UI/UX", "Prototyping"],
      status: "active",
      responsibilities: [
        "Create user-centered designs",
        "Collaborate with product and engineering teams",
        "Conduct user research and usability testing",
        "Develop design systems and guidelines",
        "Present design concepts to stakeholders",
      ],
      requirements: [
        "3+ years of product design experience",
        "Proficiency in design tools like Figma",
        "Strong portfolio demonstrating design process",
        "Experience with user research methods",
        "Understanding of front-end development basics",
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Flexible PTO policy",
        "Learning and development stipend",
        "Modern office space",
      ],
    },
  ];

  return mockJobs.find((job) => job.id === id) || null;
}

const JobDetail = async () => {
  // const { details } = "";
  const details = "2";
  const jobId = parseInt(details);

  // Fetch the job data based on the ID from the URL
  const job = await getJobById(jobId);

  // If no job is found, return a 404 page
  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1">
        <div className="container py-12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <JobDetailsHeader job={job} />

              {/* Job Description */}
              <JobDetailsSection title="Job Description">
                <p className="text-[#234C6A] leading-relaxed">
                  {job.description}
                </p>
              </JobDetailsSection>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <JobDetailsSection title="Responsibilities">
                  <JobDetailsList items={job.responsibilities} />
                </JobDetailsSection>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <JobDetailsSection title="Requirements">
                  <JobDetailsList items={job.requirements} />
                </JobDetailsSection>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <JobDetailsSection title="Benefits">
                  <JobDetailsList items={job.benefits} />
                </JobDetailsSection>
              )}
            </div>

            {/* Sidebar */}
            <JobDetailsSidebar job={job} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;
