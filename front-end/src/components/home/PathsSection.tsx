import Link from "next/link";
import { ArrowUpRight, Building2, UserRound } from "lucide-react";

const groups = [
  {
    icon: UserRound,
    name: "For Job Seekers",
    description: "Explore top openings, bookmark favorite roles, submit applications, and manage interview schedules.",
    href: "/job",
    action: "Find Jobs",
  },
  {
    icon: Building2,
    name: "For Employers",
    description: "Publish vacancies, evaluate qualified candidate profiles, schedule interviews, and build your brand.",
    href: "/auth",
    action: "Post A Job",
  },
];

export default function PathsSection() {
  return (
    <section className="border-t border-[#e5e7eb] bg-[#f8fafc] py-16 md:py-20">
      <div className="jh-container">
        <div className="mb-10">
          <p className="jh-kicker mb-2">Tailored Workspaces</p>
          <h2 className="text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">
            Built For Every Stage Of The Hiring Cycle
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map(({ icon: Icon, name, description, href, action }) => (
            <div
              key={name}
              className="flex flex-col justify-between rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-sm"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-black text-white">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-base font-bold text-[#111827]">{name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#596d7e]">{description}</p>
              </div>
              <Link
                href={href}
                className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                {action}
                <ArrowUpRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
