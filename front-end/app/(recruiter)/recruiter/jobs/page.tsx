import type { Metadata } from "next";
import JobsWorkspace from "@/src/components/hiring/JobsWorkspace";
export const metadata: Metadata = { title: "Company job postings | JobHub", robots: { index: false, follow: false } };
export default function Page() { return <JobsWorkspace/>; }
