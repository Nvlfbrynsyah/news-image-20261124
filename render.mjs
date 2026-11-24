// Builds entry.png from poster.html: 1024x1024 viewport, deviceScaleFactor 1,
// system fonts only, no network. Uses the shared Playwright install in ~/workspace/makefun/shots.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/home/hatch/workspace/makefun/shots/node_modules/playwright/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, 'poster.html');
const outPath = path.join(here, 'entry.png');

if (!fs.existsSync(htmlPath)) {
  console.error('poster.html not found at', htmlPath);
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1024, height: 1024 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: outPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1024, height: 1024 },
  });
  await context.close();
} finally {
  await browser.close();
}

const stat = fs.statSync(outPath);
console.log(`entry.png: ${stat.size} bytes`);
if (stat.size > 1048576) {
  console.error('entry.png exceeds 1 MiB');
  process.exit(1);
}
