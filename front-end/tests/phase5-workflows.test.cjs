const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
let ts;
try { ts = require('typescript'); }
catch { ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'); }
const root = path.resolve(__dirname, '..');
const src = (file) => fs.readFileSync(path.join(root, file),'utf8');
const compiled = ts.transpileModule(src('src/lib/notificationLinks.ts'), { compilerOptions:{ module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022 } });
const mod={exports:{}};
vm.runInNewContext(compiled.outputText,{module:mod,exports:mod.exports,URL});
const { safeNotificationHref }=mod.exports;
test('legacy notification link routes to working applicants page',()=>{
  assert.equal(safeNotificationHref('/recruiter/applications'),'/recruiter/applicants');
  assert.equal(safeNotificationHref('/recruiter/applications/abc?from=email'),'/recruiter/applicants?from=email');
});
test('untrusted notification links never open external or unsafe protocols',()=>{
  for(const url of ['//evil.com','javascript:alert(1)','https://evil.com','/%2fexample.com','/\\example.com'])
    assert.equal(safeNotificationHref(url),'/notifications');
  assert.equal(safeNotificationHref('/job-seeker/interviews'),'/job-seeker/interviews');
});
test('ATS only renders server-permitted transitions and sends correct interview reference',()=>{
  const s=src('src/components/hiring/ATSWorkspace.tsx');
  assert.match(s,/current\.allowedTransitions/);
  assert.match(s,/application_id: current\._id/);
  assert.match(s,/timeZone: interview\.timeZone/);
  assert.match(s,/Stage history/);
});
test('candidate engagement is role gated and company follow has UI actions',()=>{
  assert.match(src('src/Page/Candidates/CandidateDetailsPage.tsx'),/skip: !candidateId \|\| !sessionChecked \|\| !isRecruiter/);
  assert.match(src('src/Page/Candidates/CandidateDetailsPage.tsx'),/Shortlist talent/);
  assert.match(src('src/Page/Companies/CompanyDetailsPage.tsx'),/Follow for new jobs/);
});
test('prep material is functional and interview calendar can update status',()=>{
  assert.match(src('src/Page/JobSeeker/InterviewsPage.tsx'),/onClick=\{\(\) => setPrepOpen\(true\)\}/);
  assert.match(src('src/Page/Recruiter/InterviewSchedulePage.tsx'),/useUpdateInterviewStatusMutation/);
  assert.match(src('src/Page/Recruiter/InterviewSchedulePage.tsx'),/timeZone/);
});
test('recruiter conversation scheduler sends a real application ID',()=>{
  const s=src('src/Page/Recruiter/InterviewsPage.tsx');
  assert.match(s,/application_id: matchingApplication\._id/);
  assert.doesNotMatch(s,/application_id: selectedCandidate\.rawConversation\.job_id/);
});
