"use client";
import Link from "next/link";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ title = "Nothing here yet", description = "New items will appear here when available.", actionLabel, actionHref, icon }: { title?: string; description?: string; actionLabel?: string; actionHref?: string; icon?: ReactNode }) {
  return <div className="jh-state"><div className="rounded-xl bg-[#edf3f8] p-3 text-[#163b5c]">{icon || <Inbox size={24} />}</div><h2>{title}</h2><p>{description}</p>{actionLabel && actionHref && <Link href={actionHref} className="jh-button mt-2">{actionLabel}</Link>}</div>;
}
export function ErrorState({ title = "Unable to load this content", description = "Please try again. If the issue continues, return to the previous page.", onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return <div role="alert" className="jh-state"><AlertCircle size={27} className="text-[#b42332]" /><h2>{title}</h2><p>{description}</p>{onRetry && <button type="button" className="jh-button mt-2" onClick={onRetry}><RefreshCw size={16} /> Try again</button>}</div>;
}
