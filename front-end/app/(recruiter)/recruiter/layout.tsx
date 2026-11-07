"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useAppSelector } from "@/src/redux/hooks";
import { WorkspaceLoading } from "@/src/components/feedback/LoadingStates";

/** Rehydration-aware role guard; resource-level permissions remain server-enforced. */
export default function RecruiterGuardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const ready = useAppSelector(state => state.auth._persist?.rehydrated ?? false);
  const permitted = isAuthenticated && user?.role === "recruiter";
  useEffect(() => {
    if (!ready || permitted) return;
    if (!isAuthenticated) router.replace("/auth");
    else router.replace(user?.role === "seeker" ? "/job-seeker" : "/");
  }, [ready, permitted, isAuthenticated, user?.role, router]);
  if (!ready || !permitted) return <WorkspaceLoading />;
  return <>{children}</>;
}
