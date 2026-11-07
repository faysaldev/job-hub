/* Reusable, accessible route/data skeletons. No fake counts or spinner-only screens. */
export function Skeleton({ className = "", label }: { className?: string; label?: string }) {
  return <span aria-label={label} className={`jh-skeleton block ${className}`} />;
}
export function PageLoading({ heading = "Loading", cards = 3 }: { heading?: string; cards?: number }) {
  return <div role="status" aria-label={heading} className="jh-container space-y-6 py-9">
    <span className="sr-only">{heading}…</span>
    <div className="space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-72 max-w-full" /><Skeleton className="h-4 w-96 max-w-full" /></div>
    <div className="grid gap-4 md:grid-cols-3">{Array.from({ length: cards }, (_, i) => <div className="jh-panel space-y-5 p-6" key={i}><Skeleton className="h-11 w-11" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>)}</div>
  </div>;
}
export function TableLoading({ rows = 6 }: { rows?: number }) {
  return <div role="status" aria-label="Loading records" className="jh-panel overflow-hidden p-5"><span className="sr-only">Loading records…</span><Skeleton className="mb-6 h-7 w-52" />
    <div className="space-y-1">{Array.from({ length: rows }, (_, i) => <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-[#e1e8ef] py-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /><Skeleton className="h-4 w-2/3" /></div>)}</div>
  </div>;
}
export function MessagesLoading() {
  return <div role="status" aria-label="Loading conversations" className="jh-panel grid min-h-[480px] grid-cols-1 gap-0 overflow-hidden md:grid-cols-[280px_minmax(0,1fr)]"><span className="sr-only">Loading conversations…</span>
    <div className="space-y-5 border-r border-[#e1e8ef] p-5"><Skeleton className="h-10 w-full" />{Array.from({ length: 5 }, (_, i) => <div className="flex gap-3" key={i}><Skeleton className="h-10 w-10 shrink-0 rounded-full" /><div className="w-full space-y-2"><Skeleton className="h-4 w-4/5" /><Skeleton className="h-3 w-3/5" /></div></div>)}</div>
    <div className="hidden space-y-6 p-6 md:block"><Skeleton className="h-12 w-60" /><div className="space-y-4 pt-8"><Skeleton className="h-12 w-3/5" /><Skeleton className="ml-auto h-12 w-1/2" /><Skeleton className="h-12 w-2/5" /></div></div>
  </div>;
}
export function WorkspaceLoading() { return <div className="min-h-screen bg-[#f6f8fb] pt-10"><PageLoading heading="Loading workspace" cards={4}/></div>; }
