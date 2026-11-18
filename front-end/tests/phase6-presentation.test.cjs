const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const src = relative => readFileSync(path.join(__dirname, '..', relative), 'utf8');
let lib;

test('salary presentation never fabricates a $0-$0 range', async () => {
  lib = await import('../src/lib/jobPresentation.ts');
  for (const [min,max] of [[0,0], [null, null], [-4,100], [300,100], [NaN, 1]]) {
    assert.equal(lib.formatJobSalary(min,max,'yearly'), 'Salary not specified');
  }
  assert.equal(lib.formatJobSalary(100000,150000,'yearly',true), '$100k – $150k/yr');
  assert.equal(lib.formatJobSalary(0,48000,'yearly',true), 'Up to $48k/yr');
  assert.equal(lib.formatJobSalary(60000,0,'yearly',true), 'From $60k/yr');
});

test('recommendations exclude the current job and rank matching skills and category first', async () => {
  lib ||= await import('../src/lib/jobPresentation.ts');
  const current = {_id:'1',title:'Engineer', category:'technology', subcategory:'web', skills:['React'], locationType:'remote'};
  const jobs = [
    {...current,createdAt:'2025-01-01'},
    {_id:'2',title:'Designer',category:'design',subcategory:'branding',skills:[],createdAt:'2026-11-11'},
    {_id:'3',title:'Frontend engineer',category:'technology',subcategory:'web',skills:['React'],locationType:'remote',createdAt:'2026-11-09'},
  ];
  assert.deepEqual(lib.relatedJobs(current,jobs).map(job=>job._id), ['3','2']);
  assert.deepEqual(lib.relatedJobs(current,[],3), []);
});

test('job details use persisted saved state; apply button reads applied IDs from the server', () => {
  const details = src('src/Page/Jobs/JobDetailsPage.tsx');
  const apply = src('src/components/jobs/ApplyJobModal.tsx');
  assert.match(details, /useGetSavedJobIdsQuery/);
  assert.match(details, /useDeleteSavedJobMutation/);
  assert.match(apply, /useGetAppliedJobIdsQuery/);
  assert.match(apply, /disabled=\{isApplied/);
  assert.doesNotMatch(apply, /selectAppliedJobIds/);
});

test('candidate layout owns the global shell once; listings do not render duplicate header/footer', () => {
  const layout = src('app/(job)/candidates/layout.tsx');
  const listing = src('src/Page/Candidates/CandidatesListingPage.tsx');
  assert.match(layout, /<Header\s*\/>/);
  assert.match(layout, /<Footer\s*\/>/);
  assert.doesNotMatch(listing, /<Header\s*\/>|<Footer\s*\/>/);
  assert.doesNotMatch(listing, /<main\b/);
});

test('job cards use real links and salary formatting is shared', () => {
  const jobs = src('src/Page/Jobs/JobsPage.tsx');
  const company = src('src/Page/Companies/CompanyDetailsPage.tsx');
  assert.match(jobs, /<Link href=\{`\/job\/\$\{job\._id\}`\}/);
  assert.doesNotMatch(jobs, /role="link"/);
  assert.match(jobs, /formatJobSalary/);
  assert.match(company, /formatJobSalary/);
});

test('API errors remain retryable and are not mistaken for missing job IDs', () => {
  const details = src('src/Page/Jobs/JobDetailsPage.tsx');
  assert.match(details, /if \(status === 404\) notFound\(\)/);
  assert.match(details, /onClick=\{\(\) => void refetch\(\)\}/);
});
