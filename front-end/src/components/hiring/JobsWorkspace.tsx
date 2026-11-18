"use client";
import { useState } from "react";
import Link from "next/link";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { useGetWorkspaceJobsQuery, useCreateJobMutation, useUpdateJobMutation, useDeleteJobMutation } from "@/src/redux/features/jobs/jobsApi";
import { toast } from "sonner";
import type { Job } from "@/src/types";
import { apiErrorMessage } from "@/src/lib/apiErrors";
import SponsorJobButton from "@/src/components/billing/SponsorJobButton";

const primary = "rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#315c7b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50";
const secondary = "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50";

export default function JobsWorkspace() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [draftTitle, setDraftTitle] = useState("");
  const { data, isLoading, isFetching, isError, refetch } = useGetWorkspaceJobsQuery({
    ...(filter !== "all" ? { status: filter } : {}), page,
  });
  const [create, { isLoading: creating }] = useCreateJobMutation();
  const [update, { isLoading: updating }] = useUpdateJobMutation();
  const [remove, { isLoading: removing }] = useDeleteJobMutation();
  const jobs = data?.data.jobs || [];
  const overview = data?.data.overview;
  const pagination = data?.data.pagination;

  const newDraft = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draftTitle.trim()) return;
    try {
      await create({ title: draftTitle.trim(), status: "draft" } as Partial<Job>).unwrap();
      setDraftTitle(""); setFilter("all"); setPage(1);
      toast.success("Draft created — complete its details before publishing");
    } catch (error: unknown) { toast.error(apiErrorMessage(error, "Unable to create draft")); }
  };
  const change = async (id: string, status: string) => {
    try {
      await update({ jobId: id, body: { status } as Partial<Job> }).unwrap();
      toast.success(status === "closed" ? "Job closed — applications retained" : "Job reopened and available for applications");
    } catch (error: unknown) { toast.error(apiErrorMessage(error, "Unable to change job status")); }
  };
  const archive = async (id: string) => {
    if (!window.confirm("Archive this listing? It will disappear from search and the jobs list, but applications and history remain intact.")) return;
    try {
      await remove(id).unwrap();
      toast.success("Job archived; application history preserved");
      if (jobs.length === 1 && page > 1) setPage(page - 1);
    } catch (error: unknown) { toast.error(apiErrorMessage(error, "Unable to archive job")); }
  };
  return <RecruiterLayout><div className="mx-auto max-w-6xl space-y-6 pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-widest text-[#456882]">Recruitment</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#163B5C]">Job postings</h1>
        <p className="mt-2 text-sm text-slate-600">Draft, schedule, publish or close roles without losing applications.</p>
      </div><Link href="/recruiter/create-job" className={primary}>Create job</Link>
    </header>
    {overview && <section aria-label="Job posting overview" className="grid gap-3 sm:grid-cols-3">
      {[{ label: "Open for applications", value: overview.openJobs, detail: "Published and unexpired" },
        { label: "Published total", value: overview.publishedJobs, detail: "Includes expired listings" },
        { label: "Reserved plan slots", value: `${overview.quotaUsed} / ${overview.quotaLimit}`, detail: `${overview.scheduledJobs} scheduled` }].map(item =>
        <div key={item.label} className="rounded-xl border border-[#d9e3ea] bg-white p-4">
          <p className="text-xs text-slate-600">{item.label}</p><p className="mt-1 text-2xl font-semibold text-[#163B5C]">{item.value}</p><p className="text-xs text-slate-500">{item.detail}</p>
        </div>)}
    </section>}
    {overview?.overLimit ? <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      Your current plan is over capacity by {overview.overLimit} listing{overview.overLimit === 1 ? "" : "s"}. Existing jobs are preserved, but additional publishing requires available capacity or a <Link className="font-semibold underline" href="/recruiter/billing">plan upgrade</Link>.
    </p> : null}
    <form className="rounded-xl border border-[#d9e3ea] bg-white p-5" onSubmit={newDraft}>
      <h2 className="mb-3 font-semibold text-[#163B5C]">Start with a draft</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1 text-sm"><span className="sr-only">Draft job title</span>
          <input className="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus-visible:outline-2 focus-visible:outline-blue-700" value={draftTitle} onChange={e => setDraftTitle(e.target.value)} maxLength={140} minLength={1} required placeholder="e.g. Full-stack developer"/>
        </label><button className={primary} disabled={creating}>{creating ? "Saving…" : "Save draft"}</button>
      </div>
    </form>
    <section className="overflow-hidden rounded-xl border border-[#d9e3ea] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <h2 className="font-semibold text-[#163B5C]">Company opportunities</h2>
        <label className="text-xs text-slate-600">Status <select value={filter} onChange={event => { setFilter(event.target.value); setPage(1); }} className="ml-2 rounded-lg border border-slate-300 p-2 text-sm">
          <option value="all">All</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="closed">Closed</option>
        </select></label>
      </div>
      {isLoading && <div className="m-5 h-28 animate-pulse rounded-lg bg-slate-100" aria-label="Loading jobs"/>}
      {isError && <div role="alert" className="p-5 text-sm text-red-700">Unable to load job listings. <button type="button" className="underline" onClick={() => void refetch()}>Retry</button></div>}
      {!isLoading && !isError && <div className={`overflow-x-auto ${isFetching ? "opacity-70" : ""}`}>
        <table className="w-full min-w-[740px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>
            <th className="px-5 py-3">Job</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Publication</th><th className="px-5 py-3">Deadline</th><th className="px-5 py-3 text-right">Actions</th>
          </tr></thead>
          <tbody>{jobs.map(job => <tr key={job._id} className="border-t border-slate-100">
            <td className="px-5 py-4"><p className="font-semibold text-[#163B5C]">{job.title}</p>
              <p className="text-xs text-slate-500">{job.location || "Location not added"}
                {job.hasDraftChanges ? " · Private draft changes saved" : ""}
                {job.sponsoredUntil && new Date(job.sponsoredUntil).getTime() > Date.now() ? ` · Sponsored until ${new Date(job.sponsoredUntil).toLocaleDateString()}` : ""}
              </p></td>
            <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs capitalize text-blue-800">{job.expired ? "Expired" : job.status || (job.isActive ? "published" : "closed")}</span></td>
            <td className="px-5 py-4 text-slate-600">{job.publishAt ? new Date(job.publishAt).toLocaleString() : "—"}</td>
            <td className="px-5 py-4 text-slate-600">{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "—"}</td>
            <td className="px-5 py-4 text-right"><div className="flex flex-wrap justify-end gap-2">
              <Link className={secondary} href={`/recruiter/jobs/${job._id}/edit`}>{job.hasDraftChanges ? "Review draft" : "Edit"}</Link>
              {job.status === "published" && !job.expired && <SponsorJobButton jobId={job._id} active={!job.sponsoredUntil || new Date(job.sponsoredUntil).getTime() < Date.now()}/>}
              {(job.status === "published" || (!job.status && job.isActive)) ? <button type="button" disabled={updating} className={secondary} onClick={() => void change(job._id, "closed")}>Close</button> :
                job.status === "closed" && <button type="button" disabled={updating} className={secondary} onClick={() => void change(job._id, "published")}>Reopen</button>}
              <button type="button" disabled={removing} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50" onClick={() => void archive(job._id)}>Archive</button>
            </div></td>
          </tr>)}</tbody>
        </table>
        {!jobs.length && <p className="px-5 py-10 text-center text-sm text-slate-500">No jobs in this status. Create a draft or publish your first role.</p>}
      </div>}
      {pagination && pagination.totalPages > 1 && <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-600">
        <span>Page {pagination.page} of {pagination.totalPages} · {pagination.total} listings</span><div className="flex gap-2">
          <button type="button" className={secondary} disabled={page <= 1 || isFetching} onClick={() => setPage(p => p - 1)}>Previous</button>
          <button type="button" className={secondary} disabled={page >= pagination.totalPages || isFetching} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>}
    </section>
  </div></RecruiterLayout>;
}
