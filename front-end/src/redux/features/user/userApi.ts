import { baseApi } from "@/src/redux/baseApi/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users/self/in — get current user details
    getMe: builder.query({
      query: () => ({ url: "/users/self/in", method: "GET" }),
      providesTags: ["user"],
    }),

    // PATCH /users/update — update profile (supports image upload)
    updateProfile: builder.mutation({
      query: (formData: FormData) => ({
        url: "/users/update",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["user"],
    }),

    // PATCH /users/change-password
    changePassword: builder.mutation({
      query: (body: { currentPassword: string; newPassword: string }) => ({
        url: "/users/change-password",
        method: "PATCH",
        body,
      }),
    }),

    // DELETE /users/delete-profile
    deleteProfile: builder.mutation({
      query: (body: { password: string }) => ({
        url: "/users/delete-profile",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteProfileMutation,
} = userApi;
