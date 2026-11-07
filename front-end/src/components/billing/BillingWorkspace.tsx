"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check, CreditCard, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import RecruiterLayout from "@/src/components/Recruiter/RecruiterLayout";
import { usePublicPlansQuery, useBillingDashboardQuery, useBillingActionMutation } from "@/src/redux/features/billing/billingApi";
const primary = "rounded-lg bg-[#163B5C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#294e6d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
const secondary = "rounded-lg border border-[#cdd9e2] bg-white px-4 py-2.5 text-sm font-semibold text-[#163B5C] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50";
const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents/100);
export default function BillingWorkspace() {
  const search = useSearchParams();
  const [busy, setBusy] = useState("");
  const { data: plansData, isLoading: plansLoading, isError: plansError, refetch: refetchPlans } = usePublicPlansQuery();
  const { data, isLoading, isError, refetch } = useBillingDashboardQuery();
  const [act] = useBillingActionMutation();
  const profile = data?.data;
  const owner = profile?.teamRole === "owner";
  const execute = async (action: { action: "checkout"; planKey: string } | { action: "portal" }) => {
    setBusy(action.action === "checkout" ? action.planKey : "portal");
    try {
      const result = await act(action).unwrap();
      const destination = result.data.checkoutUrl || result.data.portalUrl;
      if (!destination) throw new Error("No secure redirect was returned");
      // Redirect to Stripe-hosted checkout/portal. Returning does not grant access.
      window.location.assign(destination);
    } catch (error: any) { toast.error(error?.data?.message || error?.message || "Unable to start billing"); setBusy(""); }
  };
  return <RecruiterLayout><div className="mx-auto max-w-6xl space-y-7 pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[.17em] text-[#516C83]">Recruiting workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#163B5C]">Plans & billing</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">Manage active job capacity, team seats, sponsored placements and invoices.</p></div>
      <button className={secondary} onClick={() => { refetch(); refetchPlans(); }} type="button"><RefreshCw className="mr-2 inline h-4 w-4"/>Refresh status</button>
    </header>
    {(search.get("checkout") === "returned" || search.get("promotion") === "returned") &&
      <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Checkout returned. Payment is being verified by the server. Benefits appear only after Stripe confirms payment—refresh your status to check.</p>}
    {(search.get("checkout") === "canceled" || search.get("promotion") === "canceled") &&
      <p role="status" className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Checkout was canceled. No paid benefits have been activated.</p>}
    {(isError || plansError) && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">Unable to load billing information. <button className="underline" onClick={() => { refetch(); refetchPlans(); }}>Retry</button></div>}
    {isLoading ? <div className="h-44 animate-pulse rounded-xl bg-slate-100" aria-label="Loading billing information"/> : profile && <section className="rounded-xl border border-[#d9e3ea] bg-white p-5 sm:p-6" aria-label="Current subscription">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current plan</p><h2 className="mt-1 text-2xl font-semibold text-[#163B5C]">{profile.plan.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{profile.subscription.paid ? `${profile.subscription.status} · paid until ${new Date(profile.subscription.paidThrough!).toLocaleDateString()}` : "Free plan · upgrades activate after verified payment"}{profile.subscription.cancelAtPeriodEnd && profile.subscription.paid ? " · Cancellation scheduled for period end" : ""}</p></div>
        {owner && profile.subscription.paid && <button disabled={!!busy} onClick={() => execute({ action: "portal" })} className={secondary}><CreditCard className="mr-2 inline h-4 w-4"/>{busy === "portal" ? "Opening…" : "Manage in Stripe"}</button>}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[{ label:"Active jobs", value:profile.usage.activeJobs, max:profile.usage.limits.activeJobs },
          { label:"Reserved team seats", value:profile.usage.teamSeats, max:profile.usage.limits.teamSeats },
          { label:"Available sponsor credits", value:profile.usage.creditBalance, max: null }].map(item =>
          <div key={item.label} className="rounded-lg border border-[#e1e8ef] bg-[#f8fafc] p-4"><p className="text-xs text-slate-600">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-[#163B5C]">{item.value}{item.max !== null && <span className="text-sm font-normal text-slate-500"> / {item.max}</span>}</p></div>)}
      </div>
      {!owner && <p className="mt-4 text-sm text-slate-600">Only the company owner can purchase plans, sponsor jobs or manage billing details.</p>}
    </section>}
    <section className="space-y-4" aria-labelledby="plan-heading"><div><h2 id="plan-heading" className="text-xl font-semibold text-[#163B5C]">Choose your plan</h2>
      <p className="mt-1 text-sm text-slate-600">Monthly prices in USD. All limits are enforced on the server.</p></div>
      {plansLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i=><div key={i} className="h-64 animate-pulse rounded-xl bg-slate-100"/>)}</div> :
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(plansData?.data.plans || []).map(plan => {
        const current = profile?.plan.key === plan.key && profile?.plan.version === plan.version;
        return <article key={`${plan.key}-${plan.version}`} className={`flex flex-col rounded-xl border bg-white p-5 ${current ? "border-[#163B5C] ring-1 ring-[#163B5C]/20" : "border-[#d9e3ea]"}`}>
          <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-[#163B5C]">{plan.name}</h3>{current && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">Current</span>}</div>
          <p className="mt-1 min-h-10 text-sm text-slate-600">{plan.description}</p>
          <p className="mt-3 text-3xl font-semibold text-[#163B5C]">{plan.enterprise ? "Custom" : money(plan.priceCents || 0)}{!plan.enterprise && <span className="ml-1 text-sm font-normal text-slate-500">/month</span>}</p>
          <div className="mt-5 space-y-2 text-sm text-slate-700">
            <p><Check className="mr-2 inline h-4 w-4 text-[#315f81]"/>{plan.limits.activeJobs} concurrent job postings</p>
            <p><Check className="mr-2 inline h-4 w-4 text-[#315f81]"/>{plan.limits.teamSeats} total seats</p>
            <p><Check className="mr-2 inline h-4 w-4 text-[#315f81]"/>{plan.limits.monthlyCredits} 7-day sponsor credits / paid month</p>
            {plan.features.map((item,i)=><p key={i}><Check className="mr-2 inline h-4 w-4 text-[#315f81]"/>{item}</p>)}
          </div>
          <div className="mt-auto pt-6">{plan.enterprise ? <p className="text-xs text-slate-600">Contact the platform administrator for an enterprise contract.</p> :
            current ? <span className="block rounded-lg bg-slate-100 px-4 py-2.5 text-center text-sm text-slate-600">Your current plan</span> :
            plan.priceCents === 0 ? <span className="block rounded-lg bg-slate-100 px-4 py-2.5 text-center text-sm text-slate-600">Included by default</span> :
            <button className={`${primary} w-full`} disabled={!owner || !!busy || !profile || profile.subscription.paid} onClick={() => execute({ action: "checkout", planKey: plan.key })}>
              {busy === plan.key ? "Opening checkout…" : profile?.subscription.paid ? "Manage current plan first" : `Choose ${plan.name}`}
            </button>}
          </div>
        </article>;
      })}</div>}
    </section>
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-[#d9e3ea] bg-white p-5"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#315f81]"/><h2 className="font-semibold text-[#163B5C]">Billing history</h2></div>
        <p className="mt-1 text-xs text-slate-500">Verified invoices, most recent first.</p>
        <div className="mt-4 space-y-3">{profile?.invoices.length ? profile.invoices.map(row => <div key={row._id} className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
          <div><p className="font-medium text-[#163B5C]">{row.planKey} v{row.planVersion} · {money(row.amountPaidCents)}</p><p className="text-xs text-slate-500">{new Date(row.paidAt).toLocaleDateString()}</p></div>
          {row.invoiceUrl?.startsWith("https://") && <a href={row.invoiceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 hover:underline">Invoice <ArrowUpRight className="inline h-4 w-4"/></a>}
        </div>) : <p className="text-sm text-slate-500">No paid invoices yet.</p>}</div>
      </div>
      <div className="rounded-xl border border-[#d9e3ea] bg-white p-5"><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#315f81]"/><h2 className="font-semibold text-[#163B5C]">Sponsored hiring</h2></div>
        <p className="mt-2 text-sm text-slate-600">Promote published jobs from <Link href="/recruiter/jobs" className="font-medium text-blue-700 underline">Job listings</Link>. Every sponsored result is labeled. A credit covers 7 days; paid options are $15 for 7 days or $39 for 30 days.</p>
        <div className="mt-4 space-y-3">{profile?.promotions.length ? profile.promotions.slice(0,6).map(promo => <div key={promo._id} className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
          <p className="text-slate-700">{promo.durationDays} days · {promo.source}</p><span className="text-xs capitalize text-slate-600">{promo.status}{promo.endsAt ? ` · ${new Date(promo.endsAt).toLocaleDateString()}` : ""}</span>
        </div>) : <p className="text-sm text-slate-500">No sponsorships purchased yet.</p>}</div>
      </div>
    </section>
  </div></RecruiterLayout>;
}
