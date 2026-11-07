#!/usr/bin/env node
// Breader's local shipping flow, adapted to this site's existing Vercel project.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FRONTEND = path.join(ROOT, 'frontend');
const NPM = process.env.npm_execpath ?? path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
const STEPS = ['check', 'test', 'build', 'push', 'deploy', 'live'];
const wanted = process.argv.slice(2);
if (wanted.includes('--help') || wanted.includes('-h')) {
  console.log('npm run ship -- [check test build push deploy live]\nWith no steps, runs all of them. check always runs first. Use npm run ship:link once after npx vercel login.');
  process.exit(0);
}
const selected = wanted.length ? wanted : STEPS;
for (const step of selected) {
  if (!STEPS.includes(step)) throw new Error(`Unknown step: ${step}. Choose ${STEPS.join(', ')}.`);
}
const env = { ...process.env };
for (const name of ['.env.local', '.secrets.local']) {
  const file = path.join(FRONTEND, name);
  if (existsSync(file)) Object.assign(env, parseEnv(readFileSync(file, 'utf8')));
}
function run(command, args, { cwd = ROOT, capture = false } = {}) {
  const result = spawnSync(command, args, {
    cwd, env, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    // Suppress captured stderr: hosting errors can include environment values.
    throw new Error(`${path.basename(command)} ${args[0] ?? ''} failed (${result.status}).`);
  }
  return result.stdout?.trim() ?? '';
}
const git = (...args) => run('git', args, { capture: true });
const npm = (args, options = {}) => run(process.execPath, [NPM, ...args], { cwd: FRONTEND, ...options });
const vercel = (args, options = {}) => npm(['exec', '--yes', '--package=vercel@65.12.1', '--', 'vercel', ...args], { cwd: ROOT, ...options });
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
let sha;

function check() {
  if (git('branch', '--show-current') !== 'dev') throw new Error('Ship from dev.');
  if (git('status', '--porcelain')) throw new Error('Commit or put away changes before shipping.');
  if (!/github\.com[:/]anubhav-qt\/my_website(?:\.git)?$/.test(git('remote', 'get-url', 'origin'))) {
    throw new Error('origin is not the expected personal-site repository.');
  }
  run('git', ['fetch', '--quiet', 'origin', 'dev']);
  git('merge-base', '--is-ancestor', 'origin/dev', 'HEAD');
  sha = git('rev-parse', 'HEAD');
  if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('Use Node 24 or later.');
  if (!existsSync(path.join(FRONTEND, 'public/resume.pdf'))) throw new Error('public/resume.pdf is missing.');
  if (selected.includes('build') || selected.includes('deploy')) {
    if (!existsSync(path.join(ROOT, '.vercel/project.json'))) throw new Error('Run npm run ship:link once to link the existing Vercel project.');
    vercel(['whoami'], { capture: true });
  }
  console.log(`Checked dev at ${sha.slice(0, 7)}.`);
}
function test() {
  npm(['ci']);
  npm(['test']);
}
function build() {
  vercel(['pull', '--yes', '--environment=production', '--scope=paribelle']);
  vercel(['build', '--prod', '--scope=paribelle']);
  if (!existsSync(path.join(ROOT, '.vercel/output/config.json'))) throw new Error('Vercel prebuilt output was not generated.');
  const pdf = readFileSync(path.join(FRONTEND, 'public/resume.pdf'));
  const html = readFileSync(path.join(FRONTEND, 'dist/index.html'), 'utf8');
  const bundle = html.match(/src="([^"]*\/assets\/[^"?]+\.js)"/)?.[1];
  if (!bundle) throw new Error('Could not find the built application bundle.');
  writeFileSync(path.join(ROOT, '.vercel/manual-release.json'), JSON.stringify({ sha, resumeSha256: hash(pdf), bundle }, null, 2) + '\n');
}
function push() { run('git', ['push', 'origin', 'dev']); }
function deploy() {
  const release = JSON.parse(readFileSync(path.join(ROOT, '.vercel/manual-release.json'), 'utf8'));
  if (release.sha !== sha || release.resumeSha256 !== hash(readFileSync(path.join(FRONTEND, 'public/resume.pdf')))) {
    throw new Error('The prebuilt output does not match this commit and resume. Run build again.');
  }
  vercel(['deploy', '--prebuilt', '--prod', '--yes', '--scope=paribelle']);
}
async function live() {
  const release = JSON.parse(readFileSync(path.join(ROOT, '.vercel/manual-release.json'), 'utf8'));
  if (release.sha !== sha) throw new Error('The release record is for a different commit.');
  const url = 'https://www.anubhav-qt.dev';
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const [page, pdf, scratchpad] = await Promise.all([
        fetch(`${url}/?release=${sha}`, { signal: AbortSignal.timeout(20000) }),
        fetch(`${url}/resume.pdf?release=${sha}`, { signal: AbortSignal.timeout(20000) }),
        fetch(`${url}/scratchpad?release=${sha}`, { signal: AbortSignal.timeout(20000) }),
      ]);
      const [html, bytes, scratch] = await Promise.all([page.text(), pdf.arrayBuffer(), scratchpad.text()]);
      const localScratch = readFileSync(path.join(FRONTEND, 'dist/scratchpad/index.html'), 'utf8');
      const latestEntries = ['breader is pretty big now', 'dodo'].filter((title) => localScratch.includes(title));
      if (page.ok && pdf.ok && scratchpad.ok && html.includes(release.bundle) && hash(Buffer.from(bytes)) === release.resumeSha256 && latestEntries.every((title) => scratch.includes(title))) {
        console.log(`Live at ${url}, commit ${sha.slice(0, 7)}; resume bytes and built app verified.`);
        return;
      }
    } catch { /* Retry while the deployment propagates. */ }
    if (attempt < 29) await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  throw new Error('The public site did not match the built app and resume within five minutes.');
}
const actions = { check, test, build, push, deploy, live };
try {
  console.log('\n== check');
  check();
  for (const step of selected) {
    if (step === 'check') continue;
    console.log(`\n== ${step}`);
    await actions[step]();
  }
} catch (error) {
  console.error(`ship: ${error.message}`);
  process.exitCode = 1;
}
