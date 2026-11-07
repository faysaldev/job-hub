import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { BriefcaseBusiness, FileText, ShieldAlert, Users, Mail, Scale } from "lucide-react";

const sections = [
  {
    title: "Accounts and Verification",
    icon: Users,
    items: [
      "Provide accurate registration details and maintain account confidentiality.",
      "Employers must represent an active business entity with verifiable domain authority.",
      "Report unauthorized credentials or suspicious actions promptly to security staff.",
    ],
  },
  {
    title: "Employer and Recruiter Conduct",
    icon: BriefcaseBusiness,
    items: [
      "Publish authentic job vacancies with transparent compensation and genuine location terms.",
      "Access applicant profile data solely for evaluating candidates for specified positions.",
      "Promptly archive or mark filled positions to ensure accurate market data.",
    ],
  },
  {
    title: "Candidate Responsibilities",
    icon: FileText,
    items: [
      "Submit truthful resume credentials, experience records, and portfolio references.",
      "Communicate courteously during interview coordination and assessments.",
      "Never transmit confidential or proprietary data belonging to previous employers.",
    ],
  },
  {
    title: "Prohibited Activities",
    icon: ShieldAlert,
    items: [
      "No scraping, automated account harvesting, or unauthorized API querying.",
      "Zero tolerance for fraudulent vacancies, scam solicitations, or fee extraction from job seekers.",
      "Do not circumvent security controls or payment gating systems.",
    ],
  },
  {
    title: "Payment Processing & Billing",
    icon: Scale,
    items: [
      "Subscription and job posting fees are processed securely via Stripe.",
      "Clear terms, refund policies, and cancellation workflows apply to all premium employer tiers.",
      "Platform uptime SLA terms and scheduled maintenance notices are provided in customer dashboards.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="jh-public min-h-screen bg-[#f4f6f8]">
      <Header />
      <main id="main-content">
        <section className="border-b border-[#e5e7eb] bg-white py-14 md:py-18">
          <div className="jh-container max-w-4xl">
            <span className="inline-block rounded-md bg-[#dcfce7] px-2.5 py-1 text-xs font-bold text-[#15803d] mb-3">
              Platform Standards
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] md:text-4xl">
              Terms of Service & Usage Agreement
            </h1>
            <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#596d7e]">
              Guidelines and legal expectations governing the JOB ! HUB recruitment platform for job seekers and hiring teams.
            </p>
          </div>
        </section>

        <section className="jh-container grid gap-8 py-12 md:grid-cols-[220px_minmax(0,1fr)] md:py-16">
          <aside className="h-fit md:sticky md:top-24">
            <p className="jh-kicker mb-3">Sections</p>
            <nav aria-label="Terms topics" className="flex flex-wrap gap-1.5 md:flex-col">
              {sections.map((s, i) => (
                <a
                  key={s.title}
                  href={`#terms-${i}`}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-200/60 hover:text-black transition-colors"
                >
                  {s.title}
                </a>
              ))}
              <a
                className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-200/60 hover:text-black transition-colors"
                href="#contact"
              >
                Inquiries
              </a>
            </nav>
          </aside>

          <div className="space-y-6">
            {sections.map(({ title, icon: Icon, items }, i) => (
              <section
                id={`terms-${i}`}
                key={title}
                className="scroll-mt-24 rounded-2xl border border-[#e5e7eb] bg-white p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-3.5 mb-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white shrink-0">
                    <Icon size={18} />
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#111827]">{title}</h2>
                </div>
                <ul className="list-disc space-y-2.5 pl-5 text-xs sm:text-sm leading-relaxed text-[#596d7e]">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            <section
              id="contact"
              className="scroll-mt-24 rounded-2xl border border-[#e5e7eb] bg-white p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3.5 mb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white shrink-0">
                  <Mail size={18} />
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#111827]">Legal Clarifications</h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-[#596d7e]">
                Have questions regarding commercial contracts, enterprise agreements, or compliance? Contact our legal operations team.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                Contact Legal Support
              </Link>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
