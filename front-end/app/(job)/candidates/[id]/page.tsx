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
import { useGetSeekerByIdQuery } from "@/src/redux/features/seeker/seekerApi";

export default function CandidateDetailsPage() {
  const params = useParams();
  const { data: response, isLoading, error } = useGetSeekerByIdQuery(params?.id as string);
  const seeker = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#234C6A] font-bold uppercase tracking-widest text-sm">
          Loading Candidate Profile...
        </p>
      </div>
    );
  }

  if (error || !seeker) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <User className="h-10 w-10 text-red-400" />
        </div>
        <h3 className="text-2xl font-black text-[#234C6A]">Profile not found</h3>
        <p className="text-gray-500 mt-2 max-w-md">
          We couldn't find the candidate profile you're looking for. It may have
          been removed or the link might be incorrect.
        </p>
        <Link href="/candidates" className="mt-8">
          <Button className="rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-bold px-8 h-14">
            Back to Candidates
          </Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

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
                    src={
                      seeker.userId?.image ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                    }
                    alt={seeker.userId?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                  <CheckCircle className="h-6 w-6" strokeWidth={3} />
                </div>
              </div>

              <h1 className="text-3xl font-black text-[#234C6A] mb-2">
                {seeker.userId?.name || "Anonymous"}
              </h1>
              <p className="text-[#456882] font-bold text-lg mb-6">
                {seeker.designation || "Professional"}
              </p>

              <div className="flex items-center justify-center gap-2 mb-8">
                <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-2 rounded-2xl font-bold uppercase tracking-tight text-xs">
                  {seeker.totalExperience || "N/A"} Exp
                </Badge>
                <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-2 rounded-2xl font-bold uppercase tracking-tight text-xs">
                  {seeker.jobType || "Remote"}
                </Badge>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <Button className="w-full h-14 rounded-2xl bg-[#234C6A] hover:bg-[#1a3a52] text-white font-black text-lg shadow-xl shadow-[#234C6A]/20 transition-all active:scale-95">
                  Hire Candidate
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-gray-100 text-[#234C6A] font-bold text-lg hover:bg-gray-50"
                >
                  Send Message
                </Button>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-xl rounded-[32px] bg-white space-y-6">
              <h3 className="text-xl font-bold text-[#234C6A] flex items-center gap-2">
                <Globe className="h-5 w-5" /> Online Presence
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Github,
                    label: "GitHub",
                    link: seeker.socialProfiles?.github,
                    color: "hover:bg-gray-900",
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    link: seeker.socialProfiles?.linkedin,
                    color: "hover:bg-blue-600",
                  },
                  {
                    icon: Twitter,
                    label: "Twitter",
                    link: seeker.socialProfiles?.twitter,
                    color: "hover:bg-blue-400",
                  },
                  {
                    icon: Globe,
                    label: "Portfolio",
                    link: seeker.portfolio,
                    color: "hover:bg-emerald-500",
                  },
                ]
                  .filter((social) => social.link)
                  .map((social) => (
                    <a
                      key={social.label}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl bg-gray-50 text-[#234C6A] transition-all group",
                        social.color,
                        "hover:text-white",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <social.icon className="h-5 w-5 opacity-70" />
                        <span className="font-bold">{social.label}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </a>
                  ))}
                {Object.values(seeker.socialProfiles || {}).every((v) => !v) &&
                  !seeker.portfolio && (
                    <p className="text-gray-400 text-sm italic">
                      No social profiles linked.
                    </p>
                  )}
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-10 border-none shadow-xl rounded-[40px] bg-white space-y-8">
              <div className="flex items-center justify-between">
                <Link href="/candidates">
                  <Button
                    variant="ghost"
                    className="rounded-xl text-gray-400 font-bold hover:text-[#234C6A]"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" /> Back to Search
                  </Button>
                </Link>
                <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">
                  Available {seeker.availability?.replace("-", " ")}
                </Badge>
              </div>

              <section className="space-y-4">
                <h2 className="text-3xl font-black text-[#234C6A]">
                  Professional Summary
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  {seeker.aboutMe || "No summary provided."}
                </p>
              </section>

              <section className="space-y-6 pt-10 border-t border-gray-50">
                <h2 className="text-2xl font-black text-[#234C6A] flex items-center gap-3">
                  <Code className="h-7 w-7 text-blue-500" /> Technical Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(seeker.skills || []).map((skill: string) => (
                    <div
                      key={skill}
                      className="px-6 py-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-[#234C6A] font-bold text-sm shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                    >
                      {skill}
                    </div>
                  ))}
                  {seeker.skills?.length === 0 && (
                    <p className="text-gray-400 italic">No skills listed.</p>
                  )}
                </div>
              </section>

              <section className="space-y-10 pt-10 border-t border-gray-50">
                <h2 className="text-2xl font-black text-[#234C6A] flex items-center gap-3">
                  <Briefcase className="h-7 w-7 text-blue-500" /> Work
                  Experience
                </h2>
                <div className="space-y-12">
                  {(seeker.workExperiences || []).map((work: any, i: number) => (
                    <div
                      key={i}
                      className="relative pl-10 border-l-4 border-gray-100"
                    >
                      <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-white shadow-lg"></div>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className="text-xl font-black text-[#234C6A]">
                            {work.position}
                          </h3>
                          <span className="text-sm font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                            {formatDate(work.durationFrom)} -{" "}
                            {work.durationTo
                              ? formatDate(work.durationTo)
                              : "Present"}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-[#456882]">
                          {work.companyName}
                        </p>
                        <div className="text-gray-600 leading-relaxed font-medium pt-2 whitespace-pre-line">
                          {work.responsibilities?.join("\n")}
                        </div>
                      </div>
                    </div>
                  ))}
                  {seeker.workExperiences?.length === 0 && (
                    <p className="text-gray-400 italic">No experience listed.</p>
                  )}
                </div>
              </section>

              <section className="space-y-8 pt-10 border-t border-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-[#234C6A] flex items-center gap-3">
                      <Award className="h-7 w-7 text-blue-500" /> Education
                    </h2>
                    {(seeker.educations || []).map((edu: any, i: number) => (
                      <div
                        key={i}
                        className="p-6 rounded-3xl bg-gray-50/80 border border-gray-100 space-y-1"
                      >
                        <p className="font-black text-[#234C6A]">
                          {edu.degree}
                        </p>
                        <p className="font-bold text-[#456882]">{edu.school}</p>
                        <p className="text-sm text-gray-400 font-black">
                          {edu.year?.includes(" - ") 
                            ? edu.year.split(" - ").map((d:string) => d.includes("T") ? formatDate(d) : d).join(" - ")
                            : edu.year}
                        </p>
                      </div>
                    ))}
                    {seeker.educations?.length === 0 && (
                      <p className="text-gray-400 italic">No education listed.</p>
                    )}
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-[#234C6A] flex items-center gap-3">
                      <BookOpen className="h-7 w-7 text-blue-500" /> Recent
                      Projects
                    </h2>
                    {(seeker.recentProjects || []).map((project: any, i: number) => (
                      <div
                        key={i}
                        className="p-6 rounded-3xl bg-gray-50/80 border border-gray-100 space-y-1 group hover:bg-white hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => project.link && window.open(project.link, "_blank")}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-black text-[#234C6A]">
                            {project.projectName}
                          </p>
                          {project.link && <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-blue-500" />}
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          {project.description}
                        </p>
                      </div>
                    ))}
                    {seeker.recentProjects?.length === 0 && (
                      <p className="text-gray-400 italic">No projects listed.</p>
                    )}
                  </div>
                </div>
              </section>
            </Card>

            <Card className="p-10 border-none shadow-xl rounded-[40px] bg-gradient-to-br from-[#234C6A] to-[#456882] text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black">
                  Ready to hire {seeker.userId?.name?.split(" ")[0]}?
                </h3>
                <p className="text-blue-100/70 font-medium">
                  Schedule an interview or send a direct job offer today.
                </p>
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

