"use client";
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return <main role="alert" className="mx-auto max-w-lg p-10"><h1 className="text-xl font-semibold text-[#163B5C]">Administration unavailable</h1>
    <p className="mt-3 text-sm text-slate-600">The page could not be loaded. Retry or contact the platform operator.</p>
    <button onClick={reset} className="mt-5 rounded-lg bg-[#163B5C] px-4 py-2 text-sm font-semibold text-white">Retry</button></main>;
}
