import { useState, useEffect } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Application } from "@/src/types";
import { toast } from "@/src/hooks/use-toast";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

const ApplicantsList = ({ userId }: { userId: string }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  useEffect(() => {
    // Load dummy data for demonstration
    const dummyApplications: Application[] = [
      {
        id: "1",
        jobId: "1",
        jobSeekerId: "user1",
        jobSeekerName: "Sarah Johnson",
        jobTitle: "Senior Frontend Developer",
        companyName: "Tech Innovations Inc.",
        appliedDate: new Date("2024-11-20").toISOString(),
        coverLetter:
          "I am excited to apply for this position as I have extensive experience with React and TypeScript, which aligns perfectly with your requirements.",
        status: "shortlisted",
        resumeUrl: "#",
        profileUrl: "#",
        paymentAmount: 25,
      },
      {
        id: "2",
        jobId: "2",
        jobSeekerId: "user2",
        jobSeekerName: "Michael Chen",
        jobTitle: "Backend Engineer",
        companyName: "Tech Solutions Ltd.",
        appliedDate: new Date("2024-11-18").toISOString(),
        coverLetter:
          "With 7 years of experience in backend development and cloud infrastructure, I believe I would be a valuable addition to your team.",
        status: "reviewed",
        resumeUrl: "#",
        profileUrl: "#",
        paymentAmount: 50,
      },
      {
        id: "3",
        jobId: "1",
        jobSeekerId: "user3",
        jobSeekerName: "Emma Rodriguez",
        jobTitle: "Senior Frontend Developer",
        companyName: "Tech Innovations Inc.",
        appliedDate: new Date("2024-11-15").toISOString(),
        coverLetter:
          "I have worked on several large-scale React applications and am proficient with modern JavaScript frameworks.",
        status: "pending",
        resumeUrl: "#",
        profileUrl: "#",
        paymentAmount: 0,
      },
      {
        id: "4",
        jobId: "3",
        jobSeekerId: "user4",
        jobSeekerName: "David Wilson",
        jobTitle: "DevOps Specialist",
        companyName: "Cloud Systems Co.",
        appliedDate: new Date("2024-11-10").toISOString(),
        coverLetter:
          "I specialize in containerization, CI/CD pipelines, and cloud infrastructure with AWS and Kubernetes experience.",
        status: "rejected",
        resumeUrl: "#",
        profileUrl: "#",
        paymentAmount: 75,
      },
      {
        id: "5",
        jobId: "1",
        jobSeekerId: "user5",
        jobSeekerName: "Priya Sharma",
        jobTitle: "Senior Frontend Developer",
        companyName: "Tech Innovations Inc.",
        appliedDate: new Date("2024-11-08").toISOString(),
        coverLetter:
          "As a senior frontend developer with 8 years of experience, I bring expertise in React, TypeScript, and performance optimization.",
        status: "shortlisted",
        resumeUrl: "#",
        profileUrl: "#",
        paymentAmount: 10,
      },
    ];

    // Sort applications by payment amount (highest first)
    const sortedApplications = [...dummyApplications].sort((a, b) => (b.paymentAmount || 0) - (a.paymentAmount || 0));

    setApplications(sortedApplications);
  }, []);

  const updateApplicationStatus = (
    appId: string,
    newStatus: Application["status"]
  ) => {
    const updatedApplications = applications.map((app) =>
      app.id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);

    toast({
      title: `Application ${newStatus}`,
      description: `Status updated for ${
        updatedApplications.find((a) => a.id === appId)?.jobSeekerName
      }`,
    });
  };

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

  const toggleExpand = (appId: string) => {
    setExpandedAppId(expandedAppId === appId ? null : appId);
  };

  if (applications.length === 0) {
    return (
      <Card className="p-12 text-center border-[#456882]/30 bg-white">
        <div className="mx-auto bg-[#234C6A]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-[#234C6A]" />
        </div>
        <h3 className="text-xl font-semibold text-[#234C6A] mb-2">
          No applications yet
        </h3>
        <p className="text-[#234C6A]/70">
          Once candidates apply to your jobs, they&apos;ll appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card
          key={application.id}
          className="p-6 border-[#456882]/30 bg-white hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-full w-12 h-12 flex items-center justify-center text-white">
                <span className="font-bold">
                  {application.jobSeekerName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-[#234C6A]">
                    {application.jobSeekerName}
                  </h3>
                  <Badge
                    className={`${getStatusColor(application.status)} border`}
                  >
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </Badge>
                  {application.paymentAmount && application.paymentAmount > 0 && (
                    <Badge className="bg-[#456882] text-white border-[#456882]">
                      Paid: ${application.paymentAmount.toFixed(2)}
                    </Badge>
                  )}
                </div>
                <p className="text-[#234C6A] font-medium">
                  {application.jobTitle}
                </p>
                <p className="text-sm text-[#234C6A]/70">
                  Applied on{" "}
                  {new Date(application.appliedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpand(application.id)}
              className="text-[#234C6A]"
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedAppId === application.id ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {/* Expanded section */}
          {expandedAppId === application.id && (
            <div className="mt-4 pt-4 border-t border-[#456882]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-[#234C6A] mb-2 flex items-center gap-1">
                    <User className="h-4 w-4" /> Personal Info
                  </h4>
                  <p className="text-sm text-[#234C6A]/90">
                    {application.jobSeekerName}
                  </p>
                  <p className="text-sm text-[#234C6A]/70 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> sarah.johnson@example.com
                  </p>
                  <p className="text-sm text-[#234C6A]/70 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> San Francisco, CA
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-[#234C6A] mb-2 flex items-center gap-1">
                    <Briefcase className="h-4 w-4" /> Job Details
                  </h4>
                  <p className="text-sm text-[#234C6A]/90">
                    {application.jobTitle}
                  </p>
                  <p className="text-sm text-[#234C6A]/70">
                    From: Tech Innovations Inc.
                  </p>
                  <p className="text-sm text-[#234C6A]/70">
                    Applied:{" "}
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </p>
                  {application.paymentAmount !== undefined && (
                    <p className="text-sm text-[#234C6A]/70">
                      Payment: ${application.paymentAmount.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {application.coverLetter && (
                <div className="mb-4">
                  <h4 className="font-medium text-[#234C6A] mb-2 flex items-center gap-1">
                    <Mail className="h-4 w-4" /> Cover Letter
                  </h4>
                  <p className="text-[#234C6A]/80 text-sm leading-relaxed">
                    {application.coverLetter}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Download Resume
                </Button>
              </div>

              <div className="flex gap-2">
                {application.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
                    onClick={() =>
                      updateApplicationStatus(application.id, "reviewed")
                    }
                  >
                    Mark as Reviewed
                  </Button>
                )}
                {(application.status === "pending" ||
                  application.status === "reviewed") && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                    onClick={() =>
                      updateApplicationStatus(application.id, "shortlisted")
                    }
                  >
                    Shortlist
                  </Button>
                )}
                {application.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      updateApplicationStatus(application.id, "rejected")
                    }
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Actions for collapsed view */}
          {!expandedAppId || expandedAppId !== application.id ? (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="border-[#234C6A] text-[#234C6A] hover:bg-[#234C6A]/10"
                onClick={() => toggleExpand(application.id)}
              >
                View Details
              </Button>
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
};

export default ApplicantsList;
