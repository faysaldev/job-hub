"use client";

import { useEffect, useRef } from "react";
import Header, { mockUser } from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Building2,
  Briefcase,
  Users,
  MessageSquare,
  Eye,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Calendar,
  Target,
  Award,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import CompanyProfile from "@/src/components/Recruiter/CompanyProfile";
import JobManagement from "@/src/components/Recruiter/JobManagement";
import ApplicantsList from "@/src/components/Recruiter/ApplicantsList";
import Messages from "@/src/components/common/AppCommon/Message";
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

      gsap.fromTo(
        ".quick-action",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.4,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".main-content",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power3.out" }
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
    },
    {
      title: "Total Applicants",
      value: "156",
      change: "+28 new",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Profile Views",
      value: "2.4K",
      change: "+12% vs last week",
      trend: "up",
      icon: Eye,
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Avg. Salary",
      value: "$98K",
      change: "Market competitive",
      trend: "neutral",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const quickActions = [
    {
      icon: <Plus className="h-5 w-5" />,
      title: "Post New Job",
      desc: "Create a job listing",
      action: () => router.push("/job/create"),
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Review Applicants",
      desc: "28 pending reviews",
      action: () => {},
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Schedule Interview",
      desc: "5 upcoming",
      action: () => {},
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Messages",
      desc: "3 unread",
      action: () => {},
    },
  ];

  const recentActivity = [
    { type: "application", text: "New application for Senior Developer", time: "2 min ago" },
    { type: "view", text: "Your job post received 50 views", time: "1 hour ago" },
    { type: "interview", text: "Interview scheduled with John D.", time: "3 hours ago" },
    { type: "hire", text: "Sarah M. accepted your offer", time: "1 day ago" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
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
                  variant="outline"
                  className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
                <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white group">
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
                className="stat-card p-6 border-none bg-white shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
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

          {/* Quick Actions & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <Card className="p-6 border-none bg-white shadow-lg col-span-1">
              <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className="quick-action w-full p-4 bg-[#E3E3E3]/50 hover:bg-[#234C6A]/10 rounded-xl flex items-center gap-4 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                      {action.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-[#234C6A]">{action.title}</p>
                      <p className="text-sm text-[#456882]">{action.desc}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#456882] group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 border-none bg-white shadow-lg col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#234C6A] flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </h3>
                <Button variant="ghost" size="sm" className="text-[#234C6A]">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 hover:bg-[#E3E3E3]/50 rounded-xl transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "application" ? "bg-blue-100 text-blue-600" :
                      activity.type === "view" ? "bg-purple-100 text-purple-600" :
                      activity.type === "interview" ? "bg-amber-100 text-amber-600" :
                      "bg-green-100 text-green-600"
                    }`}>
                      {activity.type === "application" && <Users className="h-5 w-5" />}
                      {activity.type === "view" && <Eye className="h-5 w-5" />}
                      {activity.type === "interview" && <Calendar className="h-5 w-5" />}
                      {activity.type === "hire" && <CheckCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[#234C6A] font-medium">{activity.text}</p>
                      <p className="text-sm text-[#456882]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Hiring Goals */}
          <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white mb-8 shadow-lg">
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

          {/* Main Tabs */}
          <div className="main-content">
            <Tabs defaultValue="jobs" className="w-full">
              <TabsList className="w-full flex mb-8 bg-white rounded-2xl p-2 shadow-lg">
                {[
                  { value: "jobs", icon: Briefcase, label: "Job Listings" },
                  { value: "applicants", icon: Users, label: "Applicants" },
                  { value: "company", icon: Building2, label: "Company Profile" },
                  { value: "messages", icon: MessageSquare, label: "Messages" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="jobs">
                <Card className="p-6 md:p-8 border-none bg-white shadow-lg rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-[#234C6A] mb-1">Manage Job Listings</h2>
                      <p className="text-[#456882]">Create, edit, and manage your job postings</p>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white group"
                      onClick={() => router.push("/job/create")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Job
                      <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </div>
                  <JobManagement userId={user.id} />
                </Card>
              </TabsContent>

              <TabsContent value="applicants">
                <Card className="p-6 md:p-8 border-none bg-white shadow-lg rounded-2xl">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#234C6A] mb-1">Applicant Pipeline</h2>
                    <p className="text-[#456882]">Review and manage candidates for your open positions</p>
                  </div>
                  <ApplicantsList userId={user.id} />
                </Card>
              </TabsContent>

              <TabsContent value="company">
                <Card className="p-6 md:p-8 border-none bg-white shadow-lg rounded-2xl">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#234C6A] mb-1">Company Profile</h2>
                    <p className="text-[#456882]">Manage your company information and branding</p>
                  </div>
                  <CompanyProfile userId={user.id} />
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card className="p-6 md:p-8 border-none bg-white shadow-lg rounded-2xl">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#234C6A] mb-1">Messages</h2>
                    <p className="text-[#456882]">Communicate with candidates and team members</p>
                  </div>
                  <Messages userId={user.id} />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
