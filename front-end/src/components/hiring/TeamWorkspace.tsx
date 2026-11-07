"use client";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useGetTeamQuery, useInviteTeamMemberMutation, useManageTeamMemberMutation,
  useRequestCompanyVerificationMutation, type TeamRole } from "@/src/redux/features/hiring/hiringApi";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { UserPlus, ShieldCheck, Users, Building2 } from "lucide-react";

const field = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
const button = "inline-flex min-h-10 items-center justify-center rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#254e70] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50";
export default function TeamWorkspace() {
  const { data, isLoading, isError, refetch } = useGetTeamQuery();
  const [invite, { isLoading: inviting }] = useInviteTeamMemberMutation();
  const [manage, { isLoading: managing }] = useManageTeamMemberMutation();
  const [verify, { isLoading: requesting }] = useRequestCompanyVerificationMutation();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<TeamRole,"owner">>("recruiter");
  const current = data?.data.workspace;
  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try { await invite({ email: email.trim(), role }).unwrap(); setEmail(""); toast.success("Invitation created. The recipient can accept it after signing in."); }
    catch (error: any) { toast.error(error?.data?.message || "Unable to invite teammate"); }
  };
  const change = async (id: string, action: "accept" | "remove" | "role", nextRole?: Exclude<TeamRole,"owner">) => {
    try { await manage({ id, action, ...(nextRole ? { role: nextRole } : {}) }).unwrap(); toast.success("Team updated"); }
    catch (error: any) { toast.error(error?.data?.message || "Unable to update membership"); }
  };
  return <RecruiterLayout><div className="mx-auto max-w-6xl space-y-6 pb-12">
    <header className="space-y-2"><p className="text-xs font-bold uppercase tracking-widest text-[#456882]">Company workspace</p>
      <h1 className="text-3xl font-semibold tracking-tight text-[#163B5C]">Team and permissions</h1>
      <p className="text-sm text-slate-600">Collaborate on hiring while keeping access scoped to one company.</p></header>
    {isLoading && <div className="h-52 animate-pulse rounded-xl bg-slate-100" aria-label="Loading team" />}
    {isError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm">Could not load your team. <button className="underline" onClick={() => refetch()}>Retry</button></div>}
    {!!data?.data.invitations.length && <section className="rounded-xl border border-[#d9e3ea] bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold text-[#163B5C]">Your invitations</h2>
      <div className="space-y-3">{data.data.invitations.map(member => <div key={member._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-3">
        <span className="text-sm text-slate-700">{typeof member.companyId === "object" ? member.companyId.companyName : "Company"} · {member.role}</span>
        <button disabled={managing} className={button} onClick={() => change(member._id, "accept")}>Accept invitation</button>
      </div>)}</div>
    </section>}
    {!current && !isLoading && !isError && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <Building2 className="mx-auto mb-3 text-[#456882]" /><h2 className="font-semibold">No company membership yet</h2>
      <p className="my-3 text-sm text-slate-500">Create a company profile or accept an invitation to join a hiring team.</p>
      <Link href="/recruiter/company" className="text-sm font-semibold text-[#135FC4] underline">Set up company</Link>
    </div>}
    {current && <>
      <div className="grid gap-4 md:grid-cols-3"><div className="rounded-xl border border-[#d9e3ea] bg-white p-5 md:col-span-2">
        <div className="flex items-center gap-2"><Users size={19} className="text-[#163B5C]" /><h2 className="font-semibold text-[#163B5C]">{current.company.companyName || "Company team"}</h2></div>
        <p className="mt-1 text-sm text-slate-600">Your access: <strong className="capitalize">{current.teamRole}</strong> · {current.members.length + 1} team accounts including owner</p>
        <p className="mt-3 text-xs text-slate-500">Owners and admins manage company settings; recruiters manage jobs and applicants; interviewers only access assigned interviews.</p>
      </div><div className="rounded-xl border border-[#d9e3ea] bg-white p-5">
        <div className="flex items-center gap-2"><ShieldCheck size={19} className="text-[#163B5C]" /><h2 className="font-semibold text-[#163B5C]">Employer verification</h2></div>
        <p className="mt-2 text-sm capitalize text-slate-600">Status: {current.company.verification?.status || "unverified"}</p>
        {(["owner","admin"].includes(current.teamRole) && current.company.verification?.status !== "verified") &&
          <button className={`${button} mt-3`} disabled={requesting || current.company.verification?.status === "pending"} onClick={async () => {
            try { await verify().unwrap(); toast.success("Verification request submitted for administrative review"); }
            catch (error: any) { toast.error(error?.data?.message || "Complete company details before requesting verification"); }
          }}>Request review</button>}
      </div></div>
      {["owner", "admin"].includes(current.teamRole) && <form onSubmit={handleInvite} className="rounded-xl border border-[#d9e3ea] bg-white p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-[#163B5C]"><UserPlus size={19} /> Invite a teammate</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]"><label className="text-sm font-medium">Email address<input required type="email" className={`${field} mt-1`} value={email} onChange={e => setEmail(e.target.value)} placeholder="recruiter@company.com" /></label>
          <label className="text-sm font-medium">Company role<select className={`${field} mt-1`} value={role} onChange={e => setRole(e.target.value as Exclude<TeamRole,"owner">)}>
            <option value="recruiter">Recruiter</option><option value="interviewer">Interviewer</option>{current.teamRole === "owner" && <option value="admin">Admin</option>}
          </select></label><button disabled={inviting} className={`${button} self-end`}>Send invite</button></div>
      </form>}
      <section className="overflow-x-auto rounded-xl border border-[#d9e3ea] bg-white"><h2 className="p-5 text-lg font-semibold text-[#163B5C]">Members and outstanding invitations</h2>
        <table className="w-full min-w-[580px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Access</th><th className="px-5 py-3 text-right">Action</th></tr></thead>
          <tbody>{current.members.map(member => <tr key={member._id} className="border-t border-slate-100"><td className="px-5 py-4">{member.email}</td>
            <td className="px-5 py-4 capitalize">{member.role}</td><td className="px-5 py-4 capitalize">{member.status}</td>
            <td className="px-5 py-4 text-right">{["owner","admin"].includes(current.teamRole) && (current.teamRole === "owner" || member.role !== "admin") &&
              <div className="flex justify-end gap-2"><select aria-label={`Role for ${member.email}`} className="rounded border border-slate-300 px-2" value={member.role} disabled={managing}
                onChange={event => change(member._id,"role",event.target.value as Exclude<TeamRole,"owner">)}>
                <option value="recruiter">Recruiter</option><option value="interviewer">Interviewer</option>{current.teamRole === "owner" && <option value="admin">Admin</option>}</select>
                <button className="rounded border border-red-200 px-3 py-1 text-red-700 hover:bg-red-50" disabled={managing} onClick={() => { if (confirm(`Remove ${member.email} from the team?`)) void change(member._id,"remove"); }}>Remove</button></div>}</td></tr>)}</tbody></table>
        {!current.members.length && <p className="px-5 py-7 text-sm text-slate-500">No teammates yet. Invite your first collaborator above.</p>}
      </section>
    </>}
  </div></RecruiterLayout>;
}
