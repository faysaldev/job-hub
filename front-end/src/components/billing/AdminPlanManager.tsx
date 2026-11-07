"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Layers, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { useAppSelector } from "@/src/redux/hooks";
import { useAdminPlansQuery, useCreateBillingPlanMutation, useManageBillingPlanMutation, type BillingPlan } from "@/src/redux/features/billing/billingApi";

const button = "rounded-lg border border-[#cdd9e2] bg-white px-3 py-2 text-sm font-medium text-[#163B5C] hover:bg-slate-50 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
const primary = "rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#315c7b] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
const input = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-blue-700";
const blank: BillingPlan = { key: "", name: "", description: "", priceCents: 0, currency: "usd", version: 1,
  enterprise: false, features: [], published: false, isCurrent: false, limits: { activeJobs: 5, teamSeats: 1, monthlyCredits: 0 } };
const money = (value: number | null) => value === null ? "Custom" : `$${(value/100).toFixed(2)}`;
export default function AdminPlanManager() {
  const { user, logout } = useAuth();
  const rehydrated = useAppSelector(s => s.auth._persist?.rehydrated ?? false);
  const router = useRouter();
  const allowed = rehydrated && user?.role === "admin";
  const { data, isLoading, isError, refetch } = useAdminPlansQuery(undefined, { skip: !allowed });
  const [createPlan, { isLoading: creating }] = useCreateBillingPlanMutation();
  const [manage, { isLoading: saving }] = useManageBillingPlanMutation();
  const [editing, setEditing] = useState<BillingPlan | null>(null);
  const [draft, setDraft] = useState<BillingPlan>({ ...blank, limits: { ...blank.limits } });
  const [features, setFeatures] = useState("");
  const [copyKey, setCopyKey] = useState("");
  const [copyName, setCopyName] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  useEffect(() => { if (rehydrated && !user) router.replace("/auth"); }, [rehydrated, user, router]);
  const open = (plan?: BillingPlan) => {
    setEditing(plan || null); const value = plan ? { ...plan, limits: { ...plan.limits }, features: [...plan.features] } : { ...blank, limits: { ...blank.limits } };
    setDraft(value); setFeatures(value.features.join("\n")); setShowEditor(true);
  };
  const change = (name: keyof BillingPlan, value: any) => setDraft(p => ({ ...p, [name]: value }));
  const commit = async (e: FormEvent) => { e.preventDefault();
    try {
      const payload = { key: draft.key.trim().toLowerCase(), name: draft.name.trim(), description: draft.description.trim(),
        priceCents: draft.enterprise ? null : draft.priceCents, enterprise: !!draft.enterprise,
        limits: draft.limits, features: features.split("\n").map(x=>x.trim()).filter(Boolean).slice(0,20) };
      if (editing?._id) await manage({ id: editing._id, body: { action: "edit", changes: {
        name: payload.name, description: payload.description, priceCents: payload.priceCents,
        enterprise: payload.enterprise, limits: payload.limits, features: payload.features,
      } } }).unwrap();
      else await createPlan(payload).unwrap();
      toast.success(editing ? "Plan saved as a draft version. Publish it when ready." : "Unpublished plan created.");
      setShowEditor(false);
    } catch (error: any) { toast.error(error?.data?.message || "Could not save plan"); }
  };
  const run = async (plan: BillingPlan, action: "publish"|"hide"|"duplicate") => {
    if (!plan._id) return;
    if (action === "duplicate" && (!/^[a-z][a-z0-9-]{1,39}$/.test(copyKey) || !copyName.trim())) {
      toast.error("Enter a valid new key and name for the duplicate"); return;
    }
    if (action !== "duplicate" && !window.confirm(`${action === "publish" ? "Publish" : "Hide"} ${plan.name} v${plan.version}?`)) return;
    try {
      await manage({ id: plan._id, body: action === "duplicate" ?
        { action, newKey: copyKey.trim(), newName: copyName.trim() } : { action } }).unwrap();
      toast.success(action === "publish" ? "Plan is now public" : action === "hide" ? "Plan hidden from new purchases" : "Duplicate draft created");
      if (action === "duplicate") { setCopyKey(""); setCopyName(""); }
    } catch (error: any) { toast.error(error?.data?.message || "Could not update plan"); }
  };
  if (!rehydrated) return <div className="min-h-screen bg-[#f6f8fb] p-10" role="status">Loading account permissions…</div>;
  if (!allowed) return <main className="mx-auto max-w-xl p-10"><h1 className="text-xl font-semibold">Admin access required</h1><p className="mt-3 text-sm text-slate-600">Only platform administrators can manage plans.</p><Link className="mt-4 inline-block text-blue-700 underline" href="/">Back to JobHub</Link></main>;
  const plans = data?.data.plans || [];
  return <div className="min-h-screen bg-[#f6f8fb] text-slate-800"><header className="border-b border-[#d9e3ea] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[#163B5C]"><Layers size={20}/>JobHub <span className="text-sm font-normal text-slate-500">/ Platform admin</span></Link>
    <button onClick={logout} className={button}>Sign out</button></div></header>
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-9">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#516C83]">Subscription catalog</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#163B5C]">Plan management</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">Versioned limits and USD pricing. Publishing a new version does not change paid customers' existing entitlements.</p></div>
        <div className="flex gap-2"><button onClick={()=>refetch()} className={button}><RefreshCw className="mr-1 inline h-4 w-4"/>Refresh</button>
          <button onClick={()=>open()} className={primary}><Plus className="mr-1 inline h-4 w-4"/>Create plan</button></div></div>
      {isError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load plans. Retry when the API is available.</p>}
      {isLoading ? <div className="h-44 animate-pulse rounded-xl bg-white" aria-label="Loading plans"/> :
        <section className="overflow-x-auto rounded-xl border border-[#d9e3ea] bg-white" aria-label="Plan versions">
          <table className="w-full min-w-[840px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-600"><tr>
            <th className="px-4 py-3">Plan</th><th className="px-4 py-3">Version</th><th className="px-4 py-3">Price/mo</th>
            <th className="px-4 py-3">Jobs / seats / credits</th><th className="px-4 py-3">Visibility</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>
            {plans.map(p => <tr key={p._id} className="border-t border-slate-100"><td className="px-4 py-4"><p className="font-semibold text-[#163B5C]">{p.name}</p><p className="text-xs text-slate-500">{p.key}</p></td>
              <td className="px-4 py-4">v{p.version}</td><td className="px-4 py-4">{money(p.priceCents)}</td>
              <td className="px-4 py-4">{p.limits.activeJobs} / {p.limits.teamSeats} / {p.limits.monthlyCredits}</td>
              <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.published&&p.isCurrent ? "bg-green-50 text-green-800" : "bg-slate-100 text-slate-600"}`}>{p.published&&p.isCurrent ? "Published" : p.isCurrent ? "Hidden" : "Draft / archived"}</span></td>
              <td className="px-4 py-4"><div className="flex justify-end gap-2">{p._id && <><button onClick={()=>open(p)} className={button}>Edit</button>
                {(!p.isCurrent || !p.published) && <button disabled={saving} onClick={()=>run(p,"publish")} className={button}>Publish</button>}
                {p.isCurrent && p.published && p.key !== "free" && <button disabled={saving} onClick={()=>run(p,"hide")} className={button}>Hide</button>}
                <button disabled={saving} onClick={()=>{setEditing(p);setShowEditor(false);setCopyKey("");setCopyName("");}} className={button}>Duplicate</button></>}</div></td></tr>)}
            {!plans.length && <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">No catalog plans. Run the Phase 5 plan seed to initialize Free, Starter, Growth, Business and Enterprise.</td></tr>}
          </tbody></table></section>}
      {editing && !showEditor && <section className="max-w-xl rounded-xl border border-[#d9e3ea] bg-white p-5" aria-label="Duplicate plan">
        <h2 className="text-lg font-semibold text-[#163B5C]">Duplicate {editing.name}</h2><p className="mt-1 text-sm text-slate-600">Create a new unpublished plan with a unique key.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row"><input className={input} aria-label="New plan key" placeholder="new-plan-key" value={copyKey} onChange={e=>setCopyKey(e.target.value)}/>
          <input className={input} aria-label="New plan name" placeholder="New plan name" value={copyName} onChange={e=>setCopyName(e.target.value)}/></div>
        <div className="mt-4 flex gap-2"><button className={primary} disabled={saving} onClick={()=>run(editing,"duplicate")}>Create duplicate</button><button className={button} onClick={()=>setEditing(null)}>Cancel</button></div>
      </section>}
      {showEditor && <section className="max-w-3xl rounded-xl border border-[#d9e3ea] bg-white p-6" aria-labelledby="plan-form-title">
        <div className="flex items-start justify-between"><div><h2 id="plan-form-title" className="text-xl font-semibold text-[#163B5C]">{editing ? `Edit ${editing.name}` : "New plan"}</h2>
          <p className="mt-1 text-sm text-slate-600">Published plans are versioned automatically; the new version starts unpublished.</p></div>
          <button className={button} type="button" onClick={()=>{setEditing(null);setShowEditor(false);}}>Close</button></div>
        <form onSubmit={commit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Plan key<input className={input} disabled={!!editing} value={draft.key} onChange={e=>change("key",e.target.value)} required maxLength={40} pattern="[a-z][a-z0-9-]{1,39}"/></label>
          <label className="text-sm font-medium">Name<input className={input} value={draft.name} onChange={e=>change("name",e.target.value)} required maxLength={80}/></label>
          <label className="sm:col-span-2 text-sm font-medium">Description<textarea className={input} rows={2} value={draft.description} onChange={e=>change("description",e.target.value)} maxLength={500}/></label>
          <label className="text-sm font-medium">Monthly price (USD cents)<input className={input} type="number" disabled={draft.enterprise} value={draft.priceCents ?? ""} onChange={e=>change("priceCents",Number(e.target.value))} min={0} max={10000000} required={!draft.enterprise}/></label>
          <label className="flex items-center gap-2 pt-7 text-sm"><input type="checkbox" checked={!!draft.enterprise} onChange={e=>change("enterprise",e.target.checked)}/>Enterprise / custom contract</label>
          {[{field:"activeJobs" as const,label:"Concurrent job limit",min:0},{field:"teamSeats" as const,label:"Total team seats",min:1},
            {field:"monthlyCredits" as const,label:"Promotion credits per paid month",min:0}].map(x=><label key={x.field} className="text-sm font-medium">{x.label}<input type="number" className={input} value={draft.limits[x.field]} min={x.min} max={x.field === "monthlyCredits" ? 10000 : 100000} required
              onChange={e=>setDraft(p=>({...p,limits:{...p.limits,[x.field]:Number(e.target.value)}}))}/></label>)}
          <label className="sm:col-span-2 text-sm font-medium">Features (one per line)<textarea className={input} rows={3} value={features} onChange={e=>setFeatures(e.target.value)} maxLength={3000}/></label>
          <div className="sm:col-span-2 flex gap-2"><button className={primary} disabled={saving||creating} type="submit">{saving||creating ? "Saving…" : "Save unpublished version"}</button></div>
        </form>
      </section>}
      <p className="text-xs text-slate-500">The platform requires a MongoDB replica set for atomic publish, quota and billing operations. Verify Stripe live/test mode before publishing pricing.</p>
    </main></div>;
}
