import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { BriefcaseBusiness, FileText, ShieldAlert, Users, Mail, Scale } from "lucide-react";

const sections = [
  { title: "Accounts and access", icon: Users, items: [
    "Provide accurate registration information and keep your credentials secure.",
    "Use the platform only with permissions appropriate to your account and organization.",
    "Report suspected account misuse through the platform contact form.",
  ] },
  { title: "Recruiter and company responsibilities", icon: BriefcaseBusiness, items: [
    "Publish genuine vacancies with truthful role, company, and compensation information.",
    "Only access applicant information for legitimate hiring purposes and respect candidate privacy.",
    "Maintain accurate job listings and remove positions that are no longer available.",
  ] },
  { title: "Candidate responsibilities", icon: FileText, items: [
    "Submit truthful professional details and application information.",
    "Respect employer communications and do not impersonate another person.",
    "Avoid sharing credentials or sensitive data in public listings or messages.",
  ] },
  { title: "Unacceptable conduct", icon: ShieldAlert, items: [
    "Fraudulent vacancies, phishing, scams, spam, unauthorized account access or automated abuse are prohibited.",
    "Do not upload illegal, infringing or malicious content, or harass other users.",
    "Do not attempt to circumvent security checks, access restrictions, or payment requirements.",
  ] },
  { title: "Payments and service availability", icon: Scale, items: [
    "Any displayed price, plan or paid promotion must be supported by the current billing implementation and confirmed before checkout.",
    "Payment processing is provided by Stripe. Specific subscription, refund, cancellation and tax terms require separate business and legal approval.",
    "Technical services may change or be temporarily unavailable. Do not rely on the site as the sole record of your hiring activities.",
  ] },
];
export default function TermsOfServicePage() {
  return <div className="jh-public"><Header/><main id="main-content">
    <section className="border-b border-[#e1e8ef] bg-white py-16 md:py-20"><div className="jh-container"><p className="jh-kicker mb-4">Platform terms</p><h1 className="text-4xl font-semibold tracking-tight text-[#162839] md:text-5xl">Using JobHub responsibly</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#66798a]">A clear outline of expected conduct for candidates and hiring teams.</p><p className="mt-7 max-w-3xl rounded-lg border border-[#e1e8ef] bg-[#f6f8fb] px-4 py-3 text-sm leading-6 text-[#516c83]">Draft for operator and legal review. This page does not establish a legal entity, governing jurisdiction, refund commitment or limitation of liability. Final enforceable Terms must be approved before production launch.</p></div></section>
    <section className="jh-container grid gap-8 py-12 md:grid-cols-[220px_minmax(0,1fr)] md:py-16"><aside className="h-fit md:sticky md:top-24"><p className="jh-kicker mb-3">Sections</p><nav aria-label="Terms topics" className="flex flex-wrap gap-2 md:flex-col">{sections.map((s,i)=><a key={s.title} href={`#terms-${i}`} className="jh-nav-link">{s.title}</a>)}</nav></aside>
    <div className="space-y-5">{sections.map(({title,icon:Icon,items},i)=><section className="jh-panel scroll-mt-24 p-6 md:p-8" id={`terms-${i}`} key={title}><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf3f8] text-[#163b5c]"><Icon size={21}/></span><h2 className="text-xl font-semibold text-[#162839]">{title}</h2></div><ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-7 text-[#66798a]">{items.map(s=><li key={s}>{s}</li>)}</ul></section>)}
    <section className="jh-panel p-6 md:p-8"><div className="flex items-center gap-3"><Mail size={22} className="text-[#163b5c]"/><h2 className="text-xl font-semibold text-[#162839]">Need clarification?</h2></div><p className="mt-4 text-sm leading-7 text-[#66798a]">Questions about your account, employer eligibility or payment workflow can be sent through the contact form. The governing agreement and jurisdiction must be supplied by the actual operator.</p><Link href="/contact" className="jh-button mt-5">Contact JobHub</Link></section></div></section>
  </main><Footer/></div>;
}
