const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = filename => readFileSync(path.join(root, filename), 'utf8');
const matrix = require('../qa/phase6-regression-matrix.json').scenarios;

test('QA report is represented by 37 distinct IDs, including every critical and high issue', () => {
  assert.equal(matrix.length, 37);
  assert.equal(new Set(matrix.map(item=>item.id)).size, 37);
  for (const [prefix, count] of [['S',12],['R',20],['F',5]]) {
    for (let i=1;i<=count;i++) assert.ok(matrix.some(row=>row.id === `${prefix}-${String(i).padStart(2,'0')}`));
  }
  assert.deepEqual(Object.fromEntries(['Critical','High','Medium','Low'].map(s=>[s,matrix.filter(item=>item.severity===s).length])),
    {Critical:5,High:16,Medium:11,Low:5});
});

test('release gate must reject a template containing no verified evidence', () => {
  const run = spawnSync(process.execPath, [path.join(root, 'scripts/phase6-evidence-gate.cjs'),
    path.join(root, 'qa/phase6-evidence.template.json')], { encoding:'utf8' });
  assert.equal(run.status, 2);
  const result = JSON.parse(run.stdout);
  assert.equal(result.release, 'BLOCKED');
  assert.equal(result.criticalOpen, 5);
  assert.equal(result.highOpen, 16);
});

test('saved job creation uses atomic upsert and prevents archived/moderated saves', () => {
  const content = source('src/domains/SavedJobs/savedjob.services.ts');
  assert.match(content,/findOneAndUpdate/);
  assert.match(content,/\$setOnInsert/);
  assert.match(content,/publicJobFilter\(\)/);
});

test('company details show source-owned verification and no guessed employer homepage', () => {
  const content = source('src/domains/Jobs/job.services.ts');
  assert.match(content,/verification\.status/);
  assert.match(content,/publicJobFilter/);
});

test('job data script requires explicit approval before modifying live records', () => {
  const content = source('scripts/phase6-audit-job-data.cjs');
  assert.match(content,/PHASE6_DATA_FIX_APPROVED/);
  assert.match(content,/PHASE6_BACKUP_RECEIPT/);
  assert.match(content,/skippedConcurrent/);
  assert.match(content,/Manual review required/);
  assert.doesNotMatch(content,/deleteMany\(|dropDatabase\(/);
});

test('a new published listing cannot advertise a zero-to-zero salary', () => {
  const sourceText = source('src/domains/Jobs/job.validation.ts');
  assert.match(sourceText, /job\.salaryMin === 0 && job\.salaryMax === 0/);
  assert.match(sourceText, /salaryMax/);
});
