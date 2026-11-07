"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import WorkspaceShell from "@/src/components/layout/WorkspaceShell";
import { useCreateSeekerProfileMutation, useGetSeekerProfileQuery, useUpdateSeekerProfileMutation } from "@/src/redux/features/seeker/seekerApi";
import { Shield } from "lucide-react";

type Privacy = { profileVisibility: "private"|"public"; searchable: boolean; allowContact: boolean };
export default function CandidatePrivacy() {
  const {data, isLoading, isError, error, refetch} = useGetSeekerProfileQuery();
  const [update,{isLoading:saving}] = useUpdateSeekerProfileMutation();
  const [create] = useCreateSeekerProfileMutation();
  const profile = (data as unknown as {data?: {privacy?: Partial<Privacy>}})?.data;
  const [privacy,setPrivacy] = useState<Privacy>({profileVisibility:"private",searchable:false,allowContact:false});
  useEffect(()=>{if(profile?.privacy) setPrivacy({profileVisibility:profile.privacy.profileVisibility||"private",searchable:!!profile.privacy.searchable,allowContact:!!profile.privacy.allowContact});},[profile]);
  const notFound = (error as {status?:number})?.status===404;
  const save = async (e:React.FormEvent)=>{e.preventDefault();try {
    if (notFound) await create({privacy} as any).unwrap(); else await update({privacy} as any).unwrap();
    toast.success("Your privacy preferences are saved");
  }catch(err:any){toast.error(err?.data?.message||"Could not save privacy preferences");}};
  return <WorkspaceShell role="seeker"><div className="mx-auto max-w-3xl space-y-6 pb-12"><header>
    <p className="text-xs font-bold uppercase tracking-widest text-[#456882]">Your account</p>
    <h1 className="mt-1 text-3xl font-semibold text-[#163B5C]">Candidate privacy</h1>
    <p className="mt-2 text-sm text-slate-600">You control whether recruiters can discover your public profile. Your resume always stays private unless shared through a job application.</p></header>
    {isLoading && <div className="h-28 animate-pulse rounded-xl bg-slate-100" aria-label="Loading privacy"/>}
    {isError && !notFound && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm">Unable to load your profile. <button className="underline" onClick={()=>refetch()}>Retry</button></div>}
    {(!isLoading && (!isError || notFound)) && <form className="space-y-6 rounded-xl border border-[#d9e3ea] bg-white p-6" onSubmit={save}>
      <div className="flex items-start gap-3"><Shield size={22} className="mt-1 shrink-0 text-[#163B5C]"/><div><h2 className="font-semibold text-[#163B5C]">Profile visibility</h2>
        <p className="mt-1 text-sm text-slate-600">Private profiles do not appear in recruiter search results or public candidate pages.</p></div></div>
      <fieldset className="space-y-3"><legend className="sr-only">Profile visibility</legend>
        {(["private","public"] as const).map(value=><label key={value} className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 text-sm">
          <input type="radio" name="visibility" className="mt-1 accent-[#163B5C]" checked={privacy.profileVisibility===value} onChange={()=>setPrivacy({...privacy,profileVisibility:value,searchable:value==="public"?privacy.searchable:false})}/>
          <span><strong className="block capitalize text-[#163B5C]">{value}</strong><span className="text-slate-500">{value==="private"?"Only you and recruiters reviewing applications you submitted can see relevant application details.":"Your professional profile may be visible publicly, without email, phone or resume."}</span></span>
        </label>)}</fieldset>
      <label className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5 text-sm"><span><strong className="block text-[#163B5C]">Appear in recruiter talent search</strong><span className="text-slate-500">Requires public profile visibility.</span></span>
        <input type="checkbox" className="h-5 w-5 shrink-0 accent-[#163B5C]" disabled={privacy.profileVisibility!=="public"} checked={privacy.searchable && privacy.profileVisibility==="public"} onChange={e=>setPrivacy({...privacy,searchable:e.target.checked})}/></label>
      <label className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5 text-sm"><span><strong className="block text-[#163B5C]">Allow recruiter contact requests</strong><span className="text-slate-500">Does not expose your personal email or phone number.</span></span>
        <input type="checkbox" className="h-5 w-5 shrink-0 accent-[#163B5C]" checked={privacy.allowContact} onChange={e=>setPrivacy({...privacy,allowContact:e.target.checked})}/></label>
      <button disabled={saving} className="rounded-lg bg-[#163B5C] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Save privacy preferences</button>
    </form>}
  </div></WorkspaceShell>;
}
