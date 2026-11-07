"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, CreditCard, FileClock, FileWarning,
  LayoutDashboard, LifeBuoy, Loader2, RefreshCw, Search, ShieldCheck, Users, X, BriefcaseBusiness, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { useAppSelector } from "@/src/redux/hooks";
import { useOperationsOverviewQuery, useOperationsRecordsQuery, useOperationsActionMutation,
  type RecordKind, type OpsRecord, type OpsAction } from "@/src/redux/features/operations/operationsApi";

const nav: { kind: RecordKind | "overview"; label: string; icon: typeof LayoutDashboard }[] = [
  { kind: "overview", label: "Overview", icon: LayoutDashboard },
  { kind: "companies", label: "Companies", icon: Building2 },
  { kind: "jobs", label: "Job moderation", icon: BriefcaseBusiness },
  { kind: "users", label: "Accounts", icon: Users },
  { kind: "reports", label: "Abuse reports", icon: FileWarning },
  { kind: "support", label: "Support", icon: LifeBuoy },
  { kind: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { kind: "invoices", label: "Invoices", icon: CreditCard },
  { kind: "stripe-events", label: "Stripe events", icon: AlertTriangle },
  { kind: "audit", label: "Audit trail", icon: FileClock },
];
const options: Partial<Record<RecordKind, string[]>> = {
  companies: ["unverified", "pending", "verified", "rejected"],
  jobs: ["draft", "scheduled", "published", "closed", "blocked"],
  users: ["seeker", "recruiter", "admin", "suspended"],
  reports: ["open", "reviewing", "resolved", "dismissed"],
  support: ["open", "in_progress", "resolved"],
  subscriptions: ["active", "past_due", "unpaid", "canceled", "trialing", "incomplete"],
  "stripe-events": ["processing", "processed", "failed"],
};
const actions: Partial<Record<RecordKind, { value: string; label: string }[]>> = {
  companies: [{ value: "verified", label: "Verify company" }, { value: "rejected", label: "Reject verification" }],
  jobs: [{ value: "blocked", label: "Block listing" }, { value: "restored", label: "Restore listing" }],
  users: [{ value: "suspend", label: "Suspend account" }, { value: "restore", label: "Restore account" }],
  reports: [{ value: "reviewing", label: "Mark reviewing" }, { value: "resolved", label: "Resolve report" },
    { value: "dismissed", label: "Dismiss report" }],
  support: [{ value: "in_progress", label: "Mark in progress" }, { value: "resolved", label: "Resolve request" },
    { value: "open", label: "Reopen request" }],
  invoices: [{ value: "reconcile", label: "Compare against Stripe" }],
  "stripe-events": [{ value: "retry", label: "Retry failed Stripe event" }],
};
const btn = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d6e0ea] bg-white px-3 py-2 text-sm font-medium text-[#163B5C] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50";
const blue = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2c5879] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50";
const field = "w-full rounded-lg border border-[#cbd7e2] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-700";
const readable = (v: unknown) => typeof v === "string" ? v.replaceAll("_", " ") : "—";
const fmtDate = (v: unknown) => typeof v === "string" && !Number.isNaN(Date.parse(v)) ?
  new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";
