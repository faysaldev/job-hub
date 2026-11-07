import CandidateDetailsPage from "@/src/Page/Candidates/CandidateDetailsPage";
import type { Metadata } from "next";
// Candidate information should not enter public search indexes until explicit
// per-user indexing consent exists. This page remains usable by its URL.
export const metadata: Metadata = { title: "Candidate profile", description: "Professional candidate profile on JobHub.", robots: { index: false, follow: false } };
export default function CandidateDetails() { return <CandidateDetailsPage />; }
