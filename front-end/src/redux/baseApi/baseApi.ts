import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs,
  type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/src/redux/store/store";
import { logout, setUser } from "@/src/redux/features/auth/authSlice";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/api/v1`;
const rawQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include", // HttpOnly refresh cookie; access token remains short lived.
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token?.replace(/['"]+/g, "");
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

let inFlightRefresh: Promise<Awaited<ReturnType<typeof rawQuery>>> | null = null;
const withRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extra) => {
  let result = await rawQuery(args, api, extra);
  const url = typeof args === "string" ? args : args.url;
  if (result.error?.status === 401 && !url.startsWith("/auth/")) {
    if (!inFlightRefresh) {
      inFlightRefresh = Promise.resolve(rawQuery({ url: "/auth/refresh", method: "POST" }, api, extra))
        .finally(() => { inFlightRefresh = null; });
    }
    const refreshed = await inFlightRefresh;
    const data = (refreshed.data as { data?: { user?: any; accessToken?: string } })?.data;
    if (data?.user && data?.accessToken) {
      api.dispatch(setUser({ user: data.user, token: data.accessToken }));
      result = await rawQuery(args, api, extra);
    } else {
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
    }
  }
  return result;
};
export const baseApi = createApi({
  reducerPath: "baseApi", baseQuery: withRefresh,
  tagTypes: ["user", "jobs", "applications", "jobSeekerProfile", "recruiterProfile", "company",
    "messages", "conversations", "notifications", "savedJobs", "Asset", "analytics", "activities", "billing", "billingPlans"],
  endpoints: () => ({}),
});
