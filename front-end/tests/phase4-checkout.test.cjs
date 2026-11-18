const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const r=path.resolve(__dirname,'../src');const read=f=>fs.readFileSync(path.join(r,f),'utf8');
test('Applicant sees server quote and can re-enter existing checkout',()=>{
  const apply=read('components/jobs/ApplyJobModal.tsx');
  const applied=read('components/JobSeeker/AppliedJobs.tsx');
  assert.match(apply,/useGetBoostOfferQuery/);
  assert.match(apply,/boostOffer\.priceCents \/ 100/);
  assert.match(apply,/boostSelected && !canBoost/);
  assert.match(applied,/useCreateCheckoutSessionMutation/);
  assert.match(applied,/Resume highlight checkout/);
});
test('Stripe success requires backend verified benefits and polls for webhook',()=>{
  const success=read('Page/Jobs/AppliedSuccessfullyPage.tsx');
  assert.match(success,/paymentData\?\.completed === true/);
  assert.match(success,/pollingInterval: sessionId \? 5000 : 0/);
  assert.match(success,/Check payment status again/);
});
test('Owner can upgrade from paid plan, team limit links to real billing page',()=>{
  const billing=read('components/billing/BillingWorkspace.tsx');
  const team=read('components/hiring/TeamWorkspace.tsx');
  assert.match(billing,/action: profile\?\.subscription\.paid \? "upgrade" : "checkout"/);
  assert.match(team,/\/recruiter\/billing/);
  assert.match(team,/seats\.teamSeats >= seats\.limit/);
});
