import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Message } from "@/src/types";

const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /messages - Create a new message
    sendMessage: builder.mutation<
      Message,
      { conversationId: string; receiverId: string; content: string }
    >({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Message }) => response.data,
      invalidatesTags: ["messages", "conversations"],
    }),

    // GET /messages/conversation/:conversationId - Get all messages in a conversation
    getConversationMessages: builder.query<
      Message[],
      { conversationId: string; page?: number; limit?: number }
    >({
      query: ({ conversationId, page = 1, limit = 50 }) => ({
        url: `/messages/conversation/${conversationId}`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.messages && Array.isArray(response.messages))
          return response.messages;
        if (response?.data?.messages && Array.isArray(response.data.messages))
          return response.data.messages;
        if (response?.data && Array.isArray(response.data))
          return response.data;
        return [];
      },
      providesTags: (result, error, { conversationId }) => [
        { type: "messages", id: conversationId },
        "messages",
      ],
    }),

    // PUT /messages/:messageId - Edit a message
    editMessage: builder.mutation<Message, { messageId: string; content: string }>({
      query: ({ messageId, content }) => ({
        url: `/messages/${messageId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["messages"],
    }),

    // DELETE /messages/:messageId - Delete a message
    deleteMessage: builder.mutation<{ success: boolean }, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["messages"],
    }),

    // PATCH /messages/:messageId/read - Mark message as read
    markMessageAsRead: builder.mutation<Message, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["messages", "conversations"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetConversationMessagesQuery,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useMarkMessageAsReadMutation,
} = messagesApi;
