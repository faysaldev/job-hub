import InterviewSchedulePage from "@/src/Page/Recruiter/InterviewSchedulePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Schedule | JobHub Recruiter",
  description:
    "Manage and oversee your upcoming candidate interview sessions. Coordinate schedules, reschedule sessions, and easily launch video interviews directly from JobHub.",
  keywords: [
    "interview schedule",
    "recruitment schedule",
    "manage interviews",
    "candidate sessions",
    "JobHub recruiter dashboard",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterInterviewSchedulePage() {
  return <InterviewSchedulePage />;
}

