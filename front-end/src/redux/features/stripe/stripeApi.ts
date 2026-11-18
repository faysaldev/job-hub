import { baseApi } from "@/src/redux/baseApi/baseApi";

export interface BoostOffer {
  available: boolean; priceCents: number | null; currency: "usd"; description: string;
}
export interface BoostCheckout {
  status: "checkout" | "verifying"; sessionId: string; checkoutUrl: string | null;
}
export interface BoostPaymentDetails {
  sessionId: string; checkoutStatus: "open" | "complete" | "expired" | null;
  paymentStatus: string; amountTotal: number; currency: string;
  benefitStatus: "none" | "pending" | "paid" | "refunded";
  benefitActivated: boolean; completed: boolean;
}
const stripeApi = baseApi.injectEndpoints({ endpoints: builder => ({
  // The quoted price always comes from backend configuration; never client constants.
  getBoostOffer: builder.query<{ data: BoostOffer }, void>({
    query: () => "/stripe/boost-offer", keepUnusedDataFor: 60,
  }),
  createCheckoutSession: builder.mutation<{ data: BoostCheckout }, { applicationId: string }>({
    query: body => ({ url: "/stripe/create-checkout-session", method: "POST", body }),
    invalidatesTags: ["applications"],
  }),
  getPaymentDetails: builder.query<{ data: BoostPaymentDetails }, string>({
    query: sessionId => `/stripe/payment-details/${encodeURIComponent(sessionId)}`,
    providesTags: ["applications"],
  }),
}) });
export const { useGetBoostOfferQuery, useCreateCheckoutSessionMutation, useGetPaymentDetailsQuery } = stripeApi;
