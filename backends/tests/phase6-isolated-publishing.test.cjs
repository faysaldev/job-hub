/**
 * Opt-in MUTATING staging test. Requires a dedicated, empty-quota recruiter company.
 * Never run against a real customer or production. Always attempts to archive fixture.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { URL } = require('node:url');
const origin = process.env.PHASE6_STAGING_URL?.replace(/\/$/, '');
const recruiter = process.env.PHASE6_STAGING_RECRUITER_TOKEN;
const enabled = process.env.PHASE6_MUTATION_APPROVED === 'YES' &&
  process.env.PHASE6_ISOLATED_TENANT === 'YES' && Boolean(origin) && Boolean(recruiter);
function ensureSafeTarget() {
  const u = new URL(origin);
  assert.equal(u.protocol, 'https:', 'Only HTTPS staging is supported');
  assert.match(u.hostname, /(?:^|[-.])(staging|stage|qa|test)(?:[-.]|$)/i,
    'Hostname must explicitly identify a test/staging environment');
  assert.ok(!/(?:^|\.)jobhub\.faysaldev\.com$/i.test(u.hostname), 'Production hostname refused');
}
async function call(route, options = {}) {
  const response = await fetch(`${origin}/api/v1${route}`, {
    ...options, signal: AbortSignal.timeout(15000),
    headers: { Authorization: `Bearer ${recruiter}`,
      ...(options.body ? { 'Content-Type':'application/json' } : {}), ...options.headers },
  });
  return { status: response.status, body: await response.json().catch(() => ({})) };
}

test('isolated recruiter draft → publish → public search → archive (R-01, R-02, R-06, R-07)',
  { skip: !enabled, timeout: 90000 }, async () => {
  ensureSafeTarget();
  const uniqueTitle = `Phase 6 QA Software Engineer ${Date.now()}`;
  const date = new Date(Date.now() + 14 * 86400000).toISOString();
  let jobId = null;
  try {
    const invalid = await call('/job', { method: 'POST', body: JSON.stringify({ status: 'published' }) });
    assert.ok([400,422].includes(invalid.status), `Expected field validation, got ${invalid.status}`);
    assert.match(JSON.stringify(invalid.body), /title|required|field/i);
    const created = await call('/job', { method: 'POST', body: JSON.stringify({ title: uniqueTitle, status: 'draft' }) });
    assert.equal(created.status, 201, `Draft creation failed: ${JSON.stringify(created.body).slice(0,500)}`);
    jobId = created.body?.data?._id;
    assert.match(String(jobId), /^[0-9a-f]{24}$/i);
    const valid = {
      title: uniqueTitle, category: 'Technology', subcategory: 'Software Engineering',
      type: 'full-time', location: 'Remote', locationType: 'remote',
      salaryMin: 40000, salaryMax: 60000, salaryPeriod: 'yearly', experienceLevel: 'junior',
      description: 'Isolated QA role for verification of the JobHub application workflow. No applications are accepted for this test.',
      requirements: ['Experience using TypeScript'], responsibilities: ['Write reliable code'],
      benefits: ['Remote work'], skills: ['TypeScript'], positions: 1, applicationDeadline: date,
    };
    const saved = await call(`/job/${jobId}`, { method: 'PUT', body: JSON.stringify({ ...valid, status: 'draft' }) });
    assert.equal(saved.status, 200, `Draft edit failed: ${JSON.stringify(saved.body).slice(0,500)}`);
    const stored = await call(`/job/${jobId}`);
    assert.equal(stored.status, 200);
    assert.equal(stored.body?.data?.title, uniqueTitle);
    const published = await call(`/job/${jobId}`, { method: 'PUT', body: JSON.stringify({ status: 'published' }) });
    assert.equal(published.status, 200, `Publishing failed: ${JSON.stringify(published.body).slice(0,500)}`);
    const results = await call(`/job?page=1&limit=50&q=${encodeURIComponent(uniqueTitle)}`);
    assert.equal(results.status, 200);
    assert.ok(results.body?.data?.jobs?.some(j => String(j._id) === jobId), 'Published job absent from public search');
    const closed = await call(`/job/${jobId}`, { method: 'DELETE' });
    assert.equal(closed.status, 200, 'Archiving the test job failed');
    const hidden = await call(`/job/${jobId}`);
    assert.equal(hidden.status, 404, 'Archived job remained publicly accessible');
  } finally {
    // Best effort cleanup if the earlier stage throws; inspect staging after partial failure.
    if (jobId) {
      try { await call(`/job/${jobId}`, { method: 'DELETE' }); }
      catch { console.error('WARNING: QA fixture may require manual archive:', jobId); }
    }
  }
});
