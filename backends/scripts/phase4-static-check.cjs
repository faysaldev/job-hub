#!/usr/bin/env node
/** Source-level integration checks only; not a substitute for runtime tests. */
const fs = require("fs"), path = require("path"), assert = require("assert/strict");
const src = p => fs.readFileSync(path.resolve(__dirname, "../src", p), "utf8");
const checks = [
  ["team endpoints require recruiter role", "domains/Company/company.route.ts", /router\.post\("\/team", authMiddleware, requireRoles\("recruiter"\)/],
  ["team membership company boundary", "domains/Company/company.workspace.ts", /member\.companyId\.toString\(\)/],
  ["team member cannot invite own role", "domains/Company/company.workspace.ts", /teamRole !== "owner"/],
  ["jobs protected by company membership", "domains/Jobs/job.services.ts", /companyForActor\(actorId, "jobs"\)/],
  ["draft jobs not public", "domains/Jobs/job.services.ts", /status: \{ \$in: \["published", null\] \}/],
  ["private applicants scoped to applications permission", "domains/Applications/application.services.ts", /companyForActor\(actorId, "applications"\)/],
  ["candidate responses remove private internal notes", "domains/Applications/application.services.ts", /select\("-internalNotes -stageHistory\.note"\)/],
  ["offer acceptance requires current unexpired offer", "domains/Applications/application.services.ts", /"offer\.expiresAt": \{ \$gt: new Date\(\) \}/],
  ["withdrawal restricted to applicant", "domains/Applications/application.services.ts", /applicant: applicantId/],
  ["assigned scorecards only", "domains/Interviews/interviews.services.ts", /requireAssignee && String\(interview\.interviewer\) !== actor/],
  ["interview assignee must be active teammate", "domains/Interviews/interviews.services.ts", /CompanyMember\.exists\(\{ companyId: company\._id/],
  ["recruiter can manage only company jobs", "domains/Company/company.access.ts", /job\.companyId\.toString\(\) === company\._id\.toString\(\)/],
  ["public resumes excluded", "domains/Seeker/seeker.services.ts", /select\("-resume -profileStrength -preferences"\)/],
  ["saved searches owned by account", "domains/SavedJobs/savedsearch.controller.ts", /userId: req\.user!\._id/],
  ["job alert scheduler not public endpoint", "scripts/phase4-scheduler.ts", /runJobAlerts\(\)/],
  ["private resume access still scoped to company", "domains/Asset/asset.services.ts", /companyForActor\(actorId, "applications"\)/],
];
for (const [name, file, pattern] of checks) {
  const data = src(file); assert.match(data, pattern, name); console.log("PASS", name);
}
console.log(`${checks.length} source checks passed (NO live API, browser or payment verification).`);
