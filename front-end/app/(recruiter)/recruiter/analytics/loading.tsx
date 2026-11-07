export default function RecruiterAnalyticsLoading() { return <div role="status" aria-label="Loading hiring analytics" className="space-y-4 animate-pulse">
  <div className="h-12 rounded-xl bg-white"/><div className="grid gap-4 md:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-28 rounded-xl bg-white"/>)}</div>
  <div className="h-56 rounded-xl bg-white"/></div>; }
