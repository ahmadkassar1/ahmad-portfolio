import { spawn } from 'node:child_process';
import fs from 'node:fs';
const port = process.env.QA_PORT || '3000';
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', port], { stdio: ['ignore', 'pipe', 'pipe'] });
server.stdout.pipe(fs.createWriteStream('reports/qa-server.log'));
server.stderr.pipe(fs.createWriteStream('reports/qa-server-errors.log'));
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(base)).status === 200) { ready = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  if (!ready) throw Error('Production server failed to become ready');
  const test = spawn(process.execPath, [process.argv[2] || 'scripts/verify-site.mjs', base], { stdio: 'inherit', env: process.env });
  process.exitCode = await new Promise(r => test.on('exit', r));
} finally { server.kill('SIGTERM'); }
