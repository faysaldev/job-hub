import { baseApi } from "@/src/redux/baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /auth/register
    register: builder.mutation({
      query: (body: {
        name: string;
        email: string;
        password: string;
        phoneNumber: string;
        role: "seeker" | "recruiter";
      }) => ({ url: "/auth/register", method: "POST", body }),
    }),

    // POST /auth/verify-email
    verifyEmail: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/login
    login: builder.mutation({
      query: (body: {
        email: string;
        password: string;
        fcmToken?: string;
      }) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    // POST /auth/forgot-password
    forgotPassword: builder.mutation({
      query: (body: { email: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/reset-password
    resetPassword: builder.mutation({
      query: (body: { email: string; code: string; newPassword: string }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/resend-verification
    resendVerification: builder.mutation({
      query: (body: { email: string }) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body,
      }),
    }),

    // POST /auth/logout
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["user"],
    }),

    // DELETE /auth/delete/:userId
    deleteAccount: builder.mutation({
      query: (userId: string) => ({
        url: `/auth/delete/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendVerificationMutation,
  useLogoutMutation,
  useDeleteAccountMutation,
} = authApi;
