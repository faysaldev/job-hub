export default function AdminLoading() {
  return <main className="min-h-screen bg-[#f5f7fa] p-8" aria-label="Loading administration" role="status">
    <div className="mx-auto max-w-6xl space-y-4 animate-pulse"><div className="h-12 rounded-xl bg-white"/>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1,2,3,4].map(n => <div key={n} className="h-28 rounded-xl bg-white"/>)}</div>
      <div className="h-64 rounded-xl bg-white"/></div>
  </main>;
}
