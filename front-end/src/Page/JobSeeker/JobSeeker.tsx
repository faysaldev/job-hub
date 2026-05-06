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
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import JobSeekerLayout from "@/src/components/JobSeeker/JobSeekerLayout";
import { useGetActivitiesQuery } from "@/src/redux/features/seeker/seekerApi";

const JobSeekerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );

      gsap.fromTo(
        ".stats-card",
        { opacity: 0, y: 20 },
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
        ".quick-action",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          delay: 0.4,
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

  if (!user) return null;

  // Stats data
  const stats = [
    {
      title: "Applied Jobs",
      value: "12",
      icon: Briefcase,
      color: "from-[#234C6A] to-[#456882]",
      trend: "+3 this week",
      trendUp: true,
      href: "/job-seeker/applications",
    },
    {
      title: "Interviews",
      value: "3",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      trend: "2 upcoming",
      trendUp: true,
      href: "/job-seeker/interviews",
    },
    {
      title: "Offers",
      value: "1",
      icon: Award,
      color: "from-green-500 to-emerald-500",
      trend: "Pending response",
      trendUp: true,
      href: "/job-seeker/applications",
    },
    {
      title: "Profile Views",
      value: "48",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      trend: "+12 this week",
      trendUp: true,
      href: "/job-seeker/profile",
    },
  ];

  // Recent activity
  const recentActivity = [
    {
      icon: CheckCircle,
      text: "Application viewed by TechCorp",
      time: "2 hours ago",
      color: "text-green-500",
    },
    {
      icon: Calendar,
      text: "Interview scheduled with DesignStudio",
      time: "Yesterday",
      color: "text-blue-500",
    },
    {
      icon: Briefcase,
      text: "Applied to Senior Developer at DataFlow",
      time: "2 days ago",
      color: "text-[#234C6A]",
    },
  ];

  const { data: activityLogs, isLoading: activityLogsLoading } =
    useGetActivitiesQuery();
  console.log(activityLogs);

  return (
    <JobSeekerLayout>
      <div ref={containerRef} className="space-y-8 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#234C6A]">
                Welcome back, {user.name}!
              </h1>
              <p className="text-[#456882]">
                Track your applications and find your dream job
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/job">
                <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl px-6">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10 rounded-xl px-6"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Resume
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <Card className="stats-card p-5 border-none bg-white shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
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
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-[#234C6A]/70 uppercase tracking-wider text-[10px]">
                  {stat.title}
                </p>
                <p className="text-xs text-[#456882]/70 mt-1">{stat.trend}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Overview Details */}
          <div className="lg:col-span-2 space-y-8 main-content">
            <Card className="p-8 border-none bg-white shadow-xl rounded-[32px] overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-[#234C6A] mb-2">
                  Get Noticed by Recruiters
                </h2>
                <p className="text-[#456882] mb-6 max-w-md">
                  Complete your profile to increase your chances of being
                  shortlisted by top companies.
                </p>
                <Link href="/job-seeker/profile">
                  <Button className="bg-[#234C6A] hover:bg-[#234C6A]/90 text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-[#234C6A]/20">
                    Update Profile
                  </Button>
                </Link>
              </div>
              <Sparkles className="absolute -bottom-10 -right-10 h-64 w-64 text-[#234C6A]/5 rotate-12" />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-none bg-white shadow-lg rounded-[28px]">
                <h3 className="font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#234C6A]" />
                  Recent Activity
                </h3>
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <activity.icon
                          className={`h-5 w-5 ${activity.color}`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#234C6A]">
                          {activity.text}
                        </p>
                        <p className="text-xs text-[#456882] mt-0.5">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-[28px] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-amber-300" />
                    <h3 className="font-bold">AI Recommendations</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6">
                    Based on your profile, we found 15 jobs that match your
                    skills.
                  </p>
                  <Link href="/job">
                    <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90 rounded-xl font-bold">
                      View Matches
                    </Button>
                  </Link>
                </div>
                <Target className="absolute -bottom-12 -right-12 h-40 w-40 text-white/10" />
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card className="p-8 border-none bg-white shadow-xl rounded-[32px]">
              <h3 className="text-xl font-bold text-[#234C6A] mb-6">
                Profile Strength
              </h3>
              <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-bold text-[#456882] uppercase tracking-wider">
                    Completion
                  </span>
                  <span className="text-3xl font-black text-[#234C6A]">
                    75%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#234C6A] to-[#456882] h-3 rounded-full shadow-lg shadow-blue-200"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-green-600 font-bold text-sm bg-green-50/50 p-3 rounded-2xl">
                  <CheckCircle className="h-5 w-5" />
                  Basic info completed
                </li>
                <li className="flex items-center gap-3 text-green-600 font-bold text-sm bg-green-50/50 p-3 rounded-2xl">
                  <CheckCircle className="h-5 w-5" />
                  Resume uploaded
                </li>
                <li className="flex items-center gap-3 text-[#456882] font-bold text-sm p-3 rounded-2xl border-2 border-dashed border-gray-100">
                  <div className="w-5 h-5 rounded-full border-2 border-[#456882]/30" />
                  Add portfolio link
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-none bg-white shadow-lg rounded-[32px] text-center border border-gray-50">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-[#234C6A]">Job Alerts</h4>
              <p className="text-xs text-[#456882] mt-2 mb-4">
                Get notified immediately when jobs matching your criteria are
                posted.
              </p>
              <Button
                variant="outline"
                className="w-full rounded-xl border-gray-100 text-[#234C6A] font-bold"
              >
                Manage Alerts
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default JobSeekerDashboard;
