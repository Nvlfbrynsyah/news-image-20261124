// news-image-20261124 entry program (Node 22, standard library only, no network).
// Copies the poster PNG held by this repository to the output location.
// The grader writes to /output/entry.png; MAKEFUN_OUTPUT_DIR overrides that
// when testing outside the grader container.

import { closeSync, copyFileSync, existsSync, mkdirSync, openSync, readSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = new URL('entry.png', import.meta.url);
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const destination = join(outputDir, 'entry.png');

if (!existsSync(source) || !statSync(source).isFile()) {
  console.error(`error: entry.png is missing next to main.ts (expected at ${fileURLToPath(source)})`);
  process.exit(1);
}

const fd = openSync(source, 'r');
const header = Buffer.alloc(8);
readSync(fd, header, 0, 8, 0);
closeSync(fd);
if (!header.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
  console.error('error: entry.png is not a PNG file');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, destination);
console.log(`wrote ${destination}`);
