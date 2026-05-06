"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  MapPin, Briefcase, User, ExternalLink, Code,
  Globe, Linkedin, Github, Twitter, ChevronLeft,
  Award, BookOpen, CheckCircle, Clock, ArrowRight,
} from "lucide-react";
import { useGetSeekerByIdQuery } from "@/src/redux/features/seeker/seekerApi";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";

const SOCIAL_CONFIG = [
  { key: "github", icon: Github, label: "GitHub", hoverBg: "hover:bg-gray-900", hoverText: "hover:text-white" },
  { key: "linkedin", icon: Linkedin, label: "LinkedIn", hoverBg: "hover:bg-blue-600", hoverText: "hover:text-white" },
  { key: "twitter", icon: Twitter, label: "Twitter", hoverBg: "hover:bg-sky-500", hoverText: "hover:text-white" },
];

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <h2 className="text-xl font-bold text-[#234C6A] flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center shadow-md">
        <Icon className="h-5 w-5 text-white" />
      </div>
      {title}
    </h2>
  );
}

export default function CandidateDetailsPage() {
  const params = useParams();
  const { data: response, isLoading, error } = useGetSeekerByIdQuery(params?.id as string);
  const seeker = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-white font-bold uppercase tracking-widest text-sm">Loading Profile...</p>
      </div>
    );
  }

  if (error || !seeker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E3E3E3] via-white to-[#E3E3E3] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
          <User className="h-10 w-10 text-red-400" />
        </div>
        <h3 className="text-2xl font-black text-[#234C6A]">Profile not found</h3>
        <p className="text-[#456882] mt-2 max-w-md">We couldn&apos;t find this candidate profile. It may have been removed.</p>
        <Link href="/candidates" className="mt-8">
          <Button className="rounded-xl bg-gradient-to-r from-[#234C6A] to-[#456882] text-white font-bold px-8 h-12">
            Back to Candidates
          </Button>
        </Link>
      </div>
    );
  }

  const socials = SOCIAL_CONFIG.map((s) => ({ ...s, link: seeker.socialProfiles?.[s.key] })).filter((s) => s.link);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E3E3E3] via-white to-[#E3E3E3]">
      <Header />

      {/* Cover */}
      <div className="h-72 bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
        </div>
        {/* Back button */}
        <div className="container mx-auto px-6 pt-24 relative z-10">
          <Link href="/candidates" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="h-4 w-4" /> Back to Candidates
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-28 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left Column ── */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-8 border border-white/60 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-xl text-center">
              <div className="relative inline-block mb-5">
                <div className="w-36 h-36 rounded-3xl overflow-hidden border-4 border-white shadow-xl mx-auto">
                  <img
                    src={seeker.userId?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${seeker.userId?.name || "U"}`}
                    alt={seeker.userId?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-xl border-2 border-white flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" strokeWidth={3} />
                </div>
              </div>

              <h1 className="text-2xl font-black text-[#234C6A] mb-1">{seeker.userId?.name || "Anonymous"}</h1>
              <p className="text-[#456882] font-semibold mb-4">{seeker.designation || "Professional"}</p>

              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {seeker.totalExperience && (
                  <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none px-3 py-1 font-bold">
                    {seeker.totalExperience} exp
                  </Badge>
                )}
                {seeker.jobType && (
                  <Badge className="bg-green-50 text-green-700 border-none px-3 py-1 font-bold">
                    {seeker.jobType}
                  </Badge>
                )}
                {seeker.availability && (
                  <Badge className="bg-blue-50 text-blue-700 border-none px-3 py-1 font-bold">
                    <Clock className="h-3 w-3 mr-1 inline" />
                    {seeker.availability.replace("-", " ")}
                  </Badge>
                )}
              </div>

              {seeker.userLocation && (
                <p className="text-sm text-[#456882] flex items-center justify-center gap-1 mb-5">
                  <MapPin className="h-4 w-4 text-[#234C6A]" />{seeker.userLocation}
                </p>
              )}

              <div className="space-y-3 pt-5 border-t border-[#E3E3E3]/50">
                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-[#234C6A] to-[#456882] text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                  Hire Candidate
                </Button>
                <Button variant="outline" className="w-full h-11 rounded-xl border-[#234C6A]/20 text-[#234C6A] font-semibold hover:bg-[#234C6A]/5">
                  Send Message
                </Button>
              </div>
            </Card>

            {/* Online Presence */}
            {(socials.length > 0 || seeker.portfolio) && (
              <Card className="p-6 border border-[#E3E3E3]/60 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
                <h3 className="font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5" /> Online Presence
                </h3>
                <div className="space-y-3">
                  {socials.map((s) => (
                    <a key={s.key} href={s.link!} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center justify-between p-3.5 rounded-xl bg-[#E3E3E3]/30 text-[#234C6A] font-semibold text-sm transition-all group ${s.hoverBg} ${s.hoverText}`}>
                      <span className="flex items-center gap-3"><s.icon className="h-5 w-5" />{s.label}</span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                  {seeker.portfolio && (
                    <a href={seeker.portfolio} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#E3E3E3]/30 text-[#234C6A] font-semibold text-sm transition-all hover:bg-emerald-500 hover:text-white group">
                      <span className="flex items-center gap-3"><Globe className="h-5 w-5" />Portfolio</span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border border-white/60 shadow-xl rounded-3xl bg-white/80 backdrop-blur-xl space-y-8">
              {/* Availability badge */}
              <div className="flex justify-end">
                <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 font-bold">
                  Available {seeker.availability?.replace("-", " ")}
                </Badge>
              </div>

              {/* Summary */}
              <section className="space-y-3">
                <SectionHeading icon={User} title="Professional Summary" />
                <p className="text-[#456882] leading-relaxed">{seeker.aboutMe || "No summary provided."}</p>
              </section>

              {/* Skills */}
              {seeker.skills?.length > 0 && (
                <section className="space-y-4 pt-6 border-t border-[#E3E3E3]/50">
                  <SectionHeading icon={Code} title="Technical Skills" />
                  <div className="flex flex-wrap gap-2.5">
                    {seeker.skills.map((skill: string) => (
                      <div key={skill} className="px-4 py-2 rounded-xl bg-[#234C6A]/5 border border-[#234C6A]/10 text-[#234C6A] font-semibold text-sm hover:bg-[#234C6A]/10 hover:-translate-y-0.5 transition-all cursor-default shadow-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Work Experience */}
              {seeker.workExperiences?.length > 0 && (
                <section className="space-y-6 pt-6 border-t border-[#E3E3E3]/50">
                  <SectionHeading icon={Briefcase} title="Work Experience" />
                  <div className="space-y-8 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#234C6A]/20 to-transparent ml-2" />
                    {seeker.workExperiences.map((work: any, i: number) => (
                      <div key={i} className="relative pl-10">
                        <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#234C6A] to-[#456882] border-2 border-white shadow-md" />
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="font-bold text-[#234C6A] text-lg">{work.position}</h3>
                            <span className="text-xs font-bold text-[#456882] bg-[#E3E3E3]/60 px-3 py-1 rounded-full">
                              {formatDate(work.durationFrom)} — {work.durationTo ? formatDate(work.durationTo) : "Present"}
                            </span>
                          </div>
                          <p className="font-semibold text-[#456882]">{work.companyName}</p>
                          {work.responsibilities?.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {work.responsibilities.map((r: string, j: number) => (
                                <li key={j} className="text-sm text-[#456882]/80 flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#234C6A]/40 mt-1.5 flex-shrink-0" />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education & Projects */}
              <section className="pt-6 border-t border-[#E3E3E3]/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {seeker.educations?.length > 0 && (
                    <div className="space-y-4">
                      <SectionHeading icon={Award} title="Education" />
                      <div className="space-y-3">
                        {seeker.educations.map((edu: any, i: number) => (
                          <div key={i} className="p-4 rounded-2xl bg-[#E3E3E3]/30 border border-[#E3E3E3]/50 space-y-1 hover:bg-[#234C6A]/5 transition-colors">
                            <p className="font-bold text-[#234C6A]">{edu.degree}</p>
                            <p className="font-semibold text-[#456882] text-sm">{edu.school}</p>
                            <p className="text-xs text-[#456882]/60">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {seeker.recentProjects?.length > 0 && (
                    <div className="space-y-4">
                      <SectionHeading icon={BookOpen} title="Recent Projects" />
                      <div className="space-y-3">
                        {seeker.recentProjects.map((project: any, i: number) => (
                          <div key={i} className="p-4 rounded-2xl bg-[#E3E3E3]/30 border border-[#E3E3E3]/50 hover:bg-[#234C6A]/5 hover:shadow-md transition-all group cursor-pointer"
                            onClick={() => project.link && window.open(project.link, "_blank")}>
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-[#234C6A] text-sm">{project.projectName}</p>
                              {project.link && <ExternalLink className="h-4 w-4 text-[#456882]/40 group-hover:text-[#234C6A] transition-colors" />}
                            </div>
                            {project.description && (
                              <p className="text-xs text-[#456882]/70 mt-1 line-clamp-2">{project.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </Card>

            {/* CTA */}
            <Card className="p-8 border-none shadow-xl rounded-3xl bg-gradient-to-br from-[#234C6A] to-[#456882] text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10 space-y-1 text-center sm:text-left">
                <h3 className="text-2xl font-black">Ready to hire {seeker.userId?.name?.split(" ")[0]}?</h3>
                <p className="text-blue-200/80">Schedule an interview or send a direct job offer today.</p>
              </div>
              <div className="flex gap-3 relative z-10">
                <Button className="bg-white text-[#234C6A] hover:bg-white/90 rounded-xl font-bold px-8 h-12 shadow-lg transition-all active:scale-95">
                  Book Interview
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
