"use client";
import { useEffect } from "react";
import Header, { mockUser } from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Briefcase, User, MessageSquare, Calendar, Award, TrendingUp } from "lucide-react";
import JobSeekerProfile from "@/src/components/JobSeeker/JobSeekerProfile";
import AppliedJobs from "@/src/components/JobSeeker/AppliedJobs";
import Messages from "@/src/components/common/AppCommon/Message";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useRouter } from "next/navigation";

const JobSeekerDashboard = () => {
  const user = mockUser;
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "jobseeker") {
      router.push("/auth");
    }
  }, [user]);

  if (!user) return null;

  // Dummy stats data
  const stats = [
    { title: "Applied Jobs", value: "12", icon: Briefcase, color: "text-[#234C6A]" },
    { title: "Interviews", value: "3", icon: Calendar, color: "text-[#456882]" },
    { title: "Offers", value: "1", icon: Award, color: "text-[#234C6A]" },
    { title: "Success Rate", value: "8%", icon: TrendingUp, color: "text-[#456882]" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />
      <main className="flex-1 py-8 md:py-12 container mx-auto">
        <div className="container px-4">
          {/* Dashboard Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#234C6A]">
              Welcome back, {user.name}!
            </h1>
            <p className="text-[#234C6A] max-w-2xl">
              Manage your job applications, track your progress, and connect with opportunities that match your skills.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 bg-white border-[#456882]/30 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#234C6A]/70 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1 text-[#234C6A]">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-[#234C6A]/10 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="applied" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#E3E3E3] rounded-xl p-1">
              <TabsTrigger
                value="applied"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white rounded-lg"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Applied Jobs
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
              <Card className="p-6 bg-white border-[#456882]/30">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#234C6A]">Your Applications</h2>
                  <Button
                    className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                    onClick={() => router.push("/jobs")}
                  >
                    Browse More Jobs
                  </Button>
                </div>
                <AppliedJobs userId={user.id} />
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="p-6 bg-white border-[#456882]/30">
                <h2 className="text-2xl font-bold text-[#234C6A] mb-6">Your Profile</h2>
                <JobSeekerProfile userId={user.id} />
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card className="p-6 bg-white border-[#456882]/30">
                <h2 className="text-2xl font-bold text-[#234C6A] mb-6">Messages</h2>
                <Messages userId={user.id} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobSeekerDashboard;
