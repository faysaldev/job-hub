"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  MapPin,
  Briefcase,
  User,
  ExternalLink,
  Code,
  Globe,
  Linkedin,
  Github,
  Twitter,
  ChevronLeft,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { useGetSeekerByIdQuery } from "@/src/redux/features/seeker/seekerApi";
import { formatDate, formatEduYear } from "@/src/utils/helper";

const SOCIAL_CONFIG = [
  {
    key: "github",
    icon: Github,
    label: "GitHub",
    hoverBg: "hover:bg-neutral-900",
    hoverText: "hover:text-white",
  },
  {
    key: "linkedin",
    icon: Linkedin,
    label: "LinkedIn",
    hoverBg: "hover:bg-blue-600",
    hoverText: "hover:text-white",
  },
  {
    key: "twitter",
    icon: Twitter,
    label: "Twitter",
    hoverBg: "hover:bg-sky-500",
    hoverText: "hover:text-white",
  },
];

function SectionHeading({
  icon: Icon,
  title,
  eyebrow,
}: {
  icon: React.ElementType;
  title: string;
  eyebrow?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {eyebrow}
          </p>
        )}
        <h2 className="text-base font-bold text-neutral-950">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default function CandidateDetailsPage() {
  const params = useParams();
  const {
    data: response,
    isLoading,
    error,
  } = useGetSeekerByIdQuery(params?.id as string);
  const seeker = response?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8fafc]">
        <Header />
        <div className="flex flex-1 items-center justify-center px-4">
          <Card className="rounded-2xl border border-[#eaecf0] bg-white p-8 text-center shadow-xs max-w-xs w-full">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Loading Profile...
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Preparing the candidate snapshot
            </p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !seeker) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8fafc]">
        <Header />
        <div className="flex flex-1 items-center justify-center p-4 text-center">
          <Card className="max-w-md rounded-2xl border border-[#eaecf0] bg-white p-8 shadow-xs w-full">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <User className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-neutral-950">
              Profile not found
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              We couldn&apos;t find this candidate profile. It may have been removed.
            </p>
            <Link href="/candidates" className="mt-6 inline-flex">
              <Button className="h-9 rounded-xl bg-black px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800">
                Back to Candidates
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const socials = SOCIAL_CONFIG.map((s) => ({
    ...s,
    link: seeker.socialProfiles?.[s.key],
  })).filter((s) => s.link);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-black text-white pt-8 pb-20 border-b border-neutral-800">
        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <Link
            href="/candidates"
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Candidates
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="max-w-3xl text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                {seeker.userId?.name || "Anonymous Candidate"}
              </h1>
              <p className="mt-2 max-w-xl text-xs sm:text-sm text-neutral-400">
                {seeker.designation || "Professional"} profile with verified skills,
                experience, and availability overview.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300">
                <Briefcase className="h-3.5 w-3.5 text-neutral-400" />
                {seeker.totalExperience || "Experience open"}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 capitalize">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                {seeker.availability?.replace("-", " ") || "Flexible"}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 capitalize">
                <Globe className="h-3.5 w-3.5 text-neutral-400" />
                {seeker.jobType || "Open to roles"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="container mx-auto max-w-5xl flex-1 px-4 pb-16">
        <div className="relative z-20 -mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          {/* Sidebar Snapshot */}
          <aside className="space-y-4">
            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs text-center">
              <div className="relative mx-auto mb-4 inline-block">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 p-0.5">
                  <img
                    src={
                      seeker.userId?.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${
                        seeker.userId?.name || "U"
                      }`
                    }
                    alt={seeker.userId?.name}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-white">
                  <CheckCircle className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              </div>

              <h2 className="text-base font-bold text-neutral-950">
                {seeker.userId?.name || "Anonymous"}
              </h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                {seeker.designation || "Professional"}
              </p>

              {seeker.userLocation && (
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-neutral-600">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                  {seeker.userLocation}
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {seeker.totalExperience && (
                    <div className="rounded-xl bg-[#f8fafc] p-2.5 text-center">
                      <p className="text-xs font-bold text-neutral-950">
                        {seeker.totalExperience}
                      </p>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                        Experience
                      </p>
                    </div>
                  )}
                  {seeker.jobType && (
                    <div className="rounded-xl bg-[#f8fafc] p-2.5 text-center">
                      <p className="text-xs font-bold capitalize text-neutral-950 truncate">
                        {seeker.jobType}
                      </p>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                        Preference
                      </p>
                    </div>
                  )}
                </div>

                {seeker.availability && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 py-2 px-3 text-xs font-semibold text-emerald-800 capitalize flex items-center justify-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-700" />
                    Available {seeker.availability.replace("-", " ")}
                  </div>
                )}
              </div>
            </Card>

            {(socials.length > 0 || seeker.portfolio) && (
              <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  <Globe className="h-3.5 w-3.5 text-neutral-500" />
                  Online Presence
                </h3>
                <div className="space-y-1.5">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={s.link!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl bg-[#f8fafc] p-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-black"
                    >
                      <span className="flex items-center gap-2">
                        <s.icon className="h-4 w-4 text-neutral-500" />
                        {s.label}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                    </a>
                  ))}
                  {seeker.portfolio && (
                    <a
                      href={seeker.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl bg-[#f8fafc] p-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-black"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-neutral-500" />
                        Portfolio
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                    </a>
                  )}
                </div>
              </Card>
            )}
          </aside>

          {/* Details Feed */}
          <div className="space-y-5">
            {/* Summary */}
            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-6 shadow-xs">
              <section className="space-y-3">
                <SectionHeading
                  icon={User}
                  title="Professional Summary"
                  eyebrow="Overview"
                />
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 whitespace-pre-line">
                  {seeker.aboutMe || "No summary provided."}
                </p>
              </section>

              {seeker.skills?.length > 0 && (
                <section className="mt-5 space-y-3 border-t border-neutral-100 pt-5">
                  <SectionHeading
                    icon={Code}
                    title="Technical Skills"
                    eyebrow={`${seeker.skills.length} skills`}
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {seeker.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-md bg-[#f3f4f6] text-neutral-700 px-2.5 py-1 text-xs font-medium border border-neutral-200/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </Card>

            {/* Experience */}
            {seeker.workExperiences?.length > 0 && (
              <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-6 shadow-xs">
                <SectionHeading
                  icon={Briefcase}
                  title="Work Experience"
                  eyebrow="Career Timeline"
                />
                <div className="mt-4 space-y-3">
                  {seeker.workExperiences.map((work: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-xl border border-neutral-100 bg-[#f8fafc] p-4 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <h3 className="text-sm font-bold text-neutral-900">
                            {work.position}
                          </h3>
                          <p className="text-xs font-semibold text-neutral-500">
                            {work.companyName}
                          </p>
                        </div>
                        <span className="inline-flex items-center rounded-md bg-white border border-neutral-200/60 px-2 py-0.5 text-[11px] font-medium text-neutral-500 self-start sm:self-auto">
                          <CalendarDays className="mr-1 h-3 w-3 text-neutral-400" />
                          {formatDate(work.durationFrom)} -{" "}
                          {work.durationTo
                            ? formatDate(work.durationTo)
                            : "Present"}
                        </span>
                      </div>
                      {work.responsibilities?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {work.responsibilities.map(
                            (r: string, j: number) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-xs leading-normal text-neutral-600"
                              >
                                <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                <span>{r}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Projects */}
            {seeker.recentProjects?.length > 0 && (
              <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-6 shadow-xs">
                <SectionHeading
                  icon={BookOpen}
                  title="Recent Projects"
                  eyebrow="Portfolio & Products"
                />
                <div className="mt-4 space-y-3">
                  {seeker.recentProjects.map((project: any, i: number) => {
                    const projectName = project.projectName || project.project_name;
                    const projectLink = project.link || project.live_url;
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-neutral-100 bg-[#f8fafc] p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-neutral-900">
                            {projectName}
                          </h3>
                          {projectLink && (
                            <a
                              href={projectLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-black hover:text-neutral-600"
                            >
                              Visit <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {project.description && (
                          <p className="mt-2 text-xs leading-relaxed text-neutral-600 whitespace-pre-line">
                            {project.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Education */}
            {seeker.educations?.length > 0 && (
              <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 sm:p-6 shadow-xs">
                <SectionHeading
                  icon={Award}
                  title="Education"
                  eyebrow="Credentials"
                />
                <div className="mt-4 space-y-2">
                  {seeker.educations.map((edu: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-xl border border-neutral-100 bg-[#f8fafc] p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                    >
                      <div>
                        <p className="text-xs font-bold text-neutral-900">{edu.degree}</p>
                        <p className="text-[11px] font-medium text-neutral-500">
                          {edu.school}
                        </p>
                      </div>
                      <p className="text-[10px] font-semibold text-neutral-400 self-start sm:self-auto">
                        {formatEduYear(edu.year)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
