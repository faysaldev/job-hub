import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Application, ApplicationStatus } from "@/src/types";

const applicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /applications - Apply to a job (Seeker)
    applyToJob: builder.mutation<
      Application,
      {
        job_id: string;
        cover_letter: string;
        resume_url: string;
        paid_amount?: number;
      }
    >({
      query: (body) => ({
        url: "/applications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["applications", "jobs"],
    }),

    // GET /applications - Get user's applications
    getUserApplications: builder.query<Application[], void>({
      query: () => ({
        url: "/applications",
        method: "GET",
      }),
      providesTags: ["applications"],
    }),

    // PUT /applications/:applicationId/status - Update application status (Recruiter)
    updateApplicationStatus: builder.mutation<Application, { applicationId: string; status: ApplicationStatus }>({
      query: ({ applicationId, status }) => ({
        url: `/applications/${applicationId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: "applications", id: applicationId },
        "applications",
      ],
    }),

    // DELETE /applications/:applicationId - Withdraw/delete application
    deleteApplication: builder.mutation<{ success: boolean }, string>({
      query: (applicationId) => ({
        url: `/applications/${applicationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["applications"],
    }),
  }),
});

export const {
  useApplyToJobMutation,
  useGetUserApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
} = applicationsApi;
