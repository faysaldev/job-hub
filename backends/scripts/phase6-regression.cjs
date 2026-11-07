#!/usr/bin/env node
/** Offline regression gate for the previously implemented phases. Does NOT certify runtime behavior. */
const { spawnSync } = require('node:child_process');
const checks = [
  ['Phase 1', 'scripts/phase1-static-security-check.cjs'],
  ['Phase 3', 'scripts/phase3-static-check.cjs'],
  ['Phase 4', 'scripts/phase4-static-check.cjs'],
  ['Phase 5', 'scripts/phase5-static-check.cjs'],
];
let failures = 0;
for (const [label, file] of checks) {
  const result = spawnSync(process.execPath, [file], { stdio: 'inherit', cwd: process.cwd() });
  console.log(`${label} static regression: ${result.status === 0 ? 'PASS' : 'FAIL'}`);
  if (result.status !== 0) failures++;
}
const six = spawnSync(process.execPath, ['--test', 'tests/phase6-static.test.cjs'], { stdio: 'inherit', cwd: process.cwd() });
console.log(`Phase 6 static security: ${six.status === 0 ? 'PASS' : 'FAIL'}`);
if (six.status !== 0) failures++;
if (failures) { console.error(`${failures} static groups failed`); process.exit(1); }
console.log('All offline static security checks passed. Live service and UI tests still required.');
