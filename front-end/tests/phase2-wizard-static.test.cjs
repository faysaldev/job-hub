/** Source-contract tests, not a substitute for browser E2E. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src = p => fs.readFileSync(path.join(__dirname,'..','src',p),'utf8');
test('create wizard supports native mouse selections, date and inline API validation',()=>{
  const content=src('Page/Recruiter/CreateJobPage.tsx');
  assert.match(content, /<select[\s\S]+aria-label="Job subcategory"/);
  assert.match(content, /type="date"/);
  assert.match(content, /localDeadlineToISO/);
  assert.match(content, /apiFieldErrors\(error\)/);
  assert.match(content, /errors\.applicationDeadline/);
  assert.match(content, /errors\.requirements/);
});
test('review displays responsibilities, benefits and separate skill chips',()=>{
  const content=src('Page/Recruiter/CreateJobPage.tsx');
  assert.match(content,/const responsibilities = useWatch/);
  assert.match(content,/const benefits = useWatch/);
  assert.match(content,/skills\?\.map/);
  assert.match(content,/val\.split\(\/\[,\\n\]\+\//);
});
test('job search uses a structured remote filter and server-driven facets',()=>{
  const content=src('Page/Jobs/JobsPage.tsx');
  assert.match(content,/locationType: \/\^remote\$\/i\.test/);
  assert.match(content,/searchJobsData\?\.data\?\.facets/);
  assert.match(content,/salaryRanges\.filter/);
  assert.doesNotMatch(src('lib/jobCategories.ts'), /count: [1-9]\d{2,}/);
});
test('workspace actions use existing job endpoints and invalidate dependent cache tags',()=>{
  const api=src('redux/features/jobs/jobsApi.ts');
  assert.match(api,/url: "\/job\/mine"/);
  assert.match(api,/url: `\/job\/\$\{jobId\}`/);
  assert.match(api,/invalidatesTags: \["jobs", "billing", "analytics"\]/);
  assert.match(src('components/hiring/JobsWorkspace.tsx'), /Job archived/);
});
