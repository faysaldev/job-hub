import { baseApi } from "@/src/redux/baseApi/baseApi";
import { JobSeekerProfile } from "@/src/types";

const seekerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /job-seekers - Create seeker profile
    createSeekerProfile: builder.mutation<JobSeekerProfile, Partial<JobSeekerProfile>>({
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
        url: "/job-seekers",
        method: "GET",
      }),
      providesTags: ["jobSeekerProfile"],
    }),

    // GET /job-seekers/all - Get all seekers (Recruiter browsing)
    getAllSeekers: builder.query<JobSeekerProfile[], void>({
      query: () => ({
        url: "/job-seekers/all",
        method: "GET",
      }),
      providesTags: ["jobSeekerProfile"],
    }),

    // PUT /job-seekers - Update seeker profile
    updateSeekerProfile: builder.mutation<JobSeekerProfile, Partial<JobSeekerProfile>>({
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
  useGetAllSeekersQuery,
  useUpdateSeekerProfileMutation,
} = seekerApi;
