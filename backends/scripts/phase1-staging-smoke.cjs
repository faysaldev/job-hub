#!/usr/bin/env node
/**
 * End-to-end auth smoke against STAGING only, using a Mailpit inbox connected
 * to the staging SMTP transport. Creates and then disables one account per role.
 * Required: PHASE1_STAGING_API_URL, PHASE1_MAILPIT_URL, PHASE1_TEST_EMAIL_DOMAIN,
 *           PHASE1_CONFIRM_STAGING=yes
 * Example: PHASE1_STAGING_API_URL=https://api.staging.example.com \
 *          PHASE1_MAILPIT_URL=https://mailpit.staging.example.com \
 *          PHASE1_TEST_EMAIL_DOMAIN=staging.example.com PHASE1_CONFIRM_STAGING=yes \
 *          node scripts/phase1-staging-smoke.cjs
 */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const base = (process.env.PHASE1_STAGING_API_URL || '').replace(/\/$/, '');
const mailboxUrl = (process.env.PHASE1_MAILPIT_URL || '').replace(/\/$/, '');
const domain = process.env.PHASE1_TEST_EMAIL_DOMAIN;
if (!base || !mailboxUrl || !domain || process.env.PHASE1_CONFIRM_STAGING !== 'yes' ||
    !/^https?:\/\//.test(base) || !/^https?:\/\//.test(mailboxUrl)) {
  console.error('Configure staging API, Mailpit, test email domain, and PHASE1_CONFIRM_STAGING=yes. No requests were sent.');
  process.exit(2);
}
if (!/^[a-z0-9.-]+$/i.test(domain) || domain.includes('..')) throw new Error('Invalid test email domain');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const extractCookie = res => (res.headers.getSetCookie?.() || [res.headers.get('set-cookie') || ''])
  .find(value => value.startsWith('jobhub_refresh='))?.split(';')[0] || '';

const request = async (path, method, body, { cookie, token } = {}) => {
  const res = await fetch(`${base}/api/v1${path}`, {
    method, headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: cookie } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = {};
  try { json = await res.json(); } catch { /* fail later on missing payload */ }
  return { res, json, cookie: extractCookie(res) };
};
const messageText = async (email, purpose) => {
  const res = await fetch(`${mailboxUrl}/api/v1/messages?limit=100`);
  assert.equal(res.status, 200, 'Mailpit must be available');
  const list = await res.json();
  const item = (list.messages || list.Items || []).find(message =>
    (message.To || message.to || []).some(recipient =>
      (recipient.Address || recipient.address || '').toLowerCase() === email.toLowerCase()) &&
    String(message.Subject || message.subject || '').toLowerCase().includes(purpose));
  if (!item) return null;
  const detail = await fetch(`${mailboxUrl}/api/v1/message/${encodeURIComponent(item.ID || item.id)}`);
  assert.equal(detail.status, 200);
  const content = await detail.json();
  return content.Text || content.text || '';
};
const receiveCode = async (email, purpose) => {
  for (let retry = 0; retry < 60; retry++) {
    const message = await messageText(email, purpose);
    const match = message && message.match(/[?&]code=(\d{6})/);
    if (match) return match[1];
    await sleep(2_000);
  }
  throw new Error(`Verification email not delivered to the staging inbox (${purpose})`);
};
const verifyRole = async role => {
  const email = `phase1-${role}-${crypto.randomBytes(5).toString('hex')}@${domain}`;
  const password = `Start${crypto.randomBytes(9).toString('hex')}9`;
  const newPassword = `Change${crypto.randomBytes(9).toString('hex')}9`;
  const phoneNumber = `+1555${crypto.randomInt(1000000, 9999999)}`;
  console.info(`Testing ${role} registration, verification, login, refresh, reset and deletion`);
  const created = await request('/auth/register', 'POST', { name: `Phase1 ${role} test`, email, password, phoneNumber, role });
  assert.equal(created.res.status, 201, `register: ${created.json.message || created.res.status}`);
  const code = await receiveCode(email, 'verify');
  const verified = await request('/auth/verify-email', 'POST', { email, code: Number(code) });
  assert.equal(verified.res.status, 200, `verify-email: ${verified.json.message || verified.res.status}`);
  assert.ok(verified.cookie, 'HttpOnly refresh cookie missing');
  let token = verified.json.data?.accessToken;
  assert.ok(token, 'access token missing');
  const profile = await request('/users/self/in', 'GET', undefined, { token });
  assert.equal(profile.res.status, 200, 'protected account GET failed');
  assert.equal(profile.json.data?.email, email);
  const renewed = await request('/auth/refresh', 'POST', undefined, { cookie: verified.cookie });
  assert.equal(renewed.res.status, 200, 'refresh failed');
  assert.ok(renewed.cookie && renewed.json.data?.accessToken, 'refreshed credentials missing');
  token = renewed.json.data.accessToken;
  const unknown = await request('/auth/login', 'POST', { email: `missing-${crypto.randomBytes(4).toString('hex')}@${domain}`, password });
  assert.equal(unknown.res.status, 401, 'unknown-account login must return 401');
  assert.ok(unknown.json.message, 'failure must have an actionable message');
  const forgot = await request('/auth/forgot-password', 'POST', { email });
  assert.equal(forgot.res.status, 200);
  const resetCode = await receiveCode(email, 'reset');
  const reset = await request('/auth/reset-password', 'POST', { email, code: resetCode, newPassword });
  assert.equal(reset.res.status, 200, 'password reset failed');
  const revoked = await request('/users/self/in', 'GET', undefined, { token });
  assert.equal(revoked.res.status, 401, 'password reset must revoke old access tokens');
  const signin = await request('/auth/login', 'POST', { email, password: newPassword });
  assert.equal(signin.res.status, 200, 'sign in after reset failed');
  const removed = await request('/users/delete-profile', 'DELETE', { password: newPassword },
    { token: signin.json.data?.accessToken, cookie: signin.cookie });
  assert.equal(removed.res.status, 200, 'test account cleanup failed');
  console.info(`PASS ${role}: registration, verification, protected route, refresh, reset, cleanup`);
};

void (async () => {
  await verifyRole('seeker');
  await verifyRole('recruiter');
  console.info('PASS Phase 1 staging auth smoke (30-minute browser idle/reload still requires Playwright or manual verification)');
})().catch(error => { console.error('FAIL Phase 1 staging auth smoke:', error.message); process.exitCode = 1; });
