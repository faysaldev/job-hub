import CandidatesListingPage from "@/src/Page/Candidates/CandidatesListingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Top Talent | JobHub",
  description:
    "Browse and filter through a curated list of exceptional professionals across various industries. Find the perfect candidate for your team on JobHub.",
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
