"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useGetSavedSearchesQuery, useCreateSavedSearchMutation, useUpdateSavedSearchMutation,
  useDeleteSavedSearchMutation } from "@/src/redux/features/savedJobs/savedJobsApi";
import { Search, Bell } from "lucide-react";
import WorkspaceShell from "@/src/components/layout/WorkspaceShell";
const field = "min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
export default function CandidateAlerts() {
  const [name,setName] = useState(""); const [q,setQ] = useState(""); const [location,setLocation] = useState("");
  const [frequency,setFrequency] = useState<"daily"|"weekly">("daily");
  const {data,isLoading,isError,refetch} = useGetSavedSearchesQuery();
  const [create,{isLoading:creating}] = useCreateSavedSearchMutation();
  const [update] = useUpdateSavedSearchMutation(); const [remove] = useDeleteSavedSearchMutation();
  return <WorkspaceShell role="seeker"><div className="mx-auto max-w-4xl space-y-6"><header><p className="text-xs font-bold uppercase tracking-widest text-[#456882]">Job discovery</p>
    <h1 className="mt-1 text-3xl font-semibold text-[#163B5C]">Saved searches and alerts</h1><p className="mt-2 text-sm text-slate-600">Save useful searches and receive in-app alerts for new matching vacancies.</p></header>
    <form className="rounded-xl border border-[#d9e3ea] bg-white p-6" onSubmit={async e=>{e.preventDefault();try{await create({name,filters:{q,location},alertsEnabled:true,frequency}).unwrap();toast.success("Search and alerts saved");setName("");setQ("");setLocation("");}catch(error:any){toast.error(error?.data?.message||"Unable to save search");}}}>
      <h2 className="mb-4 flex items-center gap-2 font-semibold text-[#163B5C]"><Search size={18}/> Save a search</h2>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Search name<input required className={`${field} mt-1`} maxLength={80} placeholder="Frontend jobs in Dhaka" value={name} onChange={e=>setName(e.target.value)} /></label>
        <label className="text-sm">Job keywords<input className={`${field} mt-1`} maxLength={100} placeholder="React developer" value={q} onChange={e=>setQ(e.target.value)} /></label>
        <label className="text-sm">Location<input className={`${field} mt-1`} maxLength={100} placeholder="Dhaka or remote" value={location} onChange={e=>setLocation(e.target.value)} /></label>
        <label className="text-sm">Notification cadence<select className={`${field} mt-1`} value={frequency} onChange={e=>setFrequency(e.target.value as "daily"|"weekly")}><option value="daily">Daily</option><option value="weekly">Weekly</option></select></label></div>
      <button disabled={creating} className="mt-5 rounded-lg bg-[#163B5C] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Save and enable alerts</button>
    </form>
    <section className="rounded-xl border border-[#d9e3ea] bg-white p-6"><h2 className="mb-4 flex items-center gap-2 font-semibold text-[#163B5C]"><Bell size={18}/> Saved searches</h2>
      {isLoading && <div className="h-24 animate-pulse rounded-lg bg-slate-100" aria-label="Loading searches"/>}
      {isError && <p role="alert" className="text-sm text-red-700">Cannot load searches. <button onClick={()=>refetch()} className="underline">Retry</button></p>}
      <div className="divide-y divide-slate-100">{data?.data.map(search=><div key={search._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div><p className="font-semibold text-[#163B5C]">{search.name}</p><p className="mt-1 text-xs text-slate-500">{search.filters.q||"Any keyword"} · {search.filters.location||"Any location"} · {search.frequency}</p></div>
        <div className="flex items-center gap-3"><label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={search.alertsEnabled}
          onChange={async e=>{try{await update({id:search._id,body:{alertsEnabled:e.target.checked}}).unwrap();}catch{toast.error("Could not update alerts");}}}/> Alerts</label>
          <Link className="text-sm font-medium text-blue-700 underline" href={`/job?q=${encodeURIComponent(search.filters.q||"")}&location=${encodeURIComponent(search.filters.location||"")}`}>Search jobs</Link>
          <button className="text-sm text-red-700 underline" onClick={async()=>{try{await remove(search._id).unwrap();}catch{toast.error("Could not remove search");}}}>Remove</button>
        </div></div>)}</div>
      {!isLoading && !data?.data.length && <p className="py-6 text-center text-sm text-slate-500">No searches saved yet.</p>}
    </section>
  </div></WorkspaceShell>;
}
