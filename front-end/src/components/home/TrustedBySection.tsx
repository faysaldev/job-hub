import { BriefcaseBusiness, CalendarCheck, MessageSquareText } from "lucide-react";
/* Intentional replacement for unsupported partner logos/testimonials. */
const features = [{icon:BriefcaseBusiness,text:"Discover and compare roles"},{icon:CalendarCheck,text:"Track applications and interviews"},{icon:MessageSquareText,text:"Keep recruiter conversations together"}];
export default function TrustedBySection() {
  return <section aria-label="Platform capabilities" className="border-b border-[#e1e8ef] bg-[#f6f8fb] py-7"><div className="jh-container flex flex-col justify-between gap-5 md:flex-row md:items-center">
    {features.map(({icon:Icon,text})=><div key={text} className="flex items-center gap-3 text-sm font-medium text-[#516c83]"><Icon size={20} className="shrink-0 text-[#163b5c]" aria-hidden="true"/>{text}</div>)}
  </div></section>;
}
