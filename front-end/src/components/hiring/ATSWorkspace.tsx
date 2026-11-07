"use client";
import { useMemo, useState } from "react";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { SecureAssetLink } from "@/src/components/assets/SecureAssetLink";
import { useGetRecruiterApplicationsQuery, useUpdateATSMutation, type ATSAction } from "@/src/redux/features/applications/applicationsApi";
import { useScheduleInterviewMutation } from "@/src/redux/features/interviews/interviewsApi";
import { useGetTeamQuery, type ATSApplication, type ApplicationStage } from "@/src/redux/features/hiring/hiringApi";
import { toast } from "sonner";
import { FileText, Users, ClipboardList, CalendarDays } from "lucide-react";
const stages: Array<{value: ApplicationStage | "all"; label: string}> = [
  { value: "all", label: "All" }, {value:"applied",label:"Applied"}, {value:"under_review",label:"Screening"},
  {value:"shortlisted",label:"Shortlisted"},{value:"interview",label:"Interview"},{value:"offer",label:"Offer"},
  {value:"hired",label:"Hired"},{value:"rejected",label:"Rejected"},
];
const btn = "rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#315c7b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50";
const secondary = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-[#163B5C] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
const statusText = (status: string) => status.replace(/_/g, " ");
export default function ATSWorkspace() {
  const [stage, setStage] = useState<ApplicationStage | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [offer, setOffer] = useState({ salary: "", currency: "USD", message: "", expiresAt: "" });
  const [interview, setInterview] = useState({date:"",start_time:"09:00",end_time:"10:00",type:"video" as "video" | "audio" | "in-person",meet_link:"",interviewer:""});
  const { data: teamResponse } = useGetTeamQuery();
  const companyTeam = teamResponse?.data.workspace;
  const { data, isLoading, isError, refetch } = useGetRecruiterApplicationsQuery({ status: stage === "all" ? undefined : stage });
  const [act, { isLoading: saving }] = useUpdateATSMutation();
  const [schedule, { isLoading: scheduling }] = useScheduleInterviewMutation();
  const applications = (data || []) as unknown as ATSApplication[];
  const current = useMemo(() => applications.find(a => a._id === selected), [applications, selected]);
  const action = async (appId: string, body: ATSAction) => {
    try { await act({applicationId:appId,body}).unwrap(); toast.success("Application updated"); setNote(""); }
    catch (error: any) { toast.error(error?.data?.message || "Unable to update application"); }
  };
  const sendOffer = async (event: React.FormEvent) => {
    event.preventDefault(); if (!current) return;
    if (!offer.expiresAt) return toast.error("Choose an offer expiration date");
    await action(current._id, { action: "offer", salary: Number(offer.salary), currency: offer.currency.toUpperCase(),
      message: offer.message, expiresAt: new Date(`${offer.expiresAt}T23:59:00`).toISOString() });
  };
  const scheduleInterview = async (event: React.FormEvent) => {
    event.preventDefault(); if (!current) return;
    try { await schedule({ application_id: current._id, job_id: current.job_id._id, interviewee: current.applicant._id,
      date: new Date(`${interview.date}T12:00:00`).toISOString(), start_time: interview.start_time, end_time: interview.end_time,
      ...(interview.interviewer ? { interviewer: interview.interviewer } : {}),
      type: interview.type, meet_link: interview.meet_link }).unwrap(); toast.success("Interview scheduled"); }
    catch (error: any) { toast.error(error?.data?.message || "Unable to schedule interview"); }
  };
  return <RecruiterLayout><div className="mx-auto max-w-7xl space-y-5 pb-12">
    <header><p className="text-xs font-bold uppercase tracking-widest text-[#456882]">Hiring workspace</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#163B5C]">Applicant tracking</h1>
      <p className="mt-2 text-sm text-slate-600">Screen, shortlist, interview, send offers and hire — with a visible decision history.</p></header>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Application stage filters">
      {stages.map(item => <button key={item.value} onClick={() => { setStage(item.value); setSelected(null); }} aria-pressed={stage===item.value}
        className={`rounded-full border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${stage===item.value ? "border-[#163B5C] bg-[#163B5C] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{item.label}</button>)}
    </div>
    {isLoading && <div className="grid gap-3" aria-label="Loading applicants">{[1,2,3].map(x=><div key={x} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}</div>}
    {isError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">Could not load applicants. <button className="underline" onClick={() => refetch()}>Retry</button></div>}
    {!isLoading && !isError && <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(350px,0.85fr)]">
      <section className="overflow-hidden rounded-xl border border-[#d9e3ea] bg-white" aria-label="Applicant list">
        <div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="flex items-center gap-2 font-semibold text-[#163B5C]"><Users size={18} /> Applications</h2><span className="text-sm text-slate-500">{applications.length} records</span></div>
        {!applications.length && <div className="p-9 text-center text-sm text-slate-500"><ClipboardList className="mx-auto mb-3" />No applications in this stage yet.</div>}
        <div className="divide-y divide-slate-100">{applications.map(app => <button key={app._id} onClick={() => setSelected(app._id)} aria-pressed={selected===app._id}
          className={`w-full p-5 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-700 ${selected===app._id ? "bg-blue-50" : ""}`}>
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold text-[#163B5C]">{app.applicant?.name || "Candidate"}</p>
            <p className="mt-1 truncate text-sm text-slate-600">{app.job_id?.title || "Job"}</p></div><span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-700">{statusText(app.status)}</span></div>
          <p className="mt-2 text-xs text-slate-500">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
        </button>)}</div>
      </section>
      <aside className="self-start rounded-xl border border-[#d9e3ea] bg-white p-5" aria-label="Application details">
        {!current ? <div className="py-14 text-center text-sm text-slate-500"><FileText className="mx-auto mb-3" />Choose an applicant to review their information.</div> : <div className="space-y-5">
          <header className="border-b border-slate-100 pb-4"><p className="text-xl font-semibold text-[#163B5C]">{current.applicant?.name}</p>
            <p className="text-sm text-slate-600">{current.applicant?.email}</p><p className="mt-1 text-xs text-slate-500">{current.job_id?.title}</p>
            <SecureAssetLink reference={current.resume_url} className={`${secondary} mt-3 inline-flex items-center gap-2`}><FileText size={16}/> View secure resume</SecureAssetLink>
          </header>
          {current.cover_letter && <div><h3 className="mb-2 text-sm font-semibold">Cover letter</h3><p className="max-h-32 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-600">{current.cover_letter}</p></div>}
          {!(["hired","rejected"].includes(current.status)) && <div><h3 className="mb-2 text-sm font-semibold text-[#163B5C]">Advance application</h3>
            <div className="flex flex-wrap gap-2">{(["under_review","shortlisted","interview","hired","rejected"] as const).filter(x=>x!==current.status).map(next=><button key={next} className={secondary} disabled={saving}
              onClick={() => { if (next === "rejected" && !confirm("Reject this application?")) return; void action(current._id,{action:"stage",status:next}); }}>{statusText(next)}</button>)}</div>
            <p className="mt-2 text-xs text-slate-500">Unavailable stage transitions are rejected by the server.</p>
          </div>}
          <div><h3 className="mb-2 text-sm font-semibold text-[#163B5C]">Private hiring notes</h3>
            <div className="space-y-2">{(current.internalNotes || []).map((n,i)=><p className="rounded-md bg-slate-50 p-3 text-sm text-slate-700" key={i}>{n.text}<span className="mt-1 block text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span></p>)}</div>
            <form className="mt-3 flex flex-col gap-2" onSubmit={e=>{e.preventDefault();void action(current._id,{action:"note",text:note});}}>
              <label htmlFor="note" className="sr-only">Internal note</label><textarea id="note" className={`${input} min-h-20`} maxLength={3000} value={note} required onChange={e=>setNote(e.target.value)} placeholder="Visible only to authorized hiring team members" />
              <button className={btn} disabled={saving}>Save internal note</button></form>
          </div>
          {current.status === "offer" && current.offer ? <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm">
            <p className="font-semibold text-[#163B5C]">Offer {current.offer.status}</p><p>{current.offer.currency} {current.offer.salary?.toLocaleString()}</p>
            <p className="text-xs text-slate-600">Expires {new Date(current.offer.expiresAt).toLocaleDateString()}</p>
          </div> : ["under_review","shortlisted","interview"].includes(current.status) && <form onSubmit={sendOffer} className="space-y-3 border-t border-slate-100 pt-4">
            <h3 className="font-semibold text-[#163B5C]">Send an offer</h3>
            <div className="grid grid-cols-[1fr_110px] gap-2"><label className="text-xs">Salary<input className={`${input} mt-1`} type="number" min="0" required value={offer.salary} onChange={e=>setOffer({...offer,salary:e.target.value})}/></label>
            <label className="text-xs">Currency<input className={`${input} mt-1 uppercase`} pattern="[A-Z]{3}" maxLength={3} value={offer.currency} required onChange={e=>setOffer({...offer,currency:e.target.value.toUpperCase()})}/></label></div>
            <label className="block text-xs">Response deadline<input className={`${input} mt-1`} type="date" required min={new Date().toISOString().slice(0,10)} value={offer.expiresAt} onChange={e=>setOffer({...offer,expiresAt:e.target.value})}/></label>
            <label className="block text-xs">Message<textarea className={`${input} mt-1`} maxLength={4000} value={offer.message} onChange={e=>setOffer({...offer,message:e.target.value})}/></label>
            <button className={btn} disabled={saving}>Send offer</button></form>}
          {["under_review","shortlisted","interview"].includes(current.status) && <form className="space-y-2 border-t border-slate-100 pt-4" onSubmit={scheduleInterview}>
            <h3 className="flex items-center gap-2 font-semibold text-[#163B5C]"><CalendarDays size={17}/> Schedule interview</h3>
            <div className="grid grid-cols-2 gap-2"><label className="col-span-2 text-xs">Date<input required type="date" className={`${input} mt-1`} min={new Date().toISOString().slice(0,10)} value={interview.date} onChange={e=>setInterview({...interview,date:e.target.value})}/></label>
              <label className="text-xs">Start<input required type="time" className={`${input} mt-1`} value={interview.start_time} onChange={e=>setInterview({...interview,start_time:e.target.value})}/></label>
              <label className="text-xs">End<input required type="time" className={`${input} mt-1`} value={interview.end_time} onChange={e=>setInterview({...interview,end_time:e.target.value})}/></label></div>
            <select aria-label="Interview type" className={input} value={interview.type} onChange={e=>setInterview({...interview,type:e.target.value as typeof interview.type})}><option value="video">Video</option><option value="audio">Audio</option><option value="in-person">In person</option></select>
            {companyTeam && <label className="text-xs font-medium text-slate-600">Assigned interviewer
              <select className={`${input} mt-1`} aria-label="Assigned interviewer" value={interview.interviewer}
                onChange={event=>setInterview({...interview,interviewer:event.target.value})}>
                <option value="">Assign to myself</option>
                <option value={companyTeam.company.userId}>Company owner</option>
                {companyTeam.members.filter(m=>m.status === "active" && !!m.userId).map(m=><option key={m._id} value={m.userId}>{m.email} ({m.role})</option>)}
              </select></label>}
            <input className={input} aria-label="Meeting link" placeholder="Meeting link (optional)" value={interview.meet_link} onChange={e=>setInterview({...interview,meet_link:e.target.value})}/>
            <button className={btn} disabled={scheduling}>Schedule interview</button></form>}
          <section className="border-t border-slate-100 pt-4"><h3 className="mb-3 font-semibold text-[#163B5C]">Stage history</h3>
            <ol className="space-y-2">{(current.stageHistory||[]).map((h,i)=><li key={i} className="border-l-2 border-blue-200 pl-3 text-sm text-slate-700">
              <span className="font-medium capitalize">{statusText(h.to)}</span><span className="ml-2 text-xs text-slate-500">{new Date(h.at).toLocaleString()}</span>{h.note && <p className="text-xs text-slate-500">{h.note}</p>}</li>)}</ol>
            {!current.stageHistory?.length && <p className="text-sm text-slate-500">No recorded transitions for this legacy application.</p>}
          </section>
        </div>}
      </aside>
    </div>}
  </div></RecruiterLayout>;
}
