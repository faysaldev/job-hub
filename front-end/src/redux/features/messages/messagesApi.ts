import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Message } from "@/src/types";

const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /messages - Create a new message
    sendMessage: builder.mutation<Message, { conversationId: string; receiverId: string; content: string }>({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["messages", "conversations"],
    }),

    // GET /messages/conversation/:conversationId - Get all messages in a conversation
    getConversationMessages: builder.query<Message[], string>({
      query: (conversationId) => ({
        url: `/messages/conversation/${conversationId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "messages", id }, "messages"],
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
