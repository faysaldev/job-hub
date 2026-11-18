const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const sourceRoot = path.resolve(__dirname,'../src');
const load = (relative, deps) => {
  const source = fs.readFileSync(path.join(sourceRoot,relative),'utf8');
  const output = ts.transpileModule(source, { fileName:relative, compilerOptions:{
    module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022, esModuleInterop:true
  } }).outputText;
  const mod = {exports:{}};
  const resolve = name => name in deps ? deps[name] : require(name);
  const wrapper = vm.runInThisContext(`(function(require,module,exports){${output}\n})`,{filename:relative});
  wrapper(resolve,mod,mod.exports);
  return mod.exports;
};
class TestError extends Error { constructor(message,statusCode){super(message);this.statusCode=statusCode} }
const policy = () => load('domains/Stripe/payment.policy.ts',{'../../lib/errors':{AppError:TestError}});
const withEnv = (items, callback) => {
  const previous = Object.fromEntries(Object.keys(items).map(k=>[k,process.env[k]]));
  for (const [k,v] of Object.entries(items)) v == null ? delete process.env[k] : process.env[k]=v;
  try { return callback(); }
  finally { for (const [k,v] of Object.entries(previous)) v === undefined ? delete process.env[k]:process.env[k]=v; }
};
test('Boost quote rejects disabled price, missing webhook and live key by default',() => {
  const p=policy();
  withEnv({APPLICATION_BOOST_PRICE_CENTS:'0',STRIPE_SECRET_KEY:'sk_test_mock',STRIPE_WEBHOOK_SECRET:'whsec_mock'},()=>assert.equal(p.boostOffer().available,false));
  withEnv({APPLICATION_BOOST_PRICE_CENTS:'299',STRIPE_SECRET_KEY:'sk_test_mock',STRIPE_WEBHOOK_SECRET:null},()=>assert.equal(p.boostOffer().available,false));
  withEnv({APPLICATION_BOOST_PRICE_CENTS:'299',STRIPE_SECRET_KEY:'sk_live_mock',STRIPE_WEBHOOK_SECRET:'whsec_mock',STRIPE_LIVE_PAYMENTS_ENABLED:null},()=>{
    assert.equal(p.boostOffer().available,false);
    assert.throws(()=>p.assertPaymentsEnabled(),{statusCode:503});
  });
});
test('Boost quote is exact USD cents with no client price input',()=>{
  withEnv({APPLICATION_BOOST_PRICE_CENTS:'399',STRIPE_SECRET_KEY:'sk_test_mock',STRIPE_WEBHOOK_SECRET:'whsec_mock',FRONTEND_URL:'https://jobhub.example.com'},()=>{
    assert.deepEqual({...policy().boostOffer()}, {available:true,priceCents:399,currency:'usd',description:'Optional application highlight. Does not guarantee an interview or an offer.'});
  });
});
function controllerHarness({priorStatus=null, initialBoost='none', lock=false}={}) {
  let app={_id:'507f1f77bcf86cd799439011',applicant:'507f1f77bcf86cd799439012',boostPaymentStatus:initialBoost,
    stripeCheckoutSessionId: priorStatus ? 'cs_test_prior' : undefined,
    boostCheckoutLockUntil: lock ? new Date(Date.now()+60000):undefined};
  let checkoutCount=0, checkoutArgs, session={id:'cs_test_new',url:'https://checkout.stripe.com/test',status:'open',payment_status:'unpaid',metadata:{user_id:app.applicant,type:'application_boost'}};
  const Application={
    findOne:async query=>query?.stripeCheckoutSessionId ? (app.stripeCheckoutSessionId===query.stripeCheckoutSessionId?app:null) : app,
    findOneAndUpdate:async (query,patch)=>{
      if (app.boostCheckoutLockUntil && app.boostCheckoutLockUntil>Date.now()) return null;
      Object.assign(app,patch.$set); return app;
    },
    updateOne:async (query,patch)=>{
      if (query.boostPaymentStatus?.$nin?.includes(app.boostPaymentStatus)) return {matchedCount:0};
      Object.assign(app,patch.$set); for (const key of Object.keys(patch.$unset || {})) delete app[key];
      return {matchedCount:1};
    },
  };
  class FakeStripe { constructor(){this.checkout={sessions:{
    retrieve:async id=>priorStatus?{...session,id,status:priorStatus}:session,
    create:async (args)=>{checkoutCount++;checkoutArgs=args;return session;},
  }};this.webhooks={constructEvent:()=>({})};} }
  const c=load('domains/Stripe/stripe.controller.ts',{
    'stripe':FakeStripe, '../../lib/errorsHandle':{asyncHandler:f=>f}, '../../lib/errors':{AppError:TestError},
    '../../lib/response':{response:data=>data}, '../Applications/application.model':Application,
    '../../lib/query':{assertId:x=>x}, '../Billing/billing.webhook':{processStripeEvent:()=>{}},
    './payment.policy':policy(),
  });
  return { c, app:()=>app, checkoutCount:()=>checkoutCount, checkoutArgs:()=>checkoutArgs, session, Application };
}
const env={APPLICATION_BOOST_PRICE_CENTS:'299',STRIPE_SECRET_KEY:'sk_test_mock',STRIPE_WEBHOOK_SECRET:'whsec_mock',FRONTEND_URL:'https://jobhub.example.com'};
test('Stripe session comes from server price; never activates boost before webhook',async()=>{
  const previous={}; for(const [k,v] of Object.entries(env)){previous[k]=process.env[k];process.env[k]=v;}
  try{
    const h=controllerHarness();
    const result=await h.c.createBoostSession(h.app()._id,h.app().applicant);
    assert.equal(result.status,'checkout');
    assert.equal(h.checkoutCount(),1);
    assert.equal(h.checkoutArgs().line_items[0].price_data.unit_amount,299);
    assert.equal(h.checkoutArgs().metadata.application_id,h.app()._id);
    assert.equal(h.checkoutArgs().metadata.price_cents,'299');
    assert.equal(h.app().boostPaymentStatus,'pending');
    assert.equal(h.app().paid_amount,undefined);
    assert.equal(h.app().boostPriceCents,299);
  }finally{for(const [k,v] of Object.entries(previous)) v===undefined?delete process.env[k]:process.env[k]=v;}
});
test('Open or completed Stripe sessions are reused instead of double charging',async()=>{
  const old={};for(const [k,v] of Object.entries(env)){old[k]=process.env[k];process.env[k]=v;}
  try{
    const open=controllerHarness({priorStatus:'open'}),complete=controllerHarness({priorStatus:'complete'});
    assert.equal((await open.c.createBoostSession(open.app()._id,open.app().applicant)).status,'checkout');
    assert.equal((await complete.c.createBoostSession(complete.app()._id,complete.app().applicant)).status,'verifying');
    assert.equal(open.checkoutCount()+complete.checkoutCount(),0);
  }finally{for(const [k,v] of Object.entries(old)) v===undefined?delete process.env[k]:process.env[k]=v;}
});
test('Concurrent checkout claim fails while prior attempt lease is held',async()=>{
  const old={};for(const [k,v] of Object.entries(env)){old[k]=process.env[k];process.env[k]=v;}
  try{const h=controllerHarness({lock:true});await assert.rejects(h.c.createBoostSession(h.app()._id,h.app().applicant),{statusCode:409});assert.equal(h.checkoutCount(),0);}
  finally{for(const [k,v] of Object.entries(old))v===undefined?delete process.env[k]:process.env[k]=v;}
});
test('Payment-details response does not falsely declare Stripe redirect paid before webhook',async()=>{
  const h=controllerHarness();h.app().stripeCheckoutSessionId='cs_test_new';h.session.payment_status='paid';h.session.status='complete';
  const previous=process.env.STRIPE_SECRET_KEY;process.env.STRIPE_SECRET_KEY='sk_test_mock';
  const res={status(){return this;},json(x){this.body=x;return this;}};
  try{
    await h.c.default.getPaymentDetails({params:{sessionId:'cs_test_new'},user:{_id:h.app().applicant,role:'seeker'}},res);
    assert.equal(res.body.data.completed,false);
    assert.equal(res.body.data.paymentStatus,'paid');
    h.app().boostPaymentStatus='paid';h.app().paid_amount=2.99;
    await h.c.default.getPaymentDetails({params:{sessionId:'cs_test_new'},user:{_id:h.app().applicant,role:'seeker'}},res);
    assert.equal(res.body.data.benefitActivated,true);
  }finally{previous===undefined?delete process.env.STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY=previous;}
});

test('Interrupted checkout creation reuses the same attempt and price rather than risking a second charge',async()=>{
  const old={};for(const [k,v] of Object.entries(env)){old[k]=process.env[k];process.env[k]=v;}
  try{
    const h=controllerHarness();
    h.app().boostCheckoutAttemptId='fixed-original-attempt';
    h.app().boostPriceCents=399;
    const result=await h.c.createBoostSession(h.app()._id,h.app().applicant);
    assert.equal(result.status,'checkout');
    assert.equal(h.checkoutArgs().metadata.attempt_id,'fixed-original-attempt');
    assert.equal(h.checkoutArgs().line_items[0].price_data.unit_amount,399);
    assert.equal(h.checkoutCount(),1);
  }finally{for(const [k,v] of Object.entries(old))v===undefined?delete process.env[k]:process.env[k]=v;}
});
