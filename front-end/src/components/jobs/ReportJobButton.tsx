"use client";
import { useState, type FormEvent } from "react";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { useSubmitAbuseReportMutation, type AbuseReport } from "@/src/redux/features/operations/operationsApi";

export default function ReportJobButton({ jobId }: { jobId: string }) {
  const { isAuthenticated } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState<AbuseReport["category"]>("misleading");
  const [description, setDescription] = useState("");
  const [submit, { isLoading }] = useSubmitAbuseReportMutation();
  if (!isAuthenticated) return null;
  const report = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await submit({ targetKind: "job", targetId: jobId, category, description: description.trim() }).unwrap();
      toast.success("Report sent to the moderation team"); setExpanded(false); setDescription("");
    } catch (error: any) { toast.error(error?.data?.message || "Could not submit report"); }
  };
  return <div className="mt-5 max-w-lg"><button type="button" onClick={() => setExpanded(v => !v)}
      aria-expanded={expanded} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-700">
      <Flag className="h-4 w-4"/>Report this listing</button>
    {expanded && <form onSubmit={report} className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm">
      <p className="text-sm font-semibold text-[#163B5C]">Tell us what seems wrong</p>
      <label htmlFor="report-category" className="mt-3 block text-xs font-medium text-slate-600">Category</label>
      <select id="report-category" className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" value={category}
        onChange={e => setCategory(e.target.value as AbuseReport["category"])}>
        <option value="misleading">Misleading information</option><option value="fraud">Suspected fraud</option>
        <option value="spam">Spam</option><option value="harassment">Harassment</option><option value="other">Other</option></select>
      <label htmlFor="report-description" className="mt-3 block text-xs font-medium text-slate-600">Details</label>
      <textarea id="report-description" rows={3} minLength={15} maxLength={2000} required
        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm" value={description}
        onChange={e => setDescription(e.target.value)} placeholder="Explain your concern with specific details"/>
      <button type="submit" disabled={isLoading || description.trim().length < 15}
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin"/>}Submit report</button>
    </form>}</div>;
}
