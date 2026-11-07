import JobSeekerInterviewsPage from "@/src/Page/JobSeeker/InterviewsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Interview Schedule | JobHub",
  description:
    "View and manage your upcoming and past interview sessions. Be prepared for your next professional conversation with top employers.",
  keywords: [
    "job interviews",
    "interview schedule",
    "recruitment",
    "JobHub",
  ],
};

export default function Page() {
  return <JobSeekerInterviewsPage />;
}
