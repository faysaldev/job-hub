"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import {
  Users,
  Target,
  Award,
  Briefcase,
  TrendingUp,
  Shield,
  Heart,
  Zap,
  Globe,
  Linkedin,
  Twitter,
  CheckCircle,
  Building2,
  Sparkles,
  ArrowRight,
  Search,
  Handshake,
  Layers3,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      );
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" },
      );
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          delay: 0.35,
          ease: "back.out(1.7)",
        },
      );

      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 82%",
          },
        },
      );

      gsap.fromTo(
        ".mission-content",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".value-card",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".team-card",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 80%",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      icon: <Users className="h-7 w-7" />,
      value: "500K+",
      label: "Active Job Seekers",
      description: "Professionals discovering better career moves",
    },
    {
      icon: <Building2 className="h-7 w-7" />,
      value: "25K+",
      label: "Partner Companies",
      description: "Hiring teams building stronger pipelines",
    },
    {
      icon: <Briefcase className="h-7 w-7" />,
      value: "1M+",
      label: "Jobs Posted",
      description: "Opportunities across roles and industries",
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      value: "92%",
      label: "Success Rate",
      description: "Matches designed for long-term growth",
    },
  ];

  const values = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Trust & Integrity",
      description:
        "Clear profiles, verified workflows, and honest communication across every hiring interaction.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "People First",
      description:
        "JobHub is built around real candidates, real teams, and career decisions that matter.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Matching",
      description:
        "Search, filters, saved jobs, applications, and recruiter tools work together to reduce friction.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Accessible Growth",
      description:
        "A platform experience that helps more professionals find better opportunities from anywhere.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Focused Execution",
      description:
        "Every page, form, and workflow is shaped to help users take the next useful step.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Meaningful Impact",
      description:
        "We measure success by better hires, stronger teams, and more confident career journeys.",
    },
  ];

  const team = [
    {
      name: "Faysal Mridha",
      role: "Founder & Product Leader",
      bio: "Building JobHub as a premium career marketplace where candidates, recruiters, and companies can move from search to meaningful opportunity with clarity.",
      image:
        "https://res.cloudinary.com/dk3v0m35u/image/upload/q_auto/f_auto/v1779182240/bg-remove-profile_owsy6r.png",
      linkedin: "#",
      twitter: "#",
    },
  ];

  const milestones = [
    {
      year: "2018",
      event: "JobHub started with a simple career-matching idea",
    },
    { year: "2019", event: "Candidate and recruiter workflows took shape" },
    { year: "2020", event: "Saved jobs, applications, and messaging expanded" },
    { year: "2021", event: "Company profiles and hiring tools improved" },
    { year: "2022", event: "Dashboard experiences became more focused" },
    { year: "2023", event: "Premium marketplace patterns entered the product" },
    { year: "2024", event: "JobHub evolved into a full career platform" },
  ];

  return (
    <div className="min-h-screen flex flex-col jobhub-page-bg">
      <Header />

      <section className="relative overflow-hidden bg-[#234C6A] pt-32 pb-28 md:pt-40 md:pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute left-8 top-28 hidden h-28 w-64 rotate-[-8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
          <div className="absolute bottom-14 right-10 hidden h-32 w-72 rotate-[7deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="text-center lg:text-left">
              <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>Premium Career Marketplace</span>
              </div>

              <h1 className="hero-title mx-auto max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl lg:mx-0">
                Building the future of hiring, one better match at a time.
              </h1>

              <p className="hero-subtitle mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-white/75 lg:mx-0">
                JobHub connects ambitious professionals with trusted companies
                through a clean, focused, and modern job portal experience.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { icon: Search, label: "Smart Search" },
                  { icon: Handshake, label: "Trusted Hiring" },
                  { icon: Layers3, label: "Full Workflow" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-white/90 backdrop-blur-sm"
                  >
                    <Icon className="mr-2 inline h-4 w-4" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <Card className="hero-subtitle relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 text-white shadow-2xl shadow-black/15 backdrop-blur-md">
              <div className="rounded-[1.35rem] bg-white p-5 text-[#234C6A]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
                      Platform Pulse
                    </p>
                    <h3 className="mt-1 text-2xl font-black">JobHub Today</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A] text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Candidates discover matching roles",
                    "Recruiters manage hiring pipelines",
                    "Companies present verified profiles",
                    "Notifications keep users moving",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl bg-[#F4F7F8] px-4 py-3 text-sm font-bold text-[#456882]"
                    >
                      <CheckCircle className="h-4 w-4 shrink-0 text-[#234C6A]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="relative z-20 -mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="stat-card group relative h-full overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-xl shadow-[#234C6A]/8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-2xl hover:shadow-[#234C6A]/12"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#234C6A] to-[#456882] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/15">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black tracking-tight text-[#234C6A]">
                  {stat.value}
                </div>
                <h3 className="mt-2 text-base font-black text-[#234C6A]">
                  {stat.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#456882]">
                  {stat.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1">
        <section ref={missionRef} className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="mission-content">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#234C6A]">
                  <Target className="h-4 w-4" />
                  Our Story
                </div>
                <h2 className="text-3xl font-black tracking-tight text-[#234C6A] md:text-5xl">
                  A cleaner way to connect talent with opportunity.
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-[#456882]">
                  JobHub was born from a simple belief: job searching and hiring
                  should feel organized, trustworthy, and useful. Candidates
                  need clarity. Recruiters need speed. Companies need a strong
                  place to tell their story.
                </p>
                <p className="mt-4 text-base font-medium leading-8 text-[#456882]">
                  The platform brings jobs, companies, applications, saved
                  listings, profiles, messages, interviews, and notifications
                  into one premium workflow so every user knows what to do next.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { label: "Workflows", value: "12+" },
                    { label: "Industries", value: "50+" },
                    { label: "User Roles", value: "3" },
                    { label: "Experience", value: "24/7" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-[#234C6A]/10 bg-white/90 p-5 shadow-sm"
                    >
                      <div className="text-2xl font-black text-[#234C6A]">
                        {item.value}
                      </div>
                      <div className="mt-1 text-sm font-bold text-[#456882]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="mission-content overflow-hidden pt-0 rounded-3xl border border-[#234C6A]/10 bg-white shadow-2xl shadow-[#234C6A]/10">
                <div className="bg-[#234C6A] p-6 text-white">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-black">Our journey</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    From idea to full job marketplace, JobHub keeps getting
                    sharper around the work users actually need to finish.
                  </p>
                </div>
                <div className="divide-y divide-[#E3E3E3]/70">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.year}
                      className="flex gap-4 p-5 transition-colors hover:bg-[#234C6A]/5"
                    >
                      <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-sm font-black text-[#234C6A]">
                        {milestone.year}
                      </div>
                      <p className="pt-2 text-sm font-semibold leading-6 text-[#456882]">
                        {milestone.event}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section ref={valuesRef} className="bg-[#E3E3E3]/70 py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#234C6A]/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#234C6A]">
                <Shield className="h-4 w-4" />
                What Drives Us
              </div>
              <h2 className="text-3xl font-black tracking-tight text-[#234C6A] md:text-5xl">
                Values behind the platform
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#456882]">
                These principles guide the way JobHub presents opportunities,
                protects trust, and helps people take action.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => (
                <Card
                  key={value.title}
                  className="value-card group relative h-full overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-7 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-2xl hover:shadow-[#234C6A]/10"
                >
                  <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#234C6A] to-[#456882] transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A] transition group-hover:bg-[#234C6A] group-hover:text-white">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#234C6A]">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#456882]">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section ref={teamRef} className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#234C6A]">
                <Users className="h-4 w-4" />
                The Leader Behind JobHub
              </div>
              <h2 className="text-3xl font-black tracking-tight text-[#234C6A] md:text-5xl">
                Leadership Team
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#456882]">
                Product thinking, engineering focus, and a clear vision for a
                better hiring experience.
              </p>
            </div>

            {team.map((member) => (
              <Card
                key={member.name}
                className="team-card mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-2xl shadow-[#234C6A]/10 backdrop-blur"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
                  <div className="relative min-h-[360px] overflow-hidden bg-[#234C6A]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] pl-2" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative z-10 pl-2 mx-auto h-[475px] w-full object-contain object-bottom"
                    />
                  </div>

                  <div className="p-7 md:p-10">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#234C6A]/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#234C6A]">
                      <CheckCircle className="h-4 w-4" />
                      Founder Profile
                    </div>
                    <h3 className="text-3xl font-black tracking-tight text-[#234C6A] md:text-4xl">
                      {member.name}
                    </h3>
                    <p className="mt-2 text-lg font-black text-[#456882]">
                      {member.role}
                    </p>
                    <p className="mt-5 text-base font-medium leading-8 text-[#456882]">
                      {member.bio}
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {["Product", "Frontend", "Marketplace"].map((skill) => (
                        <div
                          key={skill}
                          className="rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-[#234C6A]"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex gap-3">
                      <a
                        href={member.linkedin}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E3E3E3] text-[#234C6A] transition-all duration-300 hover:bg-[#234C6A] hover:text-white"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a
                        href={member.twitter}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E3E3E3] text-[#234C6A] transition-all duration-300 hover:bg-[#234C6A] hover:text-white"
                        aria-label={`${member.name} Twitter`}
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-[#E3E3E3]/70 py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl bg-[#234C6A] p-8 shadow-2xl shadow-[#234C6A]/15 md:p-14">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4" />
                    Join Our Growing Community
                  </div>

                  <h2 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
                    Ready to move your career or hiring workflow forward?
                  </h2>
                  <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-white/75">
                    Explore jobs, discover companies, manage applications, and
                    stay connected through a modern JobHub experience.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button
                    size="lg"
                    className="h-13 rounded-2xl bg-white px-7 font-black text-[#234C6A] hover:bg-[#E3E3E3]"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 rounded-2xl border-white bg-transparent px-7 font-black text-white hover:bg-white/10"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
