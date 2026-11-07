import type { Metadata } from "next";
import CandidateAlerts from "@/src/components/hiring/CandidateAlerts";
export const metadata: Metadata = { title: "Saved searches and alerts | JobHub", robots: { index: false, follow: false } };
export default function Page() { return <CandidateAlerts/>; }
