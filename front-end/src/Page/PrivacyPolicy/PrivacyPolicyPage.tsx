import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Database, Eye, LockKeyhole, Mail, ShieldCheck, CreditCard, FileText } from "lucide-react";

const sections = [
  {
    id: "collected",
    title: "Information Used by JobHub",
    icon: Database,
    details: [
      "Account details, such as name, email, password credentials, profile photo, and optional contact details.",
      "Candidate profile information, resumes or resume links, applications, interviews, and conversations entered through the service.",
      "Recruiter/company information, published jobs, application decisions, and associated activity.",
      "Operational and security information needed to run sessions, prevent abuse, and troubleshoot the service.",
    ],
  },
  {
    id: "usage",
    title: "How Information is Used",
    icon: Eye,
    details: [
      "To sign users in, help candidates apply, and let recruiters manage their own hiring workflows.",
      "To deliver relevant notifications, account email, and service messages.",
      "To process transactions through the configured payment provider and maintain application state.",
      "To investigate abuse, secure user accounts, and maintain availability and performance.",
    ],
  },
  {
    id: "sharing",
    title: "Who May See Information",
    icon: ShieldCheck,
    details: [
      "A job application shares candidate information with the employer receiving that application.",
      "Publicly visible company profiles, job listings, and enabled candidate profiles may be viewed by other visitors.",
      "JobHub uses service providers for hosting, storage, email, and payments; the current codebase integrates with Stripe and Cloudflare R2; legacy Cloudinary links may remain during the staged migration.",
      "Do not put identity documents, passwords, or sensitive private details in a publicly visible profile or job description.",
    ],
  },
  {
    id: "security",
    title: "Security and Retention",
    icon: LockKeyhole,
    details: [
      "JobHub includes authenticated API access and role-based protections. No online service can guarantee absolute security.",
      "The platform stores information needed to support accounts, applications, and record history. Detailed retention and deletion rules still require policy approval.",
      "Users should sign out of shared devices and contact support if they suspect unauthorized access.",
    ],
  },
  {
    id: "payments",
    title: "Payments and Third-Party Services",
    icon: CreditCard,
    details: [
      "Stripe handles payment checkout; payment-related information is processed according to Stripe's own terms and privacy notices.",
      "New images and documents are stored in Cloudflare R2, with private resume access restricted to authorized users. Existing Cloudinary links may remain during migration.",
      "The platform may use session cookies and browser storage to maintain sign-in state and user preferences.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="jh-public min-h-screen bg-[#f4f6f8]">
      <Header />
      <main id="main-content">
        <section className="border-b border-[#e5e7eb] bg-white py-14 md:py-18">
          <div className="jh-container max-w-4xl">
            <span className="inline-block rounded-md bg-[#dcfce7] px-2.5 py-1 text-xs font-bold text-[#15803d] mb-3">
              Transparency & Privacy
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] md:text-4xl">
              Privacy Policy & Data Safeguards
            </h1>
            <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#596d7e]">
              A plain-language overview of how JOB ! HUB manages personal credentials, candidate profiles, and hiring workflows.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 py-2 text-xs text-[#596d7e]">
              <FileText size={15} className="text-black" />
              <span>Standard operating policy draft. Subject to local regulatory review.</span>
            </div>
          </div>
        </section>

        <section className="jh-container grid gap-8 py-12 md:grid-cols-[220px_minmax(0,1fr)] md:py-16">
          <aside className="h-fit md:sticky md:top-24">
            <p className="jh-kicker mb-3">Navigation</p>
            <nav aria-label="Privacy topics" className="flex flex-wrap gap-1.5 md:flex-col">
              {sections.map((s) => (
                <a
                  className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-200/60 hover:text-black transition-colors"
                  href={`#${s.id}`}
                  key={s.id}
                >
                  {s.title}
                </a>
              ))}
              <a
                className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-200/60 hover:text-black transition-colors"
                href="#contact"
              >
                Contact & Inquiries
              </a>
            </nav>
          </aside>

          <div className="space-y-6">
            {sections.map(({ id, title, icon: Icon, details }) => (
              <section
                id={id}
                key={id}
                className="scroll-mt-24 rounded-2xl border border-[#e5e7eb] bg-white p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-3.5 mb-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white shrink-0">
                    <Icon size={18} />
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#111827]">{title}</h2>
                </div>
                <ul className="list-disc space-y-2.5 pl-5 text-xs sm:text-sm leading-relaxed text-[#596d7e]">
                  {details.map((d) => (
                    <li key={d}>{d}</li>
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
                <h2 className="text-base sm:text-lg font-bold text-[#111827]">
                  Questions or Data Requests
                </h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-[#596d7e]">
                For data export requests, profile removal, or privacy questions, contact our security team directly.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                Contact Privacy Team
              </Link>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
