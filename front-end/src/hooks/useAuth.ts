"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { selectCurrentUser, selectToken, selectSessionChecked, logout, AuthUser } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { baseApi } from "@/src/redux/baseApi/baseApi";
import { invalidatePendingRefresh } from "@/src/lib/authSession";

interface UseAuthReturn {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionChecked: boolean;
  isJobSeeker: boolean;
  isRecruiter: boolean;
  isAdmin: boolean;
  isProfileCompleted: boolean;
  logout: () => void;
  redirectIfUnauthorized: (allowedRoles?: AuthUser["role"][]) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const sessionChecked = useSelector(selectSessionChecked);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    invalidatePendingRefresh();
    // Revoke the refresh session server-side; don't depend on an unexpired access token.
    void fetch(`${(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/$/, "")}/api/v1/auth/logout`, {
      method: "POST", credentials: "include", keepalive: true,
    }).catch(() => {});
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.replace("/auth");
  }, [dispatch, router]);

  const redirectIfUnauthorized = useCallback(
    (allowedRoles?: AuthUser["role"][]): boolean => {
      if (!sessionChecked) return false;
      if (!user || !token) { router.replace("/auth"); return false; }
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.replace(user.role === "recruiter" ? "/recruiter" : user.role === "seeker" ? "/job-seeker" : "/");
        return false;
      }
      return true;
    }, [user, token, router, sessionChecked],
  );

  return {
    user, token, sessionChecked,
    isAuthenticated: !!user && !!token,
    isJobSeeker: user?.role === "seeker",
    isRecruiter: user?.role === "recruiter",
    isAdmin: user?.role === "admin",
    isProfileCompleted: user?.isProfileCompleted ?? false,
    logout: handleLogout,
    redirectIfUnauthorized,
  };
};