const nameOf = (kind: RecordKind, row: OpsRecord): string => {
  if (kind === "companies") return row.companyName || "Unnamed company";
  if (kind === "jobs") return row.title || "Untitled listing";
  if (kind === "users") return row.name || row.email || "User";
  if (kind === "reports") return `${readable(row.category)} · ${readable(row.targetKind)}`;
  if (kind === "support") return row.subject || "Support request";
  if (kind === "subscriptions") return (typeof row.companyId === "object" ? row.companyId?.companyName : undefined) || "Company subscription";
  if (kind === "invoices") return row.stripeInvoiceId || "Invoice";
  if (kind === "stripe-events") return row._id;
  return `${readable(row.action)} · ${readable(row.targetKind)}`;
};
const statusOf = (kind: RecordKind, row: OpsRecord) => {
  if (kind === "companies") return row.verification?.status || "unverified";
  if (kind === "jobs") return row.moderation?.status === "blocked" ? "blocked" : row.status || "published";
  if (kind === "users") return row.suspendedAt ? "suspended" : row.role || "user";
  if (kind === "subscriptions") return row.stripeStatus || "unknown";
  if (kind === "invoices") return `${((row.amountPaidCents || 0)/100).toFixed(2)} ${row.currency || "USD"}`;
  return row.status || "—";
};
const secondaryOf = (kind: RecordKind, row: OpsRecord) => {
  if (kind === "companies") return row.website || "No website provided";
  if (kind === "jobs") return `Posted by ${row.author?.name || "Recruiter"}`;
  if (kind === "users") return row.email || "";
  if (kind === "reports") return row.description || "";
  if (kind === "support") return `${row.fullName || "Sender"} · ${row.email || ""}`;
  if (kind === "subscriptions") return row.snapshot?.name || "Plan not available";
  if (kind === "invoices") return (typeof row.companyId === "object" ? row.companyId?.companyName : "") || "Billing";
  if (kind === "stripe-events") return row.lastError || readable(row.status);
  return `${readable(row.targetId)} · ${readable(row.reason)}`;
};
function Stat({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof LayoutDashboard }) {
  return <div className="rounded-xl border border-[#dfe7ee] bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between"><span className="text-sm font-medium text-slate-600">{label}</span><Icon className="h-5 w-5 text-[#58748c]" aria-hidden="true" /></div>
    <p className="text-3xl font-semibold tabular-nums tracking-tight text-[#163B5C]">{value}</p>
  </div>;
}
function Trend({ rows }: { rows: { day: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map(r => r.count));
  return <section className="rounded-xl border border-[#dfe7ee] bg-white p-5 shadow-sm" aria-label="Applications in the last 30 days">
    <h2 className="font-semibold text-[#163B5C]">Application activity</h2>
    <p className="mb-5 mt-1 text-sm text-slate-500">Daily applications during the past 30 days</p>
    {!rows.length ? <p className="rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-500">No application activity in this period.</p> :
      <div className="flex h-44 items-end gap-1" role="img" aria-label={rows.map(r => `${r.day}: ${r.count}`).join("; ")}>
        {rows.map(r => <div key={r.day} className="min-w-1 flex-1 rounded-t-sm bg-[#517895]" style={{ height: `${Math.max(4, r.count / max * 100)}%` }} title={`${r.day}: ${r.count}`} />)}
      </div>}
  </section>;
}

export default function AdminOperationsCenter() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const rehydrated = useAppSelector(s => s.auth._persist?.rehydrated ?? false);
  const permitted = rehydrated && user?.role === "admin";
  const [tab, setTab] = useState<RecordKind | "overview">("overview");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<OpsRecord | null>(null);
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  useEffect(() => { if (rehydrated && !user) router.replace("/auth"); }, [rehydrated, user, router]);
  useEffect(() => { const timeout = setTimeout(() => { setDebounced(search); setPage(1); }, 320);
    return () => clearTimeout(timeout); }, [search]);
  const overview = useOperationsOverviewQuery(undefined, { skip: !permitted });
  const list = useOperationsRecordsQuery({ kind: tab === "overview" ? "companies" : tab, page,
    ...(debounced ? { search: debounced } : {}), ...(status ? { status } : {}) },
    { skip: !permitted || tab === "overview" });
  const [submit, { isLoading: saving }] = useOperationsActionMutation();
  const activeKind: RecordKind = tab === "overview" ? "companies" : tab;
  const optionsForKind = useMemo(() => actions[activeKind] || [], [activeKind]);
  const selectTab = (next: typeof tab) => { setTab(next); setPage(1); setStatus(""); setSearch("");
    setDebounced(""); setSelected(null); setResult(null); };
  const open = (row: OpsRecord) => { setSelected(row); setReason(""); setResult(null);
    const opts = actions[activeKind] || [];
    const current = statusOf(activeKind, row);
    setDecision(activeKind === "users" && current === "suspended" ? "restore" :
      activeKind === "jobs" && current === "blocked" ? "restored" : opts[0]?.value || ""); };
  const perform = async (e: FormEvent) => {
    e.preventDefault(); if (!selected) return;
    let payload: OpsAction;
    switch (activeKind) {
      case "companies": payload = { action: "verify-company", companyId: selected._id,
        decision: decision as "verified"|"rejected", reason }; break;
      case "jobs": payload = { action: "moderate-job", jobId: selected._id,
        decision: decision as "blocked"|"restored", reason }; break;
      case "users": payload = { action: "user-access", userId: selected._id,
        decision: decision as "suspend"|"restore", reason }; break;
      case "reports": payload = { action: "review-report", reportId: selected._id,
        decision: decision as "reviewing"|"resolved"|"dismissed", reason }; break;
      case "support": payload = { action: "support", contactId: selected._id,
        decision: decision as "open"|"in_progress"|"resolved", reason }; break;
      case "invoices": payload = { action: "reconcile-invoice", invoiceId: selected._id }; break;
      case "stripe-events": payload = { action: "retry-stripe-event", eventId: selected._id }; break;
      default: return;
    }
    if (["blocked", "suspend", "rejected"].includes(decision) && reason.trim().length < 5) {
      toast.error("Provide a reason of at least five characters."); return;
    }
    if (["blocked", "suspend", "rejected"].includes(decision) &&
      !window.confirm(`Confirm ${decision} for ${nameOf(activeKind, selected)}? This action is audited.`)) return;
    try {
      const response = await submit(payload).unwrap();
      setResult(response.data);
      toast.success(payload.action === "reconcile-invoice" ? "Stripe comparison complete" : "Action completed and recorded");
      if (payload.action !== "reconcile-invoice") setSelected(null);
    } catch (error: any) { toast.error(error?.data?.message || "Action failed. Refresh and retry."); }
  };
  if (!rehydrated) return <main className="flex min-h-screen items-center justify-center" role="status"><Loader2 className="mr-3 h-5 w-5 animate-spin" />Loading account permissions…</main>;
  if (!permitted) return <main className="mx-auto max-w-lg p-10"><h1 className="text-xl font-semibold">Platform administrator access required</h1>
    <p className="mt-3 text-sm text-slate-600">This workspace is available only to authorized JobHub staff.</p>
    <Link className="mt-4 inline-block text-blue-700 underline" href="/">Return to JobHub</Link></main>;
  const summary = overview.data?.data;
  return <div className="min-h-screen bg-[#f5f7fa] text-slate-800">
    <a href="#admin-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
    <header className="border-b border-[#dce5ec] bg-white"><div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-5 py-4">
      <Link href="/admin" className="flex items-center gap-3 font-semibold text-[#163B5C]"><ShieldCheck className="h-6 w-6"/>JobHub <span className="border-l border-slate-200 pl-3 text-sm font-normal text-slate-500">Platform operations</span></Link>
      <div className="flex flex-wrap items-center gap-3"><span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span>
        <Link href="/admin/plans" className={btn}>Manage plans</Link><button onClick={logout} className={btn}><LogOut className="h-4 w-4"/>Sign out</button></div>
    </div></header>
    <div className="mx-auto grid max-w-[1500px] gap-0 lg:grid-cols-[225px_minmax(0,1fr)]">
      <aside className="border-b border-[#dce5ec] bg-white p-3 lg:min-h-[calc(100vh-73px)] lg:border-b-0 lg:border-r lg:p-5" aria-label="Platform administration">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">{nav.map(({ kind, label, icon: Icon }) =>
          <button type="button" key={kind} onClick={() => selectTab(kind)} aria-current={tab === kind ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm focus-visible:outline-2 focus-visible:outline-blue-700 lg:w-full ${tab === kind ? "bg-[#e8f0f7] font-semibold text-[#163B5C]" : "text-slate-600 hover:bg-slate-50"}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />{label}</button>)}</nav>
      </aside>
      <main id="admin-content" tabIndex={-1} className="min-w-0 space-y-6 px-4 py-7 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#58748c]">Super Admin</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#163B5C] md:text-3xl">{nav.find(n => n.kind === tab)?.label}</h1>
          <p className="mt-2 text-sm text-slate-600">{tab === "overview" ? "Platform health, adoption and tasks requiring attention." : "Manage safely with scoped actions and an audit record."}</p></div>
          <button className={btn} onClick={() => tab === "overview" ? overview.refetch() : list.refetch()}><RefreshCw className="h-4 w-4"/>Refresh</button>
        </div>
        {tab === "overview" ? <>
          {overview.isError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load platform metrics. Check API access and retry.</p>}
          {overview.isLoading ? <div className="h-32 animate-pulse rounded-xl bg-white" role="status" aria-label="Loading overview"/> : summary && <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat icon={Users} label="Accounts" value={summary.totals.users}/><Stat icon={Building2} label="Companies" value={summary.totals.companies}/>
              <Stat icon={BriefcaseBusiness} label="Jobs" value={summary.totals.jobs}/><Stat icon={BarChart3} label="Applications" value={summary.totals.applications}/>
            </div>
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]"><Trend rows={summary.applicationsPerDay}/>
              <section className="rounded-xl border border-[#dfe7ee] bg-white p-5"><h2 className="mb-4 font-semibold text-[#163B5C]">Needs attention</h2>
                {([ ["Verification requests",summary.attention.pendingVerification,"companies"],
                  ["Abuse reports",summary.attention.pendingReports,"reports"], ["Support requests",summary.attention.openSupport,"support"],
                  ["Failed Stripe events",summary.attention.failedStripeEvents,"stripe-events"], ["Past-due accounts",summary.attention.pastDue,"subscriptions"] ] as const).map(([label,count,kind]) =>
                  <button key={kind} onClick={() => selectTab(kind)} className="flex w-full items-center justify-between border-b border-slate-100 py-2.5 text-left text-sm hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-700"><span>{label}</span><strong className="tabular-nums">{count}</strong></button>)}
              </section></div>
            <div className="grid gap-4 sm:grid-cols-3"><Stat icon={Users} label="New accounts · 30 days" value={summary.last30Days.newUsers}/>
              <Stat icon={BarChart3} label="Applications · 30 days" value={summary.last30Days.newApplications}/>
              <Stat icon={CreditCard} label="Paid subscription invoices · 30 days" value={`$${(summary.last30Days.paidUsdCents/100).toFixed(2)}`}/></div>
            <p className="text-xs text-slate-500">Invoice total is recorded USD payments excluding known reversals, not recognized revenue. Use Stripe for settlement and dispute reconciliation.</p>
          </>}
        </> : <>
          <div className="flex flex-wrap gap-3"><div className="relative min-w-[180px] flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400"/>
            <input className={`${field} pl-9`} type="search" aria-label="Search records" value={search} placeholder="Search records" onChange={e => setSearch(e.target.value)} /></div>
            {options[activeKind] && <select aria-label="Filter by status" className={`${field} max-w-[190px]`} value={status}
              onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>
              {options[activeKind]!.map(s => <option key={s} value={s}>{readable(s)}</option>)}</select>}
          </div>
          {list.isError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Could not load these records. Check permissions and try Refresh.</div>}
          {list.isFetching && !list.data ? <div className="h-52 animate-pulse rounded-xl bg-white" role="status" aria-label="Loading records"/> :
            <section aria-label="Administration records" className="overflow-hidden rounded-xl border border-[#dfe7ee] bg-white">
              <div className="overflow-x-auto"><table className="w-full min-w-[610px] text-left text-sm">
                <thead className="bg-[#f8fafc] text-xs font-semibold uppercase tracking-wide text-slate-500"><tr>
                  <th className="px-5 py-3">Record</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Created</th><th className="px-5 py-3 text-right">Manage</th>
                </tr></thead><tbody>{list.data?.data.records.map(row => <tr key={row._id} className="border-t border-slate-100 align-top">
                  <td className="max-w-[440px] px-5 py-4"><p className="font-semibold text-[#163B5C]">{nameOf(activeKind,row)}</p>
                    <p className="mt-1 truncate text-xs text-slate-500" title={secondaryOf(activeKind,row)}>{secondaryOf(activeKind,row)}</p></td>
                  <td className="px-5 py-4"><span className="rounded-full bg-[#eef3f7] px-2.5 py-1 text-xs font-medium capitalize text-[#365a74]">{readable(statusOf(activeKind,row))}</span></td>
                  <td className="px-5 py-4 text-slate-500">{fmtDate(row.createdAt || row.paidAt)}</td>
                  <td className="px-5 py-4 text-right"><button className={btn} disabled={!actions[activeKind] ||
                    (activeKind === "companies" && row.verification?.status !== "pending") ||
                    (activeKind === "stripe-events" && row.status !== "failed") ||
                    (activeKind === "users" && row.role === "admin")}
                    onClick={() => open(row)}>{actions[activeKind] ? "Review" : "View only"}</button></td>
                </tr>)}</tbody></table></div>
              {!list.data?.data.records.length && !list.isFetching && <p className="p-10 text-center text-sm text-slate-500">No records match the current filters.</p>}
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-5 py-4 text-sm text-slate-600">
                <span>{list.data?.data.pagination.total || 0} records · Page {page}</span>
                <div className="flex gap-2"><button className={btn} disabled={page<=1} onClick={() => setPage(p=>p-1)}>Previous</button>
                  <button className={btn} disabled={page >= (list.data?.data.pagination.totalPages || 1)} onClick={() => setPage(p=>p+1)}>Next</button></div>
              </div>
            </section>}
          {selected && <section className="rounded-xl border border-[#cbd9e6] bg-white p-5" aria-label="Review selected record"><div className="flex justify-between gap-2">
            <div><h2 className="text-lg font-semibold text-[#163B5C]">Review: {nameOf(activeKind,selected)}</h2><p className="mt-1 text-xs text-slate-500">ID: {selected._id}</p></div>
            <button className={btn} aria-label="Close review" onClick={() => setSelected(null)}><X className="h-4 w-4"/></button></div>
            <form onSubmit={perform} className="mt-5 grid max-w-2xl gap-4"><div><label htmlFor="ops-action" className="mb-1 block text-sm font-medium">Action</label>
              <select id="ops-action" className={field} value={decision} onChange={e => setDecision(e.target.value)}>
                {optionsForKind.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select></div>
              {!(["invoices", "stripe-events"] as RecordKind[]).includes(activeKind) && <div><label htmlFor="ops-reason" className="mb-1 block text-sm font-medium">Internal reason</label>
                <textarea id="ops-reason" className={field} rows={3} maxLength={1000} placeholder="Describe the reason for this change" value={reason} onChange={e => setReason(e.target.value)}/></div>}
              <div className="flex items-center gap-3"><button type="submit" className={blue} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle2 className="h-4 w-4"/>}Confirm action</button>
                <button type="button" className={btn} onClick={() => setSelected(null)}>Cancel</button></div>
            </form>
            {result && <div role="status" className="mt-5 rounded-lg border border-[#dce5ec] bg-[#f8fafc] p-4 text-sm">
              <p className="font-semibold text-[#163B5C]">Stripe comparison</p><p className="mt-2">{result.matches === true ? "Stripe and the recorded invoice agree." : "Review the recorded invoice against Stripe before taking any action."}</p>
              <p className="mt-1 text-xs text-slate-500">This comparison does not change subscription entitlements.</p></div>}
          </section>}
        </>}
      </main>
    </div>
  </div>;
}
