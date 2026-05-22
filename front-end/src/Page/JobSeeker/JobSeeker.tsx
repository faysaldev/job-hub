"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import {
  Briefcase,
  Calendar,
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
  ArrowUpRight,
  Bell,
  Zap,
  BarChart3,
  Activity,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useGetActivitiesQuery } from "@/src/redux/features/seeker/seekerApi";
import { useGetSeekerDashboardStatsQuery } from "@/src/redux/features/generals/generalsApi";

interface StatDef {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
  href: string;
}

function StatCard({ stat }: { stat: StatDef }) {
  return (
    <Link href={stat.href}>
      <Card className="stats-card group relative h-full overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-2xl hover:shadow-[#234C6A]/10">
        <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#234C6A] to-[#456882] transition-transform duration-300 group-hover:scale-x-100" />
        <div className="mb-5 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/15 transition-transform duration-300 group-hover:scale-105">
            <stat.icon className="h-6 w-6" />
          </div>
          {stat.trendUp && (
            <Badge className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              Up
            </Badge>
          )}
        </div>
        <p className="text-3xl font-black tracking-tight text-[#234C6A]">
          {stat.value ?? "-"}
        </p>
        <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#456882]">
          {stat.title}
        </p>
        <p className="mt-2 text-sm font-medium text-[#456882]/75">
          {stat.trend}
        </p>
      </Card>
    </Link>
  );
}

const JobSeekerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".stats-card",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.2,
          ease: "power2.out",
        },
      );
      gsap.fromTo(
        ".main-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const { data: activityData } = useGetActivitiesQuery();
  const { data: seekerStatsData } = useGetSeekerDashboardStatsQuery();

  const apiStats = seekerStatsData as any;
  const activities: any[] = (activityData as any)?.slice(0, 5) ?? [];
  const profileStrength = apiStats?.profileStrength ?? 0;

  const stats: StatDef[] = [
    {
      title: "Applied Jobs",
      value: apiStats?.applications?.total ?? "-",
      icon: Briefcase,
      trend: apiStats?.applications?.thisWeek
        ? `+${apiStats.applications.thisWeek} this week`
        : "Total applications",
      trendUp: (apiStats?.applications?.thisWeek ?? 0) > 0,
      href: "/job-seeker/applications",
    },
    {
      title: "Interviews",
      value: apiStats?.interviews?.total ?? "-",
      icon: Calendar,
      trend: "Scheduled and upcoming",
      trendUp: (apiStats?.interviews?.total ?? 0) > 0,
      href: "/job-seeker/interviews",
    },
    {
      title: "Hired",
      value: apiStats?.applications?.hired ?? "-",
      icon: Award,
      trend: "Successful placements",
      trendUp: (apiStats?.applications?.hired ?? 0) > 0,
      href: "/job-seeker/applications",
    },
    {
      title: "Profile Strength",
      value: profileStrength ? `${profileStrength}%` : "-",
      icon: TrendingUp,
      trend: "Profile completion score",
      trendUp: profileStrength >= 70,
      href: "/job-seeker/profile",
    },
  ];

  if (!user) return null;

  return (
    <JobSeekerLayout>
      <div ref={containerRef} className="mx-auto max-w-7xl space-y-8">
        <section className="dashboard-header">
          <div className="relative overflow-hidden rounded-3xl bg-[#234C6A] p-7 text-white shadow-2xl shadow-[#234C6A]/20 md:p-9">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                  <Shield className="h-4 w-4" />
                  <span>Seeker Command Center</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                  Welcome back, {user.name}!
                </h1>
                <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/75">
                  Track your applications, strengthen your profile, and keep
                  momentum toward the right opportunity.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/job">
                  <Button className="h-12 w-full rounded-2xl bg-white px-6 font-black text-[#234C6A] hover:bg-[#E3E3E3]">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Jobs
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-white/30 bg-transparent px-6 font-black text-white hover:bg-white/10"
                  onClick={() =>
                    apiStats?.resumeLink &&
                    window.open(apiStats.resumeLink, "_blank")
                  }
                  disabled={!apiStats?.resumeLink}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {apiStats?.resumeLink ? "View Resume" : "No Resume"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </section>

        <section className="main-content grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-7 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882]" />
              <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#234C6A] text-white">
                      <Zap className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#456882]">
                      Profile Boost
                    </span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-[#234C6A]">
                    Get noticed by recruiters
                  </h2>
                  <p className="mt-2 max-w-md text-sm font-medium leading-6 text-[#456882]">
                    Complete your profile to improve matching quality and make
                    your applications stronger.
                  </p>
                </div>
                <Link href="/job-seeker/profile" className="shrink-0">
                  <Button className="h-12 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-7 font-black text-white shadow-lg shadow-[#234C6A]/20 hover:from-[#1c405a] hover:to-[#3b5a71]">
                    Update Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <Sparkles className="absolute -bottom-8 -right-8 h-44 w-44 rotate-12 text-[#234C6A]/5" />
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-black text-[#234C6A]">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </h3>
                  {activities.length > 0 && (
                    <Badge className="rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 text-[10px] font-black uppercase tracking-wide text-[#234C6A]">
                      {activities.length} events
                    </Badge>
                  )}
                </div>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.map((act: any, i: number) => (
                      <div
                        key={act._id ?? i}
                        className="flex items-start gap-3 rounded-2xl bg-[#F8FAFC] p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A]">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#234C6A]">
                            {act.activityTitle || "Activity"}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-[#456882]">
                            {act.date
                              ? new Date(act.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "Recently"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-[#234C6A]/15 bg-[#F8FAFC] py-8 text-center">
                      <BarChart3 className="mx-auto mb-2 h-10 w-10 text-[#456882]/35" />
                      <p className="text-sm font-medium text-[#456882]">
                        No activity yet. Start applying!
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#234C6A] to-[#456882] p-6 text-white shadow-xl shadow-[#234C6A]/20">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[3rem] bg-white/10" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black">Smart Recommendations</h3>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    You have applied to{" "}
                    <span className="font-black text-white">
                      {apiStats?.applications?.total ?? 0} jobs
                    </span>
                    . Keep exploring roles that fit your profile.
                  </p>
                  <Link href="/job">
                    <Button className="mt-6 h-11 w-full rounded-2xl bg-white font-black text-[#234C6A] hover:bg-[#E3E3E3]">
                      View Matches
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <Target className="absolute -bottom-10 -right-10 h-36 w-36 text-white/10" />
              </Card>
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-black text-[#234C6A]">
                <BarChart3 className="h-5 w-5" />
                Profile Strength
              </h3>
              <div className="mb-3 flex items-end justify-between">
                <span className="text-sm font-semibold text-[#456882]">
                  Completion
                </span>
                <span className="text-3xl font-black text-[#234C6A]">
                  {profileStrength}%
                </span>
              </div>
              <div className="mb-5 h-3 w-full overflow-hidden rounded-full bg-[#E3E3E3]">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#234C6A] to-[#456882] shadow-sm transition-all duration-700"
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
              <ul className="space-y-3">
                {[
                  { label: "Basic info completed", done: profileStrength > 0 },
                  { label: "Resume uploaded", done: !!apiStats?.resumeLink },
                  { label: "Add portfolio link", done: profileStrength >= 90 },
                ].map((item) => (
                  <li
                    key={item.label}
                    className={`flex items-center gap-3 rounded-2xl p-3 text-sm font-black ${
                      item.done
                        ? "bg-emerald-50 text-emerald-700"
                        : "border border-dashed border-[#234C6A]/15 text-[#456882]"
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle className="h-4 w-4 shrink-0" />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-[#456882]/30" />
                    )}
                    {item.label}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A]">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-[#234C6A]">
                Stay interview-ready
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#456882]">
                Keep your resume and profile current so recruiters can evaluate
                you faster.
              </p>
              <Link href="/job-seeker/interviews">
                <Button
                  variant="outline"
                  className="mt-5 h-11 w-full rounded-2xl border-[#234C6A]/20 font-black text-[#234C6A] hover:bg-[#234C6A]/5"
                >
                  View Interviews
                </Button>
              </Link>
            </Card>
          </aside>
        </section>
      </div>
    </JobSeekerLayout>
  );
};

export default JobSeekerDashboard;
