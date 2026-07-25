# NEXUS CODE 4.0 verification report

Verified on 2026-07-26 with Node.js 24.14.0 and npm 11.9.0.

## Required quality gate

All requested commands completed successfully:

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
```

Results:

- install: dependency tree up to date;
- TypeScript: zero errors;
- ESLint: zero errors and zero warnings;
- Vitest: 18 files passed, 76 tests passed;
- production build: 1,687 modules transformed;
- static-output verification: 79 files, 9.09 MiB including source maps;
- production dependency audit: 0 known vulnerabilities;
- Prettier repository check: all tracked source and documentation matched.

## Test coverage contract

Automated coverage includes:

- all 90 lessons and 18 worlds;
- globally unique lesson and task IDs;
- two required tasks and one bonus task per lesson;
- valid execution metadata and compilable validation patterns;
- v1, v2, v3, and v4 storage migration to v5;
- bounded drafts, bookmarks, settings, XP idempotency, and lesson completion;
- Atlas search and bookmark interaction;
- router, lazy routes, 404 handling, command-palette focus, and navigation;
- Python/JavaScript execution limits and validation modes;
- deterministic spatial scene coordinates, edges, step normalization, and labels;
- daily mission derivation and language completion scaffolds;
- the `/lab` route under a non-WebGL test environment.

## Production and Pages builds

Both deployment modes passed the output verifier:

```bash
npm run build
VITE_BASE_PATH=/nexus-code-v4/ npm run build
```

The verifier confirmed:

- no development-source references in the generated HTML;
- every local HTML asset reference resolves;
- `.nojekyll` and the web manifest are present;
- repository-subpath references use `/nexus-code-v4/`;
- dedicated CodeMirror and Three.js chunks are emitted;
- Pyodide and JavaScript Worker bundles are emitted.

Notable compressed transfer sizes:

| Asset                         |  Gzip size |
| ----------------------------- | ---------: |
| Application/content chunk     | 165.26 KiB |
| Lazy Three.js chunk           | 189.63 KiB |
| CodeMirror platform chunk     |  97.69 KiB |
| Global responsive style sheet |  25.20 KiB |
| Lesson route                  |  38.65 KiB |

Three.js is loaded only when an eligible spatial scene mounts. CodeMirror language
packages and page routes remain split. Pyodide is fetched only when Python execution is
first requested.

## Manual QA boundary

The automated environment verified DOM behavior, semantics, reduced-motion logic,
fallback rendering, responsive rules, build references, and runtime boundaries. It did
not provide a graphical WebGL browser. The final cross-device GPU/rendering review
remains a release checklist item in [QA_CHECKLIST.md](QA_CHECKLIST.md), especially for
low-end mobile GPUs and Safari-specific canvas behavior.
