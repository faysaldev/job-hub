/** Offline source-level regression checks only: NOT a replacement for DB/E2E tests. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..", "src");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const cases = [
  ["public signup role restricted", "domains/Auth/auth.validation.ts", /z\.enum\(\["seeker", "recruiter"\]\)/],
  ["auth cookies are HTTP only", "domains/Auth/auth.controller.ts", /httpOnly:\s*true/],
  ["refresh session rotated atomically", "domains/Auth/auth.token.services.ts", /refreshHash:\s*hash\(oldRefresh\)/],
  ["refresh sessions are revocable", "domains/Auth/auth.token.services.ts", /revokedAt:\s*\{\s*\$exists:\s*false/],
  ["password excluded from user selection", "domains/User/user.model.ts", /select:\s*false/],
  ["user updates allowlisted", "domains/User/user.services.ts", /updateProfileValidation\.parse/],
  ["job mutation requires recruiter", "domains/Jobs/job.route.ts", /requireRoles\("recruiter"\)/],
  ["job mutation scoped to author", "domains/Jobs/job.services.ts", /author:\s*requesterId/],
  ["applications scoped to applicant", "domains/Applications/application.services.ts", /applicant:\s*applicantId/],
  ["application status scoped to owner", "domains/Applications/application.services.ts", /author:\s*actorId/],
  ["interviews cross-check job owner", "domains/Interviews/interviews.services.ts", /author:\s*recruiterId/],
  ["conversation membership enforced", "domains/Conversations/conversations.services.ts", /participants:\s*userId/],
  ["messages scoped to sender", "domains/Messages/message.services.ts", /senderId:\s*actorId/],
  ["message cache checked after member auth", "config/socketio.ts", /ensureParticipant\(id, userId\)/],
  ["stripe webhook signature checked", "domains/Stripe/stripe.controller.ts", /webhooks\.constructEvent/],
  ["stripe price determined on server", "domains/Stripe/stripe.controller.ts", /APPLICATION_BOOST_PRICE_CENTS/],
  ["stripe webhook mounted before JSON", "server.ts", /express\.raw\([\s\S]*?app\.use\(express\.json/],
  ["CORS is explicit allowlist", "config/cors.ts", /allowedOrigins\.has\(origin\)/],
  ["login protected by rate limiter", "domains/Auth/auth.route.ts", /authRate/],
  ["public seeker resume hidden", "domains/Seeker/seeker.services.ts", /\.select\("-resume/],
  ["job deletion is non destructive", "domains/Jobs/job.services.ts", /isDeleted:\s*true, isActive:\s*false/],
];
let failures = 0;
for (const [name, file, pattern] of cases) {
  const found = pattern.test(read(file));
  console.log(`${found ? "PASS" : "FAIL"} ${name}`);
  if (!found) failures++;
}
console.log(`${cases.length - failures}/${cases.length} source invariants present.`);
if (failures) process.exitCode = 1;
