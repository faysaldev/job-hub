import CompanyDetailsPage from "@/src/Page/Companies/CompanyDetailsPage";
import { publicEntity, safeMetaText } from "@/src/lib/publicMetadata";
import type { Metadata } from "next";
type Props = { params: Promise<{ id: string }> };
type CompanyMeta = { companyName?: string; description?: string; industries?: string; companyLocation?: string };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const company = await publicEntity<CompanyMeta>("recruiter-company", id);
  if (!company) return { title: "Company unavailable", robots: { index: false, follow: false } };
  const name = safeMetaText(company.companyName, 80) || "Company";
  return { title: `${name} — Company profile`, description: safeMetaText(company.description) || `Explore ${name} on JobHub.`, alternates: { canonical: `/company/${id}` }, openGraph: { title: `${name} — Company profile`, description: safeMetaText(company.description) } };
}
export default function CompanyDetails() { return <CompanyDetailsPage />; }
