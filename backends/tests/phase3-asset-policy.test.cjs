const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const child = require('node:child_process');
const { createRequire } = require('node:module');
const ts = (() => { try { return require('typescript'); } catch { return require(path.join(child.execFileSync('npm', ['root','-g'], {encoding:'utf8'}).trim(), 'typescript')); } })();
const compile = (name, resolver=()=>({})) => {
  const filename=path.join(__dirname,'../src/domains/Asset',name);
  const js=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
  const mod={exports:{}};
  new Function('module','exports','require',js)(mod,mod.exports,resolver);
  return mod.exports;
};
const policy=compile('asset.policy.ts');
function zip(names) {
  let local = Buffer.alloc(0), central = Buffer.alloc(0);
  for(const name of names) {
    const bytes = Buffer.from(name);
    const head=Buffer.alloc(30); head.writeUInt32LE(0x04034b50,0); head.writeUInt16LE(bytes.length,26);
    const index=Buffer.alloc(46); index.writeUInt32LE(0x02014b50,0); index.writeUInt16LE(bytes.length,28); index.writeUInt32LE(local.length,42);
    central=Buffer.concat([central,index,bytes]); local=Buffer.concat([local,head,bytes]);
  }
  const tail=Buffer.alloc(22); tail.writeUInt32LE(0x06054b50,0); tail.writeUInt16LE(names.length,8); tail.writeUInt16LE(names.length,10);
  tail.writeUInt32LE(central.length,12);tail.writeUInt32LE(local.length,16);
  return Buffer.concat([local,central,tail]);
}
test('upload policy allows correct JPEG/PNG/WEBP, PDF/DOCX and banner purposes',()=>{
  assert.deepEqual(policy.checkFile('avatar','image/jpeg',1024,'photo.jpeg'),{ok:true,extension:'jpg'});
  assert.deepEqual(policy.checkFile('job-banner','image/webp',1024,'photo.webp'),{ok:true,extension:'webp'});
  assert.deepEqual(policy.checkFile('resume','application/pdf',1024,'cv.pdf'),{ok:true,extension:'pdf'});
  assert.equal(policy.checkFile('resume','application/zip',1000,'cv.docx').ok,false);
  assert.equal(policy.checkFile('avatar','image/png',1000,'photo.jpg').ok,false);
  assert.equal(policy.checkFile('resume','application/pdf',10_000_001,'cv.pdf').ok,false);
  assert.equal(policy.checkFile('avatar','image/png',0,'photo.png').ok,false);
  assert.equal(policy.checkFile('avatar','image/png',5_000_001,'photo.png').ok,false);
  assert.equal(policy.checkFile('nope','image/png',100,'photo.png').ok,false);
});
test('signature verification rejects renamed files and accepts valid headers',()=>{
  assert.equal(policy.matchesFileSignature('image/png',Buffer.from('89504e470d0a1a0a','hex')),true);
  assert.equal(policy.matchesFileSignature('image/png',Buffer.from('%PDF-1.7')),false);
  assert.equal(policy.matchesFileSignature('application/pdf',Buffer.from('%PDF-1.7')),true);
  assert.equal(policy.matchesFileSignature('image/webp',Buffer.from('RIFFabcdefghWEBP')),false);
  assert.equal(policy.matchesFileSignature('image/webp',Buffer.from('RIFF1234WEBP')),true);
});
test('DOCX must be a real ZIP with Office document entries',()=>{
  const valid=zip(['[Content_Types].xml','word/document.xml']);
  assert.equal(policy.looksLikeDocx(valid),true);
  assert.equal(policy.looksLikeDocx(zip(['fake.txt','hello.xml'])),false);
  assert.equal(policy.looksLikeDocx(zip(['[Content_Types].xml','../word/document.xml'])),false);
  assert.equal(policy.looksLikeDocx(Buffer.from('PK\x03\x04garbage')),false);
});

