import { useState, useEffect } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Application, Job } from "@/src/types";
import { toast } from "@/src/hooks/use-toast";

// Extending the Job type to include recruiterId
interface JobWithRecruiter extends Job {
  recruiterId: string;
}

const ApplicantsList = ({ userId }: { userId: string }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobWithRecruiter[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      const userJobs = allJobs.filter(
        (job: JobWithRecruiter) => job.recruiterId === userId
      );
      setJobs(userJobs);

      const allApplications = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jobIds = userJobs.map((job: any) => job.id.toString()); // Convert to string to match application jobId
      const jobApplications = allApplications.filter((app: Application) =>
        jobIds.includes(app.jobId)
      );
      setApplications(jobApplications);
    };

    fetchData();
  }, [userId]);

  const updateApplicationStatus = (
    appId: string,
    newStatus: Application["status"]
  ) => {
    const allApplications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );
    const updatedApplications = allApplications.map((app: Application) =>
      app.id === appId ? { ...app, status: newStatus } : app
    );
    localStorage.setItem("applications", JSON.stringify(updatedApplications));

    const jobIds = jobs.map((job) => job.id.toString()); // Convert to string to match application jobId
    const jobApplications = updatedApplications.filter((app: Application) =>
      jobIds.includes(app.jobId)
    );
    setApplications(jobApplications);

    toast({ title: `Application ${newStatus}` });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "reviewed":
        return "bg-blue-500/10 text-blue-500";
      case "shortlisted":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted";
    }
  };

  if (applications.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No applications yet.</p>
        <p className="text-muted-foreground mt-2">
          Once candidates apply to your jobs, they&apos;ll appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {app.jobSeekerName}
              </h3>
              <p className="text-muted-foreground">
                Applied for: {app.jobTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                Applied on {new Date(app.appliedDate).toLocaleDateString()}
              </p>
            </div>
            <Badge className={getStatusColor(app.status)}>
              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
            </Badge>
          </div>

          {app.coverLetter && (
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold mb-2">Cover Letter:</p>
              <p className="text-sm">{app.coverLetter}</p>
            </div>
          )}

          <div className="flex gap-2">
            {app.status === "pending" && (
              <Button
                size="sm"
                onClick={() => updateApplicationStatus(app.id, "reviewed")}
              >
                Mark as Reviewed
              </Button>
            )}
            {(app.status === "pending" || app.status === "reviewed") && (
              <Button
                size="sm"
                variant="default"
                onClick={() => updateApplicationStatus(app.id, "shortlisted")}
              >
                Shortlist
              </Button>
            )}
            {app.status !== "rejected" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateApplicationStatus(app.id, "rejected")}
              >
                Reject
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ApplicantsList;
