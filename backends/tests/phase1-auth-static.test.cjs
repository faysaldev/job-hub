/** Source contract tests. Run npm run typecheck and the staging smoke in addition. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = name => fs.readFileSync(path.resolve(__dirname, '../src/', name), 'utf8');

test('authentication endpoints maintain the existing minimal API', () => {
  const routes = source('domains/Auth/auth.route.ts');
  for (const endpoint of ['register', 'verify-email', 'login', 'forgot-password', 'reset-password', 'resend-verification', 'refresh', 'logout']) {
    assert.ok(routes.includes(`"/${endpoint}"`), `${endpoint} missing`);
  }
  assert.match(routes, /requireTrustedOrigin/);
  assert.match(routes, /rateLimit/);
});

test('JWT lifetime, maximum session count and atomic refresh claims', () => {
  const session = source('domains/Auth/auth.token.services.ts');
  assert.match(session, /ACCESS_TTL_SECONDS\s*=\s*15\s*\*\s*60/);
  assert.match(session, /REFRESH_TTL_SECONDS\s*=\s*30\s*\*\s*24\s*\*\s*60\s*\*\s*60/);
  assert.match(session, /MAX_SESSIONS\s*=\s*3/);
  assert.match(session, /refreshHash:\s*oldHash/);
  assert.match(session, /previousRefreshValidUntil/);
  assert.match(session, /revokeAllSessions/);
  assert.match(session, /sign\(user, claims\.sid, "access"\)/);
});

test('signup creates an outbox task rather than tying success to an SMTP send', () => {
  const auth = source('domains/Auth/auth.service.ts');
  const queue = source('lib/mail.outbox.ts');
  assert.match(auth, /enqueueAuthEmail/);
  assert.doesNotMatch(auth, /await sendEmail/);
  assert.match(queue, /aes-256-gcm/);
  assert.match(queue, /findOneAndUpdate/);
  assert.match(queue, /MAX_ATTEMPTS\s*=\s*5/);
  assert.match(source('lib/mail.outbox.model.ts'), /expireAfterSeconds:\s*0/);
});

test('passwords are neither trimmed nor exposed and account actions revoke sessions', () => {
  const model = source('domains/User/user.model.ts');
  const password = model.slice(model.indexOf('    password: {'), model.indexOf('    role: {'));
  assert.doesNotMatch(password, /trim:\s*true/);
  assert.match(password, /select:\s*false/);
  assert.match(source('domains/User/user.services.ts'), /revokeAllSessions/);
  assert.match(source('domains/User/user.route.ts'), /delete-profile/);
});
