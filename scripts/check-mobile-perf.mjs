const base = process.env.BASE_URL ?? "http://localhost:3000";

async function measure(path) {
  const started = performance.now();
  const res = await fetch(`${base}${path}`, { headers: { "User-Agent": "ArtBoxPerf/1.0 Mobile" } });
  const body = await res.text();
  const elapsed = Math.round(performance.now() - started);
  return {
    path,
    status: res.status,
    ms: elapsed,
    kb: Math.round(body.length / 1024),
  };
}

await fetch(`${base}/`).catch(() => undefined);

const results = await Promise.all([measure("/"), measure("/icon.svg")]);
const home = results[0];

console.log("Mobile perf smoke check:", base);
for (const row of results) {
  console.log(`  ${row.path} → ${row.status} in ${row.ms}ms (${row.kb} KB HTML/asset)`);
}

const ok = home.status === 200 && home.ms < 3000;
if (!ok) {
  console.error("Perf check failed: home should respond in under 3s.");
  process.exit(1);
}

console.log("OK: landing page is responsive for mobile.");
