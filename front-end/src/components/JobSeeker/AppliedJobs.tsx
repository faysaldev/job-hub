import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Building2, Calendar } from "lucide-react";
import { Application } from "@/src/types";

// Local type alias to avoid conflicts
interface AppliedJob extends Omit<Application, 'jobSeekerId' | 'jobSeekerName' | 'jobId' | 'resumeUrl' | 'profileUrl'> {
  jobId: string;
}

const AppliedJobs = ({ userId }: { userId: string }) => {
  // Dummy data for applied jobs
  const dummyApplications: AppliedJob[] = [
    {
      id: "1",
      jobId: "1",
      jobTitle: "Senior Frontend Developer",
      companyName: "TechCorp Inc.",
      appliedDate: "2024-11-20",
      coverLetter: "I am excited to apply for this position as I have extensive experience with React and TypeScript, which aligns perfectly with your requirements.",
      status: "shortlisted",
      paymentAmount: 25
    },
    {
      id: "2",
      jobId: "2",
      jobTitle: "Product Designer",
      companyName: "DesignStudio",
      appliedDate: "2024-11-18",
      coverLetter: "With 5 years of product design experience and a strong portfolio, I believe I can contribute significantly to your design team.",
      status: "reviewed",
      paymentAmount: 10
    },
    {
      id: "3",
      jobId: "3",
      jobTitle: "Backend Engineer",
      companyName: "DataFlow",
      appliedDate: "2024-11-15",
      coverLetter: "My expertise in Node.js and cloud infrastructure makes me a great fit for this backend position. Excited about your innovative projects.",
      status: "pending",
      paymentAmount: 0
    },
    {
      id: "4",
      jobId: "4",
      jobTitle: "DevOps Engineer",
      companyName: "CloudSystems",
      appliedDate: "2024-11-10",
      coverLetter: "I have hands-on experience with Docker, Kubernetes, and CI/CD pipelines that align with your tech stack requirements.",
      status: "rejected",
      paymentAmount: 50
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "reviewed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "shortlisted":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "bg-muted";
    }
  };

  if (dummyApplications.length === 0) {
    return (
      <Card className="p-12 text-center border-[#456882]/30">
        <p className="text-[#234C6A]/70 text-lg">
          You haven&apos;t applied to any jobs yet.
        </p>
        <p className="text-[#234C6A]/50 mt-2">
          Start browsing jobs and apply to get started!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {dummyApplications.map((app) => (
        <Card key={app.id} className="p-6 hover:shadow-xl transition-all duration-300 border-[#456882]/30">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-[#234C6A]">{app.jobTitle}</h3>
              <div className="flex flex-wrap items-center gap-4 text-[#234C6A]/70 mb-4">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{app.companyName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Applied {new Date(app.appliedDate).toLocaleDateString()}
                  </span>
                </div>
                {app.paymentAmount !== undefined && app.paymentAmount > 0 && (
                  <div className="flex items-center gap-1 text-[#234C6A]">
                    <span>${app.paymentAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              {app.coverLetter && (
                <p className="text-sm text-[#234C6A]/80 line-clamp-2">
                  {app.coverLetter}
                </p>
              )}
            </div>
            <Badge className={`${getStatusColor(app.status)} border`}>
              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AppliedJobs;