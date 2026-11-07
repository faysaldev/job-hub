import { Suspense } from "react";
import JobsClient from "@/src/Page/Jobs/JobsPage";
import { PageLoading } from "@/src/components/feedback/LoadingStates";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find jobs",
  description: "Browse available job openings and filter by skills, location, work arrangement and experience level.",
  alternates: { canonical: "/job" },
};
export default function JobsPage() {
  return <Suspense fallback={<PageLoading heading="Loading job search" cards={4} />}><JobsClient /></Suspense>;
}
