import { baseApi } from "@/src/redux/baseApi/baseApi";

export type RecordKind = "companies"|"jobs"|"users"|"reports"|"support"|"subscriptions"|"invoices"|"stripe-events"|"audit";
export interface OpsOverview {
  generatedAt: string;
  totals: { users: number; companies: number; jobs: number; applications: number };
  attention: { pendingVerification: number; pendingReports: number; openSupport: number; failedStripeEvents: number; pastDue: number };
  last30Days: { newUsers: number; newApplications: number; paidUsdCents: number; paidInvoices: number; sponsoredJobs: number };
  applicationsPerDay: { day: string; count: number }[];
}
export interface OpsRecord {
  _id: string; companyName?: string; name?: string; email?: string; website?: string; title?: string; subject?: string;
  status?: string; role?: string; isActive?: boolean; suspendedAt?: string;
  verification?: { status?: string }; moderation?: { status?: string; reason?: string };
  companyId?: { companyName?: string } | string; author?: { name?: string; email?: string };
  targetKind?: string; targetId?: string; category?: string; description?: string;
  lastError?: string; action?: string; reason?: string; createdAt?: string; paidAt?: string;
  stripeInvoiceId?: string; amountPaidCents?: number; currency?: string;
  stripeStatus?: string; planKey?: string; snapshot?: { name?: string };
  reviewerId?: string; message?: string; fullName?: string; resolutionNote?: string;
}
export interface OpsRecords { kind: RecordKind; records: OpsRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number }; }
export type OpsAction =
  | { action: "verify-company"; companyId: string; decision: "verified"|"rejected"; reason: string }
  | { action: "moderate-job"; jobId: string; decision: "blocked"|"restored"; reason: string }
  | { action: "user-access"; userId: string; decision: "suspend"|"restore"; reason: string }
  | { action: "review-report"; reportId: string; decision: "reviewing"|"resolved"|"dismissed"; reason: string }
  | { action: "support"; contactId: string; decision: "open"|"in_progress"|"resolved"; reason: string }
  | { action: "reconcile-invoice"; invoiceId: string }
  | { action: "retry-stripe-event"; eventId: string };
export interface RecruiterAnalytics {
  generatedAt: string; windowDays: number;
  totals: { totalJobs: number; openJobs: number; applications: number; completedInterviews: number;
    activePromotions: number; paidPromotions: number };
  funnel: { stage: string; count: number }[];
  applicationsPerDay: { day: string; count: number }[];
  caveat: string;
}
export type AbuseReport = { targetKind: "job"|"company"|"user"; targetId: string;
  category: "spam"|"fraud"|"harassment"|"misleading"|"other"; description: string };

const api = baseApi.injectEndpoints({ endpoints: builder => ({
  operationsOverview: builder.query<{ data: OpsOverview }, void>({
    query: () => "/operations/overview", providesTags: ["operations"],
  }),
  operationsRecords: builder.query<{ data: OpsRecords }, { kind: RecordKind; page: number; limit?: number; status?: string; search?: string }>({
    query: args => ({ url: "/operations/records", params: args }), providesTags: ["operations"],
  }),
  operationsAction: builder.mutation<{ data: Record<string, unknown> }, OpsAction>({
    query: body => ({ url: "/operations/actions", method: "POST", body }),
    invalidatesTags: ["operations", "jobs", "billing", "company"],
  }),
  recruiterAnalytics: builder.query<{ data: RecruiterAnalytics }, void>({
    query: () => "/operations/recruiter/analytics", providesTags: ["analytics"],
  }),
  submitAbuseReport: builder.mutation<{ data: { _id: string; status: string } }, AbuseReport>({
    query: body => ({ url: "/operations/reports", method: "POST", body }),
  }),
}) });
export const { useOperationsOverviewQuery, useOperationsRecordsQuery, useOperationsActionMutation,
  useRecruiterAnalyticsQuery, useSubmitAbuseReportMutation } = api;
