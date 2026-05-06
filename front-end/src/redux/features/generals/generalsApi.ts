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
  }),
});

export const {
  useGetHeaderStatsQuery,
  useGetCategoryStatsQuery,
  useGetSubcategoryStatsQuery,
  useGetTopJobsQuery,
} = generalsApi;
