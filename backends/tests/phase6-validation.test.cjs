/** Runtime validation unit tests. Run only after `pnpm build` installs zod and emits dist. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { adminActions, recordQuery, reportInput } = require('../dist/domains/Operations/operations.validation.js');
const oid = '507f1f77bcf86cd799439011';

test('user-access rejects an arbitrary role elevation or extra selectors', () => {
  const supplied = { action: 'user-access', userId: oid, decision: 'suspend', reason: 'Repeated fraud', role: 'admin' };
  assert.equal(adminActions.safeParse(supplied).success, false);
  assert.equal(adminActions.safeParse({ ...supplied, role: undefined }).success, false); // property is still unknown
});

test('unrecognized and malformed administration actions are rejected', () => {
  assert.equal(adminActions.safeParse({ action: 'delete-all-users' }).success, false);
  assert.equal(adminActions.safeParse({ action: 'verify-company', companyId: 'not-objectid', decision: 'verified' }).success, false);
  assert.equal(adminActions.safeParse({ action: 'retry-stripe-event', eventId: 'evt_x' }).success, false);
});

test('valid strict job moderation and safe invoice reconciliation validate', () => {
  assert.equal(adminActions.safeParse({ action:'moderate-job', jobId:oid, decision:'blocked', reason:'Suspected fraudulent role' }).success, true);
  assert.equal(adminActions.safeParse({ action:'reconcile-invoice', invoiceId:oid }).success, true);
});

test('record pagination is bounded and database selectors cannot be supplied by client', () => {
  assert.equal(recordQuery.safeParse({ kind:'users', page:999999, limit:20 }).success, false);
  assert.equal(recordQuery.safeParse({ kind:'jobs', limit:1000 }).success, false);
  assert.equal(recordQuery.safeParse({ kind:'users', where:{ role:'admin' } }).success, false);
  const valid = recordQuery.parse({ kind:'users', page:'2', limit:'10' });
  assert.equal(valid.page, 2); assert.equal(valid.limit,10);
});

test('reports accept legitimate descriptions and reject secret/HTML injection fields', () => {
  assert.equal(reportInput.safeParse({ targetKind:'job', targetId:oid, category:'fraud', description:'The recruiter requests money for an interview.' }).success,true);
  assert.equal(reportInput.safeParse({ targetKind:'job', targetId:oid, category:'fraud', description:'Too short' }).success,false);
  assert.equal(reportInput.safeParse({ targetKind:'job', targetId:oid, category:'fraud', description:'The recruiter requests money for an interview.', isStaff:true }).success,false);
});
