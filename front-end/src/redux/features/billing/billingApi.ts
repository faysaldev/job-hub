import { baseApi } from "@/src/redux/baseApi/baseApi";

export interface PlanLimits { activeJobs: number; teamSeats: number; monthlyCredits: number }
export interface BillingPlan {
  _id?: string; key: string; version: number; name: string; description: string;
  priceCents: number|null; currency: "usd"; limits: PlanLimits; features: string[];
  published?: boolean; isCurrent?: boolean; enterprise?: boolean;
}
export interface BillingDashboard {
  company: { id: string; name?: string }; teamRole: "owner"|"admin"|"recruiter"|"interviewer";
  plan: { key: string; version: number; name: string; limits: PlanLimits; priceCents: number; currency: "usd" };
  subscription: { status: string; paidThrough: string|null; paid: boolean; cancelAtPeriodEnd?: boolean };
  usage: { activeJobs: number; teamSeats: number; creditBalance: number; limits: PlanLimits };
  invoices: { _id: string; amountPaidCents: number; currency: string; invoiceUrl?: string; paidAt: string; planKey: string; planVersion: number }[];
  promotions: { _id: string; jobId: string; durationDays: number; status: string; source: string; startsAt?: string; endsAt?: string }[];
}
export type BillingAction = { action: "checkout"; planKey: string } | { action: "portal" } |
  { action: "sponsor"; jobId: string; durationDays: 7|30; payment: "credit"|"stripe"; requestId: string };
export type ManagePlanAction = { action: "publish"|"hide" } |
  { action: "duplicate"; newKey: string; newName: string } |
  { action: "edit"; changes: Partial<Omit<BillingPlan,"_id"|"key"|"version"|"published"|"isCurrent">> };
const billingApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    publicPlans: builder.query<{ data: { plans: BillingPlan[] } }, void>({
      query: () => "/billing/plans", providesTags: ["billingPlans"],
    }),
    billingDashboard: builder.query<{ data: BillingDashboard }, void>({
      query: () => "/billing/dashboard", providesTags: ["billing"],
    }),
    billingAction: builder.mutation<{ data: { checkoutUrl?: string; portalUrl?: string; status?: string } }, BillingAction>({
      query: body => ({ url: "/billing/actions", method: "POST", body }),
      invalidatesTags: ["billing", "jobs"],
    }),
    adminPlans: builder.query<{ data: { plans: BillingPlan[] } }, void>({
      query: () => "/billing/admin/plans", providesTags: ["billingPlans"],
    }),
    createBillingPlan: builder.mutation<{ data: { plan: BillingPlan } }, Omit<BillingPlan,"_id"|"published"|"isCurrent"|"version"|"currency">>({
      query: body => ({ url: "/billing/admin/plans", method: "POST", body }),
      invalidatesTags: ["billingPlans"],
    }),
    manageBillingPlan: builder.mutation<{ data: { plan: BillingPlan } }, { id: string; body: ManagePlanAction }>({
      query: ({ id, body }) => ({ url: `/billing/admin/plans/${id}`, method: "PATCH", body }),
      invalidatesTags: ["billingPlans", "billing"],
    }),
  }),
});
export const { usePublicPlansQuery, useBillingDashboardQuery, useBillingActionMutation,
  useAdminPlansQuery, useCreateBillingPlanMutation, useManageBillingPlanMutation } = billingApi;
