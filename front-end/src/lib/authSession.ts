/**
 * A single refresh request is shared by app bootstrap, periodic renewals and
 * API 401 recovery. The refresh credential never leaves its HttpOnly cookie.
 */
export type RestoredSession = {
  user: { _id: string; email: string; name: string; role: "seeker" | "recruiter" | "admin"; image: string | null;
    phoneNumber?: string; isEmailVerified?: boolean; isProfileCompleted?: boolean; isVerified?: boolean; createdAt: string };
  accessToken: string;
};
export class SessionRefreshError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

const baseUrl = `${(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/$/, "")}/api/v1`;
let refreshPending: Promise<RestoredSession> | null = null;
let generation = 0;
let refreshController: AbortController | null = null;

export const sessionGeneration = () => generation;
export const invalidatePendingRefresh = () => {
  generation += 1;
  refreshController?.abort();
  refreshPending = null;
};

export const requestSessionRefresh = (): Promise<RestoredSession> => {
  if (refreshPending) return refreshPending;
  const thisGeneration = generation;
  const controller = new AbortController();
  refreshController = controller;
  const call = (async () => {
    let result: Response;
    try {
      result = await fetch(`${baseUrl}/auth/refresh`, { method: "POST", credentials: "include",
        headers: { Accept: "application/json" }, cache: "no-store", signal: controller.signal });
    } catch {
      throw new SessionRefreshError(0, "Unable to reach the authentication server");
    }
    if (!result.ok) throw new SessionRefreshError(result.status, "Session could not be restored");
    const payload = await result.json() as { data?: RestoredSession };
    if (!payload.data?.user || !payload.data.accessToken) {
      throw new SessionRefreshError(0, "Invalid session response");
    }
    if (generation !== thisGeneration) throw new SessionRefreshError(0, "Session changed");
    return payload.data;
  })();
  refreshPending = call;
  void call.finally(() => {
    if (refreshPending === call) refreshPending = null;
    if (refreshController === controller) refreshController = null;
  }).catch(() => {});
  return call;
};
