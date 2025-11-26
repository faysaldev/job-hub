import { useState, useEffect } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Application } from "@/src/types";
import { Building2, Calendar } from "lucide-react";

const AppliedJobs = ({ userId }: { userId: string }) => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const allApplications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );
    const userApplications = allApplications.filter(
      (app: Application) => app.jobSeekerId === userId
    );
    // setApplications(userApplications);
  }, [userId]);

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
        <p className="text-muted-foreground text-lg">
          You haven{`'`}t applied to any jobs yet.
        </p>
        <p className="text-muted-foreground mt-2">
          Start browsing jobs and apply to get started!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{app.jobTitle}</h3>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
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
              </div>
              {app.coverLetter && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {app.coverLetter}
                </p>
              )}
            </div>
            <Badge className={getStatusColor(app.status)}>
              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AppliedJobs;
