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
  BarChart3,
  ArrowRight,
  Building2,
  Shield,
  Activity,
  Sparkles,
  CheckCircle,
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
      <Card className="stat-card group relative h-full overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-2xl hover:shadow-[#234C6A]/10">
        <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#234C6A] to-[#456882] transition-transform duration-300 group-hover:scale-x-100" />
        <div className="mb-5 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/15 transition-transform duration-300 group-hover:scale-105">
            <stat.icon className="h-6 w-6" />
          </div>
          {stat.trend === "up" && (
            <Badge className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
              <TrendingUp className="mr-1 h-3 w-3" />
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

  // API may return plain numbers OR objects like {total, percentage}
  const val = (v: any): number | string => {
    if (v == null) return "—";
    if (typeof v === "object" && v.total !== undefined) return v.total;
    return v;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      );
      gsap.fromTo(
        ".stat-card",
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
        ".main-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: "power2.out" },
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
          ? `${apiData.activeJobs.percentage}% of capacity`
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
      change: "Market competitive",
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
      detail: "Candidates in your hiring funnel",
      icon: Users,
    },
    {
      label: "Interviews",
      value: interviews,
      detail: "Conversation-ready candidates",
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
      <div ref={containerRef} className="mx-auto max-w-7xl space-y-8">
        <section className="dashboard-header">
          <div className="relative overflow-hidden rounded-3xl bg-[#234C6A] p-7 text-white shadow-2xl shadow-[#234C6A]/20 md:p-9">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                  <Shield className="h-4 w-4" />
                  <span>Recruiter Command Center</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                  Welcome back, {user.name?.split(" ")[0] || "Recruiter"}!
                </h1>
                <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/75">
                  Manage open roles, review candidate momentum, and move your
                  strongest applicants toward interviews.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  className="h-12 w-full rounded-2xl bg-white px-6 font-black text-[#234C6A] hover:bg-[#E3E3E3]"
                  onClick={() => router.push("/recruiter/create-job")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Job
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-white/30 bg-transparent px-6 font-black text-white hover:bg-white/10"
                  onClick={() => router.push("/recruiter/messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
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

        <section className="main-section grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-7 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882]" />
              <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#234C6A] text-white">
                      <Target className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#456882]">
                      Hiring Pipeline
                    </span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-[#234C6A]">
                    Keep every role moving
                  </h2>
                  <p className="mt-2 max-w-md text-sm font-medium leading-6 text-[#456882]">
                    Review active jobs, shortlist applicants, and schedule
                    interviews from one focused recruiter workspace.
                  </p>
                </div>
                <Link href="/recruiter/applicants" className="shrink-0">
                  <Button className="h-12 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-7 font-black text-white shadow-lg shadow-[#234C6A]/20 hover:from-[#1c405a] hover:to-[#3b5a71]">
                    View Pipeline
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
                    Pipeline Snapshot
                  </h3>
                  <Badge className="rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 text-[10px] font-black uppercase tracking-wide text-[#234C6A]">
                    Live
                  </Badge>
                </div>
                <div className="space-y-4">
                  {pipelineItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-2xl bg-[#F8FAFC] p-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A]">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-[#234C6A]">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#456882]">
                          {item.detail}
                        </p>
                      </div>
                      <p className="text-2xl font-black text-[#234C6A]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#234C6A] to-[#456882] p-6 text-white shadow-xl shadow-[#234C6A]/20">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[3rem] bg-white/10" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black">Hiring Performance</h3>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    You are managing{" "}
                    <span className="font-black text-white">
                      {activeJobs ?? 0} active jobs
                    </span>{" "}
                    with an average salary of{" "}
                    <span className="font-black text-white">{avgSalary}</span>.
                  </p>
                  <Link href="/recruiter/jobs">
                    <Button className="mt-6 h-11 w-full rounded-2xl bg-white font-black text-[#234C6A] hover:bg-[#E3E3E3]">
                      Manage Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <Target className="absolute -bottom-10 -right-10 h-36 w-36 text-white/10" />
              </Card>
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A]">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-[#234C6A]">
                Quick Actions
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#456882]">
                Jump into the recruiter tasks you use most.
              </p>
              <div className="mt-5 space-y-3">
                {quickActions.map((action) => (
                  <Link key={action.label} href={action.href}>
                    <button className="flex w-full items-center gap-3 rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-3 text-left text-sm font-black text-[#234C6A] transition-colors hover:bg-[#234C6A]/5">
                      <action.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{action.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-[#456882]" />
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
