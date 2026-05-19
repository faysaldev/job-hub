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
  Mail,
  CalendarDays,
} from "lucide-react";
import { useGetSeekerByIdQuery } from "@/src/redux/features/seeker/seekerApi";

const SOCIAL_CONFIG = [
  {
    key: "github",
    icon: Github,
    label: "GitHub",
    hoverBg: "hover:bg-gray-900",
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

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatEduYear(yearStr: string) {
  if (!yearStr) return "";
  const parseAndFormat = (str: string) => {
    const trimmed = str.trim();
    if (!trimmed) return "";
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return trimmed;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (trimmed.length <= 4) return trimmed;
    return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  };

  if (yearStr.includes(" - ")) {
    return yearStr.split(" - ").map(parseAndFormat).join(" - ");
  }
  return parseAndFormat(yearStr);
}

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
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/15">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        {eyebrow && (
          <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-black tracking-tight text-[#234C6A]">
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

  console.log(" seeker", seeker);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col jobhub-page-bg">
        <div className="flex flex-1 items-center justify-center px-6">
          <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-10 text-center shadow-2xl shadow-[#234C6A]/10">
            <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-[#234C6A]/15 border-t-[#234C6A]" />
            <p className="text-sm font-black uppercase tracking-widest text-[#234C6A]">
              Loading Profile...
            </p>
            <p className="mt-2 text-sm text-[#456882]">
              Preparing the candidate snapshot
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !seeker) {
    return (
      <div className="flex min-h-screen flex-col jobhub-page-bg">
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <Card className="max-w-md rounded-3xl border border-[#234C6A]/10 bg-white/95 p-10 shadow-2xl shadow-[#234C6A]/10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50">
              <User className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-black text-[#234C6A]">
              Profile not found
            </h3>
            <p className="mt-2 text-[#456882]">
              We couldn&apos;t find this candidate profile. It may have been
              removed.
            </p>
            <Link href="/candidates" className="mt-8 inline-flex">
              <Button className="h-12 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-8 font-black text-white">
                Back to Candidates
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const socials = SOCIAL_CONFIG.map((s) => ({
    ...s,
    link: seeker.socialProfiles?.[s.key],
  })).filter((s) => s.link);

  return (
    <div className="min-h-screen flex flex-col jobhub-page-bg">
      <section className="relative overflow-hidden bg-[#234C6A] pt-28 pb-28 md:pt-20 md:pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute left-8 top-28 hidden h-28 w-64 rotate-[-8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
          <div className="absolute bottom-14 right-10 hidden h-32 w-72 rotate-[7deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Link
            href="/candidates"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/80 backdrop-blur-sm transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Candidates
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                {seeker.userId?.name || "Anonymous Candidate"}
              </h1>
              <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-white/75">
                {seeker.designation || "Professional"} profile with skills,
                experience, availability, and project history in one focused
                recruiter view.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
              {[
                {
                  icon: Briefcase,
                  label: "Experience",
                  value: seeker.totalExperience || "Not added",
                },
                {
                  icon: Clock,
                  label: "Availability",
                  value: seeker.availability?.replace("-", " ") || "Flexible",
                },
                {
                  icon: Globe,
                  label: "Preference",
                  value: seeker.jobType || "Open",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm"
                >
                  <Icon className="mb-3 h-5 w-5" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-black capitalize">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto flex-1 px-6 pb-20">
        <div className="relative z-20 -mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-2xl shadow-[#234C6A]/10 backdrop-blur-xl pt-0">
              <div className="bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 p-8 text-center">
                <div className="relative mx-auto mb-5 inline-block">
                  <div className="mx-auto h-36 w-36 overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white p-1 shadow-xl">
                    <img
                      src={
                        seeker.userId?.image ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${
                          seeker.userId?.name || "U"
                        }`
                      }
                      alt={seeker.userId?.name}
                      className="h-full w-full rounded-[1.35rem] object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-white bg-emerald-500 shadow-lg">
                    <CheckCircle
                      className="h-5 w-5 text-white"
                      strokeWidth={3}
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-black text-[#234C6A]">
                  {seeker.userId?.name || "Anonymous"}
                </h2>
                <p className="mt-1 font-semibold text-[#456882]">
                  {seeker.designation || "Professional"}
                </p>

                {seeker.userLocation && (
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#456882]">
                    <MapPin className="h-4 w-4 text-[#234C6A]" />
                    {seeker.userLocation}
                  </p>
                )}
              </div>

              <div className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-3">
                  {seeker.totalExperience && (
                    <div className="rounded-2xl bg-[#F4F7F8] p-4 text-center">
                      <p className="text-lg font-black text-[#234C6A]">
                        {seeker.totalExperience}
                      </p>
                      <p className="text-xs font-bold text-[#456882]">
                        Experience
                      </p>
                    </div>
                  )}
                  {seeker.jobType && (
                    <div className="rounded-2xl bg-[#F4F7F8] p-4 text-center">
                      <p className="text-lg font-black capitalize text-[#234C6A]">
                        {seeker.jobType}
                      </p>
                      <p className="text-xs font-bold text-[#456882]">
                        Job Type
                      </p>
                    </div>
                  )}
                </div>

                {seeker.availability && (
                  <Badge className="w-full justify-center rounded-2xl border border-emerald-100 bg-emerald-50 py-2 font-black capitalize text-emerald-700">
                    <Clock className="mr-2 h-4 w-4" />
                    Available {seeker.availability.replace("-", " ")}
                  </Badge>
                )}

                <div className="space-y-3 border-t border-[#E3E3E3]/70 pt-5">
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-2xl border-[#234C6A]/20 font-black text-[#234C6A] hover:bg-[#234C6A]/5"
                    onClick={() => {
                      const email = seeker.userId?.email;
                      if (email) {
                        const name = seeker.userId?.name || "Candidate";
                        const designation = seeker.designation || "professional";
                        const skills = seeker.skills?.slice(0, 3).join(", ") || "development";
                        const subject = encodeURIComponent(`Exciting Career Opportunity at JobHub - ${designation}`);
                        const body = encodeURIComponent(
                          `Hello ${name},\n\n` +
                          `I hope you are doing well.\n\n` +
                          `I was reviewing your profile on JobHub and was highly impressed by your background as a ${designation}, particularly your expertise in ${skills}.\n\n` +
                          `We are currently looking for talented individuals with your skillset and I would love to schedule a quick chat to discuss how your experience aligns with our goals. Are you available for a brief conversation this week?\n\n` +
                          `Looking forward to hearing from you!\n\n` +
                          `Best regards,\n` +
                          `Recruiter`
                        );
                        window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
                      }
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            </Card>

            {(socials.length > 0 || seeker.portfolio) && (
              <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-[#234C6A]">
                  <Globe className="h-5 w-5" />
                  Online Presence
                </h3>
                <div className="space-y-3">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={s.link!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-between rounded-2xl bg-[#F4F7F8] p-3.5 text-sm font-black text-[#234C6A] transition-all ${s.hoverBg} ${s.hoverText}`}
                    >
                      <span className="flex items-center gap-3">
                        <s.icon className="h-5 w-5" />
                        {s.label}
                      </span>
                      <ExternalLink className="h-4 w-4 opacity-45 transition-opacity group-hover:opacity-100" />
                    </a>
                  ))}
                  {seeker.portfolio && (
                    <a
                      href={seeker.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl bg-[#F4F7F8] p-3.5 text-sm font-black text-[#234C6A] transition-all hover:bg-emerald-500 hover:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <Globe className="h-5 w-5" />
                        Portfolio
                      </span>
                      <ExternalLink className="h-4 w-4 opacity-45 transition-opacity group-hover:opacity-100" />
                    </a>
                  )}
                </div>
              </Card>
            )}
          </aside>

          <div className="space-y-6">
            <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-7 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
              <section className="space-y-4">
                <SectionHeading
                  icon={User}
                  title="Professional Summary"
                  eyebrow="Overview"
                />
                <p className="text-base font-medium leading-8 text-[#456882]">
                  {seeker.aboutMe || "No summary provided."}
                </p>
              </section>

              {seeker.skills?.length > 0 && (
                <section className="mt-8 space-y-5 border-t border-[#E3E3E3]/70 pt-8">
                  <SectionHeading
                    icon={Code}
                    title="Technical Skills"
                    eyebrow={`${seeker.skills.length} skills`}
                  />
                  <div className="flex flex-wrap gap-2.5">
                    {seeker.skills.map((skill: string) => (
                      <Badge
                        key={skill}
                        className="rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-4 py-2 text-sm font-bold text-[#234C6A] transition hover:bg-[#234C6A]/10"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </Card>

            {seeker.workExperiences?.length > 0 && (
              <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-7 shadow-sm backdrop-blur">
                <SectionHeading
                  icon={Briefcase}
                  title="Work Experience"
                  eyebrow="Career timeline"
                />
                <div className="relative mt-7 space-y-6">
                  <div className="absolute bottom-2 left-[21px] top-2 w-px bg-gradient-to-b from-[#234C6A]/25 to-transparent" />
                  {seeker.workExperiences.map((work: any, i: number) => (
                    <div key={i} className="relative flex gap-5">
                      <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/15">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div className="flex-1 rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-black text-[#234C6A]">
                              {work.position}
                            </h3>
                            <p className="mt-1 font-semibold text-[#456882]">
                              {work.companyName}
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-black text-[#456882] shadow-sm">
                            <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-[#234C6A]" />
                            {formatDate(work.durationFrom)} -{" "}
                            {work.durationTo
                              ? formatDate(work.durationTo)
                              : "Present"}
                          </span>
                        </div>
                        {work.responsibilities?.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {work.responsibilities.map(
                              (r: string, j: number) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-sm leading-6 text-[#456882]"
                                >
                                  <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-[#234C6A]" />
                                  {r}
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {seeker.educations?.length > 0 && (
                <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-7 shadow-sm backdrop-blur">
                  <SectionHeading
                    icon={Award}
                    title="Education"
                    eyebrow="Credentials"
                  />
                  <div className="mt-6 space-y-3">
                    {seeker.educations.map((edu: any, i: number) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-[#234C6A]/8 bg-[#F8FAFC] p-4 transition hover:bg-[#234C6A]/5"
                      >
                        <p className="font-black text-[#234C6A]">
                          {edu.degree}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#456882]">
                          {edu.school}
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#456882]/65">
                          {formatEduYear(edu.year)}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {seeker.recentProjects?.length > 0 && (
                <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-7 shadow-sm backdrop-blur">
                  <SectionHeading
                    icon={BookOpen}
                    title="Recent Projects"
                    eyebrow="Portfolio work"
                  />
                  <div className="mt-6 space-y-3">
                    {seeker.recentProjects.map((project: any, i: number) => (
                      <button
                        key={i}
                        type="button"
                        className="group w-full rounded-2xl border border-[#234C6A]/8 bg-[#F8FAFC] p-4 text-left transition hover:bg-[#234C6A]/5 hover:shadow-sm"
                        onClick={() =>
                          project.link && window.open(project.link, "_blank")
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-black text-[#234C6A]">
                            {project.projectName}
                          </p>
                          {project.link && (
                            <ExternalLink className="h-4 w-4 shrink-0 text-[#456882]/45 transition group-hover:text-[#234C6A]" />
                          )}
                        </div>
                        {project.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#456882]">
                            {project.description}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