test('service integration: initiate, confirm, reject corrupted upload, enforce private access and company binding',async()=>{
  class AppError extends Error { constructor(message,statusCode){super(message);this.statusCode=statusCode;} }
  const entries=new Map(), objects=new Map(); let next=1;
  const ids=()=>String(next++).padStart(24,'0');
  const lookup=where=> [...entries.values()].find(doc=>Object.entries(where).every(([key,val])=>String(doc[key])===String(val)));
  const Asset={
    create:async params=>{const doc={...params,_id:ids()};entries.set(doc._id,doc);return doc;},
    deleteOne:async query=>{entries.delete(query._id);},
    findOne:where=>({select:async()=>lookup(where)||null}),
    findOneAndUpdate:(where,changes)=>({select:async()=>{const doc=lookup(where);if(!doc)return null;Object.assign(doc,changes.$set);for(const field of Object.keys(changes.$unset||{}))delete doc[field];return doc;}}),
    exists:async where=>Boolean(lookup(where)),
  };
  const store={
    bucketFor:kind=>kind==='resume'||kind==='attachment'?'private':'public',
    publicAssetUrl:key=>`https://media.example.com/${key}`,
    signedPut:async()=> 'https://r2.example/signed-upload',
    signedRead:async()=> 'https://r2.example/signed-download',
    head:async(bucket,key)=>{const data=objects.get(`${bucket}/${key}`);if(!data){const e=Error('not found');e.name='NotFound';throw e;}return {ContentLength:data.bytes.length,ContentType:data.mime};},
    firstBytes:async(bucket,key)=>objects.get(`${bucket}/${key}`).bytes.subarray(0,32),
    readObject:async(bucket,key)=>objects.get(`${bucket}/${key}`).bytes,
    remove:async(bucket,key)=>objects.delete(`${bucket}/${key}`),
    putBuffer:async()=>{},
  };
  const noop={exists:async()=>false,distinct:async()=>[]};
  const resolver=name=>{
    if(name==='node:crypto')return require('node:crypto');
    if(name==='../../lib/errors')return {AppError};
    if(name==='../../lib/query')return {assertId:value=>value};
    if(name==='./asset.model')return Asset;
    if(name==='./asset.storage')return store;
    if(name==='./asset.policy')return policy;
    if(name==='../Company/company.access')return {companyForActor:async user=>{
      if(user==='outsider')throw new AppError('not allowed',403);
      return {company:{_id:'company-1',userId:'owner-1'}};
    }};
    return noop;
  };
  process.env.R2_PUBLIC_BASE_URL='https://media.example.com';
  const service=compile('asset.services.ts',resolver);
  const avatar=await service.initiateUpload('owner-1',{kind:'avatar',fileName:'face.png',mimeType:'image/png',size:8});
  assert.equal(avatar.headers['If-None-Match'],'*');
  let entry=entries.get(avatar.assetId);
  objects.set(`${entry.bucket}/${entry.key}`,{mime:'image/png',bytes:Buffer.from('89504e470d0a1a0a','hex')});
  const confirmed=await service.confirmUpload('owner-1',avatar.assetId);
  assert.equal(confirmed.url,`https://media.example.com/${entry.key}`);
  assert.equal(entry.status,'ready'); assert.equal(entry.expiresAt,undefined);
  const corrupt=await service.initiateUpload('owner-1',{kind:'avatar',fileName:'bad.png',mimeType:'image/png',size:8});
  entry=entries.get(corrupt.assetId);objects.set(`${entry.bucket}/${entry.key}`,{mime:'image/png',bytes:Buffer.from('%PDF-1.7')});
  await assert.rejects(()=>service.confirmUpload('owner-1',corrupt.assetId),{statusCode:400});
  assert.equal(objects.has(`${entry.bucket}/${entry.key}`),false);
  const resume=await service.initiateUpload('owner-1',{kind:'resume',fileName:'cv.pdf',mimeType:'application/pdf',size:8});
  entry=entries.get(resume.assetId);objects.set(`${entry.bucket}/${entry.key}`,{mime:'application/pdf',bytes:Buffer.from('%PDF-1.7')});
  await service.confirmUpload('owner-1',resume.assetId);
  assert.match((await service.getAssetAccess(resume.assetId,'owner-1','seeker')).url,/signed-download/);
  await assert.rejects(()=>service.getAssetAccess(resume.assetId,'outsider','recruiter'),{statusCode:404});
  const banner=await service.initiateUpload('owner-1',{kind:'job-banner',fileName:'job.webp',mimeType:'image/webp',size:12});
  entry=entries.get(banner.assetId);objects.set(`${entry.bucket}/${entry.key}`,{mime:'image/webp',bytes:Buffer.from('RIFF1234WEBP')});
  const result=await service.confirmUpload('owner-1',banner.assetId);
  await service.assertCompanyBanner(result.url,'company-1');
  await assert.rejects(()=>service.assertCompanyBanner(result.url,'other-company'),{statusCode:403});
  await assert.rejects(()=>service.initiateUpload('outsider',{kind:'job-banner',fileName:'job.webp',mimeType:'image/webp',size:12}),{statusCode:403});
});
