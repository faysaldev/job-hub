/** Offline source tests. They validate invariants, not runtime MongoDB/Stripe behavior. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = p => fs.readFileSync(path.join(__dirname, '..', 'src', p), 'utf8');
const scripts = p => fs.readFileSync(path.join(__dirname, '..', 'scripts', p), 'utf8');
const has = (p, pattern) => assert.match(src(p), pattern);

test('staff API is guarded by verified login and admin role', () => {
  has('domains/Operations/operations.route.ts', /router\.use\(authMiddleware\)/);
  has('domains/Operations/operations.route.ts', /router\.use\(requireRoles\("admin"\)\)/);
  has('domains/Operations/operations.route.ts', /router\.post\("\/actions"/);
});
test('recruiter analytics requires recruiter role and company access', () => {
  has('domains/Operations/operations.route.ts', /requireRoles\("recruiter"\), controller\.recruiter/);
  has('domains/Operations/operations.services.ts', /companyForActor\(actorId, "view"\)/);
  has('domains/Operations/operations.services.ts', /companyJobs\(company\)/);
});
test('staff actions validated using strict discriminator rather than client-provided paths', () => {
  has('domains/Operations/operations.validation.ts', /z\.discriminatedUnion\("action"/);
  has('domains/Operations/operations.controller.ts', /adminActions\.parse\(req\.body\)/);
  has('domains/Operations/operations.services.ts', /transactional\(async session/);
});
test('prohibited self-suspension and staff suspension', () => {
  has('domains/Operations/operations.services.ts', /action\.userId === actorId/);
  has('domains/Operations/operations.services.ts', /role: \{ \$ne: "admin" \}/);
});
test('suspended accounts cannot log in, refresh or use access token', () => {
  has('domains/Auth/auth.service.ts', /user\.suspendedAt \|\|/);
  has('domains/Auth/auth.token.services.ts', /user\.isDeleted \|\| user\.suspendedAt/);
  has('domains/Operations/operations.services.ts', /await AuthSession\.updateMany/);
});
test('moderation cannot be bypassed by editing or scheduler', () => {
  has('domains/Jobs/job.services.ts', /current\.moderation\?\.status === "blocked"/);
  const checks = (src('domains/Jobs/job.services.ts').match(/"moderation\.status": \{ \$ne: "blocked" \}/g) || []).length;
  assert.ok(checks >= 4, `expected 4 public/scheduled filters, got ${checks}`);
  has('domains/Applications/application.services.ts', /"moderation\.status": \{ \$ne: "blocked" \}/);
  has('domains/Company/company.workspace.ts', /"moderation\.status": \{ \$ne: "blocked" \}/);
});
test('private R2 objects do not have admin bypass and company files use membership', () => {
  has('domains/Asset/asset.services.ts', /let permitted = asset\.owner\.toString\(\) === actorId/);
  has('domains/Asset/asset.services.ts', /companyForActor\(actorId, "applications"\)/);
  assert.doesNotMatch(src('domains/Asset/asset.services.ts'), /role === "admin"/);
});
test('reports do not disclose other candidate reports through public APIs', () => {
  has('domains/Operations/operations.route.ts', /router\.post\("\/reports"/);
  assert.doesNotMatch(src('domains/Operations/operations.route.ts'), /router\.get\("\/reports"/);
  has('domains/Operations/operations.services.ts', /Report\.exists\(\{ reporterId/);
});
test('stripe reconciliation is read only and retries retrieve Stripe event over authenticated API', () => {
  has('domains/Operations/operations.services.ts', /new Stripe\(process\.env\.STRIPE_SECRET_KEY\)\.invoices\.retrieve/);
  has('domains/Operations/operations.services.ts', /new Stripe\(process\.env\.STRIPE_SECRET_KEY\)\.events\.retrieve/);
  has('domains/Operations/operations.services.ts', /processStripeEvent\(verified\)/);
});
test('production probes only expose safe statuses', () => {
  has('server.ts', /\/healthz/);
  has('server.ts', /\/readyz/);
  has('middlewares/logger.middleware.ts', /X-Request-ID/);
  assert.doesNotMatch(src('middlewares/logger.middleware.ts'), /req\.originalUrl|req\.headers\.authorization|req\.body/);
});
test('index/backup tools are opt-in and never drop indexes', () => {
  assert.match(scripts('phase6-indexes.cjs'), /PHASE6_INDEXES_APPROVED/);
  assert.doesNotMatch(scripts('phase6-indexes.cjs'), /\.dropIndexes?\(/);
  assert.match(scripts('phase6-backup.cjs'), /PHASE6_BACKUP_APPROVED/);
  assert.doesNotMatch(scripts('phase6-backup.cjs'), /mongorestore/);
});

test('suspended users are disconnected from any existing real-time rooms', () => {
  has('domains/Operations/operations.services.ts', /disconnectSockets\(true\)/);
  has('config/socketio.ts', /socket\.use\(async \(_packet, next\)/);
  has('config/socketio.ts', /await verifyAccess\(socket\.token!\)/);
});
