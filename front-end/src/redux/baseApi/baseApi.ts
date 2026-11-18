import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs,
  type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/src/redux/store/store";
import { sessionExpired, setUser } from "@/src/redux/features/auth/authSlice";
import { requestSessionRefresh, sessionGeneration, SessionRefreshError } from "@/src/lib/authSession";

const baseUrl = `${(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/$/, "")}/api/v1`;
const rawQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const withRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extra) => {
  const url = typeof args === "string" ? args : args.url;
  const before = (api.getState() as RootState).auth.token;
  let result = await rawQuery(args, api, extra);
  if (result.error?.status !== 401 || url.startsWith("/auth/")) return result;

  const updatedToken = (api.getState() as RootState).auth.token;
  if (updatedToken && updatedToken !== before) {
    return rawQuery(args, api, extra); // Another request already refreshed the session.
  }
  const expectedGeneration = sessionGeneration();
  try {
    const restored = await requestSessionRefresh();
    if (expectedGeneration !== sessionGeneration()) return result; // Logged out in flight.
    api.dispatch(setUser({ user: restored.user, token: restored.accessToken }));
    result = await rawQuery(args, api, extra);
  } catch (error: unknown) {
    if (expectedGeneration === sessionGeneration() && error instanceof SessionRefreshError &&
        (error.status === 401 || error.status === 403)) {
      api.dispatch(sessionExpired("Your session expired. Please sign in again."));
      api.dispatch(baseApi.util.resetApiState());
    }
    // Temporary network failures do not revoke a still-valid server session.
  }
  return result;
};
export const baseApi = createApi({
  reducerPath: "baseApi", baseQuery: withRefresh,
  tagTypes: ["user", "jobs", "applications", "jobSeekerProfile", "recruiterProfile", "company",
    "messages", "conversations", "notifications", "savedJobs", "Asset", "analytics", "activities", "billing", "billingPlans", "operations"],
  endpoints: () => ({}),
});
