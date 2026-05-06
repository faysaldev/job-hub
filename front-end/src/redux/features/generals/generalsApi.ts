import { baseApi } from "@/src/redux/baseApi/baseApi";
import { ApiResponse, Job } from "@/src/types";

export interface HeaderStats {
  unreadNotificationsCount: number;
  savedJobsCount: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface SubcategoryStat {
  subcategory: string;
  count: number;
}

export interface SeekerDashboardStats {
  profileStrength: number;
  resumeLink: string;
  applications: {
    total: number;
    thisWeek: number;
    hired: number;
  };
  interviews: {
    total: number;
  };
}

export interface ContactFormData {
  fullName: string;
  email: string;
  department: string;
  subject: string;
  message: string;
}

export interface RecruiterDashboardStats {
  activeJobs: {
    total: number;
    percentage: number;
  };
  applicants: {
    total: number;
    percentage: number;
  };
  avgSalary: number;
}

const generalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /generals/header-stats - Get unread notifications and saved jobs count
    getHeaderStats: builder.query<HeaderStats, void>({
      query: () => ({
        url: "/generals/header-stats",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<HeaderStats>) => response.data,
      providesTags: ["notifications", "savedJobs"],
    }),

    // GET /generals/category-stats - Get job count by category
    getCategoryStats: builder.query<CategoryStat[], void>({
      query: () => ({
        url: "/generals/category-stats",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<CategoryStat[]>) => response.data,
    }),

    // GET /generals/subcategory-stats - Get job count by subcategory
    getSubcategoryStats: builder.query<SubcategoryStat[], void>({
      query: () => ({
        url: "/generals/subcategory-stats",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<SubcategoryStat[]>) => response.data,
    }),

    // GET /generals/top-jobs - Get top trending or latest jobs
    getTopJobs: builder.query<Job[], void>({
      query: () => ({
        url: "/generals/top-jobs",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Job[]>) => response.data,
      providesTags: ["jobs"],
    }),

    // GET /generals/seeker-dashboard-stats - Get stats for seeker dashboard
    getSeekerDashboardStats: builder.query<SeekerDashboardStats, void>({
      query: () => ({
        url: "/generals/seeker-dashboard-stats",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<SeekerDashboardStats>) =>
        response.data,
      providesTags: ["applications", "jobs", "activities"],
    }),

    // GET /generals/applied-job-ids - Get IDs of jobs user has applied for
    getAppliedJobIds: builder.query<string[], void>({
      query: () => ({
        url: "/generals/applied-job-ids",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<string[]>) => response.data,
      providesTags: ["applications"],
    }),

    // POST /generals/contact - Submit contact form
    submitContactForm: builder.mutation<any, ContactFormData>({
      query: (body) => ({
        url: "/generals/contact",
        method: "POST",
        body,
      }),
    }),

    // GET /generals/recruiter-dashboard-stats - Get stats for recruiter dashboard
    getRecruiterDashboardStats: builder.query<RecruiterDashboardStats, void>({
      query: () => ({
        url: "/generals/recruiter-dashboard-stats",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<RecruiterDashboardStats>) =>
        response.data,
      providesTags: ["applications", "jobs"],
    }),
  }),
});

export const {
  useGetHeaderStatsQuery,
  useGetCategoryStatsQuery,
  useGetSubcategoryStatsQuery,
  useGetTopJobsQuery,
  useGetSeekerDashboardStatsQuery,
  useGetAppliedJobIdsQuery,
  useSubmitContactFormMutation,
  useGetRecruiterDashboardStatsQuery,
} = generalsApi;
