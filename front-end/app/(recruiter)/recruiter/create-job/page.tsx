import CreateJobPage from "@/src/Page/Recruiter/CreateJobPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Job | JobHub",
  description:
    "Create a new job opening with detailed information about the role, responsibilities, and qualifications. Attract top talent to your company.",
  keywords: [
    "create job",
    "post job",
    "job opening",
    "recruiter",
    "hiring",
    "job description",
    "jobhub",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterCreateJobPage() {
  return <CreateJobPage />;
}
