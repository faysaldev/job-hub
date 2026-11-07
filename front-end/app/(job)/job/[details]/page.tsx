import JobDetailsPage from "@/src/Page/Jobs/JobDetailsPage";
import { publicEntity, safeMetaText } from "@/src/lib/publicMetadata";
import type { Metadata } from "next";

type Props = { params: Promise<{ details: string }> };
type JobMeta = { title?: string; description?: string; company?: { companyName?: string }; location?: string; skills?: string[]; isActive?: boolean; applicationDeadline?: string; isDeleted?: boolean };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { details } = await params;
  const job = await publicEntity<JobMeta>("job", details);
  if (!job || job.isActive === false || job.isDeleted) return { title: "Job unavailable", robots: { index: false, follow: false } };
  const company = job.company?.companyName || "Employer";
  return { title: `${safeMetaText(job.title, 80)} at ${safeMetaText(company, 50)}`, description: safeMetaText(job.description) || `See the details of this job opportunity at ${company}.`, alternates: { canonical: `/job/${details}` }, openGraph: { type: "article", title: `${safeMetaText(job.title, 80)} at ${safeMetaText(company, 50)}`, description: safeMetaText(job.description) }, robots: { index: true, follow: true } };
}
export default function JobDetails() { return <JobDetailsPage />; }
