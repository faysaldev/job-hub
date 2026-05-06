import CompanyDetailsPage from "@/src/Page/Companies/CompanyDetailsPage";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies/${id}`,
    );
    const data = await res.json();
    const company = data?.data;

    if (!company) {
      return {
        title: "Company Not Found | JobHub",
      };
    }

    return {
      title: `${company.companyName} Careers & Profile | JobHub`,
      description: `Learn more about ${company.companyName}. Explore their company culture, open positions, and what it's like to work in the ${company.industries} industry.`,
      keywords: [
        company.companyName,
        "company profile",
        "careers",
        "jobs at " + company.companyName,
        company.industries,
        "JobHub",
        "hiring",
      ],
    };
  } catch (error) {
    return {
      title: "Company Profile | JobHub",
      description: "Explore company profiles and careers on JobHub.",
    };
  }
}

export default function CompanyDetails() {
  return <CompanyDetailsPage />;
}
