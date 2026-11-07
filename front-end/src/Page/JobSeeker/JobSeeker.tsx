"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Calendar,
  Award,
  TrendingUp,
  ArrowUpRight,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Target,
  CheckCircle,
  Bell,
  Activity,
  FileText,
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useAuth } from "@/src/hooks/useAuth";
import { useAppSelector } from "@/src/redux/hooks";
import gsap from "gsap";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useOpenAsset } from "@/src/components/assets/SecureAssetLink";
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
      <Card className="stats-card group relative h-full overflow-hidden rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 shrink-0">
            <stat.icon className="h-5 w-5" />
          </div>
          {stat.trendUp && (
            <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              Up
            </Badge>
          )}
        </div>
        <p className="text-2xl font-black tracking-tight text-neutral-950">
          {stat.value ?? "-"}
        </p>
        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          {stat.title}
        </p>
        <p className="mt-1.5 text-xs font-medium text-neutral-500">
          {stat.trend}
        </p>
      </Card>
    </Link>
  );
}

const JobSeekerDashboard = () => {
  const { openAsset } = useOpenAsset();
  const { user, isAuthenticated } = useAuth();
  const rehydrated = useAppSelector(state => state.auth._persist?.rehydrated ?? false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rehydrated && !isAuthenticated) router.replace("/auth");
  }, [isAuthenticated, rehydrated, router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
      gsap.fromTo(
        ".stats-card",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.1,
          ease: "power2.out",
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const { data: activityData } = useGetActivitiesQuery(undefined, { skip: !isAuthenticated });
  const { data: seekerStatsData } = useGetSeekerDashboardStatsQuery(undefined, { skip: !isAuthenticated });

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
      <div ref={containerRef} className="mx-auto max-w-7xl space-y-6">
        {/* Pitch-Black Header */}
        <section className="dashboard-header">
          <div className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8 text-white border border-neutral-800 shadow-xs">
            <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
                  <Shield className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Seeker Command Center</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  Welcome back, {user.name}!
                </h1>
                <p className="mt-1 max-w-2xl text-xs sm:text-sm text-neutral-400">
                  Track your job applications, interviews, and candidate profile momentum.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-row">
                <Link href="/job">
                  <Button className="h-9 w-full sm:w-auto rounded-xl bg-white px-5 text-xs font-bold uppercase tracking-wider text-black hover:bg-neutral-100">
                    <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                    Browse Jobs
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="h-9 w-full sm:w-auto rounded-xl border-neutral-700 bg-neutral-900 px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
                  onClick={() => { if (apiStats?.resumeLink) void openAsset(apiStats.resumeLink); }}
                  disabled={!apiStats?.resumeLink}
                >
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  {apiStats?.resumeLink ? "View Resume" : "No Resume"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </section>

        {/* Main Content Layout */}
        <section className="main-content grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-6 shadow-xs">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                      <Zap className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Profile Readiness
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-neutral-950">
                    Get noticed by recruiters
                  </h2>
                  <p className="mt-0.5 max-w-md text-xs text-neutral-500 leading-relaxed">
                    Keep your profile updated with recent skills and projects to improve discovery.
                  </p>
                </div>
                <Link href="/job-seeker/profile" className="shrink-0">
                  <Button className="h-9 rounded-xl bg-black px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800">
                    Update Profile
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
                <div className="mb-4 flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                    <Activity className="h-4 w-4 text-neutral-700" />
                    Recent Activity
                  </h3>
                  {activities.length > 0 && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                      {activities.length} events
                    </span>
                  )}
                </div>
                <div className="space-y-2.5">
                  {activities.length > 0 ? (
                    activities.map((act: any, i: number) => (
                      <div
                        key={act._id ?? i}
                        className="flex items-start gap-2.5 rounded-xl bg-[#f8fafc] p-2.5"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200/60 text-neutral-700">
                          <Clock className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900 truncate">
                            {act.activityTitle || "Activity"}
                          </p>
                          <p className="text-[10px] text-neutral-400">
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
                    <div className="rounded-xl border border-dashed border-[#eaecf0] bg-[#f8fafc] py-6 text-center">
                      <BarChart3 className="mx-auto mb-1 h-6 w-6 text-neutral-400" />
                      <p className="text-xs text-neutral-500">
                        No activity yet. Start applying!
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="rounded-2xl border border-neutral-800 bg-black p-5 text-white shadow-xs">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Recommendations</h3>
                <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                  You have applied to{" "}
                  <span className="font-bold text-white">
                    {apiStats?.applications?.total ?? 0} jobs
                  </span>
                  . Discover fresh matching opportunities today.
                </p>
                <Link href="/job">
                  <Button className="mt-4 h-8 w-full rounded-lg bg-white text-black hover:bg-neutral-100 text-[10px] font-bold uppercase tracking-wider">
                    View Matches <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <BarChart3 className="h-4 w-4 text-neutral-600" />
                Profile Strength
              </h3>
              <div className="mb-2 flex items-end justify-between">
                <span className="text-xs font-semibold text-neutral-500">
                  Completion
                </span>
                <span className="text-2xl font-black text-neutral-950">
                  {profileStrength}%
                </span>
              </div>
              <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-2 rounded-full bg-black transition-all duration-700"
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
              <ul className="space-y-2">
                {[
                  { label: "Basic info completed", done: profileStrength > 0 },
                  { label: "Resume uploaded", done: !!apiStats?.resumeLink },
                  { label: "Add portfolio link", done: profileStrength >= 90 },
                ].map((item) => (
                  <li
                    key={item.label}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium ${
                      item.done
                        ? "bg-emerald-50 text-emerald-800"
                        : "border border-dashed border-neutral-200 text-neutral-500"
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="h-3 w-3 shrink-0 rounded-full border-2 border-neutral-300" />
                    )}
                    {item.label}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                <Bell className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                Stay interview-ready
              </h3>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                Keep your resume and profile up to date to get evaluated faster by hiring teams.
              </p>
              <Link href="/job-seeker/interviews">
                <Button
                  variant="outline"
                  className="mt-4 h-8 w-full rounded-lg border-neutral-300 text-[10px] font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50"
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
