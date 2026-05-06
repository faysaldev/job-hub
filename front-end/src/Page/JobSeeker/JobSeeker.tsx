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

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatDef {
  title: string;
  value: number | string;
  icon: React.ElementType;
  gradient: string;
  trend: string;
  trendUp: boolean;
  href: string;
}

function StatCard({ stat, index }: { stat: StatDef; index: number }) {
  return (
    <Link href={stat.href}>
      <Card className="stats-card p-5 border-none bg-white shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1 overflow-hidden relative">
        <div
          className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity -translate-y-1/2 translate-x-1/2`}
        />
        <div className="flex items-start justify-between mb-4 relative">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
          >
            <stat.icon className="h-6 w-6 text-white" />
          </div>
          {stat.trendUp && (
            <Badge className="bg-green-100 text-green-700 border-none text-[10px] font-bold px-2 py-0.5">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Up
            </Badge>
          )}
        </div>
        <p className="text-3xl font-bold text-[#234C6A] mb-1">
          {stat.value ?? "—"}
        </p>
        <p className="text-[10px] font-semibold text-[#234C6A]/70 uppercase tracking-wider">
          {stat.title}
        </p>
        <p className="text-xs text-[#456882]/70 mt-1">{stat.trend}</p>
      </Card>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
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
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out",
        },
      );
      gsap.fromTo(
        ".main-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const { data: activityData } = useGetActivitiesQuery();
  const { data: seekerStatsData } = useGetSeekerDashboardStatsQuery();

  // Map real API shape
  // seekerStatsData = { profileStrength, resumeLink, applications: { total, thisWeek, hired }, interviews: { total } }
  const apiStats = seekerStatsData as any;
  const activities: any[] = (activityData as any)?.slice(0, 5) ?? [];

  const stats: StatDef[] = [
    {
      title: "Applied Jobs",
      value: apiStats?.applications?.total ?? "—",
      icon: Briefcase,
      gradient: "from-[#234C6A] to-[#456882]",
      trend: apiStats?.applications?.thisWeek
        ? `+${apiStats.applications.thisWeek} this week`
        : "Total applications",
      trendUp: (apiStats?.applications?.thisWeek ?? 0) > 0,
      href: "/job-seeker/applications",
    },
    {
      title: "Interviews",
      value: apiStats?.interviews?.total ?? "—",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      trend: "Scheduled / upcoming",
      trendUp: (apiStats?.interviews?.total ?? 0) > 0,
      href: "/job-seeker/applications",
    },
    {
      title: "Hired",
      value: apiStats?.applications?.hired ?? "—",
      icon: Award,
      gradient: "from-green-500 to-emerald-500",
      trend: "Successful placements",
      trendUp: (apiStats?.applications?.hired ?? 0) > 0,
      href: "/job-seeker/applications",
    },
    {
      title: "Profile Strength",
      value: apiStats?.profileStrength ? `${apiStats.profileStrength}%` : "—",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      trend: "Profile completion score",
      trendUp: (apiStats?.profileStrength ?? 0) >= 70,
      href: "/job-seeker/profile",
    },
  ];

  if (!user) return null;

  return (
    <JobSeekerLayout>
      <div ref={containerRef} className="space-y-8 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="dashboard-header">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl p-8 text-white shadow-2xl">
            {/* bg deco */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/70 text-sm font-medium">
                    Dashboard
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome back,{" "}
                  <span className="text-blue-300">{user.name}!</span>
                </h1>
                <p className="text-white/70 mt-1">
                  Track your applications and find your dream job
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link href="/job">
                  <Button className="bg-white text-[#234C6A] hover:bg-white/90 rounded-xl px-6 font-semibold shadow-lg">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl px-6"
                  onClick={() =>
                    apiStats?.resumeLink &&
                    window.open(apiStats.resumeLink, "_blank")
                  }
                  disabled={!apiStats?.resumeLink}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {apiStats?.resumeLink ? "View Resume" : "No Resume"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>

        {/* ── Main 3-col Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 main-content">
          {/* Left 2-col */}
          <div className="lg:col-span-2 space-y-6">
            {/* CTA Banner */}
            <Card className="p-8 border-none bg-white shadow-lg rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A]/3 to-[#456882]/3 group-hover:from-[#234C6A]/6 group-hover:to-[#456882]/6 transition-all duration-500" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-[#456882] uppercase tracking-widest">
                      Profile Boost
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#234C6A] mb-1">
                    Get Noticed by Recruiters
                  </h2>
                  <p className="text-[#456882] text-sm max-w-md">
                    Complete your profile to increase your chances of being
                    shortlisted by top companies.
                  </p>
                </div>
                <Link href="/job-seeker/profile" className="flex-shrink-0">
                  <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-[#234C6A]/20">
                    Update Profile
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <Sparkles className="absolute -bottom-8 -right-8 h-48 w-48 text-[#234C6A]/5 rotate-12" />
            </Card>

            {/* Activity + AI grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#234C6A] flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[#234C6A]" />
                    Recent Activity
                  </h3>
                  {activities.length > 0 && (
                    <Badge className="bg-[#234C6A]/10 text-[#234C6A] border-none text-[10px]">
                      {activities.length} events
                    </Badge>
                  )}
                </div>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.map((act: any, i: number) => {
                      // Determine icon color based on title content
                      const isApply = act.activityTitle
                        ?.toLowerCase()
                        .includes("applied");
                      const isLogin = act.activityTitle
                        ?.toLowerCase()
                        .includes("logged");
                      const style = isApply
                        ? { bg: "bg-[#234C6A]/10", color: "text-[#234C6A]" }
                        : isLogin
                          ? { bg: "bg-blue-50", color: "text-blue-500" }
                          : { bg: "bg-[#E3E3E3]/50", color: "text-[#456882]" };
                      return (
                        <div
                          key={act._id ?? i}
                          className="flex items-start gap-3"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0`}
                          >
                            <Clock className={`h-4 w-4 ${style.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#234C6A]">
                              {act.activityTitle || "Activity"}
                            </p>
                            <p className="text-xs text-[#456882] mt-0.5">
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
                      );
                    })
                  ) : (
                    <div className="text-center py-6">
                      <BarChart3 className="h-10 w-10 text-[#E3E3E3] mx-auto mb-2" />
                      <p className="text-sm text-[#456882]/60">
                        No activity yet — start applying!
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* AI Recommendations */}
              <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-amber-300" />
                    <h3 className="font-bold">AI Recommendations</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6">
                    You have applied to{" "}
                    <span className="font-bold text-white">
                      {apiStats?.applications?.total ?? 0} jobs
                    </span>{" "}
                    total — keep going!
                  </p>
                  <Link href="/job">
                    <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90 rounded-xl font-bold">
                      View Matches
                    </Button>
                  </Link>
                </div>
                <Target className="absolute -bottom-10 -right-10 h-36 w-36 text-white/10" />
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Strength */}
            <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
              <h3 className="text-lg font-bold text-[#234C6A] mb-5 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#234C6A]" />
                Profile Strength
              </h3>
              {(() => {
                const pct = apiStats?.profileStrength ?? 0;
                const hasResume = !!apiStats?.resumeLink;
                const checkItems = [
                  { label: "Basic info completed", done: pct > 0 },
                  { label: "Resume uploaded", done: hasResume },
                  { label: "Add portfolio link", done: pct >= 90 },
                ];
                return (
                  <>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm text-[#456882]">Completion</span>
                      <span className="text-2xl font-black text-[#234C6A]">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full bg-[#E3E3E3] rounded-full h-2.5 mb-5">
                      <div
                        className="bg-gradient-to-r from-[#234C6A] to-[#456882] h-2.5 rounded-full shadow-sm transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <ul className="space-y-3">
                      {checkItems.map((item, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-3 text-sm font-medium p-3 rounded-xl ${
                            item.done
                              ? "bg-green-50/80 text-green-700"
                              : "text-[#456882] border-2 border-dashed border-gray-100"
                          }`}
                        >
                          {item.done ? (
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-[#456882]/30 flex-shrink-0" />
                          )}
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </>
                );
              })()}
            </Card>
          </div>
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default JobSeekerDashboard;
