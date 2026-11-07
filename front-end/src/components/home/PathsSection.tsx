import Link from "next/link";
import { ArrowUpRight, Building2, UserRound } from "lucide-react";
const groups = [
  { icon: UserRound, name: "For job seekers", description: "Explore roles, save opportunities, manage applications and prepare for interviews.", href: "/job", action: "Find a job" },
  { icon: Building2, name: "For recruiters", description: "Publish job listings, review applications, schedule interviews and manage your company profile.", href: "/auth", action: "Start hiring" },
];
export default function PathsSection() { return <section className="border-t border-[#e1e8ef] bg-white py-16 md:py-20"><div className="jh-container">
  <div className="mb-9"><p className="jh-kicker mb-3">One platform, two paths</p><h2 className="text-3xl font-semibold tracking-tight text-[#162839] md:text-4xl">Built for every side of hiring</h2></div>
  <div className="grid gap-4 md:grid-cols-2">{groups.map(({icon:Icon,name,description,href,action}) => <div key={name} className="rounded-2xl border border-[#e1e8ef] bg-[#f6f8fb] p-8"><Icon size={25} className="text-[#163b5c]"/><h3 className="mt-6 text-xl font-semibold text-[#162839]">{name}</h3><p className="mt-3 max-w-md text-sm leading-6 text-[#66798a]">{description}</p><Link href={href} className="jh-button mt-7">{action}<ArrowUpRight size={17}/></Link></div>)}</div>
</div></section>; }
