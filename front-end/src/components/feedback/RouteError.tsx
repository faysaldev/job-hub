"use client";
import { useEffect } from "react";
import Link from "next/link";
import { ErrorState } from "@/src/components/feedback/StateViews";
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Do not expose stack traces or private server details to users.
    if (process.env.NODE_ENV !== "production") console.error("JobHub route error", error);
  }, [error]);
  return <main id="main-content" className="jh-container space-y-4 py-12"><ErrorState onRetry={reset} />
    <div className="text-center"><Link className="text-sm font-semibold text-[#163b5c] underline" href="/">Return home</Link></div>
  </main>;
}
