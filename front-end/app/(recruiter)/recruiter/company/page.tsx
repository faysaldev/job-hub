import CompanyPage from "@/src/Page/Recruiter/CompanyPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Page | JobHub",
  description:
    "Manage your company profile on JobHub. Update company information, add team members, showcase company culture, and attract top talent.",
  keywords: [
    "company profile",
    "edit company",
    "company information",
    "manage company",
    "jobhub recruiter",
    "company page",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecruiterCompanyPage() {
  return <CompanyPage />;
}
