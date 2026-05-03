import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Interview } from "../../../types";

export const interviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /interviews - Schedule an interview
    scheduleInterview: builder.mutation<Interview, Partial<Interview>>({
      query: (data) => ({
        url: "/interviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["applications"],
    }),

    // GET /interviews/my - Get user's interviews
    getMyInterviews: builder.query<
      Interview[],
      { role?: "interviewer" | "interviewee" }
    >({
      query: (params) => ({
        url: "/interviews/my",
        method: "GET",
        params,
      }),
      transformResponse: (response: { data: Interview[] }) => response.data,
      providesTags: ["applications"],
    }),

    // PUT /interviews/:interviewId/status - Update interview status
    updateInterviewStatus: builder.mutation<
      Interview,
      { interviewId: string; status: string }
    >({
      query: ({ interviewId, status }) => ({
        url: `/interviews/${interviewId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["applications"],
    }),
    // POST /interviews/hire - Hire a candidate
    hireCandidate: builder.mutation<
      { success: boolean },
      { jobId: string; applicantId: string }
    >({
      query: (data) => ({
        url: "/interviews/hire",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["applications", "conversations"],
    }),
    // PATCH /interviews/:interviewId/reschedule - Reschedule an interview
    rescheduleInterview: builder.mutation<
      Interview,
      { interviewId: string; date: string; start_time: string; end_time: string }
    >({
      query: ({ interviewId, ...data }) => ({
        url: `/interviews/${interviewId}/reschedule`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["applications"],
    }),
  }),
});

export const {
  useScheduleInterviewMutation,
  useGetMyInterviewsQuery,
  useUpdateInterviewStatusMutation,
  useHireCandidateMutation,
  useRescheduleInterviewMutation,
} = interviewsApi;
