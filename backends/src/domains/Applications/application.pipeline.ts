/** Canonical ATS lifecycle. Keep the allowed actions with the server, not in UI guesses. */
export const APPLICATION_TRANSITIONS: Readonly<Record<string, readonly string[]>> = Object.freeze({
  applied: ["under_review", "shortlisted", "rejected"],
  under_review: ["shortlisted", "interview", "hired", "rejected"],
  shortlisted: ["interview", "hired", "rejected"],
  interview: ["shortlisted", "hired", "rejected"],
  offer: ["hired", "rejected"],
  rejected: [],
  hired: [],
});

export const allowedATSStages = (status: string, offerStatus?: string) =>
  (APPLICATION_TRANSITIONS[status] || []).filter((next) =>
    next !== "hired" || !offerStatus || offerStatus === "accepted");
