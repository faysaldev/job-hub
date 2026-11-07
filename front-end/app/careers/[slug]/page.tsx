import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
interface PublicCompany { _id: string; companyName?: string; companyLogo?: string; careersHeadline?: string; careersDescription?: string;
  companyLocation?: string; website?: string; verification?: { status?: string } }
interface PublicJob { _id: string; title: string; type: string; location: string; locationType: string; salaryMin?: number; salaryMax?: number; salaryPeriod?: string; applicationDeadline: string }
interface PageInfo { company: PublicCompany; jobs: PublicJob[] }
const getCareers = async (slug: string): Promise<PageInfo | null> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const api = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/$/, "");
  try { const res = await fetch(`${api}/api/v1/recruiter-company/careers/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) return null; const body = await res.json(); return body.data as PageInfo;
  } catch { return null; }
};
export async function generateMetadata({params}: {params: Promise<{slug:string}>}): Promise<Metadata> {
  const {slug} = await params; const data = await getCareers(slug);
  return { title: data ? `Careers at ${data.company.companyName || "Company"} | JobHub` : "Careers page unavailable | JobHub",
    description: data?.company.careersDescription?.slice(0,155) || "Explore current career opportunities.",
    robots: { index: Boolean(data), follow: true } };
}
export default async function Page({params}: {params: Promise<{slug:string}>}) {
  const {slug} = await params; const data = await getCareers(slug); if (!data) notFound();
  const {company,jobs} = data;
  return <main className="min-h-screen bg-[#f6f8fb] text-[#163B5C]"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-5">
    <Link href="/" className="text-lg font-semibold">JobHub</Link><Link href="/job" className="text-sm font-medium text-blue-700">All jobs</Link></div></header>
    <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-5xl space-y-4 px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-widest text-[#456882]">Company careers</p>
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{company.careersHeadline || `Work with ${company.companyName}`}</h1>
      <p className="max-w-3xl whitespace-pre-wrap text-base leading-7 text-slate-600">{company.careersDescription || `Explore current opportunities at ${company.companyName}.`}</p>
      <div className="flex flex-wrap gap-3 text-sm text-slate-500">{company.companyLocation && <span>{company.companyLocation}</span>}
        {company.verification?.status === "verified" && <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">Verified company</span>}
        {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 underline">Company website</a>}
      </div></div></section>
    <section className="mx-auto max-w-5xl space-y-5 px-6 py-12"><div><h2 className="text-2xl font-semibold">Open positions</h2><p className="mt-1 text-sm text-slate-600">{jobs.length} current opportunities</p></div>
      {!jobs.length && <p className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600">No open positions at the moment. Check back for future opportunities.</p>}
      <div className="grid gap-4 sm:grid-cols-2">{jobs.map(job=><article className="rounded-xl border border-slate-200 bg-white p-6" key={job._id}>
        <h3 className="text-lg font-semibold">{job.title}</h3><p className="mt-2 text-sm text-slate-600">{job.location} · {job.locationType} · {job.type}</p>
        {job.salaryMin!=null && job.salaryMax!=null && <p className="mt-2 text-sm text-slate-600">{job.salaryMin.toLocaleString()}–{job.salaryMax.toLocaleString()} / {job.salaryPeriod || "year"}</p>}
        <Link href={`/job/${job._id}`} className="mt-5 inline-block rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#315c7b]">View opportunity</Link>
      </article>)}</div>
    </section></main>;
}
