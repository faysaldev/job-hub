import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { ArrowRight, BriefcaseBusiness, ClipboardList, MessagesSquare, Search, ShieldCheck } from "lucide-react";

const principles = [
  {
    title: "Discover With Clarity",
    description: "Compare verified job descriptions, compensation ranges, seniority levels, and work arrangements in seconds.",
    icon: Search,
  },
  {
    title: "Organize Every Application",
    description: "Maintain real-time oversight of submitted roles, candidate pipelines, and interview stages in one workspace.",
    icon: ClipboardList,
  },
  {
    title: "Communicate Directly",
    description: "Connect job seekers and hiring teams without intermediary friction or delayed email chains.",
    icon: MessagesSquare,
  },
];

export default function AboutPage() {
  return (
    <div className="jh-public bg-[#f4f6f8] min-h-screen">
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="border-b border-[#e5e7eb] bg-white py-16 md:py-20">
          <div className="jh-container max-w-4xl">
            <span className="inline-block rounded-md bg-[#dcfce7] px-2.5 py-1 text-xs font-bold text-[#15803d] mb-4">
              Our Mission
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-5xl leading-tight">
              Hiring should be simple, transparent, and built around people.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#596d7e]">
              JOB ! HUB unifies job discovery, structured applications, and employer workspaces into one high-performance platform. We prioritize verified data, transparent salary insights, and seamless interactions.
            </p>
          </div>
        </section>

        {/* Core Principles */}
        <section className="jh-container py-16 md:py-20">
          <div className="mb-10">
            <p className="jh-kicker mb-2">Our Operating Philosophy</p>
            <h2 className="text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">
              Engineered For Results
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-black text-white mb-6">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-[#111827]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#596d7e]">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Verification banner */}
        <section className="jh-container pb-16">
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#dcfce7] text-[#15803d]">
              <ShieldCheck size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#111827]">Verified Company Ecosystem</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#596d7e]">
                Every hiring profile is authenticated to prevent ghost jobs, protect applicant resumes, and ensure transparent communications.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="border-t border-[#e5e7eb] bg-white py-16">
          <div className="jh-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <BriefcaseBusiness size={18} className="text-black" />
                <span className="jh-kicker">Start Your Journey</span>
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">Explore Current Opportunities</h2>
              <p className="mt-1 text-xs text-[#596d7e]">Browse open listings or register as an employer to begin hiring immediately.</p>
            </div>
            <Link
              href="/job"
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-2xs"
            >
              Browse Open Jobs <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
