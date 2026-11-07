import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { ArrowRight, BriefcaseBusiness, ClipboardList, MessagesSquare, Search } from "lucide-react";
const principles = [
  { title: "Discover", description: "Make job descriptions, employment types and locations easy to compare.", icon: Search },
  { title: "Organize", description: "Keep applications, roles and interview activity in one workspace.", icon: ClipboardList },
  { title: "Communicate", description: "Help candidates and recruiters stay connected throughout the process.", icon: MessagesSquare },
];
export default function AboutPage() { return <div className="jh-public"><Header/><main id="main-content">
  <section className="border-b border-[#e1e8ef] bg-white py-20"><div className="jh-container max-w-5xl"><p className="jh-kicker mb-5">About JobHub</p><h1 className="max-w-4xl text-4xl font-semibold leading-[1.13] tracking-tight text-[#162839] md:text-6xl">Hiring is a journey. The tools should make it easier.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#66798a]">JobHub brings job discovery, applications, company profiles and recruiter workflows into one product. We focus on useful features and clear next steps.</p></div></section>
  <section className="jh-container py-16 md:py-20"><div className="mb-10"><p className="jh-kicker mb-3">How we approach the product</p><h2 className="text-3xl font-semibold tracking-tight text-[#162839]">Simple, practical and focused</h2></div><div className="grid gap-4 md:grid-cols-3">{principles.map(({title,description,icon:Icon})=><div className="jh-panel p-7" key={title}><Icon size={23} className="text-[#163b5c]"/><h3 className="mt-7 text-lg font-semibold text-[#162839]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#66798a]">{description}</p></div>)}</div></section>
  <section className="border-y border-[#e1e8ef] bg-white py-16"><div className="jh-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><div className="mb-3 flex items-center gap-2 text-[#163b5c]"><BriefcaseBusiness size={20}/><span className="jh-kicker">Your next step</span></div><h2 className="text-3xl font-semibold text-[#162839]">Find the tools you need.</h2><p className="mt-3 text-[#66798a]">Explore openings or create an account to manage your recruiting activity.</p></div><Link href="/job" className="jh-button">Browse jobs <ArrowRight size={17}/></Link></div></section>
</main><Footer/></div>; }
