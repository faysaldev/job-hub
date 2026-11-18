/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/src/redux/baseApi/baseApi";
import { JobSeekerProfile } from "@/src/types";

export interface ActivityLog {
  _id: string;
  userId: string;
  activityTitle: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type CandidateEngagement = { status: "none" | "saved" | "shortlisted";
  application: { id: string; status: string; jobId: string } | null;
  canMessage: boolean; userId?: string };
const seekerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /job-seekers/activities - Get latest 5 activities
    getActivities: builder.query<ActivityLog[], void>({
      query: () => ({
        url: "/job-seekers/activities",
        method: "GET",
      }),
      transformResponse: (response: { data: ActivityLog[] }) => response.data,
      providesTags: ["activities"],
    }),

    // POST /job-seekers - Create seeker profile
    createSeekerProfile: builder.mutation<
      JobSeekerProfile,
      Partial<JobSeekerProfile>
    >({
      query: (body) => ({
        url: "/job-seekers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["jobSeekerProfile"],
    }),

    // GET /job-seekers - Get authenticated user's seeker profile
    getSeekerProfile: builder.query<JobSeekerProfile, void>({
      query: () => ({
        url: "/job-seekers/profile",
        method: "GET",
      }),
      providesTags: ["jobSeekerProfile"],
    }),

    // GET /job-seekers/:id - Get seeker by ID
    getSeekerById: builder.query<any, string>({
      query: (id) => ({
        url: `/job-seekers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "jobSeekerProfile", id }],
    }),

    getCandidateEngagement: builder.query<CandidateEngagement, string>({
      query: (id) => `/job-seekers/${id}/engagement`,
      transformResponse: (response: { data: CandidateEngagement }) => response.data,
      providesTags: (result, error, id) => [{ type: "jobSeekerProfile", id }],
    }),
    updateCandidateEngagement: builder.mutation<{ data: { status: CandidateEngagement["status"] } },
      { id: string; action: "save" | "shortlist" | "remove" }>({
      query: ({ id, action }) => ({ url: `/job-seekers/${id}/engagement`, method: "PATCH", body: { action } }),
      invalidatesTags: (result, error, { id }) => [{ type: "jobSeekerProfile", id }],
    }),
    // GET /job-seekers/all - Get all seekers (Recruiter browsing)
    getAllSeekers: builder.query<any, any>({
      query: (params) => ({
        url: "/job-seekers/all",
        method: "GET",
        params,
      }),
      providesTags: ["jobSeekerProfile"],
    }),

    // PUT /job-seekers - Update seeker profile
    updateSeekerProfile: builder.mutation<
      JobSeekerProfile,
      Partial<JobSeekerProfile>
    >({
      query: (body) => ({
        url: "/job-seekers",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["jobSeekerProfile"],
    }),
  }),
});

export const {
  useCreateSeekerProfileMutation,
  useGetSeekerProfileQuery,
  useGetSeekerByIdQuery,
  useGetAllSeekersQuery,
  useGetCandidateEngagementQuery,
  useUpdateCandidateEngagementMutation,
  useUpdateSeekerProfileMutation,
  useGetActivitiesQuery,
} = seekerApi;
