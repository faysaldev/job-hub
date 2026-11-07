#!/usr/bin/env node
/** Read-only staging latency sample. PHASE6_STAGING_URL is required. */
const base = (process.env.PHASE6_STAGING_URL || '').replace(/\/$/, '');
const samples = Number(process.env.PHASE6_PERF_SAMPLES || 15);
const budget = Number(process.env.PHASE6_PERF_P95_MS || 1500);
if (!/^https?:\/\//.test(base) || !Number.isInteger(samples) || samples < 1 || samples > 100 || !Number.isFinite(budget) || budget < 1) {
  console.error('Set PHASE6_STAGING_URL=http(s)://host and optional PHASE6_PERF_SAMPLES=15 PHASE6_PERF_P95_MS=1500'); process.exit(2);
}
const urls = ['/healthz', '/api/v1/job?page=1&limit=10', '/api/v1/generals/discovery'];
(async () => {
  let failed = false;
  for (const route of urls) {
    const durations = [];
    for (let i = 0; i < samples; i++) {
      const start = performance.now();
      const response = await fetch(`${base}${route}`, { headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(12000) });
      const duration = performance.now() - start;
      if (!response.ok) { failed = true; console.error(`${route} request=${i+1} status=${response.status}`); }
      durations.push(duration);
    }
    durations.sort((a,b) => a-b);
    const p50 = durations[Math.ceil(samples * .5) - 1];
    const p95 = durations[Math.ceil(samples * .95) - 1];
    console.log(`${route} samples=${samples} p50=${p50.toFixed(0)}ms p95=${p95.toFixed(0)}ms max=${durations.at(-1).toFixed(0)}ms budget=${budget}ms`);
    if (p95 > budget) failed = true;
  }
  if (failed) process.exitCode = 1;
})().catch(error => { console.error('Staging performance run failed:', error.message); process.exitCode = 1; });
