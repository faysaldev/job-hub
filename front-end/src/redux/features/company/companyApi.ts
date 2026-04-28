import { baseApi } from "@/src/redux/baseApi/baseApi";
import { CompanyProfile } from "@/src/types";

const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /recruiter-company - Create company profile (Multipart for logo)
    createCompany: builder.mutation<CompanyProfile, FormData>({
      query: (body) => ({
        url: "/recruiter-company",
        method: "POST",
        body,
      }),
      invalidatesTags: ["company", "recruiterProfile"],
    }),

    // GET /recruiter-company - Get authenticated user's company profile
    getCompany: builder.query<CompanyProfile, void>({
      query: () => ({
        url: "/recruiter-company",
        method: "GET",
      }),
      providesTags: ["company", "recruiterProfile"],
    }),

    // GET /recruiter-company/all - Get all companies
    getAllCompanies: builder.query<CompanyProfile[], void>({
      query: () => ({
        url: "/recruiter-company/all",
        method: "GET",
      }),
      providesTags: ["company"],
    }),

    // PUT /recruiter-company - Update company profile (Multipart for logo)
    updateCompany: builder.mutation<CompanyProfile, FormData>({
      query: (body) => ({
        url: "/recruiter-company",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["company", "recruiterProfile"],
    }),
  }),
});

export const {
  useCreateCompanyMutation,
  useGetCompanyQuery,
  useGetAllCompaniesQuery,
  useUpdateCompanyMutation,
} = companyApi;
