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
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGetRecruiterDashboardStatsQuery } from "@/src/redux/features/generals/generalsApi";

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
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (!user) return null;

  const stats = [
    {
      title: "Active Jobs",
      value: val(apiData?.activeJobs),
      change: apiData?.activeJobs?.percentage != null
        ? `${apiData.activeJobs.percentage}% of capacity`
        : "Total posted",
      trend: Number(val(apiData?.activeJobs)) > 0 ? "up" : "neutral",
      icon: Briefcase,
      color: "from-[#234C6A] to-[#456882]",
      href: "/recruiter/jobs",
    },
    {
      title: "Total Applicants",
      value: val(apiData?.applicants),
      change: apiData?.applicants?.percentage != null
        ? `${apiData.applicants.percentage}% response rate`
        : "All applicants",
      trend: Number(val(apiData?.applicants)) > 0 ? "up" : "neutral",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      href: "/recruiter/applicants",
    },
    {
      title: "Avg. Salary",
      value: apiData?.avgSalary != null ? `$${Number(apiData.avgSalary).toLocaleString()}` : "—",
      change: "Market competitive",
      trend: "neutral",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      href: "/recruiter/jobs",
    },
    {
      title: "Interviews",
      value: val(apiData?.interviews),
      change: "Scheduled sessions",
      trend: Number(val(apiData?.interviews)) > 0 ? "up" : "neutral",
      icon: Calendar,
      color: "from-purple-500 to-violet-500",
      href: "/recruiter/interviews",
    },
  ];

  return (
    <RecruiterLayout>
      <div ref={containerRef} className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/70 text-sm font-medium">
                    Recruiter Dashboard
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome back,{" "}
                  <span className="text-blue-300">
                    {user.name?.split(" ")[0] || "Recruiter"}!
                  </span>
                </h1>
                <p className="text-white/70 mt-1">
                  Manage your recruitment pipeline and build your dream team
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button
                  className="bg-white text-[#234C6A] hover:bg-white/90 rounded-xl px-6 font-semibold shadow-lg"
                  onClick={() => router.push("/recruiter/create-job")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl px-6"
                  onClick={() => router.push("/recruiter/messages")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <Card className="stat-card p-5 border-none bg-white shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1 overflow-hidden relative">
                <div
                  className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity -translate-y-1/2 translate-x-1/2`}
                />
                <div className="flex items-start justify-between mb-4 relative">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  {stat.trend === "up" && (
                    <Badge className="bg-green-100 text-green-700 border-none text-[10px] font-bold px-2 py-0.5">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Up
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold text-[#234C6A] mb-1">
                  {stat.value}
                </p>
                <p className="text-[10px] font-semibold text-[#234C6A]/70 uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-xs text-[#456882]/70 mt-1">{stat.change}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 main-section">
          {/* Hiring Goal */}
          <Card className="lg:col-span-2 p-8 border-none bg-white shadow-lg rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A]/3 to-[#456882]/3 group-hover:from-[#234C6A]/6 group-hover:to-[#456882]/6 transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center shadow-md">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#234C6A]">
                    Recruitment Pipeline
                  </h3>
                  <p className="text-sm text-[#456882]">
                    Track your hiring progress
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Active Jobs",
                    value: val(apiData?.activeJobs),
                    color: "bg-[#234C6A]/10 text-[#234C6A]",
                  },
                  {
                    label: "Applicants",
                    value: val(apiData?.applicants),
                    color: "bg-blue-50 text-blue-700",
                  },
                  {
                    label: "Avg. Salary",
                    value: apiData?.avgSalary != null ? `$${Number(apiData.avgSalary).toLocaleString()}` : "—",
                    color: "bg-green-50 text-green-700",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded-xl border border-[#E3E3E3]/50 text-center"
                  >
                    <p
                      className={`text-3xl font-bold ${item.color.split(" ")[1]}`}
                    >
                      {item.value}
                    </p>
                    <p className="text-xs font-semibold text-[#456882] mt-1 uppercase tracking-wider">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Link href="/recruiter/applicants" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/5 font-semibold"
                  >
                    View Pipeline
                  </Button>
                </Link>
                <Link href="/recruiter/schedule" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/5 font-semibold"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl" />
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-1">Quick Actions</h3>
              <p className="text-white/70 text-sm mb-6">
                Jump to the most common tasks
              </p>
              <div className="space-y-3">
                {[
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
                    href: "/recruiter/schedule",
                    icon: Calendar,
                  },
                  {
                    label: "Update Company",
                    href: "/recruiter/company",
                    icon: Award,
                  },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left font-medium text-sm mb-0.5">
                      <action.icon className="h-4 w-4 flex-shrink-0" />
                      {action.label}
                      <ArrowUpRight className="h-4 w-4 ml-auto opacity-50" />
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
