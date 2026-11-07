import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Database, Eye, LockKeyhole, Mail, ShieldCheck, CreditCard, FileText } from "lucide-react";

const sections = [
  { id: "collected", title: "Information used by JobHub", icon: Database, details: [
    "Account details, such as name, email, password credentials, profile photo, and optional contact details.",
    "Candidate profile information, resumes or resume links, applications, interviews, and conversations entered through the service.",
    "Recruiter/company information, published jobs, application decisions, and associated activity.",
    "Operational and security information needed to run sessions, prevent abuse, and troubleshoot the service.",
  ] },
  { id: "usage", title: "How information is used", icon: Eye, details: [
    "To sign users in, help candidates apply, and let recruiters manage their own hiring workflows.",
    "To deliver relevant notifications, account email, and service messages.",
    "To process transactions through the configured payment provider and maintain application state.",
    "To investigate abuse, secure user accounts, and maintain availability and performance.",
  ] },
  { id: "sharing", title: "Who may see information", icon: ShieldCheck, details: [
    "A job application shares candidate information with the employer receiving that application.",
    "Publicly visible company profiles, job listings, and enabled candidate profiles may be viewed by other visitors.",
    "JobHub uses service providers for hosting, storage, email, and payments; the current codebase integrates with Stripe and Cloudinary.",
    "Do not put identity documents, passwords, or sensitive private details in a publicly visible profile or job description.",
  ] },
  { id: "security", title: "Security and retention", icon: LockKeyhole, details: [
    "JobHub includes authenticated API access and role-based protections. No online service can guarantee absolute security.",
    "The platform stores information needed to support accounts, applications, and record history. Detailed retention and deletion rules still require policy approval.",
    "Users should sign out of shared devices and contact support if they suspect unauthorized access.",
  ] },
  { id: "payments", title: "Payments and third-party services", icon: CreditCard, details: [
    "Stripe handles payment checkout; payment-related information is processed according to Stripe's own terms and privacy notices.",
    "Cloudinary currently handles uploaded images. A migration to Cloudflare R2 is planned separately.",
    "The platform may use session cookies and browser storage to maintain sign-in state and user preferences.",
  ] },
];

export default function PrivacyPolicyPage() {
  return <div className="jh-public"><Header />
    <main id="main-content"><section className="border-b border-[#e1e8ef] bg-white py-16 md:py-20"><div className="jh-container">
      <p className="jh-kicker mb-4">Privacy information</p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#162839] md:text-5xl">Your information on JobHub</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[#66798a]">A plain-language overview of how the current platform handles account, hiring and payment information.</p>
      <div className="mt-7 inline-flex items-center gap-2 rounded-lg border border-[#e1e8ef] bg-[#f6f8fb] px-4 py-3 text-sm text-[#516c83]"><FileText size={18} /> This policy copy requires operator and legal review before production use.</div>
    </div></section>
    <section className="jh-container grid gap-9 py-12 md:grid-cols-[220px_minmax(0,1fr)] md:py-16">
      <aside className="h-fit md:sticky md:top-24"><p className="jh-kicker mb-3">On this page</p><nav aria-label="Privacy topics" className="flex flex-wrap gap-2 md:flex-col">{sections.map(s=><a className="jh-nav-link" href={`#${s.id}`} key={s.id}>{s.title}</a>)}<a className="jh-nav-link" href="#contact">Contact</a></nav></aside>
      <div className="space-y-5">{sections.map(({ id, title, icon: Icon, details })=><section id={id} key={id} className="jh-panel scroll-mt-24 p-6 md:p-8"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf3f8] text-[#163b5c]"><Icon size={21}/></span><h2 className="text-xl font-semibold text-[#162839]">{title}</h2></div><ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-7 text-[#66798a]">{details.map(d=><li key={d}>{d}</li>)}</ul></section>)}
      <section id="contact" className="jh-panel scroll-mt-24 p-6 md:p-8"><div className="flex items-center gap-3"><Mail size={23} className="text-[#163b5c]"/><h2 className="text-xl font-semibold text-[#162839]">Questions or privacy requests</h2></div><p className="mt-4 text-sm leading-7 text-[#66798a]">To request account assistance or ask about personal information, use the contact form. Legal obligations, specific retention periods, privacy rights and the controller identity must be finalized by the platform operator before public launch.</p><Link href="/contact" className="jh-button mt-5">Contact JobHub</Link></section></div>
    </section></main><Footer /></div>;
}
