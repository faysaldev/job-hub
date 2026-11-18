"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setSessionChecked, sessionExpired, setUser } from "@/src/redux/features/auth/authSlice";
import { requestSessionRefresh, sessionGeneration } from "@/src/lib/authSession";
import { baseApi } from "@/src/redux/baseApi/baseApi";

const RENEW_INTERVAL_MS = 12 * 60_000;

export default function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const rehydrated = useAppSelector(state => state.auth._persist?.rehydrated ?? false);
  const sessionChecked = useAppSelector(state => state.auth.sessionChecked);
  const token = useAppSelector(state => state.auth.token);
  const cachedUser = useAppSelector(state => state.auth.user);
  const started = useRef(false);

  useEffect(() => {
    if (!rehydrated || started.current) return;
    started.current = true;
    // Purge legacy auth data from older releases (the access JWT is memory-only now).
    try { localStorage.removeItem("token"); localStorage.removeItem("user"); } catch {}
    const generation = sessionGeneration();
    requestSessionRefresh().then(({ user, accessToken }) => {
      if (generation === sessionGeneration()) dispatch(setUser({ user, token: accessToken }));
    }).catch((error: { status?: number }) => {
      if (generation !== sessionGeneration()) return;
      // On an ordinary anonymous visit there is no session cookie. No alert needed.
      if (error?.status === 401) {
        if (cachedUser) dispatch(sessionExpired("Your session expired. Please sign in again."));
        else dispatch(setSessionChecked());
      }
      else dispatch(sessionExpired("Unable to restore the session. Check your connection and sign in again."));
      dispatch(baseApi.util.resetApiState());
    }).finally(() => {
      if (generation === sessionGeneration()) dispatch(setSessionChecked());
    });
  }, [rehydrated, dispatch, cachedUser]);

  useEffect(() => {
    if (!sessionChecked || !token) return;
    const refresh = () => {
      const generation = sessionGeneration();
      void requestSessionRefresh().then(({ user, accessToken }) => {
        if (generation === sessionGeneration()) dispatch(setUser({ user, token: accessToken }));
      }).catch((error: { status?: number }) => {
        if (generation !== sessionGeneration()) return;
        if (error.status === 401 || error.status === 403) {
          dispatch(sessionExpired("Your session expired. Please sign in again."));
          dispatch(baseApi.util.resetApiState());
        }
      });
    };
    const interval = window.setInterval(refresh, RENEW_INTERVAL_MS);
    const onFocus = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onFocus);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", onFocus); };
  }, [sessionChecked, !!token, dispatch]);
  return <>{children}</>;
}
