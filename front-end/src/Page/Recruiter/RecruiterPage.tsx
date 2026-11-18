"use client";

import { useEffect, useRef } from "react";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { useAuth } from "@/src/hooks/useAuth";
import {
  Briefcase,
  Users,
  Calendar,
  Plus,
  ArrowUpRight,
  Target,
  Award,
  TrendingUp,
  MessageSquare,
  Clock,
  DollarSign,
  ArrowRight,
  Building2,
  Shield,
  Activity,
  Sparkles,
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGetRecruiterDashboardStatsQuery } from "@/src/redux/features/generals/generalsApi";

interface StatDef {
  title: string;
  value: number | string;
  change: string;
  trend: "up" | "neutral";
  icon: React.ElementType;
  href: string;
}

function StatCard({ stat }: { stat: StatDef }) {
  return (
    <Link href={stat.href}>
      <Card className="stat-card group relative h-full overflow-hidden rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs transition-all hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 shrink-0">
            <stat.icon className="h-5 w-5" />
          </div>
          {stat.trend === "up" && (
            <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              <TrendingUp className="mr-1 h-3 w-3" />
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
          {stat.change}
        </p>
      </Card>
    </Link>
  );
}

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: recruiterStats } = useGetRecruiterDashboardStatsQuery(
    undefined,
    { skip: !user },
  );

  const apiData = recruiterStats as any;

  const val = (v: any): number | string => {
    if (v == null) return "—";
    if (typeof v === "object" && v.total !== undefined) return v.total;
    return v;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
      gsap.fromTo(
        ".stat-card",
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
      gsap.fromTo(
        ".main-section",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (!user) return null;

  const activeJobs = val(apiData?.activeJobs);
  const applicants = val(apiData?.applicants);
  const interviews = val(apiData?.interviews);
  const avgSalary =
    apiData?.avgSalary != null
      ? `$${Number(apiData.avgSalary).toLocaleString()}`
      : "—";

  const stats: StatDef[] = [
    {
      title: "Active Jobs",
      value: activeJobs,
      change:
        apiData?.activeJobs?.percentage != null
          ? `${apiData.activeJobs.percentage}% capacity`
          : "Total posted",
      trend: Number(activeJobs) > 0 ? "up" : "neutral",
      icon: Briefcase,
      href: "/recruiter/jobs",
    },
    {
      title: "Total Applicants",
      value: applicants,
      change:
        apiData?.applicants?.percentage != null
          ? `${apiData.applicants.percentage}% response rate`
          : "All applicants",
      trend: Number(applicants) > 0 ? "up" : "neutral",
      icon: Users,
      href: "/recruiter/applicants",
    },
    {
      title: "Avg. Salary",
      value: avgSalary,
      change: "Market benchmark",
      trend: "neutral",
      icon: DollarSign,
      href: "/recruiter/jobs",
    },
    {
      title: "Interviews",
      value: interviews,
      change: "Scheduled sessions",
      trend: Number(interviews) > 0 ? "up" : "neutral",
      icon: Calendar,
      href: "/recruiter/interviews",
    },
  ];

  const pipelineItems = [
    {
      label: "Active Jobs",
      value: activeJobs,
      detail: "Open roles receiving applicants",
      icon: Briefcase,
    },
    {
      label: "Applicants",
      value: applicants,
      detail: "Candidates in hiring funnel",
      icon: Users,
    },
    {
      label: "Interviews",
      value: interviews,
      detail: "Active candidate sessions",
      icon: MessageSquare,
    },
  ];

  const quickActions = [
    {
      label: "Post a New Job",
      href: "/recruiter/create-job",
      icon: Plus,
    },
    {
      label: "Review Applicants",
      href: "/recruiter/applicants",
      icon: Users,
    },
    {
      label: "Schedule Interview",
      href: "/recruiter/interview-schedule",
      icon: Calendar,
    },
    {
      label: "Update Company",
      href: "/recruiter/company",
      icon: Building2,
    },
  ];

  return (
    <RecruiterLayout>
      <div ref={containerRef} className="mx-auto max-w-7xl space-y-6">
        {/* Pitch-Black Header */}
        <section className="dashboard-header">
          <div className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8 text-white border border-neutral-800 shadow-xs">
            <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-semibold text-neutral-300">
                  <Shield className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Recruiter Command Center</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  Welcome back, {user.name?.split(" ")[0] || "Recruiter"}!
                </h1>
                <p className="mt-1 max-w-2xl text-xs sm:text-sm text-neutral-400">
                  Manage open listings, review candidate applications, and coordinate team interviews.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-row">
                <Button
                  className="h-9 w-full sm:w-auto rounded-xl bg-white px-5 text-xs font-bold uppercase tracking-wider text-black hover:bg-neutral-100"
                  onClick={() => router.push("/recruiter/create-job")}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Post New Job
                </Button>
                <Button
                  variant="outline"
                  className="h-9 w-full sm:w-auto rounded-xl border-neutral-700 bg-neutral-900 px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
                  onClick={() => router.push("/recruiter/messages")}
                >
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  Messages
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
        <section className="main-section grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-6 shadow-xs">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                      <Target className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Hiring Pipeline
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-neutral-950">
                    Keep every role moving forward
                  </h2>
                  <p className="mt-0.5 max-w-md text-xs text-neutral-500 leading-relaxed">
                    Review incoming candidate applications, update statuses, and send interview invitations.
                  </p>
                </div>
                <Link href="/recruiter/applicants" className="shrink-0">
                  <Button className="h-9 rounded-xl bg-black px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800">
                    View Pipeline
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
                    Pipeline Snapshot
                  </h3>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-700 uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <div className="space-y-2.5">
                  {pipelineItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200/60 text-neutral-700">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {item.detail}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-neutral-950">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="rounded-2xl border border-neutral-800 bg-black p-5 text-white shadow-xs">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                  <Award className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Hiring Performance</h3>
                <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                  You are managing{" "}
                  <span className="font-bold text-white">
                    {activeJobs ?? 0} active jobs
                  </span>{" "}
                  with an average salary of{" "}
                  <span className="font-bold text-white">{avgSalary}</span>.
                </p>
                <Link href="/recruiter/jobs">
                  <Button className="mt-4 h-8 w-full rounded-lg bg-white text-black hover:bg-neutral-100 text-[10px] font-bold uppercase tracking-wider">
                    Manage Jobs
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="rounded-2xl border border-[#eaecf0] bg-white p-5 shadow-xs">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">
                Quick Actions
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                Jump straight into routine hiring workflows.
              </p>
              <div className="mt-4 space-y-1.5">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href} className="block">
                    <button className="flex w-full items-center gap-2.5 rounded-xl border border-neutral-100 bg-[#f8fafc] p-2.5 text-left text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors">
                      <action.icon className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                      <span className="flex-1 truncate">{action.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400" />
                    </button>
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </section>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
