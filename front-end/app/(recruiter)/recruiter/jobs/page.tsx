import JobsPage from "@/src/Page/Recruiter/JobsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiter Jobs | JobHub",
  description:
    "Post, edit, and manage job listings for your company on JobHub. Attract top talent with detailed descriptions, salary ranges, and company branding.",
  keywords: [
    "recruiter job postings",
    "post job openings",
    "edit job listing",
    "manage vacancies",
    "company hiring",
    "jobhub recruiter",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterJobsPage() {
  return <JobsPage />;
}
