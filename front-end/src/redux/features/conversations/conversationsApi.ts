import { baseApi } from "@/src/redux/baseApi/baseApi";
import { Conversation } from "@/src/types";

const conversationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /conversations - Create a new conversation
    createConversation: builder.mutation<Conversation, { receiverId: string }>({
      query: (body) => ({
        url: "/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["conversations"],
    }),

    // GET /conversations - Get user's conversations
    getUserConversations: builder.query<Conversation[], void>({
      query: () => ({
        url: "/conversations",
        method: "GET",
      }),
      transformResponse: (response: { data: Conversation[] }) => response.data,
      providesTags: ["conversations"],
    }),

    // DELETE /conversations/:conversationId - Delete a conversation
    deleteConversation: builder.mutation<{ success: boolean }, string>({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["conversations"],
    }),
  }),
});

export const {
  useCreateConversationMutation,
  useGetUserConversationsQuery,
  useDeleteConversationMutation,
} = conversationsApi;
