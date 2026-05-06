import CandidateDetailsPage from "@/src/Page/Candidates/CandidateDetailsPage";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/seekers/${id}`,
    );
    const data = await res.json();
    const seeker = data?.data;

    if (!seeker) {
      return {
        title: "Candidate Not Found | JobHub",
      };
    }

    return {
      title: `${seeker.userId?.name || "Candidate"} - ${seeker.designation || "Professional"} | JobHub`,
      description: `View the professional profile of ${seeker.userId?.name} on JobHub. Explore their skills in ${seeker.skills?.slice(0, 3).join(", ")}, work experience, and more.`,
      keywords: [
        "candidate profile",
        "professional portfolio",
        "hire talent",
        "JobHub",
        ...(seeker.skills || []),
      ],
    };
  } catch (error) {
    return {
      title: "Candidate Profile | JobHub",
      description:
        "View candidate professional profiles and portfolios on JobHub.",
    };
  }
}

export default function CandidateDetails() {
  return <CandidateDetailsPage />;
}
