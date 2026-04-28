import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Notification } from "@/src/types";

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /notifications - Get all notifications
    getUserNotifications: builder.query<Notification[], void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    // GET /notifications/unread - Get unread notifications
    getUnreadNotifications: builder.query<Notification[], void>({
      query: () => ({
        url: "/notifications/unread",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    // GET /notifications/unread/count - Get unread count
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => ({
        url: "/notifications/unread/count",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    // PATCH /notifications/:id/read - Mark one as read
    markNotificationAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),

    // PATCH /notifications/read-all - Mark all as read
    markAllNotificationsAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),

    // DELETE /notifications/:id - Soft delete notification
    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),

    // POST /notifications - Create a new notification
    createNotification: builder.mutation<Notification, { title: string; link: string; receiver: string }>({
      query: (body) => ({
        url: "/notifications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useGetUnreadNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useCreateNotificationMutation,
} = notificationsApi;
