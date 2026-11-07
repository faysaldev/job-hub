import CreateJobPage from "@/src/Page/Recruiter/CreateJobPage";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Edit job | JobHub", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CreateJobPage jobId={id}/>;
}
