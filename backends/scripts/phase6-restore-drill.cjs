#!/usr/bin/env node
/** Verify a mongodump archive and optionally restore it into a separate drill database.
 * Never restores to the source database. Never defaults to running a destructive command.
 */
require('dotenv').config();
const { createHash, timingSafeEqual } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, statSync } = require('node:fs');
const path = require('node:path');
const archive = process.env.PHASE6_RESTORE_ARCHIVE;
const sourceDb = process.env.PHASE6_SOURCE_DB;
const drillDb = process.env.PHASE6_DRILL_DB;
const drillUri = process.env.PHASE6_DRILL_DATABASE_URL;
const restore = process.argv.includes('--restore');
const fail = message => { console.error(`Restore drill refused: ${message}`); process.exit(2); };
if (!archive || !sourceDb || !drillDb || !drillUri) fail('Set PHASE6_RESTORE_ARCHIVE, PHASE6_SOURCE_DB, PHASE6_DRILL_DB and PHASE6_DRILL_DATABASE_URL');
if (!/^[a-zA-Z0-9_-]{1,64}$/.test(sourceDb)) fail('Invalid source database name');
if (!/^jobhub_restore_[a-zA-Z0-9_]{6,48}$/.test(drillDb) || drillDb === sourceDb) fail('Use a distinct isolated jobhub_restore_XXXXXX database');
if (!existsSync(archive) || statSync(archive).size < 1024) fail('Missing or empty backup archive');
if (process.env.DATABASE_URL && drillUri === process.env.DATABASE_URL) fail('Drill URI must be different from production DATABASE_URL');
const archiveName = path.resolve(archive);
const checksumPath = `${archiveName}.sha256`;
if (!existsSync(checksumPath)) fail('Cannot verify archive without its .sha256 manifest');
const expected = readFileSync(checksumPath, 'utf8').split(/\s+/)[0].toLowerCase();
if (!/^[a-f0-9]{64}$/.test(expected)) fail('Invalid checksum');
const calculated = createHash('sha256').update(readFileSync(archiveName)).digest('hex');
if (!timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(calculated, 'hex'))) fail('Archive hash mismatch');
console.log(`Archive integrity verified. bytes=${statSync(archiveName).size} sha256=${calculated}`);
console.log(`Source namespace: ${sourceDb}.*; isolated restore namespace: ${drillDb}.*`);
if (!restore) { console.log('Dry run only. Add --restore and PHASE6_RESTORE_APPROVED=YES to execute.'); process.exit(0); }
if (process.env.PHASE6_RESTORE_APPROVED !== 'YES') fail('Set PHASE6_RESTORE_APPROVED=YES');
try {
  execFileSync('mongorestore', [
    `--uri=${drillUri}`, `--archive=${archiveName}`, '--gzip', '--stopOnError', '--drop',
    `--nsFrom=${sourceDb}.*`, `--nsTo=${drillDb}.*`,
  ], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 30 * 60 * 1000 });
  console.log('Isolated restore command succeeded. Verify collections/counts and application read paths before approving deployment.');
} catch { console.error('Isolated restore failed. Check MongoDB tools, archive namespaces, URI and permissions.'); process.exitCode = 1; }
