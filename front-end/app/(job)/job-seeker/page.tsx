import JobSeekerDashboard from "@/src/Page/JobSeeker/JobSeeker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Seeker Dashboard | JobHub",
  description:
    "Manage your job applications, interviews, and professional profile from your personalized JobHub dashboard. Keep track of your career progress.",
  keywords: [
    "job seeker",
    "dashboard",
    "career management",
    "job search",
    "JobHub",
  ],
};
// Server component wrapper
export default function JobsPage() {
  return <JobSeekerDashboard />;
}
