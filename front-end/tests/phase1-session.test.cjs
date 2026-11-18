const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/lib/authSession.ts'), 'utf8');

const newSessionModule = () => {
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const filename = path.join(__dirname, '__phase1_session_fixture__.cjs');
  const instance = new Module(filename, module);
  instance.filename = filename;
  instance.paths = module.paths;
  instance._compile(compiled, filename);
  return instance.exports;
};

const fakeSession = { data: { user: { _id: 'u1', name: 'Example', email: 'qa@example.test', role: 'seeker', image: null, createdAt: 'now' }, accessToken: 'jwt-access' } };
const response = (code, data) => ({ ok: code >= 200 && code < 300, status: code, json: async () => data });
const previousFetch = global.fetch;
afterEach(() => { global.fetch = previousFetch; });

test('parallel refreshes share one network request', async () => {
  const auth = newSessionModule();
  let requests = 0;
  global.fetch = async () => { requests++; return response(200, fakeSession); };
  const [a,b,c] = await Promise.all([auth.requestSessionRefresh(), auth.requestSessionRefresh(), auth.requestSessionRefresh()]);
  assert.equal(requests, 1);
  assert.equal(a.accessToken, 'jwt-access');
  assert.deepEqual(a, b); assert.deepEqual(b, c);
});

test('refresh failures preserve their status and never expose credentials', async () => {
  const auth = newSessionModule();
  global.fetch = async (_url, opts) => {
    assert.equal(opts.credentials, 'include');
    assert.equal(opts.method, 'POST');
    assert.equal(opts.headers.Authorization, undefined);
    return response(401, { message: 'Not authenticated' });
  };
  await assert.rejects(auth.requestSessionRefresh(), err => err instanceof auth.SessionRefreshError && err.status === 401);
});

test('logout invalidates a pending refresh result', async () => {
  const auth = newSessionModule();
  let unblock;
  global.fetch = async () => { await new Promise(resolve => { unblock = resolve; }); return response(200, fakeSession); };
  const pending = auth.requestSessionRefresh();
  auth.invalidatePendingRefresh();
  unblock();
  await assert.rejects(pending, /Session changed/);
});
