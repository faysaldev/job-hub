import type { Metadata } from "next";
import RecruiterAnalyticsWorkspace from "@/src/components/analytics/RecruiterAnalyticsWorkspace";
export const metadata: Metadata = { title: "Hiring analytics | JobHub", robots: { index: false, follow: false } };
export default function RecruiterAnalyticsPage() { return <RecruiterAnalyticsWorkspace/>; }
