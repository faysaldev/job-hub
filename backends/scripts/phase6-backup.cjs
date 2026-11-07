#!/usr/bin/env node
/** Explicit, non-destructive encrypted-storage-ready backup helper. Does not restore data. */
require('dotenv').config();
const { execFileSync } = require('node:child_process');
const { existsSync, mkdirSync, statSync, readFileSync, writeFileSync } = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
if (process.argv[2] !== '--backup') { console.error('Usage: node scripts/phase6-backup.cjs --backup'); process.exit(2); }
if (process.env.PHASE6_BACKUP_APPROVED !== 'YES' || !process.env.DATABASE_URL || !process.env.PHASE6_BACKUP_DIR) {
  console.error('Set PHASE6_BACKUP_APPROVED=YES, DATABASE_URL and PHASE6_BACKUP_DIR.'); process.exit(2);
}
const dest = path.resolve(process.env.PHASE6_BACKUP_DIR);
mkdirSync(dest, { recursive: true, mode: 0o700 });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = path.join(dest, `jobhub-${stamp}.archive.gz`);
if (existsSync(filename)) throw new Error('Archive already exists');
try {
  // The credentials never enter shell-command strings or the console log.
  execFileSync('mongodump', [`--uri=${process.env.DATABASE_URL}`, `--archive=${filename}`, '--gzip'],
    { stdio: ['ignore', 'ignore', 'pipe'], timeout: 30*60*1000 });
  if (statSync(filename).size < 1024) throw new Error('Archive unexpectedly small');
  const sum = crypto.createHash('sha256').update(readFileSync(filename)).digest('hex');
  writeFileSync(`${filename}.sha256`, `${sum}  ${path.basename(filename)}\n`, { mode: 0o600 });
  console.log(`Backup archive created; bytes=${statSync(filename).size}; sha256=${sum}`);
  console.log('Store in an access-controlled, encrypted location. Run a separate isolated restoration drill.');
} catch (error) { console.error('Backup failed; inspect mongodump availability, permissions and connection'); process.exitCode = 1; }
