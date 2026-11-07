"use client";
import ApplyJobModal from "./ApplyJobModal";

/** Legacy entry point retained for existing sidebar imports. Applies via the real API. */
export default function JobApplicationDialog({ jobId, jobTitle, companyName }: {
  jobId: string; jobTitle: string; companyName: string;
}) {
  return <ApplyJobModal jobId={jobId} jobTitle={jobTitle} companyName={companyName} />;
}
