#!/usr/bin/env node
/** Gate release on real evidence. A skipped Playwright test is NOT a pass. */
const { readFileSync } = require('node:fs');
const path = require('node:path');
const matrix = require('../qa/phase6-regression-matrix.json').scenarios;
const target = process.argv[2];
if (!target || target === '--help') {
  console.error('Usage: node scripts/phase6-evidence-gate.cjs /secure/path/to/staging-evidence.json');
  process.exit(2);
}
let evidence;
try { evidence = JSON.parse(readFileSync(path.resolve(target), 'utf8')); }
catch { console.error('Unable to read JSON evidence file'); process.exit(2); }
const missing = [];
const failures = [];
const hasCommit = value => typeof value === 'string' && /^[a-f0-9]{7,64}$/i.test(value);
const evidenceRef = ref => typeof ref === 'string' && /^(https:\/\/|s3:\/\/|gs:\/\/|artifact:|run:)/i.test(ref.trim()) && ref.trim().length > 16;
const timestamp = Date.parse(evidence.verifiedAt);
const current = Date.now();
if (!String(evidence.environment || '').startsWith('staging')) failures.push('Environment must identify isolated staging');
if (!hasCommit(evidence.frontendCommit) || !hasCommit(evidence.backendCommit)) failures.push('Frontend/backend deployment Git SHAs required');
if (!Number.isFinite(timestamp) || timestamp > current || current - timestamp > 7 * 24 * 3600_000) failures.push('Verification must be from the last 7 days');
for (const row of matrix) {
  const item = evidence.cases?.[row.id];
  if (item?.status !== 'passed' || !Array.isArray(item.evidence) || !item.evidence.some(ref =>
    evidenceRef(ref))) {
    missing.push({ id: row.id, severity: row.severity, status: item?.status || 'missing' });
  }
}
const summary = { total: matrix.length, passedWithEvidence: matrix.length - missing.length,
  criticalOpen: missing.filter(row => row.severity === 'Critical').length,
  highOpen: missing.filter(row => row.severity === 'High').length,
  missing, metadataIssues: failures, release: missing.length || failures.length ? 'BLOCKED' : 'ELIGIBLE_FOR_FINAL_REVIEW' };
console.log(JSON.stringify(summary, null, 2));
// This check does not itself deploy or certify production infrastructure.
if (missing.length || failures.length) process.exitCode = 2;
