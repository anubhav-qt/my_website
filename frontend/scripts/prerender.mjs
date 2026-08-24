// Post-build step: renders each static route with a headless browser and writes the
// resulting HTML into dist/<route>/index.html, so crawlers and link-preview bots that
// don't execute JS (Slack, Discord, iMessage, most OG scrapers) see real content instead
// of an empty <div id="root">. Also renders public/og-template.html to a static PNG for
// the og:image / twitter:image tags. Runs after `vite build` via the "postbuild" script.

import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Vercel's build container is Linux with none of the shared libraries a full Chromium
// download expects, so plain `puppeteer` fails to launch there. @sparticuz/chromium ships
// a statically-linked build made for exactly that environment. Locally (Windows/Mac dev),
// fall back to regular `puppeteer`, which bundles a Chromium that actually runs there.
async function launchBrowser() {
  if (process.platform === 'linux') {
    const [{ default: chromium }, { default: puppeteer }] = await Promise.all([
      import('@sparticuz/chromium'),
      import('puppeteer-core'),
    ]);
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
  const { default: puppeteer } = await import('puppeteer');
  return puppeteer.launch();
}

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

const ROUTES = ['/', '/projects', '/scratchpad', '/contact'];

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server at ${url} did not start in time`);
}

async function outPathFor(route) {
  const dir = route === '/' ? DIST : path.join(DIST, route.slice(1));
  await mkdir(dir, { recursive: true });
  return path.join(dir, 'index.html');
}

async function main() {
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    shell: true,
    stdio: 'inherit',
  });

  const cleanup = () => preview.kill();
  process.on('exit', cleanup);

  try {
    await waitForServer(BASE_URL);

    const browser = await launchBrowser();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(20000);
    // The Vercel Analytics/Speed Insights beacons keep retrying against endpoints that
    // don't exist on a local preview server, which can keep the connection count above
    // zero indefinitely — block them so 'networkidle0' can actually resolve.
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.url().includes('/_vercel/')) req.abort();
      else req.continue();
    });
    // This headless browser has no visitor's real localStorage, so any
    // "have you seen this before" UI (e.g. the stack panel's one-time hint,
    // see ProfileRail.tsx) would otherwise always render as "first visit"
    // in the static snapshot -- which most real visitors, being returning
    // ones, have already dismissed. Force it to the seen state so crawlers
    // and the pre-JS paint don't show a hint most people no longer see.
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('stack-hint-seen', '1');
    });

    for (const route of ROUTES) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });
      const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);
      const outPath = await outPathFor(route);
      await writeFile(outPath, html, 'utf-8');
      console.log(`prerendered ${route} -> ${path.relative(ROOT, outPath)}`);
    }

    // OG image: a static template rendered to a 1200x630 PNG.
    const ogPage = await browser.newPage();
    ogPage.setDefaultNavigationTimeout(20000);
    await ogPage.setViewport({ width: 1200, height: 630 });
    await ogPage.goto(`${BASE_URL}/og-template.html`, { waitUntil: 'networkidle0' });
    await ogPage.screenshot({ path: path.join(DIST, 'og-image.png') });
    console.log('generated dist/og-image.png');

    await browser.close();
  } finally {
    cleanup();
  }
}

const watchdog = setTimeout(() => {
  console.error('prerender: exceeded 90s, aborting');
  process.exit(1);
}, 90000);

main()
  .then(() => clearTimeout(watchdog))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
