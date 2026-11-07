import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, Globe, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Footer from "@/src/components/common/Footer";
import { CompanyBrandIcon } from "@/src/components/jobs/JobCard";

interface PublicCompany {
  _id: string;
  companyName?: string;
  companyLogo?: string;
  careersHeadline?: string;
  careersDescription?: string;
  companyLocation?: string;
  website?: string;
  verification?: { status?: string };
}

interface PublicJob {
  _id: string;
  title: string;
  type: string;
  location: string;
  locationType: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: string;
  applicationDeadline: string;
}

interface PageInfo {
  company: PublicCompany;
  jobs: PublicJob[];
}

const getCareers = async (slug: string): Promise<PageInfo | null> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const api = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/$/, "");
  try {
    const res = await fetch(`${api}/api/v1/recruiter-company/careers/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data as PageInfo;
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCareers(slug);
  return {
    title: data ? `Careers at ${data.company.companyName || "Company"} | JobHub` : "Careers page unavailable | JobHub",
    description: data?.company.careersDescription?.slice(0, 155) || "Explore current career opportunities.",
    robots: { index: Boolean(data), follow: true },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCareers(slug);
  if (!data) notFound();
  const { company, jobs } = data;
  const companyName = company.companyName || "Company";

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#111827] flex flex-col justify-between">
      {/* Pitch-black header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-black text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 group select-none" aria-label="JOB ! HUB home">
            <div className="flex flex-col leading-none font-black text-white">
              <span className="text-[12px] font-black tracking-widest text-white">JOB !</span>
              <span className="text-sm font-black tracking-tight text-neutral-300">HUB</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/job"
              className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              All Open Jobs
            </Link>
            <Link
              href="/auth"
              className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black hover:bg-neutral-200 transition-colors shadow-2xs"
            >
              Post Job
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Company Banner / Header */}
        <section className="border-b border-[#e5e7eb] bg-white py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-5">
              {company.companyLogo ? (
                <img
                  src={company.companyLogo}
                  alt={companyName}
                  className="h-16 w-16 rounded-2xl object-cover border border-[#e5e7eb] shadow-sm"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-black text-white text-lg font-bold shadow-sm">
                  {companyName.slice(0, 2).toUpperCase() || <Building2 size={24} />}
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
                    {company.careersHeadline || `Work with ${companyName}`}
                  </h1>
                  {company.verification?.status === "verified" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-semibold text-[#15803d]">
                      <CheckCircle2 size={13} /> Verified Employer
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {companyName} Careers Portal
                </p>
              </div>
            </div>

            <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-[#596d7e] whitespace-pre-wrap">
              {company.careersDescription || `Explore current open positions and join our growing team at ${companyName}.`}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#596d7e]">
              {company.companyLocation && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-neutral-400" />
                  {company.companyLocation}
                </span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-black hover:underline"
                >
                  <Globe size={14} className="text-neutral-400" />
                  Official Website
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Positions Section */}
        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="jh-kicker mb-1">Open Positions</p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
                Available Roles ({jobs.length})
              </h2>
            </div>
            <span className="text-xs text-[#596d7e]">
              Direct applications verified by {companyName}
            </span>
          </div>

          {!jobs.length ? (
            <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-white p-12 text-center shadow-xs">
              <Building2 className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
              <h3 className="text-base font-bold text-[#111827]">No Open Roles Currently</h3>
              <p className="mt-1 text-xs text-[#596d7e] max-w-sm mx-auto">
                There are no open positions listed at the moment. Please check back later or explore other companies.
              </p>
              <Link
                href="/job"
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                Browse All Jobs
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => {
                const salary =
                  job.salaryMin != null && job.salaryMax != null
                    ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()} / ${job.salaryPeriod || "yr"}`
                    : "Competitive";

                return (
                  <article
                    key={job._id}
                    className="jh-card-reference flex flex-col justify-between rounded-2xl border border-[#eaecf0] bg-white p-4 sm:p-5 shadow-xs hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-2">
                        <CompanyBrandIcon companyName={companyName} logoUrl={company.companyLogo} id={job._id} />
                        <div className="min-w-0 pt-0.5">
                          <h3 className="text-sm font-bold text-[#111827] truncate">
                            {job.title}
                          </h3>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-0.5 truncate">
                            {companyName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mt-2 mb-2">
                        <MapPin size={11} className="text-neutral-400 shrink-0" />
                        <span className="truncate">{job.location || job.locationType || "Remote"}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 py-1.5 text-[10.5px] border-y border-neutral-100 my-2">
                        <span className="font-semibold text-neutral-700 truncate">{job.type}</span>
                        <span className="font-bold text-neutral-900 truncate text-right">{salary}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        <span className="bg-[#f3f4f6] text-neutral-600 rounded-md px-2 py-0.5 text-[10px] font-medium">
                          {job.locationType}
                        </span>
                        <span className="bg-[#f3f4f6] text-neutral-600 rounded-md px-2 py-0.5 text-[10px] font-medium">
                          {job.type}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">
                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/job/${job._id}`}
                        className="inline-flex h-[28px] items-center gap-1 rounded-lg bg-black px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-2xs"
                      >
                        Apply <ArrowRight size={11} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
