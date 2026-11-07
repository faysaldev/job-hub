"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { useGetCompanyQuery, useUpdateCompanyMutation } from "@/src/redux/features/company/companyApi";
import { useGetTeamQuery, type CompanyWorkspace } from "@/src/redux/features/hiring/hiringApi";
const field = "mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
export default function CareersSettings() {
  const {data, isLoading, isError, refetch} = useGetCompanyQuery();
  const [update,{isLoading:saving}] = useUpdateCompanyMutation();
  const { data: teamInfo } = useGetTeamQuery();
  const canEdit = ["owner", "admin"].includes(teamInfo?.data.workspace?.teamRole || "");
  const company = data?.data as (CompanyWorkspace|undefined);
  const [values,setValues] = useState({careersSlug:"",careersHeadline:"",careersDescription:"",careersEnabled:true});
  useEffect(()=>{ if(company) setValues({careersSlug:company.careersSlug||"",careersHeadline:company.careersHeadline||"",careersDescription:company.careersDescription||"",careersEnabled:company.careersEnabled!==false}); },[company]);
  return <RecruiterLayout><div className="mx-auto max-w-3xl space-y-6 pb-12"><header>
    <p className="text-xs font-bold uppercase tracking-widest text-[#456882]">Company branding</p>
    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#163B5C]">Your careers page</h1>
    <p className="mt-2 text-sm text-slate-600">A public page for your company’s published vacancies, with its own address and introduction.</p></header>
    {isLoading && <div className="h-40 animate-pulse rounded-xl bg-slate-100" aria-label="Loading careers settings" />}
    {isError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Company profile unavailable. <Link href="/recruiter/company" className="underline">Create it first</Link> or <button className="underline" onClick={()=>refetch()}>retry</button>.</p>}
    {!!company && !canEdit && <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">Only your company owner or an admin can edit careers branding. {company.careersSlug && <Link href={`/careers/${company.careersSlug}`} className="font-semibold text-blue-700 underline">View the public page</Link>}</p>}
    {!!company && canEdit && <form onSubmit={async e=>{e.preventDefault();try{await update(values).unwrap();toast.success("Careers page updated");}catch(error:any){toast.error(error?.data?.message||"Could not save careers page");}}}
      className="space-y-5 rounded-xl border border-[#d9e3ea] bg-white p-6">
      <label className="block text-sm font-semibold text-slate-700">Public URL slug<input className={field} required minLength={3} maxLength={60} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={values.careersSlug} onChange={e=>setValues({...values,careersSlug:e.target.value.toLowerCase()})}/>
        <span className="mt-2 block text-xs font-normal text-slate-500">Lowercase letters, numbers and hyphens only. Changing this address also changes your public careers link.</span></label>
      <label className="block text-sm font-semibold text-slate-700">Page headline<input className={field} maxLength={140} value={values.careersHeadline} onChange={e=>setValues({...values,careersHeadline:e.target.value})} placeholder="Join our team" /></label>
      <label className="block text-sm font-semibold text-slate-700">Company introduction<textarea className={`${field} min-h-32 py-3`} maxLength={3000} value={values.careersDescription} onChange={e=>setValues({...values,careersDescription:e.target.value})} placeholder="What makes your team and work meaningful?" /></label>
      <label className="flex items-center gap-3 text-sm text-slate-700"><input className="h-4 w-4 accent-[#163B5C]" type="checkbox" checked={values.careersEnabled} onChange={e=>setValues({...values,careersEnabled:e.target.checked})}/> Show careers page publicly</label>
      <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5"><button disabled={saving} className="rounded-lg bg-[#163B5C] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Save careers page</button>
        {values.careersSlug && <Link className="text-sm font-semibold text-[#135FC4] underline" href={`/careers/${values.careersSlug}`} target="_blank" rel="noopener noreferrer">View public page</Link>}</div>
    </form>}
  </div></RecruiterLayout>;
}
