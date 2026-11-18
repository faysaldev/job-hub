const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function load(file) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, reportDiagnostics: true });
  assert.equal(compiled.diagnostics?.length || 0, 0);
  const m = { exports: {} };
  vm.runInNewContext(compiled.outputText, { exports: m.exports, module: m, Intl, Date, Error, URL, console });
  return m.exports;
}
const { createInterviewSlot } = load('src/domains/Interviews/interviews.slot.ts');
const { APPLICATION_TRANSITIONS, allowedATSStages } = load('src/domains/Applications/application.pipeline.ts');
const future = new Date('2026-11-01T00:00:00Z');
const book = (date, start_time, end_time, timeZone) => createInterviewSlot({ date, start_time, end_time, timeZone }, future);

test('Dhaka appointment converts to UTC and preserves wall clock', () => {
  const result = book('2027-01-11', '09:00', '10:00', 'Asia/Dhaka');
  assert.equal(result.startAt.toISOString(), '2027-01-11T03:00:00.000Z');
  assert.equal(result.endAt.toISOString(), '2027-01-11T04:00:00.000Z');
  assert.equal(result.timeZone, 'Asia/Dhaka');
});
test('New York interview handles winter and summer offsets', () => {
  assert.equal(book('2027-01-11', '09:00', '10:00', 'America/New_York').startAt.toISOString(), '2027-01-11T14:00:00.000Z');
  assert.equal(book('2027-07-11', '09:00', '10:00', 'America/New_York').startAt.toISOString(), '2027-07-11T13:00:00.000Z');
});
test('invalid, non-existent and ambiguous times fail explicitly', () => {
  for (const args of [
    ['2027-01-11','10:00','09:00','UTC'],
    ['2027-01-11','09:00','09:00','UTC'],
    ['2027-01-11','08:00','10:00','Invalid/TimeZone'],
    ['2027-03-14','02:30','03:30','America/New_York'],
    ['2027-11-07','01:30','02:30','America/New_York'],
    ['2027-01-11','not-a-time','10:00','UTC'],
  ]) assert.throws(() => book(...args), Error);
});
test('rejects past appointments', () => assert.throws(() => createInterviewSlot({ date: '2020-01-01', start_time: '09:00', end_time: '10:00', timeZone:'UTC' }, future)));
test('server permitted transitions are accurate and offer-gated', () => {
  assert.deepEqual([...allowedATSStages('applied')], ['under_review','shortlisted','rejected']);
  assert.deepEqual([...allowedATSStages('offer','sent')], ['rejected']);
  assert.deepEqual([...allowedATSStages('offer','accepted')], ['hired','rejected']);
  assert.deepEqual([...allowedATSStages('hired')], []);
  assert.deepEqual([...APPLICATION_TRANSITIONS.interview], ['shortlisted','hired','rejected']);
});
test('interview mutations validate team access, application and time slots', () => {
  const s = fs.readFileSync(path.join(root,'src/domains/Interviews/interviews.services.ts'),'utf8');
  for (const pattern of [/jobForActor\(String\(data\.job_id\), actor, "jobs"\)/, /assertInterviewer\(company, assignee\)/,
    /checkConflict\(assignee, slot.startAt, slot.endAt\)/, /application_id: application\._id/,
    /updatedAt: interview\.updatedAt/, /status: "scheduled"/, /createNotification/]) assert.match(s,pattern);
});
test('candidate bookmarks are company scoped with role and privacy gates', () => {
  const svc = fs.readFileSync(path.join(root,'src/domains/Seeker/candidate-engagement.services.ts'),'utf8');
  const model = fs.readFileSync(path.join(root,'src/domains/Seeker/company-candidate.model.ts'),'utf8');
  for (const pattern of [/companyForActor\(actorId, "applications"\)/, /"privacy.profileVisibility": "public"/,
    /"privacy.searchable": true/, /"privacy.allowContact"/, /isWithdrawn: \{ \$ne: true \}/]) {
    if (pattern.source === '"privacy.allowContact"') assert.match(svc, /privacy\?\.allowContact/);
    else assert.match(svc, pattern);
  }
  assert.match(model,/companyId: 1, seekerId: 1.*unique: true/);
});
test('employer alerts reuse scheduler, dedupe and verify public jobs', () => {
  const scheduler = fs.readFileSync(path.join(root,'src/scripts/phase4-scheduler.ts'),'utf8');
  const follows = fs.readFileSync(path.join(root,'src/domains/SavedJobs/company-follow.services.ts'),'utf8');
  const notificationModel = fs.readFileSync(path.join(root,'src/domains/Notifications/notifications.model.ts'),'utf8');
  assert.match(scheduler,/runCompanyFollowAlerts\(\)/);
  assert.match(follows,/publicJobFilter\(now\)/);
  assert.match(follows,/dedupeKey:/);
  assert.match(notificationModel,/dedupeKey: 1.*unique: true, sparse: true/);
  assert.match(follows,/lastCheckedAt: follow\.lastCheckedAt/);
});
test('authorization is performed before returning existing conversations', () => {
  const ctrl = fs.readFileSync(path.join(root,'src/domains/Conversations/conversations.controller.ts'),'utf8');
  const svc = fs.readFileSync(path.join(root,'src/domains/Conversations/conversations.services.ts'),'utf8');
  assert.doesNotMatch(ctrl, /findConversationByParticipantsService\(/);
  assert.match(svc,/companyForActor\(String\(recruiterId\), "applications"\)/);
  assert.match(svc,/Candidate does not allow direct contact/);
});
