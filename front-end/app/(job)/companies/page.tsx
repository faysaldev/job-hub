import CompaniesPage from "@/src/Page/Companies/CompaniesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Companies & Employers | JobHub",
  description:
    "Explore leading companies and organizations hiring on JobHub. Discover company cultures, sizes, and open positions at top employers worldwide.",
  keywords: [
    "companies",
    "employers",
    "company profiles",
    "hire talent",
    "JobHub",
    "recruitment",
    "industry leaders",
    "top workplaces",
  ],
};

export default function Companies() {
  return <CompaniesPage />;
}
