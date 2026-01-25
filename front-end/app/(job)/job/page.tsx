import { Suspense } from "react";
import JobsClient from "@/src/Page/Jobs/JobsPage";

// Loading component
function JobsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E3E3E3]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#234C6A] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#456882] font-medium">Loading jobs...</p>
      </div>
    </div>
  );
}

// Server component wrapper with Suspense for useSearchParams
export default function JobsPage() {
  return (
    <Suspense fallback={<JobsLoading />}>
      <JobsClient />
    </Suspense>
  );
}
