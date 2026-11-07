"use client";
import { useState } from "react";
import Link from "next/link";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { useGetWorkspaceJobsQuery, useCreateJobMutation, useUpdateJobMutation, useDeleteJobMutation } from "@/src/redux/features/jobs/jobsApi";
import { toast } from "sonner";
import type { Job } from "@/src/types";
const primary = "rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#315c7b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50";
const secondary = "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50";
export default function JobsWorkspace() {
  const [filter, setFilter] = useState("all"); const [draftTitle, setDraftTitle] = useState("");
  const {data, isLoading, isError, refetch} = useGetWorkspaceJobsQuery(filter === "all" ? {} : { status: filter });
  const [create, {isLoading:creating}] = useCreateJobMutation();
  const [update, {isLoading:updating}] = useUpdateJobMutation();
  const [remove, {isLoading:removing}] = useDeleteJobMutation();
  const jobs = data?.data.jobs || [];
  const newDraft = async (event: React.FormEvent) => { event.preventDefault();
    try { await create({title:draftTitle.trim(),status:"draft"} as unknown as Partial<Job>).unwrap(); setDraftTitle(""); toast.success("Draft created. Complete its details before publishing."); }
    catch (error:any) { toast.error(error?.data?.message || "Unable to create draft"); }
  };
  const change = async (id:string,status:string) => {
    try { await update({jobId:id,body:{status} as Partial<Job>}).unwrap(); toast.success(`Job moved to ${status}`); }
    catch (error:any) { toast.error(error?.data?.message || "Check the job details before publishing"); }
  };
  const del = async (id:string) => { if (!confirm("Archive this job? Its application history will be retained.")) return;
    try { await remove(id).unwrap(); toast.success("Job archived"); }
    catch (error:any) { toast.error(error?.data?.message || "Unable to archive job"); }
  };
  return <RecruiterLayout><div className="mx-auto max-w-6xl space-y-6 pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#456882]">Recruitment</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#163B5C]">Job postings</h1><p className="mt-2 text-sm text-slate-600">Draft, schedule, publish or close roles without losing applications.</p></div>
      <Link href="/recruiter/create-job" className={primary}>Create job</Link></header>
    <form className="rounded-xl border border-[#d9e3ea] bg-white p-5" onSubmit={newDraft}>
      <h2 className="mb-3 font-semibold text-[#163B5C]">Start with a draft</h2>
      <div className="flex flex-col gap-3 sm:flex-row"><label className="flex-1 text-sm"><span className="sr-only">Draft job title</span>
        <input className="min-h-11 w-full rounded-lg border border-slate-300 px-3 focus-visible:outline-2 focus-visible:outline-blue-700" value={draftTitle} onChange={e=>setDraftTitle(e.target.value)} maxLength={140} minLength={1} required placeholder="e.g. Full-stack developer"/></label>
        <button className={primary} disabled={creating}>Save draft</button></div>
    </form>
    <section className="overflow-hidden rounded-xl border border-[#d9e3ea] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5"><h2 className="font-semibold text-[#163B5C]">Company opportunities</h2>
        <label className="text-xs text-slate-500">Status <select value={filter} onChange={e=>setFilter(e.target.value)} className="ml-2 rounded-lg border border-slate-300 p-2 text-sm">
          <option value="all">All</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="closed">Closed</option>
        </select></label></div>
      {isLoading && <div className="m-5 h-28 animate-pulse rounded-lg bg-slate-100" aria-label="Loading jobs"/>}
      {isError && <div role="alert" className="p-5 text-sm text-red-700">Unable to load job listings. <button className="underline" onClick={()=>refetch()}>Retry</button></div>}
      {!isLoading && !isError && <div className="overflow-x-auto"><table className="w-full min-w-[690px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Job</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Publish date</th><th className="px-5 py-3">Deadline</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
        <tbody>{jobs.map(job => <tr key={job._id} className="border-t border-slate-100"><td className="px-5 py-4"><p className="font-semibold text-[#163B5C]">{job.title}</p><p className="text-xs text-slate-500">{job.location || "Location not added"}</p></td>
          <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs capitalize text-blue-800">{job.status || (job.isActive ? "published" : "closed")}</span></td>
          <td className="px-5 py-4 text-slate-600">{job.publishAt ? new Date(job.publishAt).toLocaleString() : "—"}</td>
          <td className="px-5 py-4 text-slate-600">{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "—"}</td>
          <td className="px-5 py-4 text-right"><div className="flex flex-wrap justify-end gap-2">
            <Link className={secondary} href={`/recruiter/jobs/${job._id}/edit`}>Edit</Link>
            {(job.status === "published" || (!job.status && job.isActive)) ? <button disabled={updating} className={secondary} onClick={()=>change(job._id,"closed")}>Close</button> :
              job.status === "closed" && <button disabled={updating} className={secondary} onClick={()=>change(job._id,"published")}>Reopen</button>}
            <button disabled={removing} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50" onClick={()=>del(job._id)}>Archive</button>
          </div></td></tr>)}</tbody></table>
        {!jobs.length && <p className="px-5 py-10 text-center text-sm text-slate-500">No jobs in this status. Create a draft or publish your first role.</p>}
      </div>}
    </section>
  </div></RecruiterLayout>;
}
