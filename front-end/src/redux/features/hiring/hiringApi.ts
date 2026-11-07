import { baseApi } from "@/src/redux/baseApi/baseApi";
export type TeamRole = "owner" | "admin" | "recruiter" | "interviewer";
export interface TeamMember {
  _id: string; email: string; role: TeamRole; status: "invited" | "active" | "removed";
  companyId?: { _id: string; companyName?: string; careersSlug?: string } | string;
  userId?: string;
}
export interface CompanyWorkspace {
  _id: string; userId: string; companyName?: string; careersSlug?: string; careersHeadline?: string;
  careersDescription?: string; careersEnabled?: boolean;
  verification?: { status: "unverified" | "pending" | "verified" | "rejected" };
}
export interface TeamResponse { workspace: null | { company: CompanyWorkspace; teamRole: TeamRole; members: TeamMember[] }; invitations: TeamMember[] }
export interface Envelope<T> { data: T; message: string; status: string }
export type ApplicationStage = "applied" | "under_review" | "shortlisted" | "interview" | "offer" | "hired" | "rejected";
export interface ATSApplication {
  _id: string; status: ApplicationStage; isWithdrawn?: boolean;
  applicant: { _id: string; name: string; image?: string; email?: string };
  job_id: { _id: string; title: string; author: string };
  resume_url: string; cover_letter?: string; createdAt: string;
  stageHistory?: Array<{ from?: string; to: string; note?: string; at: string }>;
  internalNotes?: Array<{ text: string; authorId: string; createdAt: string }>;
  offer?: { salary: number; currency: string; message?: string; expiresAt: string; status: "sent" | "accepted" | "declined" | "expired" };
}
const hiringApi = baseApi.injectEndpoints({ endpoints: (builder) => ({
  getTeam: builder.query<Envelope<TeamResponse>, void>({
    query: () => "/recruiter-company/team", providesTags: ["company"],
  }),
  inviteTeamMember: builder.mutation<Envelope<TeamMember>, { email: string; role: Exclude<TeamRole, "owner"> }>({
    query: (body) => ({ url: "/recruiter-company/team", method: "POST", body }), invalidatesTags: ["company"],
  }),
  manageTeamMember: builder.mutation<Envelope<unknown>, { id: string; action: "accept" | "remove" | "role"; role?: Exclude<TeamRole, "owner"> }>({
    query: ({ id, ...body }) => ({ url: `/recruiter-company/team/${id}`, method: "PATCH", body }),
    invalidatesTags: ["company", "jobs", "applications"],
  }),
  requestCompanyVerification: builder.mutation<Envelope<unknown>, void>({
    query: () => ({ url: "/recruiter-company/verification-request", method: "POST" }), invalidatesTags: ["company"],
  }),
}) });
export const { useGetTeamQuery, useInviteTeamMemberMutation, useManageTeamMemberMutation,
  useRequestCompanyVerificationMutation } = hiringApi;
