import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Job, PaginatedResponse, JobFilters, ApiResponse } from "@/src/types";

const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /job - Get all jobs with optional filters
    getJobs: builder.query<PaginatedResponse<Job>, JobFilters | void>({
      query: (filters) => ({
        url: "/job",
        method: "GET",
        params: filters || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "jobs" as const, id })),
              { type: "jobs", id: "LIST" },
            ]
          : [{ type: "jobs", id: "LIST" }],
    }),

    // GET /job/search - Search jobs
    searchJobs: builder.query<PaginatedResponse<Job>, JobFilters>({
      query: (filters) => ({
        url: "/job/search",
        method: "GET",
        params: filters,
      }),
      providesTags: ["jobs"],
    }),

    // GET /job/:jobId - Get single job by ID
    getJobById: builder.query<ApiResponse<Job>, string>({
      query: (jobId) => ({
        url: `/job/${jobId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "jobs", id }],
    }),

    // GET /job/author/:authorId - Get jobs by author ID
    getJobsByAuthor: builder.query<ApiResponse<Job[]>, string>({
      query: (authorId) => ({
        url: `/job/author/${authorId}`,
        method: "GET",
      }),
      providesTags: [{ type: "jobs", id: "AUTHOR_LIST" }],
    }),

    // POST /job - Create new job (Recruiter)
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (body) => ({
        url: "/job",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "jobs", id: "LIST" }],
    }),

    // PUT /job/:jobId - Update job (Recruiter)
    updateJob: builder.mutation<Job, { jobId: string; body: Partial<Job> }>({
      query: ({ jobId, body }) => ({
        url: `/job/${jobId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { jobId }) => [
        { type: "jobs", id: jobId },
        { type: "jobs", id: "LIST" },
      ],
    }),

    // DELETE /job/:jobId - Delete job (Recruiter)
    deleteJob: builder.mutation<{ success: boolean }, string>({
      query: (jobId) => ({
        url: `/job/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "jobs", id },
        { type: "jobs", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useSearchJobsQuery,
  useGetJobByIdQuery,
  useGetJobsByAuthorQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;
