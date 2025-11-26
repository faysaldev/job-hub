import { useEffect } from "react";
import Header, { mockUser } from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Briefcase, User, MessageSquare } from "lucide-react";
import JobSeekerProfile from "@/src/components/JobSeeker/JobSeekerProfile";
import AppliedJobs from "@/src/components/JobSeeker/AppliedJobs";
import Messages from "@/src/components/common/AppCommon/Message";
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your job applications and profile
            </p>
          </div>

          <Tabs defaultValue="applied" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="applied">
                <Briefcase className="h-4 w-4 mr-2" />
                Applied Jobs
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applied">
              <AppliedJobs userId={user.id} />
            </TabsContent>

            <TabsContent value="profile">
              <JobSeekerProfile userId={user.id} />
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

export default JobSeekerDashboard;
