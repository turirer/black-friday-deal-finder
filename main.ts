// DealBeacon hand-in program (Node 22, standard library only).
//
// The entry is the static site in app/ beside this file: plain HTML, CSS
// and ES modules, no build step, nothing loaded over the network. The
// deals live in app/data.js; each links out to its store.
//
// This program hands the site in: it copies app/ and screenshots/ to
// /output (MAKEFUN_OUTPUT_DIR stands in for /output outside the grader)
// and writes /output/dossier.json with buildDossier from the vendored
// make.fun library, which must stay unchanged — the scorer rebuilds the
// dossier with its own copy and compares byte for byte.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(root, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(root, 'screenshots'))) {
  cpSync(join(root, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps: the dossier text is capped at 160 KiB, at most 4
// screenshots of at most 256 KiB each, and app/ stays within 993 entries
// and 16 MiB so the whole of /output fits its 1,000-entry / 64 MiB cap.
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, 'dossier.json'), dossier);
console.log(`dossier.json written to ${join(out, 'dossier.json')} (${Buffer.byteLength(dossier)} bytes)`);
