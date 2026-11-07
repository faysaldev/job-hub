import Link from "next/link";

const footerSections = [
  {
    title: "Explore",
    links: [
      { label: "Finds Jobs", href: "/job" },
      { label: "Company Reviews", href: "/companies" },
      { label: "Find Resumes", href: "/candidates" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Sign In", href: "/auth" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="jh-footer border-t border-[#e5e7eb] bg-white text-[#111827]">
      <div className="jh-container grid gap-10 py-14 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 group select-none" aria-label="JOB ! HUB home">
            <div className="flex flex-col leading-none font-black text-[#111827]">
              <span className="text-[12px] font-black tracking-widest text-[#111827]">JOB !</span>
              <span className="text-sm font-black tracking-tight text-neutral-500">HUB</span>
            </div>
          </Link>
          <p className="max-w-sm text-xs leading-6 text-[#596d7e]">
            The modern job board and hiring network. Discover opportunities, compare salaries, and connect with premier companies worldwide.
          </p>
        </div>
        {footerSections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#111827]">{section.title}</h2>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link className="text-xs text-[#596d7e] hover:text-black transition-colors" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[#e5e7eb]">
        <div className="jh-container flex flex-wrap justify-between gap-3 py-6 text-xs text-[#596d7e]">
          <span>© {new Date().getFullYear()} JOB ! HUB. All rights reserved.</span>
          <span>Connecting global talent with premier opportunities</span>
        </div>
      </div>
    </footer>
  );
}
