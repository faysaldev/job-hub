import InterviewsPage from "@/src/Page/Recruiter/InterviewsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiter Interviews | JobHub",
  description:
    "Schedule, manage, and track interviews with candidates. Coordinate with your team and candidates to find the perfect fit for your open roles.",
  keywords: [
    "recruiter interviews",
    "interview scheduling",
    "manage interviews",
    "candidate interviews",
    "jobhub recruiter",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterInterviewsPage() {
  return <InterviewsPage />;
}
