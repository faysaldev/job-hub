import { useState, useEffect } from "react";
import Header, { mockUser } from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Building2, Briefcase, Users, MessageSquare } from "lucide-react";
import CompanyProfile from "@/src/components/Recruiter/CompanyProfile";
import JobManagement from "@/src/components/Recruiter/JobManagement";
import ApplicantsList from "@/src/components/Recruiter/ApplicantsList";
import Messages from "@/src/components/common/AppCommon/Message";
import { useRouter } from "next/navigation";

const RecruiterDashboard = () => {
  const user = mockUser;
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "recruiter") {
      router.push("/auth");
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-amber-100">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your jobs and applicants
            </p>
          </div>

          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="jobs">
                <Briefcase className="h-4 w-4 mr-2" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="applicants">
                <Users className="h-4 w-4 mr-2" />
                Applicants
              </TabsTrigger>
              <TabsTrigger value="company">
                <Building2 className="h-4 w-4 mr-2" />
                Company
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <JobManagement userId={user.id} />
            </TabsContent>

            <TabsContent value="applicants">
              <ApplicantsList userId={user.id} />
            </TabsContent>

            <TabsContent value="company">
              <CompanyProfile userId={user.id} />
            </TabsContent>

            <TabsContent value="messages">
              <Messages userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
