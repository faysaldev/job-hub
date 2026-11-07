import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

const footerSections = [
  { title: "Explore", links: [{ label: "Find jobs", href: "/job" }, { label: "Companies", href: "/companies" }, { label: "Candidates", href: "/candidates" }] },
  { title: "Platform", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Get started", href: "/auth" }] },
  { title: "Legal", links: [{ label: "Privacy policy", href: "/privacy-policy" }, { label: "Terms of service", href: "/terms-of-service" }] },
];

export default function Footer() {
  return <footer className="jh-footer">
    <div className="jh-container grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
      <div className="space-y-4">
        <Link href="/" className="jh-logo"><span className="jh-logo-mark"><BriefcaseBusiness size={18} /></span>JobHub</Link>
        <p className="max-w-sm text-sm leading-6 text-[#66798a]">One place to discover opportunities, organize applications and manage hiring.</p>
      </div>
      {footerSections.map((section) => <div key={section.title}>
        <h2 className="mb-4 text-sm font-semibold text-[#162839]">{section.title}</h2>
        <ul className="space-y-3">{section.links.map((link) => <li key={link.href}><Link className="text-sm text-[#66798a] hover:text-[#163b5c] hover:underline" href={link.href}>{link.label}</Link></li>)}</ul>
      </div>)}
    </div>
    <div className="border-t border-[#e1e8ef]"><div className="jh-container flex flex-wrap justify-between gap-3 py-5 text-xs text-[#516c83]"><span>© {new Date().getFullYear()} JobHub</span><span>Connecting job seekers and hiring teams</span></div></div>
  </footer>;
}
