"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  selectCurrentUser,
  selectToken,
  logout,
  AuthUser,
} from "@/src/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";

interface UseAuthReturn {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isJobSeeker: boolean;
  isRecruiter: boolean;
  isAdmin: boolean;
  isProfileCompleted: boolean;
  logout: () => void;
  redirectIfUnauthorized: (allowedRoles?: AuthUser["role"][]) => boolean;
}

/**
 * Central auth hook — replaces all usages of mockUser throughout the app.
 * Reads auth state from Redux (persisted via redux-persist).
 */
export const useAuth = (): UseAuthReturn => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    // Clear any localStorage residuals for backwards compatibility
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth");
  }, [dispatch, router]);

  /**
   * Returns false and redirects if the user does not have one of the allowed roles.
   * Call this at the top of role-guarded pages.
   */
  const redirectIfUnauthorized = useCallback(
    (allowedRoles?: AuthUser["role"][]): boolean => {
      if (!user || !token) {
        router.push("/auth");
        return false;
      }
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their correct dashboard
        router.push(user.role === "recruiter" ? "/recruiter" : "/job-seeker");
        return false;
      }
      return true;
    },
    [user, token, router],
  );

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isJobSeeker: user?.role === "seeker",
    isRecruiter: user?.role === "recruiter",
    isAdmin: user?.role === "admin",
    isProfileCompleted: user?.isProfileCompleted ?? false,
    logout: handleLogout,
    redirectIfUnauthorized,
  };
};
