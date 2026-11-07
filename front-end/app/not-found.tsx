import Link from "next/link";
import { SearchX } from "lucide-react";
export default function NotFound() {
  return <main className="jh-container flex min-h-[70vh] flex-col items-center justify-center gap-4 py-14 text-center" id="main-content">
    <div className="rounded-xl bg-[#edf3f8] p-4 text-[#163b5c]"><SearchX size={36} /></div>
    <p className="jh-kicker">404 · Page not found</p>
    <h1 className="text-3xl font-semibold tracking-tight text-[#162839]">That page isn’t available.</h1>
    <p className="max-w-md text-sm leading-6 text-[#66798a]">The link may be out of date or the content may have been removed.</p>
    <Link href="/job" className="jh-button mt-2">Browse available jobs</Link>
  </main>;
}
