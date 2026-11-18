/** Isolated, executable lifecycle tests: no MongoDB or external services required. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let typescript;
try { typescript = require('typescript'); }
catch { typescript = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'); }
const source = fs.readFileSync(path.join(__dirname, '../src/domains/Jobs/job.lifecycle.ts'), 'utf8');
const output = typescript.transpileModule(source, { compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022 } }).outputText;
const ctx = { exports: {}, Date }; vm.runInNewContext(output, ctx);
const { jobOwnerFilter, publicJobFilter, quotaJobFilter, reservesJobSlot } = ctx.exports;
const now = new Date('2026-11-18T14:00:00Z');
const company = { _id: 'company1', userId: 'owner1' };
const candidate = (overrides={}) => ({ companyId: company._id, author: company.userId, status: 'published', isActive: true,
  isDeleted: false, moderation: { status: 'clear' }, applicationDeadline: new Date('2026-12-01T14:00:00Z'), ...overrides });
function equals(a,b) { return b === null ? a == null : String(a) === String(b); }
function evalCondition(doc, query) {
  return Object.entries(query).every(([key, expected]) => {
    if (key === '$and') return expected.every(q=>evalCondition(doc,q));
    if (key === '$or') return expected.some(q=>evalCondition(doc,q));
    const actual = key.split('.').reduce((v,p)=>v?.[p],doc);
    if (!expected || typeof expected !== 'object' || expected instanceof Date || Array.isArray(expected)) return equals(actual,expected);
    return Object.entries(expected).every(([op, v])=> {
      if (op==='$ne') return !equals(actual,v);
      if (op==='$gt') return actual!=null && actual>v;
      if (op==='$in') return v.some(x => equals(actual, x));
      throw new Error('Unexpected matcher '+op);
    });
  });
}
test('public and quota eligibility agree for live published jobs', () => {
  const job = candidate();
  assert.equal(reservesJobSlot(job, now), true);
  assert.equal(evalCondition(job, publicJobFilter(now)), true);
  assert.equal(evalCondition(job, quotaJobFilter(company,now)), true);
});
test('scheduled jobs reserve a quota slot without appearing in public search', () => {
  const scheduled = candidate({ status: 'scheduled', isActive: false });
  assert.equal(reservesJobSlot(scheduled, now), true);
  assert.equal(evalCondition(scheduled, quotaJobFilter(company,now)), true);
  assert.equal(evalCondition(scheduled, publicJobFilter(now)), false);
});
test('draft, closed, expired, moderated, and archived do not consume slots or appear publicly', () => {
  const cases = [
    candidate({status:'draft',isActive:false}), candidate({status:'closed',isActive:false}),
    candidate({applicationDeadline:new Date('2026-11-17T00:00:00Z')}),
    candidate({moderation:{status:'blocked'}}), candidate({isDeleted:true}),
  ];
  for(const job of cases) {
    assert.equal(reservesJobSlot(job,now), false, job.status);
    assert.equal(evalCondition(job, publicJobFilter(now)), false, job.status);
    assert.equal(evalCondition(job, quotaJobFilter(company,now)), false, job.status);
  }
});
test('legacy active jobs with no status remain discoverable and reserve a slot', () => {
  const legacy = candidate({status: undefined});
  assert.equal(reservesJobSlot(legacy,now),true);
  assert.equal(evalCondition(legacy, publicJobFilter(now)),true);
  assert.equal(evalCondition(legacy, quotaJobFilter(company,now)),true);
});
test('company ownership supports both modern companyId and legacy author', () => {
  const modern = candidate({ author:'teammate' });
  const legacy = candidate({ companyId: undefined });
  assert.equal(evalCondition(modern,jobOwnerFilter(company)),true);
  assert.equal(evalCondition(legacy,jobOwnerFilter(company)),true);
  assert.equal(evalCondition(candidate({companyId:'different',author:'different'}),jobOwnerFilter(company)),false);
});
test('job services use the same eligibility policy for search, quota checks and scheduled publication', () => {
  const svc = fs.readFileSync(path.join(__dirname,'../src/domains/Jobs/job.services.ts'),'utf8');
  const entitlement = fs.readFileSync(path.join(__dirname,'../src/domains/Billing/billing.entitlements.ts'),'utf8');
  const general = fs.readFileSync(path.join(__dirname,'../src/domains/Generals/general.services.ts'),'utf8');
  assert.match(svc,/publicJobFilter\(now\)/);
  assert.match(svc,/reservesJobSlot\(next, now\)/);
  assert.match(svc,/publishDueJobs/);
  assert.match(svc,/pendingDraft/);
  assert.match(svc,/"0-30k": \[0, 30000\]/);
  assert.match(svc,/"150k\+": \[150000, Infinity\]/);
  assert.match(entitlement,/Job\.countDocuments\(quotaJobFilter\(company/);
  assert.match(general,/publicJobFilter\(now\)/);
});
test('reconciliation defaults to safe dry-run and never removes production jobs', () => {
  const script=fs.readFileSync(path.join(__dirname, '../scripts/phase2-reconcile-jobs.cjs'),'utf8');
  assert.match(script,/process\.argv\.includes\('--apply'\)/);
  assert.match(script,/--acknowledge/);
  assert.doesNotMatch(script, /deleteMany|dropDatabase|dropCollection|insertMany/);
  assert.match(script,/fs\.writeFileSync/);
});
