const base = process.env.BASE_URL ?? "http://localhost:3000";
const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;

if (!email || !password) {
  console.error("Set TEST_EMAIL and TEST_PASSWORD env vars");
  process.exit(1);
}

async function main() {
  const jar = new Map();

  function storeCookies(res) {
    const raw = res.headers.getSetCookie?.() ?? [];
    for (const line of raw) {
      const [pair] = line.split(";");
      const idx = pair.indexOf("=");
      if (idx === -1) continue;
      jar.set(pair.slice(0, idx), pair.slice(idx + 1));
    }
  }

  function cookieHeader() {
    return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  }

  const csrfRes = await fetch(`${base}/api/auth/csrf`, { headers: { cookie: cookieHeader() } });
  storeCookies(csrfRes);
  const { csrfToken } = await csrfRes.json();

  const loginRes = await fetch(`${base}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: cookieHeader(),
    },
    body: new URLSearchParams({ csrfToken, email, password }),
    redirect: "manual",
  });
  storeCookies(loginRes);
  console.log("login status", loginRes.status);

  for (const path of ["/api/me", "/api/orders/current", "/app/choose"]) {
    const res = await fetch(`${base}${path}`, { headers: { cookie: cookieHeader() }, redirect: "manual" });
    const text = await res.text();
    console.log(path, res.status, text.slice(0, 200).replace(/\s+/g, " "));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
