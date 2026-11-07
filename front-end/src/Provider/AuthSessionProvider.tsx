"use client";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectToken, setUser, logout } from "@/src/redux/features/auth/authSlice";
import { useRefreshMutation } from "@/src/redux/features/auth/authApi";
import { useAppDispatch } from "@/src/redux/hooks";

export default function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const dispatch = useAppDispatch();
  const [refresh] = useRefreshMutation();
  const bootstrapped = useRef<string | null>(null);
  useEffect(() => {
    // Re-check persisted access tokens on each browser load. A 15-minute JWT
    // can expire while the browser is closed; the HttpOnly refresh cookie remains
    // authoritative. Avoid duplicate refreshes during React StrictMode effects.
    if (!user?._id || !token || bootstrapped.current === user._id) return;
    bootstrapped.current = user._id;
    refresh().unwrap().then((result) => {
      if (result.data?.user && result.data.accessToken) {
        dispatch(setUser({ user: result.data.user, token: result.data.accessToken }));
      }
    }).catch((error: { status?: number }) => {
      if (error?.status === 401 || error?.status === 403) dispatch(logout());
    });
  }, [user?._id, !!token, refresh, dispatch]);
  useEffect(() => {
    if (!user || !token) return;
    const interval = window.setInterval(() => {
      refresh().unwrap().then((result) => {
        if (result.data?.user && result.data.accessToken) dispatch(setUser({ user: result.data.user, token: result.data.accessToken }));
      }).catch((error: { status?: number }) => {
        if (error?.status === 401 || error?.status === 403) dispatch(logout());
      });
    }, 12 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [user?._id, !!token, refresh, dispatch]);
  return <>{children}</>;
}
