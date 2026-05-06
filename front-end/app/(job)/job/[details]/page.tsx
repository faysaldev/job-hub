import JobDetailsPage from "@/src/Page/Jobs/JobDetailsPage";
import { Metadata } from "next";

type Props = {
  params: Promise<{ details: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { details } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${details}`);
    const data = await res.json();
    const job = data?.data;

    if (!job) {
      return {
        title: "Job Not Found | JobHub",
      };
    }

    const companyName = typeof job.company === 'object' ? job.company.companyName : 'Company';

    return {
      title: `${job.title} at ${companyName} | JobHub`,
      description: `Apply for the ${job.title} position at ${companyName} in ${job.location}. ${job.description.slice(0, 150)}...`,
      keywords: [
        job.title,
        companyName,
        job.location,
        job.type,
        "hiring",
        "job opportunity",
        "JobHub",
        ...(job.skills || []),
      ],
    };
  } catch (error) {
    return {
      title: "Job Details | JobHub",
      description: "View job details and apply on JobHub.",
    };
  }
}

export default function JobDetails() {
  return <JobDetailsPage />;
}
