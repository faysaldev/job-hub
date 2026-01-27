"use client";

import { useEffect, useRef } from "react";
import { mockUser } from "@/src/components/common/Header";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import {
  Briefcase,
  Users,
  Eye,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Target,
  Award,
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const RecruiterDashboard = () => {
  const user = mockUser;
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!user) return null;

  const stats = [
    {
      title: "Active Jobs",
      value: "24",
      change: "+3 this week",
      trend: "up",
      icon: Briefcase,
      color: "from-[#234C6A] to-[#456882]",
      href: "/recruiter/jobs",
    },
    {
      title: "Total Applicants",
      value: "156",
      change: "+28 new",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      href: "/recruiter/applicants",
    },
    {
      title: "Profile Views",
      value: "2.4K",
      change: "+12% vs last week",
      trend: "up",
      icon: Eye,
      color: "from-purple-500 to-violet-500",
      href: "/recruiter/company",
    },
    {
      title: "Avg. Salary",
      value: "$98K",
      change: "Market competitive",
      trend: "neutral",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      href: "/recruiter/jobs",
    },
  ];

  return (
    <RecruiterLayout>
      <div ref={containerRef} className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="dashboard-header mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Active
                </span>
                <span className="text-[#456882] text-sm">Last login: Today, 9:30 AM</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#234C6A] mb-2">
                Welcome back, {user.name?.split(" ")[0] || "Recruiter"}!
              </h1>
              <p className="text-[#456882] max-w-2xl">
                Manage your recruitment pipeline, track applicants, and build your dream team. Here is what is happening today.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white group"
                onClick={() => router.push("/recruiter/create-job")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
                <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="stat-card p-6 border-none bg-white shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative cursor-pointer"
              onClick={() => router.push(stat.href)}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-[#456882] text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-[#234C6A] mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-[#456882]"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Hiring Goals */}
        <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Target className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Q1 Hiring Goal</h3>
                <p className="text-white/80">You are 75% towards your quarterly target</p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span>15 of 20 positions filled</span>
                <span className="font-bold">75%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-white rounded-full" />
              </div>
            </div>
            <Button className="bg-white text-[#234C6A] hover:bg-white/90">
              <Award className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </Card>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
