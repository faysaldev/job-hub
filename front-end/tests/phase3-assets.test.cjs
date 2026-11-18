const { test }=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const child=require('node:child_process');
const ts=(()=>{try{return require('typescript');}catch{return require(path.join(child.execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'typescript'));}})();
const filename=path.join(__dirname,'../src/lib/assetUpload.ts');
const compiled=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const mod={exports:{}};new Function('exports','module',compiled)(mod.exports,mod);
const { resolvedMime, validateAssetFile, fileSignatureMatches, assetErrorMessage }=mod.exports;
test('client validations agree with server file policy',()=>{
  assert.equal(validateAssetFile({name:'pic.jpg',type:'image/jpeg',size:500},'avatar'),null);
  assert.match(validateAssetFile({name:'pic.jpg',type:'image/jpeg',size:5_000_001},'avatar'),/5 MB/);
  assert.match(validateAssetFile({name:'malware.exe',type:'application/octet-stream',size:500},'resume'),/PDF and DOCX/);
  assert.equal(validateAssetFile({name:'cv.docx',type:'application/zip',size:500},'resume'),null);
  assert.equal(resolvedMime({name:'cv.docx',type:'application/zip'}),'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  assert.equal(validateAssetFile({name:'pic.gif',type:'image/gif',size:500},'job-banner')!==null,true);
});
test('browser preflight rejects renamed payloads',()=>{
  assert.equal(fileSignatureMatches('image/png',Uint8Array.from([137,80,78,71,13,10,26,10])),true);
  assert.equal(fileSignatureMatches('image/png',new TextEncoder().encode('%PDF-1.5')),false);
  assert.equal(fileSignatureMatches('application/pdf',new TextEncoder().encode('%PDF-1.5')),true);
  assert.equal(fileSignatureMatches('application/pdf',new Uint8Array()),false);
});
test('upload errors expose the specific backend or R2 reason',()=>{
  assert.equal(assetErrorMessage({data:{message:'File type is not allowed'}}),'File type is not allowed');
  assert.equal(assetErrorMessage({error:'Storage CORS failure'}),'Storage CORS failure');
});
const read=relative=>fs.readFileSync(path.join(__dirname,'../src',relative),'utf8');
test('job uploader, rendering and independent profile saves are integrated',()=>{
  assert.match(read('Page/Recruiter/CreateJobPage.tsx'),/kind: "job-banner"/);
  assert.match(read('Page/Jobs/JobsPage.tsx'),/job\.bannerUrl/);
  assert.match(read('Page/Jobs/JobDetailsPage.tsx'),/job\.bannerUrl/);
  const profile=read('components/JobSeeker/JobSeekerProfile.tsx');
  assert.match(profile,/Other profile changes were saved, but the photo was not/);
  assert.match(profile,/if \(editing \|\|/);
  const company=read('components/Recruiter/CompanyProfile.tsx');
  assert.match(company,/Retry upload/);
});
