import CandidatesListingPage from "@/src/Page/Candidates/CandidatesListingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse candidate profiles",
  description:
    "Search candidate profiles by skills, availability, and experience in JobHub.",
  keywords: [
    "candidates",
    "hire talent",
    "professionals",
    "job seekers",
    "JobHub",
    "recruitment",
    "top talent",
  ],
};

export default function Candidates() {
  return <CandidatesListingPage />;
}
