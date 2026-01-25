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
  Briefcase,
  User,
  MessageSquare,
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
import JobSeekerProfile from "@/src/components/JobSeeker/JobSeekerProfile";
import AppliedJobs from "@/src/components/JobSeeker/AppliedJobs";
import Messages from "@/src/components/common/AppCommon/Message";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

const JobSeekerDashboard = () => {
  const user = mockUser;
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || user.role !== "jobseeker") {
      router.push("/auth");
    }
  }, [user, router]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".stats-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" }
      );

      gsap.fromTo(
        ".quick-action",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, delay: 0.4, ease: "power2.out" }
      );

      gsap.fromTo(
        ".main-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" }
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
    },
    {
      title: "Interviews",
      value: "3",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      trend: "2 upcoming",
      trendUp: true,
    },
    {
      title: "Offers",
      value: "1",
      icon: Award,
      color: "from-green-500 to-emerald-500",
      trend: "Pending response",
      trendUp: true,
    },
    {
      title: "Profile Views",
      value: "48",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      trend: "+12 this week",
      trendUp: true,
    },
  ];

  // Quick actions
  const quickActions = [
    { icon: FileText, label: "Update Resume", href: "#", color: "bg-blue-500" },
    { icon: Target, label: "Job Alerts", href: "#", color: "bg-green-500" },
    { icon: Bell, label: "Notifications", href: "/notifications", color: "bg-orange-500" },
    { icon: Sparkles, label: "AI Insights", href: "#", color: "bg-purple-500" },
  ];

  // Recent activity
  const recentActivity = [
    { icon: CheckCircle, text: "Application viewed by TechCorp", time: "2 hours ago", color: "text-green-500" },
    { icon: Calendar, text: "Interview scheduled with DesignStudio", time: "Yesterday", color: "text-blue-500" },
    { icon: Briefcase, text: "Applied to Senior Developer at DataFlow", time: "2 days ago", color: "text-[#234C6A]" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="dashboard-header mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#234C6A]">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-[#456882]">
                    Track your applications and find your dream job
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/job">
                  <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-[#234C6A]/20 text-[#234C6A] hover:bg-[#234C6A]/10"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Resume
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="stats-card p-5 border-none bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  {stat.trendUp && (
                    <Badge className="bg-green-100 text-green-700 border-none text-xs">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Up
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold text-[#234C6A] mb-1">{stat.value}</p>
                <p className="text-sm text-[#456882]">{stat.title}</p>
                <p className="text-xs text-[#456882]/70 mt-1">{stat.trend}</p>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="quick-action p-4 border-none bg-white shadow-md rounded-xl hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#234C6A]">{action.label}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 main-content">
              <Tabs defaultValue="applied" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-white rounded-xl p-1 shadow-md">
                  <TabsTrigger
                    value="applied"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white rounded-lg"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Applications
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white rounded-lg"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="messages"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white rounded-lg"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="applied">
                  <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-[#234C6A]">Your Applications</h2>
                        <p className="text-sm text-[#456882]">Track the status of your job applications</p>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                        onClick={() => router.push("/job")}
                      >
                        Browse More Jobs
                      </Button>
                    </div>
                    <AppliedJobs userId={user.id} />
                  </Card>
                </TabsContent>

                <TabsContent value="profile">
                  <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-[#234C6A]">Your Profile</h2>
                      <p className="text-sm text-[#456882]">Keep your profile updated to attract recruiters</p>
                    </div>
                    <JobSeekerProfile userId={user.id} />
                  </Card>
                </TabsContent>

                <TabsContent value="messages">
                  <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-[#234C6A]">Messages</h2>
                      <p className="text-sm text-[#456882]">Communicate with recruiters and employers</p>
                    </div>
                    <Messages userId={user.id} />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                <h3 className="text-lg font-bold text-[#234C6A] mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-[#E3E3E3] flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#234C6A]">{activity.text}</p>
                        <p className="text-xs text-[#456882]">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Profile Completion */}
              <Card className="p-6 border-none bg-white shadow-lg rounded-2xl">
                <h3 className="text-lg font-bold text-[#234C6A] mb-4">Profile Strength</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#456882]">Completion</span>
                    <span className="text-sm font-semibold text-[#234C6A]">75%</span>
                  </div>
                  <div className="w-full bg-[#E3E3E3] rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#234C6A] to-[#456882] h-2 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Basic info completed
                  </li>
                  <li className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Resume uploaded
                  </li>
                  <li className="flex items-center gap-2 text-[#456882]">
                    <div className="w-4 h-4 rounded-full border-2 border-[#456882]" />
                    Add portfolio link
                  </li>
                </ul>
              </Card>

              {/* Job Recommendations */}
              <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-bold">AI Recommendations</h3>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Based on your profile, we found 15 jobs that match your skills
                </p>
                <Link href="/job">
                  <Button className="w-full bg-white text-[#234C6A] hover:bg-white/90">
                    View Recommendations
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobSeekerDashboard;
