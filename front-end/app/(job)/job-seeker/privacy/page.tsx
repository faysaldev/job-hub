import type { Metadata } from "next";
import CandidatePrivacy from "@/src/components/hiring/CandidatePrivacy";
export const metadata: Metadata = { title: "Candidate privacy | JobHub", robots: { index: false, follow: false } };
export default function Page() { return <CandidatePrivacy/>; }
