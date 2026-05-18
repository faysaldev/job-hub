import { baseApi } from "@/src/redux/baseApi/baseApi";

/**
 * Messages REST API — only DELETE remains here.
 * send / getMessages / edit / markRead are all handled via Socket.IO.
 */
const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // DELETE /messages/:messageId — hard-delete a message
    deleteMessage: builder.mutation<{ success: boolean }, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      // The socket will broadcast message:deleted, no tag invalidation needed
    }),
  }),
});

export const { useDeleteMessageMutation } = messagesApi;
