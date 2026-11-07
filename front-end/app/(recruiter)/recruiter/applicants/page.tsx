import type { Metadata } from "next";
import ATSWorkspace from "@/src/components/hiring/ATSWorkspace";
export const metadata: Metadata = { title: "Applicant tracking | JobHub", robots: { index: false, follow: false } };
export default function Page() { return <ATSWorkspace/>; }
