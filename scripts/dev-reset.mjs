#!/usr/bin/env node
import { execSync, spawn } from "node:child_process";
import { rmSync } from "node:fs";

function freePort(port) {
  try {
    const out = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
    if (!out) return;
    for (const pid of out.split("\n").filter(Boolean)) {
      try {
        process.kill(Number(pid), "SIGTERM");
      } catch {
        // process already exited
      }
    }
  } catch {
    // nothing listening
  }
}

freePort(3000);
rmSync(".next", { recursive: true, force: true });

const child = spawn("npx", ["next", "dev", "--turbopack", "-p", "3000"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
