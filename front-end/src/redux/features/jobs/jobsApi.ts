import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Job, JobFilters, ApiResponse } from "@/src/types";

export interface SearchJobsData {
  jobs: Job[];
  pagination: { currentPage: number; totalPages: number; totalJobs: number; hasNext: boolean; hasPrev: boolean };
  facets: { categories: Array<{ category: string; count: number }>;
    subcategories: Array<{ subcategory: string; count: number }> };
}
export interface WorkspaceJob {
  _id: string; title: string; status?: string; isActive: boolean; publishAt?: string;
  applicationDeadline?: string; location?: string; sponsoredUntil?: string; bannerUrl?: string;
  createdAt: string; hasDraftChanges?: boolean; expired?: boolean;
}
export interface WorkspaceJobsData {
  jobs: WorkspaceJob[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  overview: { openJobs: number; scheduledJobs: number; publishedJobs: number;
    quotaUsed: number; quotaLimit: number; overLimit: number };
}
const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<ApiResponse<SearchJobsData>, JobFilters | void>({
      query: (filters) => ({ url: "/job", params: filters || {} }),
      providesTags: (result) => result ? [
        ...result.data.jobs.map(job => ({ type: "jobs" as const, id: job._id || String(job.id) })),
        { type: "jobs", id: "LIST" },
      ] : [{ type: "jobs", id: "LIST" }],
    }),
    searchJobs: builder.query<ApiResponse<SearchJobsData>, JobFilters>({
      query: (filters) => ({ url: "/job", params: filters }), providesTags: ["jobs"],
    }),
    getJobById: builder.query<ApiResponse<Job>, string>({
      query: jobId => `/job/${jobId}`,
      providesTags: (result, error, id) => [{ type: "jobs", id }],
    }),
    getJobsByAuthor: builder.query<ApiResponse<Job[]>, string>({
      query: authorId => `/job/author/${authorId}`, providesTags: [{ type: "jobs", id: "AUTHOR_LIST" }],
    }),
    getWorkspaceJobs: builder.query<ApiResponse<WorkspaceJobsData>, { status?: string; page?: number } | void>({
      query: params => ({ url: "/job/mine", params: params || {} }), providesTags: ["jobs"],
    }),
    createJob: builder.mutation<ApiResponse<Job>, Partial<Job>>({
      query: body => ({ url: "/job", method: "POST", body }),
      invalidatesTags: ["jobs", "billing", "analytics"],
    }),
    updateJob: builder.mutation<ApiResponse<Job>, { jobId: string; body: Partial<Job> }>({
      query: ({ jobId, body }) => ({ url: `/job/${jobId}`, method: "PUT", body }),
      invalidatesTags: ["jobs", "billing", "analytics"],
    }),
    deleteJob: builder.mutation<ApiResponse<Job>, string>({
      query: jobId => ({ url: `/job/${jobId}`, method: "DELETE" }),
      invalidatesTags: ["jobs", "billing", "analytics"],
    }),
  }),
});
export const { useGetWorkspaceJobsQuery, useGetJobsQuery, useSearchJobsQuery,
  useGetJobByIdQuery, useGetJobsByAuthorQuery, useCreateJobMutation,
  useUpdateJobMutation, useDeleteJobMutation } = jobsApi;
