import { FileText, MessageSquareText, SearchCheck } from "lucide-react";

const benefits = [
  {
    icon: SearchCheck,
    title: "Precision Job Search",
    description: "Filter roles by seniority level, employment type, location, and verified compensation ranges.",
  },
  {
    icon: FileText,
    title: "Centralized Workspace",
    description: "Track submitted applications, interview schedules, and recruiter feedback without leaving your dashboard.",
  },
  {
    icon: MessageSquareText,
    title: "Direct Employer Access",
    description: "Communicate directly with hiring managers and receive prompt status notifications at every stage.",
  },
];

export default function WhySection() {
  return (
    <section className="bg-[#f4f6f8] py-16 md:py-20 border-t border-[#e5e7eb]">
      <div className="jh-container">
        <div className="mb-10 max-w-2xl">
          <p className="jh-kicker mb-2">Designed For Professionals</p>
          <h2 className="text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">
            Streamlined Hiring. Zero Clutter.
          </h2>
          <p className="mt-1.5 text-xs text-[#596d7e]">
            A purposeful platform built around the tools candidates and employers need to move forward.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-black text-white">
                <Icon size={20} />
              </div>
              <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#596d7e]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
