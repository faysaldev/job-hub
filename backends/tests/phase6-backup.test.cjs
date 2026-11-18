const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { sha256File, verifyReceipt } = require('../scripts/phase6-backup-integrity.cjs');

async function withArchive(fn) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'jobhub-phase6-backup-'));
  const archive = path.join(directory, 'jobhub-verified.archive.gz');
  const receipt = archive + '.sha256';
  try {
    await fs.writeFile(archive, Buffer.alloc(2048, 42));
    const expected = await sha256File(archive);
    await fs.writeFile(receipt, `${expected}  ${path.basename(archive)}\n`);
    await fn({ archive, receipt, expected });
  } finally { await fs.rm(directory, { recursive: true, force: true }); }
}

test('streaming backup receipt validates archive digest and size', async () => {
  await withArchive(async ({ receipt, archive, expected }) => {
    assert.deepEqual(await verifyReceipt(receipt), { archive, checksum: expected, bytes: 2048 });
  });
});
test('backup receipt rejects a modified archive (safe cleanup is still manual)', async () => {
  await withArchive(async ({ receipt, archive }) => {
    await fs.appendFile(archive, Buffer.from('tamper'));
    await assert.rejects(verifyReceipt(receipt), /checksum/i);
  });
});
test('backup receipt rejects forged filenames or unsuitable paths', async () => {
  await withArchive(async ({ receipt }) => {
    const data = await fs.readFile(receipt, 'utf8');
    await fs.writeFile(receipt, data.replace('jobhub-verified.archive.gz', 'some-other.archive.gz'));
    await assert.rejects(verifyReceipt(receipt), /manifest/i);
    await assert.rejects(verifyReceipt('/tmp/jobhub-not-a-manifest.json'), /manifest/i);
  });
});
