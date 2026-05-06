import ApplicantsPage from "@/src/Page/Recruiter/ApplicantsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiter Applicants | JobHub",
  description:
    "View and manage all candidate applications in one place. Review resumes, track progress, and connect with top talent for your open roles.",
  keywords: [
    "recruiter applicants",
    "view applications",
    "manage candidates",
    "jobhub recruiter",
    "applicant tracking",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterApplicantsPage() {
  return <ApplicantsPage />;
}
