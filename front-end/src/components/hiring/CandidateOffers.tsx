"use client";
import { useGetUserApplicationsQuery, useUpdateATSMutation } from "@/src/redux/features/applications/applicationsApi";
import { type ATSApplication } from "@/src/redux/features/hiring/hiringApi";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
export default function CandidateOffers() {
  const {data,isLoading,isError,refetch} = useGetUserApplicationsQuery();
  const [respond,{isLoading:saving}] = useUpdateATSMutation();
  const applications = (data||[]) as unknown as ATSApplication[];
  const offers = applications.filter(app=>app.status==="offer" && !!app.offer);
  if (!isLoading && !isError && !offers.length) return null;
  return <section className="rounded-xl border border-[#d9e3ea] bg-white p-5"><h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#163B5C]"><MailCheck size={20}/> Offers and decisions</h2>
    {isLoading && <div className="h-16 animate-pulse rounded-lg bg-slate-100" aria-label="Loading offers"/>}
    {isError && <p role="alert" className="text-sm text-red-700">Unable to load offers. <button className="underline" onClick={()=>refetch()}>Retry</button></p>}
    <div className="space-y-3">{offers.map(app=><div key={app._id} className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-[#163B5C]">{app.job_id?.title||"Job offer"}</p>
        <p className="mt-1 text-sm text-slate-600">{app.offer?.currency} {app.offer?.salary?.toLocaleString()} · Expires {app.offer && new Date(app.offer.expiresAt).toLocaleDateString()}</p>
        {app.offer?.message && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{app.offer.message}</p>}</div>
        {app.offer?.status==="sent" && new Date(app.offer.expiresAt).getTime()>Date.now() ? <div className="flex gap-2"><button className="rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white" disabled={saving}
          onClick={async()=>{try{await respond({applicationId:app._id,body:{action:"offer-response",decision:"accepted"}}).unwrap();toast.success("Offer accepted; the recruiter has been notified");}catch(error:any){toast.error(error?.data?.message||"Unable to accept offer");}}}>Accept</button>
          <button className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700" disabled={saving}
          onClick={async()=>{if(!confirm("Decline this offer?")) return;try{await respond({applicationId:app._id,body:{action:"offer-response",decision:"declined"}}).unwrap();toast.success("Offer declined");}catch(error:any){toast.error(error?.data?.message||"Unable to decline offer");}}}>Decline</button></div>
          : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize">{new Date(app.offer?.expiresAt || 0).getTime()<=Date.now() && app.offer?.status==="sent"?"Expired":app.offer?.status}</span>}
      </div>
    </div>)}</div>
  </section>;
}
