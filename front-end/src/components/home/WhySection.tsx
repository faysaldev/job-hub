import { FileText, MessageSquareText, SearchCheck } from "lucide-react";
const benefits = [
  { icon: SearchCheck, title: "Clearer job discovery", description: "Filter roles by category, location, work arrangement and experience." },
  { icon: FileText, title: "Organized applications", description: "Review roles you have applied to and follow their progress." },
  { icon: MessageSquareText, title: "Hiring conversations", description: "Communicate with hiring teams and keep interviews in view." },
];
export default function WhySection() { return <section className="bg-[#eef3f8] py-16 md:py-20"><div className="jh-container">
  <div className="mb-9 max-w-2xl"><p className="jh-kicker mb-3">Made for the process</p><h2 className="text-3xl font-semibold tracking-tight text-[#162839] md:text-4xl">Less noise. More progress.</h2><p className="mt-3 text-[#66798a]">The useful tools are the ones that help you take the next step.</p></div>
  <div className="grid gap-4 md:grid-cols-3">{benefits.map(({ icon: Icon, title, description }) => <div key={title} className="jh-panel p-7"><div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-[#edf3f8] text-[#163b5c]"><Icon size={22}/></div><h3 className="text-lg font-semibold text-[#162839]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#66798a]">{description}</p></div>)}</div>
</div></section>; }
