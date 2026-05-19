/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Search,
  Briefcase,
  TrendingUp,
  Zap,
  Shield,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Users,
  CheckCircle,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { jobCategories } from "@/src/lib/jobCategories";
import {
  useGetCategoryStatsQuery,
  useGetTopJobsQuery,
} from "@/src/redux/features/generals/generalsApi";

const featuredCompanies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
];

const formatRelativeTime = (dateStr?: string) => {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

const formatSalary = (min?: number, max?: number, period?: string) => {
  if (!min || !max) return "Salary disclosed";
  const compact = (value: number) =>
    value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`;
  const periodLabel =
    period === "hourly" ? "/hr" : period === "yearly" ? "/yr" : "/mo";
  return `${compact(min)} - ${compact(max)}${periodLabel}`;
};

function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allTopsJobs } = useGetTopJobsQuery(undefined);
  const { data: categoryStats } = useGetCategoryStatsQuery(undefined);

  const enrichedCategories = useMemo(() => {
    if (!categoryStats || !Array.isArray(categoryStats)) return jobCategories;
    return jobCategories.map((cat) => {
      const stat = categoryStats.find(
        (s: { category: string; count: number }) => s.category === cat.id,
      );
      return stat ? { ...cat, count: stat.count } : cat;
    });
  }, [categoryStats]);

  const topJobs = useMemo(() => {
    if (!allTopsJobs || !Array.isArray(allTopsJobs)) return [];
    return allTopsJobs;
  }, [allTopsJobs]);

  const heroJobs = useMemo(() => topJobs.slice(0, 3), [topJobs]);
  const totalCategoryJobs = useMemo(
    () =>
      enrichedCategories.reduce(
        (sum, category) => sum + (Number(category.count) || 0),
        0,
      ),
    [enrichedCategories],
  );
  const handleSearch = () => {
    const keyword = searchQuery.trim();
    router.push(keyword ? `/job?s=${encodeURIComponent(keyword)}` : "/job");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content > *",
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: "power3.out" },
      );

      gsap.fromTo(
        ".hero-panel",
        { opacity: 0, x: 36 },
        { opacity: 1, x: 0, duration: 0.85, ease: "power3.out", delay: 0.2 },
      );

      gsap.utils.toArray(".fade-up").forEach((el: any) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          },
        );
      });

      gsap.utils.toArray(".stagger-item").forEach((el: any, i: number) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            delay: i * 0.05,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col jobhub-page-bg">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-[#234C6A]/10 bg-[#F8FAFC]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#234C6A10_1px,transparent_1px),linear-gradient(to_bottom,#234C6A0D_1px,transparent_1px)] bg-[size:72px_72px]" />
            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#E3E3E3]/80 to-transparent" />
            <div className="absolute bottom-0 right-0 h-40 w-full bg-gradient-to-t from-white to-transparent" />
          </div>

          <div className="container mx-auto relative z-10 px-4 pt-28 pb-16 lg:pt-36 lg:pb-24">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-10 xl:gap-14 items-center">
              <div className="hero-content">
                <Badge className="mb-6 w-fit bg-white text-[#234C6A] border border-[#234C6A]/10 px-4 py-2 shadow-sm">
                  <Sparkles className="h-4 w-4 mr-2 text-[#456882]" />
                  Premium hiring marketplace for modern teams
                </Badge>

                <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.02] tracking-tight text-[#234C6A]">
                  Find the role that moves your career forward.
                </h1>

                <p className="mt-6 max-w-2xl text-lg md:text-xl leading-8 text-[#456882]">
                  Search verified jobs, compare top companies, and apply with a
                  smoother job portal built around real opportunities from your
                  current JobHub data.
                </p>

                <div className="mt-8 max-w-2xl rounded-2xl border border-[#234C6A]/10 bg-white p-2 shadow-2xl shadow-[#234C6A]/10">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex min-h-14 flex-1 items-center gap-3 rounded-xl bg-[#F4F7F8] px-4">
                      <Search className="h-5 w-5 text-[#456882]" />
                      <input
                        type="text"
                        placeholder="Search by title, keyword, or company"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent text-[#234C6A] outline-none placeholder:text-[#456882]/60"
                      />
                    </div>
                    <Button
                      size="lg"
                      onClick={handleSearch}
                      className="h-14 rounded-xl bg-[#234C6A] px-7 font-bold text-white shadow-lg shadow-[#234C6A]/20 hover:bg-[#1c405a]"
                    >
                      Search Jobs
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {["Remote", "Frontend", "Full Stack", "Product", "Design"].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          router.push(`/job?s=${encodeURIComponent(term)}`);
                        }}
                        className="rounded-full border border-[#234C6A]/10 bg-white px-4 py-2 text-sm font-semibold text-[#456882] transition hover:border-[#234C6A]/25 hover:text-[#234C6A]"
                      >
                        {term}
                      </button>
                    ),
                  )}
                </div>

                <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                  {[
                    {
                      value:
                        totalCategoryJobs > 0
                          ? `${totalCategoryJobs.toLocaleString()}+`
                          : "10K+",
                      label: "Open roles",
                    },
                    {
                      value: `${topJobs.length || 100}+`,
                      label: "Featured jobs",
                    },
                    {
                      value: `${enrichedCategories.length}+`,
                      label: "Categories",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-[#234C6A]/10 bg-white/80 p-4 shadow-sm"
                    >
                      <p className="text-2xl font-black text-[#234C6A]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#456882]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-panel relative hidden lg:block">
                <div className="absolute -top-10 -left-10 h-full w-full rounded-3xl bg-gradient-to-br from-[#234C6A]/10 to-transparent" />

                <div className="relative space-y-4">
                  {heroJobs.length > 0
                    ? heroJobs.map((job: any, i: number) => (
                        <Link
                          key={job._id}
                          href={`/job/${job._id}`}
                          className="block"
                        >
                          <Card
                            className={`group cursor-pointer rounded-2xl border border-[#E3E3E3] bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-xl ${
                              i === 1 ? "ml-8" : i === 2 ? "ml-4" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-5">
                              <div className="flex min-w-0 gap-4">
                                {job.company?.companyLogo ? (
                                  <Image
                                    src={job.company.companyLogo}
                                    alt={job.company.companyName || job.title}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-xl object-cover shadow-md"
                                  />
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] text-lg font-bold text-white">
                                    {job.company?.companyName?.[0] || "J"}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="truncate font-semibold text-[#234C6A] transition-colors group-hover:text-[#456882]">
                                      {job.title}
                                    </h3>
                                    <Badge className="shrink-0 bg-[#E3E3E3] text-[#234C6A] border-none text-xs capitalize">
                                      {job.locationType}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-[#456882]">
                                    {job.company?.companyName ||
                                      "Verified company"}
                                  </p>
                                  <div className="mt-2 flex items-center gap-4 text-xs text-[#456882]">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span className="max-w-[150px] truncate">
                                        {job.location || "Flexible"}
                                      </span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatRelativeTime(job.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="font-semibold text-[#234C6A]">
                                  {formatSalary(
                                    job.salaryMin,
                                    job.salaryMax,
                                    job.salaryPeriod,
                                  )}
                                </p>
                                <p className="text-xs capitalize text-[#456882]">
                                  {job.type}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))
                    : [0, 1, 2].map((i) => (
                        <Card
                          key={i}
                          className={`animate-pulse rounded-2xl border-none bg-white p-5 shadow-lg ${
                            i === 1 ? "ml-8" : i === 2 ? "ml-4" : ""
                          }`}
                        >
                          <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-xl bg-[#E3E3E3]" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-3/4 rounded bg-[#E3E3E3]" />
                              <div className="h-3 w-1/2 rounded bg-[#E3E3E3]" />
                            </div>
                          </div>
                        </Card>
                      ))}
                </div>

                <div className="absolute -bottom-6 -right-6 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-4 py-3 text-white shadow-xl">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">
                      {topJobs.length || 0}+ top jobs available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#234C6A]/10 bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#456882]">
                Trusted by teams hiring across every discipline
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {featuredCompanies.map((company) => (
                  <span
                    key={company}
                    className="text-lg font-black text-[#234C6A]/35 transition hover:text-[#234C6A]"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="fade-up mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Badge className="mb-4 bg-[#234C6A]/10 text-[#234C6A] border-none">
                  Browse categories
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#234C6A]">
                  Explore jobs by specialty
                </h2>
                <p className="mt-3 max-w-2xl text-[#456882]">
                  Category counts are connected to your backend stats, so this
                  section stays fresh as new roles are added.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A] hover:text-white"
              >
                <Link href="/job">
                  View all categories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {enrichedCategories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/job?category=${category.id}`}
                  className="stagger-item group"
                >
                  <Card className="h-full overflow-hidden rounded-2xl border border-[#234C6A]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-xl">
                    <div className="mb-5 flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} shadow-lg`}
                      >
                        <Briefcase className="h-7 w-7 text-white" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#456882] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>
                    <h3 className="text-lg font-black text-[#234C6A]">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-[#456882]">
                      {(category.count || 0).toLocaleString()} open jobs
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#234C6A] py-20 lg:py-24 text-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="fade-up">
                <Badge className="mb-5 bg-white/10 text-white border-white/15">
                  Why JobHub
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                  A cleaner way to discover, compare, and apply.
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/70">
                  Keep the job search focused with verified roles, readable
                  job cards, category browsing, and a premium application path.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: Zap,
                    title: "Quick apply",
                    description: "Move from discovery to application faster.",
                  },
                  {
                    icon: Shield,
                    title: "Verified data",
                    description: "Use your existing backend as the source.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Better matches",
                    description: "Search and browse around real categories.",
                  },
                ].map((feature) => (
                  <Card
                    key={feature.title}
                    className="stagger-item rounded-2xl border border-white/10 bg-white/10 p-6 text-white shadow-none backdrop-blur-sm"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-black">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {feature.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {topJobs.length > 0 && (
          <section className="py-20 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="fade-up mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <Badge className="mb-4 bg-[#234C6A]/10 text-[#234C6A] border-none">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending now
                  </Badge>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#234C6A]">
                    Latest premium openings
                  </h2>
                  <p className="mt-3 max-w-2xl text-[#456882]">
                    Real roles from your API, displayed as polished cards built
                    for scanning and quick action.
                  </p>
                </div>
                <Button
                  asChild
                  className="rounded-xl bg-[#234C6A] text-white hover:bg-[#1c405a]"
                >
                  <Link href="/job">
                    Browse all jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {topJobs.slice(0, 6).map((job: any) => (
                  <Link key={job._id} href={`/job/${job._id}`}>
                    <Card className="stagger-item group h-full rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-6 transition hover:-translate-y-1 hover:border-[#234C6A]/25 hover:bg-white hover:shadow-xl">
                      <div className="flex items-start gap-4">
                        {job.company?.companyLogo ? (
                          <Image
                            src={job.company.companyLogo}
                            alt={job.company.companyName || job.title}
                            width={52}
                            height={52}
                            className="h-14 w-14 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#234C6A] text-lg font-black text-white">
                            {job.company?.companyName?.[0] || "J"}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-black text-[#234C6A] group-hover:text-[#456882]">
                            {job.title}
                          </h3>
                          <p className="truncate text-sm font-semibold text-[#456882]">
                            {job.company?.companyName || "Verified company"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Badge className="bg-white text-[#234C6A] border border-[#234C6A]/10 capitalize">
                          {job.type}
                        </Badge>
                        <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none capitalize">
                          {job.locationType}
                        </Badge>
                      </div>

                      <div className="mt-5 space-y-3 text-sm text-[#456882]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#234C6A]" />
                          <span className="truncate">
                            {job.location || "Flexible location"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#234C6A]" />
                          <span>
                            {formatSalary(
                              job.salaryMin,
                              job.salaryMax,
                              job.salaryPeriod,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-[#E3E3E3] pt-4">
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#456882]">
                          <Clock className="h-3.5 w-3.5" />
                          {formatRelativeTime(job.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 text-sm font-black text-[#234C6A]">
                          View
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Search with intent",
                  description:
                    "Start from keywords, categories, or featured jobs.",
                },
                {
                  step: "02",
                  title: "Compare the fit",
                  description:
                    "Review salary, location type, company, and skills faster.",
                },
                {
                  step: "03",
                  title: "Apply and track",
                  description:
                    "Continue into your existing application workflow.",
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="fade-up rounded-2xl border border-[#234C6A]/10 bg-white p-8 shadow-sm"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-5xl font-black text-[#234C6A]/15">
                      {item.step}
                    </span>
                    <CheckCircle className="h-7 w-7 text-[#456882]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#234C6A]">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-[#456882]">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="fade-up mb-10 max-w-3xl">
              <Badge className="mb-4 bg-[#234C6A]/10 text-[#234C6A] border-none">
                Choose your path
              </Badge>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#234C6A]">
                Built for candidates and hiring teams.
              </h2>
              <p className="mt-3 text-[#456882]">
                A premium job portal should feel useful from both sides of the
                marketplace. These entry points keep the next action clear.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {[
                {
                  icon: Users,
                  title: "For job seekers",
                  description:
                    "Browse verified roles, save opportunities, apply faster, and manage your career flow from one focused dashboard.",
                  href: "/job",
                  action: "Explore jobs",
                  points: ["Live openings", "Saved jobs", "Application tracking"],
                },
                {
                  icon: Building2,
                  title: "For recruiters",
                  description:
                    "Post roles, review candidates, manage applicants, and keep hiring activity organized without changing your backend flow.",
                  href: "/auth",
                  action: "Start hiring",
                  points: ["Candidate discovery", "Job posting", "Recruiter tools"],
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="stagger-item group overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-8 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/20">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-black text-[#234C6A]">
                        {item.title}
                      </h3>
                      <p className="mt-3 leading-7 text-[#456882]">
                        {item.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.points.map((point) => (
                          <span
                            key={point}
                            className="rounded-full border border-[#234C6A]/10 bg-white px-3 py-1 text-xs font-bold text-[#456882]"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                      <Button
                        asChild
                        className="mt-6 rounded-xl bg-[#234C6A] text-white hover:bg-[#1c405a]"
                      >
                        <Link href={item.href}>
                          {item.action}
                          <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="fade-up mb-10 text-center">
              <Badge className="mb-4 bg-[#234C6A]/10 text-[#234C6A] border-none">
                Career proof
              </Badge>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#234C6A]">
                A smoother search feels different.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  quote:
                    "The job cards are easy to scan, and the role details feel much clearer than a typical job board.",
                  name: "Sarah Johnson",
                  role: "Frontend Engineer",
                },
                {
                  quote:
                    "I can quickly understand company, location, salary, and job type before opening the full listing.",
                  name: "Michael Chen",
                  role: "Product Designer",
                },
                {
                  quote:
                    "The premium layout makes the platform feel trustworthy and faster for real hiring decisions.",
                  name: "Emily Davis",
                  role: "Recruiting Lead",
                },
              ].map((testimonial) => (
                <Card
                  key={testimonial.name}
                  className="stagger-item rounded-3xl border border-[#234C6A]/10 bg-white p-7 shadow-sm"
                >
                  <div className="mb-5 flex gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Star
                          key={index}
                          className="h-4 w-4 fill-[#234C6A] text-[#234C6A]"
                        />
                      ))}
                  </div>
                  <p className="leading-7 text-[#456882]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E3E3E3] font-black text-[#234C6A]">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-[#234C6A]">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-[#456882]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20 lg:pb-24">
          <div className="container mx-auto px-4">
            <Card className="fade-up overflow-hidden rounded-[2rem] border-none bg-[#234C6A] p-8 text-white shadow-2xl shadow-[#234C6A]/20 md:p-12 lg:p-16">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <Badge className="mb-5 bg-white/10 text-white border-white/15">
                    Start today
                  </Badge>
                  <h2 className="max-w-3xl text-3xl md:text-5xl font-black tracking-tight">
                    Ready to discover your next opportunity?
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
                    Join JobHub, browse live openings, and keep moving toward a
                    better role with a cleaner premium experience.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button
                    asChild
                    size="lg"
                    className="h-14 rounded-xl bg-white px-8 font-black text-[#234C6A] hover:bg-[#E3E3E3]"
                  >
                    <Link href="/auth">
                      Get started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-xl border-white/30 bg-transparent px-8 font-black text-white hover:bg-white/10"
                  >
                    <Link href="/job">Browse jobs</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
