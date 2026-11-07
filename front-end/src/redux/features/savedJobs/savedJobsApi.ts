import { baseApi } from "@/src/redux/baseApi/baseApi";
import { SavedJob } from "@/src/types";

export interface SavedSearch { _id: string; name: string; filters: { q?: string; category?: string; location?: string; type?: string; locationType?: "remote" | "onsite" | "hybrid" }; alertsEnabled: boolean; frequency: "daily" | "weekly" }
const savedJobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSavedSearches: builder.query<{ data: SavedSearch[] }, void>({
      query: () => "/saved-jobs/searches", providesTags: ["savedJobs"],
    }),
    createSavedSearch: builder.mutation<{ data: SavedSearch }, Omit<SavedSearch, "_id">>({
      query: (body) => ({ url: "/saved-jobs/searches", method: "POST", body }), invalidatesTags: ["savedJobs"],
    }),
    updateSavedSearch: builder.mutation<{ data: SavedSearch }, { id: string; body: Partial<Omit<SavedSearch, "_id">> }>({
      query: ({ id, body }) => ({ url: `/saved-jobs/searches/${id}`, method: "PATCH", body }), invalidatesTags: ["savedJobs"],
    }),
    deleteSavedSearch: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/saved-jobs/searches/${id}`, method: "DELETE" }), invalidatesTags: ["savedJobs"],
    }),
    // POST /saved-jobs - Save a job
    saveJob: builder.mutation<SavedJob, { jobId: string }>({
      query: (body) => ({
        url: "/saved-jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["savedJobs", "jobs"],
    }),

    // GET /saved-jobs - Get user's saved jobs
    getUserSavedJobs: builder.query<SavedJob[], void>({
      query: () => ({
        url: "/saved-jobs",
        method: "GET",
      }),
      providesTags: ["savedJobs"],
    }),

    // DELETE /saved-jobs/:jobId - Remove a saved job
    deleteSavedJob: builder.mutation<{ success: boolean }, string>({
      query: (jobId) => ({
        url: `/saved-jobs/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["savedJobs", "jobs"],
    }),
  }),
});

export const {
  useGetSavedSearchesQuery,
  useCreateSavedSearchMutation,
  useUpdateSavedSearchMutation,
  useDeleteSavedSearchMutation,
  useSaveJobMutation,
  useGetUserSavedJobsQuery,
  useDeleteSavedJobMutation,
} = savedJobsApi;
