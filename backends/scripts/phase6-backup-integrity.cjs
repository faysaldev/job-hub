#!/usr/bin/env node
/** Streaming checksum validation shared by backup/restore/data-repair tools. */
const { createHash, timingSafeEqual } = require('node:crypto');
const { createReadStream, promises: fs } = require('node:fs');
const path = require('node:path');

async function sha256File(filename) {
  const hash = createHash('sha256');
  for await (const bytes of createReadStream(filename)) hash.update(bytes);
  return hash.digest('hex');
}

/** Return archive metadata ONLY if the full archive matches its adjacent checksum. */
async function verifyReceipt(receiptPath) {
  if (typeof receiptPath !== 'string' || !receiptPath.endsWith('.archive.gz.sha256'))
    throw new Error('Backup receipt must point to a .archive.gz.sha256 manifest');
  const manifest = path.resolve(receiptPath);
  const archive = manifest.slice(0, -'.sha256'.length);
  const [body, details] = await Promise.all([fs.readFile(manifest, 'utf8'), fs.stat(archive)]);
  if (details.size < 1024) throw new Error('Backup archive is incomplete or empty');
  const match = body.trim().match(/^([a-fA-F0-9]{64})\s{2}([^\s/\\]+)$/);
  if (!match || match[2] !== path.basename(archive)) throw new Error('Backup checksum manifest is invalid');
  const calculated = await sha256File(archive);
  const expected = match[1].toLowerCase();
  if (!timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(expected, 'hex')))
    throw new Error('Backup archive checksum does not match its receipt');
  return { archive, checksum: calculated, bytes: details.size };
}
module.exports = { sha256File, verifyReceipt };
