"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecruiterGuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isRecruiter, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // We use a small timeout or wait for the auth state to settle
    // since redux-persist might take a moment to rehydrate
    if (isAuthenticated !== undefined) {
      if (!isAuthenticated) {
        router.replace("/auth");
      } else if (!isRecruiter) {
        // If they are a seeker, send them to their dashboard
        if (user?.role === "seeker") {
          router.replace("/job-seeker");
        } else {
          router.replace("/");
        }
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, isRecruiter, user, router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E3E3E3]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#234C6A]" />
          <p className="text-[#234C6A] font-medium animate-pulse">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
