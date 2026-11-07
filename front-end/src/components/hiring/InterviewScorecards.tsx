"use client";
import { useState } from "react";
import { useGetMyInterviewsQuery, useSaveInterviewScorecardMutation } from "@/src/redux/features/interviews/interviewsApi";
import { toast } from "sonner";
import { ClipboardCheck } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
type ScoredInterview = { _id: string; status: string; date: string; interviewer?: string | { _id: string }; job_id?: {title?:string}; interviewee?: {name?:string}; scorecard?: {overall:number;recommendation:string} };
export default function InterviewScorecards() {
  const { user } = useAuth();
  const {data,isLoading,isError,refetch} = useGetMyInterviewsQuery({role:"interviewer"});
  const [submit,{isLoading:saving}] = useSaveInterviewScorecardMutation();
  const [selected,setSelected] = useState(""); const [overall,setOverall] = useState(3);
  const [recommendation,setRecommendation] = useState<"strong_yes"|"yes"|"no"|"strong_no">("yes"); const [feedback,setFeedback] = useState("");
  const interviews=((data||[]) as unknown as ScoredInterview[]).filter(item=>
    (typeof item.interviewer === "object" ? item.interviewer?._id : item.interviewer) === user?._id);
  return <section className="rounded-xl border border-[#d9e3ea] bg-white p-5"><h2 className="mb-2 flex items-center gap-2 font-semibold text-[#163B5C]"><ClipboardCheck size={19}/> Interview scorecards</h2>
    <p className="mb-4 text-sm text-slate-500">Score only interviews assigned to you. Feedback is private to authorized hiring team members.</p>
    {isLoading && <div className="h-20 animate-pulse rounded-lg bg-slate-100"/>}
    {isError && <p role="alert" className="text-sm text-red-700">Cannot load interviews. <button className="underline" onClick={()=>refetch()}>Retry</button></p>}
    {!isLoading && !isError && <div className="grid gap-4 lg:grid-cols-2"><div className="max-h-72 divide-y divide-slate-100 overflow-auto">
      {interviews.filter(i=>i.status!=="cancelled").map(item=><button key={item._id} onClick={()=>setSelected(item._id)} aria-pressed={selected===item._id}
        className={`w-full p-3 text-left text-sm hover:bg-slate-50 ${selected===item._id?"bg-blue-50":""}`}>
        <span className="block font-semibold text-[#163B5C]">{item.interviewee?.name||"Candidate"} · {item.job_id?.title||"Interview"}</span>
        <span className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()} · {item.scorecard?`Rated ${item.scorecard.overall}/5`:"Not scored"}</span></button>)}
      {!interviews.length && <p className="p-4 text-sm text-slate-500">No assigned interviews yet.</p>}
    </div><form onSubmit={async e=>{e.preventDefault();if(!selected)return;try{await submit({interviewId:selected,overall,recommendation,criteria:[],feedback}).unwrap();toast.success("Scorecard saved");}catch(error:any){toast.error(error?.data?.message||"Unable to save scorecard");}}} className="space-y-3">
      <label className="block text-sm">Overall rating (1–5)<select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={overall} onChange={e=>setOverall(Number(e.target.value))}>{[1,2,3,4,5].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
      <label className="block text-sm">Recommendation<select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={recommendation} onChange={e=>setRecommendation(e.target.value as typeof recommendation)}>
        <option value="strong_yes">Strong yes</option><option value="yes">Yes</option><option value="no">No</option><option value="strong_no">Strong no</option></select></label>
      <label className="block text-sm">Job-related interview feedback<textarea maxLength={3000} className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 p-3" value={feedback} onChange={e=>setFeedback(e.target.value)}/></label>
      <button className="rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={!selected||saving}>Save scorecard</button>
    </form></div>}
  </section>;
}
