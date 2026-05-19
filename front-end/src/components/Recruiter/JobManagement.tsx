import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/hooks/use-toast";
import {
  Plus,
  Trash2,
  Edit3,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  useGetJobsByAuthorQuery,
  useDeleteJobMutation,
  useUpdateJobMutation,
} from "@/src/redux/features/jobs/jobsApi";
import { useRouter } from "next/navigation";

const JobManagement = ({ userId }: { userId: string }) => {
  const router = useRouter();

  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsIsError,
    error: jobsError,
  } = useGetJobsByAuthorQuery(userId);

  const [deleteJobMutation] = useDeleteJobMutation();
  const [updateJobMutation] = useUpdateJobMutation();

  const deleteJob = async (jobId: string) => {
    try {
      await deleteJobMutation(jobId).unwrap();
      toast({ title: "Job deleted successfully" });
    } catch (error) {
      toast({
        title: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newActive = currentStatus !== "active";
      await updateJobMutation({
        jobId,
        body: { isActive: newActive },
      }).unwrap();
      toast({
        title: `Job ${newActive ? "activated" : "closed"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Failed to update job status",
        variant: "destructive",
      });
    }
  };

  const jobs = jobsData?.data ?? [];
  const activeCount = jobs.filter((job: any) => job.isActive !== false).length;
  const closedCount = jobs.length - activeCount;

  if (jobsLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-6"
          >
            <div className="flex animate-pulse gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#E3E3E3]" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-2/5 rounded-full bg-[#E3E3E3]" />
                <div className="h-4 w-4/5 rounded-full bg-[#E3E3E3]" />
                <div className="h-4 w-3/5 rounded-full bg-[#E3E3E3]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (jobsIsError) {
    return (
      <Card className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h3 className="text-lg font-black text-red-700">
          Could not load job postings
        </h3>
        <p className="mt-2 text-sm font-medium text-red-600">
          {(jobsError as any)?.data?.message ||
            "Please refresh the page and try again."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Total Jobs", value: jobs.length, icon: Briefcase },
          { label: "Active", value: activeCount, icon: Search },
          { label: "Closed", value: closedCount, icon: Users },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-[#234C6A]/10 bg-[#F8FAFC] p-5"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A]">
              <item.icon className="h-5 w-5" />
            </div>
            <p className="text-3xl font-black text-[#234C6A]">{item.value}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-widest text-[#456882]">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {!jobs.length ? (
        <Card className="rounded-3xl border border-dashed border-[#234C6A]/20 bg-[#F8FAFC] p-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#234C6A]/10 text-[#234C6A]">
            <Briefcase className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-black text-[#234C6A]">
            No job postings yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#456882]">
            Create your first role with the full premium job builder and start
            receiving applications.
          </p>
          <Button
            className="mt-6 h-12 rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] px-7 font-black text-white shadow-lg shadow-[#234C6A]/20 hover:from-[#1c405a] hover:to-[#3b5a71]"
            onClick={() => router.push("/recruiter/create-job")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Job
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job: any) => {
            const status = job.isActive !== false ? "active" : "closed";
            const deadline = job.applicationDeadline
              ? new Date(job.applicationDeadline).toLocaleDateString()
              : "Not set";
            const salaryMin = Number(job.salaryMin || 0).toLocaleString();
            const salaryMax = Number(job.salaryMax || 0).toLocaleString();

            return (
              <Card
                key={job._id}
                className="group overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#234C6A]/25 hover:shadow-xl hover:shadow-[#234C6A]/10"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black tracking-tight text-[#234C6A] transition-colors group-hover:text-[#456882]">
                        {job.title}
                      </h3>
                      <Badge
                        variant={status === "active" ? "default" : "secondary"}
                        className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          status === "active"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-[#456882]/20 bg-[#456882]/10 text-[#456882]"
                        }`}
                      >
                        {status}
                      </Badge>
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-3 text-sm font-semibold text-[#456882] md:grid-cols-2 xl:grid-cols-4">
                      <div className="flex items-center gap-2 rounded-2xl bg-[#F8FAFC] px-3 py-2">
                        <Briefcase className="h-4 w-4 text-[#234C6A]" />
                        <span>{job.type || "Job type"}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl bg-[#F8FAFC] px-3 py-2">
                        <MapPin className="h-4 w-4 text-[#234C6A]" />
                        <span>{job.location || "Location"}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl bg-[#F8FAFC] px-3 py-2">
                        <DollarSign className="h-4 w-4 text-[#234C6A]" />
                        <span>
                          {salaryMin} - {salaryMax} {job.salaryPeriod}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl bg-[#F8FAFC] px-3 py-2">
                        <Calendar className="h-4 w-4 text-[#234C6A]" />
                        <span>Deadline: {deadline}</span>
                      </div>
                    </div>

                    <p className="mb-5 line-clamp-2 text-sm font-medium leading-6 text-[#456882]">
                      {job.description || "No description provided."}
                    </p>

                    {!!job.skills?.length && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills
                          ?.slice(0, 8)
                          .map((skill: string, index: number) => (
                            <Badge
                              key={`${skill}-${index}`}
                              variant="secondary"
                              className="rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-3 py-1 font-black text-[#234C6A] hover:bg-[#234C6A]/10"
                            >
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 xl:flex-col">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 rounded-2xl border-[#234C6A]/20 px-4 font-black text-[#234C6A] hover:bg-[#234C6A]/5"
                      onClick={() => toggleJobStatus(job._id, status)}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      {status === "active" ? "Close" : "Reopen"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-10 rounded-2xl px-4 font-black"
                      onClick={() => deleteJob(job._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobManagement;
