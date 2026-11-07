"use client";
import { useRecruiterAnalyticsQuery } from "@/src/redux/features/operations/operationsApi";
import { BarChart3, BriefcaseBusiness, RefreshCw, Users, CalendarCheck2, Megaphone } from "lucide-react";

const card = "rounded-xl border border-[#dfe7ee] bg-white p-5 shadow-sm";
export default function RecruiterAnalyticsWorkspace() {
  const { data, isLoading, isError, refetch, isFetching } = useRecruiterAnalyticsQuery();
  const report = data?.data;
  const highest = Math.max(1, ...(report?.funnel.map(item => item.count) || []));
  const maximumDay = Math.max(1, ...(report?.applicationsPerDay.map(item => item.count) || []));
  const metrics = report ? [
    { label: "Open vacancies", value: report.totals.openJobs, icon: BriefcaseBusiness },
    { label: "Applications", value: report.totals.applications, icon: Users },
    { label: "Completed interviews", value: report.totals.completedInterviews, icon: CalendarCheck2 },
    { label: "Active sponsored jobs", value: report.totals.activePromotions, icon: Megaphone },
  ] : [];
  return <div className="mx-auto max-w-7xl space-y-6 text-slate-800">
    <header className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#58748c]">Company reports</p>
      <h1 className="mt-1 text-3xl font-semibold text-[#163B5C]">Hiring analytics</h1>
      <p className="mt-2 text-sm text-slate-600">Live hiring stages and sponsored placement counts across your company workspace.</p></div>
      <button onClick={() => refetch()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-[#163B5C] hover:bg-slate-50 disabled:opacity-50" disabled={isFetching}><RefreshCw className="h-4 w-4"/>Refresh</button></header>
    {isLoading && <div role="status" aria-label="Loading hiring analytics" className="h-48 animate-pulse rounded-xl bg-white"/>}
    {isError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Analytics are unavailable. Please retry.</div>}
    {report && <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon }) =>
        <div key={label} className={card}><div className="mb-3 flex justify-between"><span className="text-sm text-slate-600">{label}</span><Icon className="h-5 w-5 text-[#58748c]"/></div>
          <p className="text-3xl font-semibold tabular-nums text-[#163B5C]">{value}</p></div>)}</section>
      <div className="grid gap-5 xl:grid-cols-2"><section className={card}><h2 className="flex items-center gap-2 text-lg font-semibold text-[#163B5C]"><BarChart3 className="h-5 w-5"/>Candidate funnel</h2>
        <p className="mt-1 text-sm text-slate-500">Current application stages, not unique candidate counts per stage.</p>
        {!report.funnel.length ? <p className="mt-8 text-sm text-slate-500">No applicants yet. Publish a job to begin building the pipeline.</p> :
          <div className="mt-6 space-y-4">{report.funnel.map(x => <div key={x.stage}><div className="mb-1 flex justify-between text-sm"><span className="capitalize">{x.stage.replaceAll("_", " ")}</span><strong className="tabular-nums">{x.count}</strong></div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#517895]" style={{ width: `${x.count/highest*100}%` }}/></div></div>)}</div>}</section>
        <section className={card}><h2 className="text-lg font-semibold text-[#163B5C]">Applications over time</h2>
          <p className="mt-1 text-sm text-slate-500">New applications over the last {report.windowDays} days</p>
          {!report.applicationsPerDay.length ? <p className="mt-8 text-sm text-slate-500">No recent applications.</p> :
            <div className="mt-6 flex h-44 items-end gap-1" role="img" aria-label={report.applicationsPerDay.map(x=>`${x.day}: ${x.count}`).join("; ")}>
              {report.applicationsPerDay.map(x => <div key={x.day} title={`${x.day} · ${x.count}`} className="min-w-1 flex-1 rounded-t bg-[#517895]" style={{height:`${Math.max(4,x.count/maximumDay*100)}%`}}/>)}</div>}</section></div>
      <section className={card}><h2 className="font-semibold text-[#163B5C]">Sponsored placement performance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3"><div><p className="text-sm text-slate-500">Active promotions</p><p className="mt-1 text-2xl font-semibold">{report.totals.activePromotions}</p></div>
          <div><p className="text-sm text-slate-500">Paid promotion records</p><p className="mt-1 text-2xl font-semibold">{report.totals.paidPromotions}</p></div>
          <div><p className="text-sm text-slate-500">Total job records</p><p className="mt-1 text-2xl font-semibold">{report.totals.totalJobs}</p></div></div>
        <p className="mt-5 rounded-lg bg-[#f5f7fa] p-3 text-xs text-slate-600">{report.caveat} Impressions, clicks and attributable conversions require an instrumented event pipeline and should not be estimated from applications.</p></section>
      <p className="text-xs text-slate-500">As of {new Date(report.generatedAt).toLocaleString()}. These are operational hiring metrics, not evidence of a particular candidate's suitability.</p>
    </>}
  </div>;
}
