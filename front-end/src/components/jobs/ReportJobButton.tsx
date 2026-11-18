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
  return (
    <div className="mt-3 max-w-lg">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-neutral-400"
      >
        <Flag className="h-3.5 w-3.5 text-neutral-400" />
        Report this listing
      </button>
      {expanded && (
        <form onSubmit={report} className="mt-3 rounded-2xl border border-[#eaecf0] bg-white p-4 text-neutral-800 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">Tell us what seems wrong</p>
          <label htmlFor="report-category" className="mt-2.5 block text-xs font-medium text-neutral-600">Category</label>
          <select
            id="report-category"
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-[#f8fafc] p-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
            value={category}
            onChange={e => setCategory(e.target.value as AbuseReport["category"])}
          >
            <option value="misleading">Misleading information</option>
            <option value="fraud">Suspected fraud</option>
            <option value="spam">Spam</option>
            <option value="harassment">Harassment</option>
            <option value="other">Other</option>
          </select>
          <label htmlFor="report-description" className="mt-2.5 block text-xs font-medium text-neutral-600">Details</label>
          <textarea
            id="report-description"
            rows={3}
            minLength={15}
            maxLength={2000}
            required
            className="mt-1 w-full rounded-xl border border-neutral-200 bg-[#f8fafc] p-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Explain your concern with specific details"
          />
          <button
            type="submit"
            disabled={isLoading || description.trim().length < 15}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-black hover:bg-neutral-800 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin"/>}
            Submit report
          </button>
        </form>
      )}
    </div>
  );
}
