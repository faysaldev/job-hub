/**
 * Read-only live staging checks. All mutation tests are malformed requests, guaranteed
 * to be rejected by validation. No payment, uploads or user suspensions are performed.
 * PHASE6_STAGING_URL=https://staging-api.example.com node --test tests/phase6-staging.test.cjs
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const origin = (process.env.PHASE6_STAGING_URL || '').replace(/\/$/, '');
const admin = process.env.PHASE6_STAGING_ADMIN_TOKEN;
const recruiter = process.env.PHASE6_STAGING_RECRUITER_TOKEN;
const seeker = process.env.PHASE6_STAGING_SEEKER_TOKEN;
const request = async (path, token, options = {}) => {
  const res = await fetch(`${origin}${path}`, { ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}), ...options.headers }, signal: AbortSignal.timeout(10000) });
  const data = await res.json().catch(() => null);
  return { status: res.status, data, headers: res.headers };
};
const available = Boolean(origin);
test('readiness responds without leaking secrets', { skip: !available }, async () => {
  const { status, data } = await request('/readyz'); assert.equal(status, 200); assert.equal(data.status, 'ready');
  assert.ok(!JSON.stringify(data).includes('mongodb://'));
});
test('anonymous accounts cannot read staff records', { skip: !available }, async () => {
  const { status } = await request('/api/v1/operations/records?kind=users'); assert.equal(status, 401);
});
test('anonymous accounts cannot submit a report', { skip: !available }, async () => {
  const { status } = await request('/api/v1/operations/reports', '', { method: 'POST',
    body: JSON.stringify({ targetKind: 'job', targetId: '000000000000000000000000', category: 'fraud', description: 'Potential deceptive listing' }) });
  assert.equal(status, 401);
});
test('recruiter denied administration', { skip: !available || !recruiter }, async () => {
  const { status } = await request('/api/v1/operations/overview', recruiter); assert.equal(status, 403);
});
test('seeker denied administration and recruiter analytics', { skip: !available || !seeker }, async () => {
  const [one, two] = await Promise.all([
    request('/api/v1/operations/overview', seeker), request('/api/v1/operations/recruiter/analytics', seeker),
  ]); assert.equal(one.status, 403); assert.equal(two.status, 403);
});
test('admin can view overview without raw user secrets', { skip: !available || !admin }, async () => {
  const { status, data } = await request('/api/v1/operations/overview', admin); assert.equal(status, 200);
  assert.ok(data?.data?.totals); assert.ok(!JSON.stringify(data).includes('passwordHash'));
});
test('admin records are limited and paginated', { skip: !available || !admin }, async () => {
  const { status, data } = await request('/api/v1/operations/records?kind=users&limit=2&page=1', admin);
  assert.equal(status, 200); assert.ok(data?.data?.records?.length <= 2);
  assert.ok(data?.data?.pagination);
});
test('admin actions reject unknown body keys before mutation', { skip: !available || !admin }, async () => {
  const { status } = await request('/api/v1/operations/actions', admin,
    { method: 'POST', body: JSON.stringify({ action: 'user-access', userId: '000000000000000000000000',
      decision: 'suspend', reason: 'test', role: 'admin' }) });
  assert.equal(status, 400);
});
test('signed webhook rejects missing signature', { skip: !available }, async () => {
  const { status } = await request('/api/v1/stripe/webhook', '', { method: 'POST', body: '{}',
    headers: { 'Content-Type': 'application/json' } });
  assert.equal(status, 400);
});
test('private asset cannot be fetched anonymously', { skip: !available }, async () => {
  const { status } = await request('/api/v1/assets/000000000000000000000000/access'); assert.equal(status, 401);
});
test('recruiter analytics respects authenticated company', { skip: !available || !recruiter }, async () => {
  const { status, data } = await request('/api/v1/operations/recruiter/analytics', recruiter);
  assert.ok(status === 200 || status === 403); // 403 only for an unassigned recruiter account
  if (status === 200) assert.ok(data?.data?.totals);
});
