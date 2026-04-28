import { baseApi } from "@/src/redux/baseApi/baseApi";

const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /stripe/create-checkout-session - Create checkout for application boost
    createCheckoutSession: builder.mutation<{ url: string }, { applicationId?: string; amount: number }>({
      query: (body) => ({
        url: "/stripe/create-checkout-session",
        method: "POST",
        body,
      }),
    }),

    // GET /stripe/payment-details/:sessionId - Get payment details
    getPaymentDetails: builder.query<any, string>({
      query: (sessionId) => ({
        url: `/stripe/payment-details/${sessionId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetPaymentDetailsQuery,
} = stripeApi;
