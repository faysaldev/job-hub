import type { Metadata } from "next";
import RecruiterPage from "@/src/Page/Recruiter/RecruiterPage";
export const metadata: Metadata = { title: "Recruiter overview", robots: { index: false, follow: false } };
export default function RecruiterDashboardPage() { return <RecruiterPage />; }
