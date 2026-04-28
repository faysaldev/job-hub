import { baseApi } from "@/src/redux/baseApi/baseApi";
import { SavedJob } from "@/src/types";

const savedJobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  useSaveJobMutation,
  useGetUserSavedJobsQuery,
  useDeleteSavedJobMutation,
} = savedJobsApi;
