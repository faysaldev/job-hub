"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Star,
  User,
  ExternalLink,
  Code,
  Globe,
  Mail,
  Linkedin,
  Github,
  Twitter,
  ChevronLeft,
  Calendar,
  Award,
  BookOpen,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const MOCK_CANDIDATE = {
  id: "1",
  name: "Alex Rivera",
  role: "Senior Frontend Engineer",
  location: "San Francisco, CA",
  experience: "8 years",
  rating: 4.9,
  skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "Redux", "GraphQL", "Jest", "Web Accessibility"],
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  bio: "Passionate about building highly interactive and accessible web applications. Over the past 8 years, I've specialized in frontend architecture, performance optimization, and creating seamless user experiences. I thrive in collaborative environments and love solving complex technical challenges.",
  availability: "Immediate",
  education: [
    {
      degree: "B.S. in Computer Science",
      school: "Stanford University",
      year: "2012 - 2016",
    },
  ],
  workExperience: [
    {
      role: "Senior Frontend Engineer",
      company: "TechFlow Systems",
      period: "2019 - Present",
      description: "Leading the migration from legacy monolithic architecture to a modern micro-frontend setup using Next.js and Module Federation. Improved application load times by 40%.",
    },
    {
      role: "Frontend Developer",
      company: "Innovate Digital",
      period: "2016 - 2019",
      description: "Developed and maintained multiple high-traffic client websites. Implemented a custom UI component library used across the entire company.",
    },
  ],
  projects: [
    {
      title: "Pulse Dash",
      description: "A real-time analytics dashboard for SaaS companies.",
      link: "#",
    },
    {
      title: "Echo UI",
      description: "An open-source accessible React component library.",
      link: "#",
    },
  ],
  socials: {
    linkedin: "linkedin.com/in/alexrivera",
    github: "github.com/alexrivera",
    twitter: "twitter.com/alexrivera_dev",
    website: "alexrivera.dev",
  },
  contact: {
    email: "alex.rivera@example.com",
    phone: "+1 (555) 000-0000",
  }
};

export default function CandidateDetailsPage() {
  const params = useParams();
  const candidate = MOCK_CANDIDATE; // In real app, fetch by params.id

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header / Cover */}
      <div className="h-64 bg-[#234C6A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#ffffff20_0%,_transparent_100%)]"></div>
          <div className="grid grid-cols-12 gap-4 p-10 h-full">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="h-full w-px bg-white/20 ml-auto"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-10 border-none shadow-2xl rounded-[40px] bg-white text-center">
              <div className="relative inline-block mb-6">
                <div className="w-40 h-40 rounded-[48px] overflow-hidden border-8 border-gray-50 shadow-xl mx-auto">
                  <img 
                    src={candidate.image} 
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                  <CheckCircle className="h-6 w-6" strokeWidth={3} />
                </div>
              </div>

              <h1 className="text-3xl font-black text-[#234C6A] mb-2">{candidate.name}</h1>
              <p className="text-[#456882] font-bold text-lg mb-6">{candidate.role}</p>

              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="flex items-center gap-1.5 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-black text-yellow-700">{candidate.rating}</span>
                </div>
                <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-2 rounded-2xl font-bold uppercase tracking-tight text-xs">
                   {candidate.experience} Exp
                </Badge>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <Button className="w-full h-14 rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-black text-lg shadow-xl shadow-[#234C6A]/20 transition-all active:scale-95">
                  Hire Candidate
                </Button>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-100 text-[#234C6A] font-bold text-lg hover:bg-gray-50">
                  Message Alex
                </Button>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-xl rounded-[32px] bg-white space-y-6">
              <h3 className="text-xl font-bold text-[#234C6A] flex items-center gap-2">
                <Globe className="h-5 w-5" /> Online Presence
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Github, label: "GitHub", link: candidate.socials.github, color: "hover:bg-gray-900" },
                  { icon: Linkedin, label: "LinkedIn", link: candidate.socials.linkedin, color: "hover:bg-blue-600" },
                  { icon: Twitter, label: "Twitter", link: candidate.socials.twitter, color: "hover:bg-blue-400" },
                  { icon: Globe, label: "Portfolio", link: candidate.socials.website, color: "hover:bg-emerald-500" },
                ].map((social) => (
                  <a 
                    key={social.label} 
                    href="#" 
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl bg-gray-50 text-[#234C6A] transition-all group",
                      social.color,
                      "hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <social.icon className="h-5 w-5 opacity-70" />
                      <span className="font-bold">{social.label}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-10 border-none shadow-xl rounded-[40px] bg-white space-y-8">
              <div className="flex items-center justify-between">
                 <Link href="/candidates">
                   <Button variant="ghost" className="rounded-xl text-gray-400 font-bold hover:text-[#234C6A]">
                     <ChevronLeft className="h-5 w-5 mr-1" /> Back to Search
                   </Button>
                 </Link>
                 <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">
                   Available for Hire
                 </Badge>
              </div>

              <section className="space-y-4">
                <h2 className="text-3xl font-black text-[#234C6A]">Professional Summary</h2>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  {candidate.bio}
                </p>
              </section>

              <section className="space-y-6 pt-10 border-t border-gray-50">
                <h2 className="text-2xl font-black text-[#234C6A] flex items-center gap-3">
                  <Code className="h-7 w-7 text-blue-500" /> Technical Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {candidate.skills.map((skill) => (
                    <div key={skill} className="px-6 py-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-[#234C6A] font-bold text-sm shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-10 pt-10 border-t border-gray-50">
                <h2 className="text-2xl font-black text-[#234C6A] flex items-center gap-3">
                  <Briefcase className="h-7 w-7 text-blue-500" /> Work Experience
                </h2>
                <div className="space-y-12">
                  {candidate.workExperience.map((work, i) => (
                    <div key={i} className="relative pl-10 border-l-4 border-gray-100">
                      <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-white shadow-lg"></div>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="text-xl font-black text-[#234C6A]">{work.role}</h3>
                          <span className="text-sm font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                            {work.period}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-[#456882]">{work.company}</p>
                        <p className="text-gray-600 leading-relaxed font-medium pt-2">
                          {work.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8 pt-10 border-t border-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-[#234C6A] flex items-center gap-3">
                      <Award className="h-7 w-7 text-blue-500" /> Education
                    </h2>
                    {candidate.education.map((edu, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-gray-50/80 border border-gray-100 space-y-1">
                        <p className="font-black text-[#234C6A]">{edu.degree}</p>
                        <p className="font-bold text-[#456882]">{edu.school}</p>
                        <p className="text-sm text-gray-400 font-black">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-[#234C6A] flex items-center gap-3">
                      <BookOpen className="h-7 w-7 text-blue-500" /> Recent Projects
                    </h2>
                    {candidate.projects.map((project, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-gray-50/80 border border-gray-100 space-y-1 group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <p className="font-black text-[#234C6A]">{project.title}</p>
                          <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Card>

            <Card className="p-10 border-none shadow-xl rounded-[40px] bg-gradient-to-br from-[#234C6A] to-[#456882] text-white flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-2xl font-black">Ready to hire {candidate.name}?</h3>
                  <p className="text-blue-100/70 font-medium">Schedule an interview or send a direct job offer today.</p>
               </div>
               <div className="flex gap-4">
                  <Button className="bg-white text-[#234C6A] hover:bg-white/90 rounded-2xl font-black px-10 h-14 shadow-lg transition-all active:scale-95">
                     Book Interview
                  </Button>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
