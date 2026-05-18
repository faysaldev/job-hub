import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Conversation } from "@/src/types";

/**
 * Conversations REST API.
 * - GET (list) is handled by Socket.IO (conversations:get event)
 * - Only CREATE and DELETE remain as REST endpoints
 */
const conversationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /conversations — Create or find an existing conversation
    createConversation: builder.mutation<
      Conversation,
      { participants: string | string[] }
    >({
      query: (body) => ({
        url: "/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["conversations"],
    }),

    // DELETE /conversations/:conversationId
    deleteConversation: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["conversations"],
    }),
  }),
});

export const { useCreateConversationMutation, useDeleteConversationMutation } =
  conversationsApi;
