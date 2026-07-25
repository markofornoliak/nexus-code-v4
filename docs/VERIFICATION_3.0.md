# NEXUS CODE 3.0 verification report — archived

This report records the final release checks for the Bioluminescent Field Codex
source archive.

## Automated checks

The following commands completed successfully:

```bash
npm install
npm audit --omit=dev
npm run format:check
npm run typecheck
npm run lint
npm run test
npm run build
VITE_BASE_PATH=/nexus-code-v3/ npm run build
```

Vitest completed 15 test files and 61 tests. `npm audit --omit=dev` reported
0 vulnerabilities. The production build transformed 1,672 modules without warnings or
errors. The content integrity suite verifies all 65 lessons, global ID uniqueness, two
standard tasks per lesson, runtime metadata, and every released validation regular
expression. Router and navigation coverage additionally verifies named parameters,
active branches, client-side navigation, fallback handling, command-palette keyboard
behavior, focus restoration, and the hash-safe skip link.

Storage tests cover migration from versions 1, 2, and 3 to version 4, including
preservation of completed tasks, XP, achievements, activity history, profile data,
drafts, and bounded bookmarks. Atlas tests cover full-catalog search, filtering, and
bookmark persistence.

## Runtime startup

The production preview reported ready, served `index.html`, returned the web manifest
with HTTP 200, and was then stopped:

```bash
npm run preview
```

## GitHub Pages audit

The production build was generated with a repository subpath and inspected for:

- prefixed HTML asset references;
- relative lazy-route chunks;
- a generated CodeMirror bundle;
- a generated Pyodide worker bundle;
- a generated JavaScript worker bundle;
- lazy chunks for each CodeMirror language mode;
- a pinned Pyodide CDN resource URL;
- missing referenced files;
- unexpected root-relative application assets.

The verified production output contains 65 files and is 5.02 MiB before compression.
The largest eagerly requested JavaScript chunk is 435.30 kB (136.50 kB gzip), below
Vite's 500 kB warning threshold. The isolated CodeMirror chunk is 298.52 kB
(97.69 kB gzip), and language parsers load only when a lesson needs them. The
application uses its dependency-free typed `HashRouter`, so lesson, track, Atlas,
profile, and fallback routes remain refresh-safe on static GitHub Pages hosting.

## Manual QA

The detailed browser checklist is in
[`docs/QA_CHECKLIST.md`](./QA_CHECKLIST.md). This build environment verified HTTP
startup, DOM behavior, accessibility semantics, and responsive CSS rather than a
complete graphical browser session: the available graphical channel was blocked
before page rendering. Viewport and live Pyodide interaction checks therefore remain
documented release checks rather than claimed visual assertions. Responsive rules
explicitly cover 1,440 px, 1,024 px, 768 px, 390 px, and 320 px layouts.
