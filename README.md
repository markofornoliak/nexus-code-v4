# NEXUS CODE v4.1

> Recover the logic. Rebuild the signal.

NEXUS CODE is a browser-native programming learning platform presented as a living,
spatial code archive. Version 4.1 combines 100 typed lessons, executable Python and
JavaScript challenges, accessible HTML previews, structural Java and C++ exercises,
an interactive Three.js concept lab, and local-first learning progress.

The repository is production-ready for GitHub Pages. It contains deterministic content
and scene-model tests, strict TypeScript and ESLint gates, build-output verification,
CI, Pages deployment, and Dependabot configuration.

## Release inventory

| Track       | Execution mode             | Worlds | Lessons |
| ----------- | -------------------------- | -----: | ------: |
| Python Core | Pyodide Web Worker         |      9 |      45 |
| JavaScript  | JavaScript Web Worker      |      4 |      20 |
| HTML / CSS  | Sandboxed browser preview  |      3 |      15 |
| Java        | Java source analyzer       |      2 |      10 |
| C++         | C++ source analyzer        |      2 |      10 |
| **Total**   | Four validation strategies | **20** | **100** |

Every lesson has two required tasks and one optional bonus challenge: 200 required
tasks and 100 bonus challenges in total.

## What changed in v4.1

- Added an adaptive **Command Center** with a recovery score, ranked next-best actions,
  world-level diagnostics, a 14-day learning pulse, and persistent 15/25/45-minute focus
  protocols.
- Added a second interactive Three.js experience: a draggable, raycast-selectable skill
  constellation with bounded pixel density, viewport pausing, cleanup, context-loss
  recovery, and a complete semantic fallback.
- Expanded the archive to 100 lessons and 20 worlds. Python gains the **Automation
  Forge**; JavaScript gains **Runtime Orchestration**.
- Added generators, decorators, context managers, test design, Python automation,
  event buses, reducer state machines, concurrency, memoization, and observable runtime
  capstones.
- Added storage v6 with a non-destructive v1 → v6 migration and new 100-lesson,
  automation, and runtime-orchestration relics.
- Extended route, selector, migration, catalog, and curriculum tests for the new release.

See [Release Notes 4.1](docs/RELEASE_NOTES_4.1.md) for the detailed change log.

## What changed in v4

- A new spatial UI system with an interactive Three.js archive core, a dedicated 3D
  Concept Lab, and embedded per-lesson concept reactors.
- Adaptive, immersive, and minimal visual-depth modes. WebGL is progressive
  enhancement; semantic DOM scenes preserve the complete interface on unsupported
  devices.
- Five new five-lesson worlds: Graph Nexus, State Reactor, Interface Reactor, Contract
  Forge, and Ownership Reactor.
- A 40-lesson Python path that now reaches graph representation, BFS, DFS, dynamic
  programming, and Dijkstra-style pathfinding.
- Daily adaptive missions, clearer recommended actions, 32 achievements, 75/90-lesson
  milestones, and a 5,000-XP mastery relic.
- CodeMirror line wrapping and language-specific completion scaffolds for Python,
  JavaScript, HTML/CSS, Java, and C++.
- Recoverable Pyodide/Worker failures, explicit runtime reset actions, offline-aware
  Python startup, bounded output, and execution timeouts.
- Version 5 local storage with a non-destructive v1 → v5 migration chain. Existing
  lesson IDs, task IDs, XP, achievements, bookmarks, drafts, profile data, and streaks
  remain compatible.
- A dedicated `three` production chunk, static-output verification, updated GitHub
  Actions, and automated Pages deployment.

See [Release Notes 4.0](docs/RELEASE_NOTES_4.0.md) for the detailed change log.

## Quick start

Requirements:

- Node.js 24 LTS-compatible runtime. Node 20.19+ is supported by the project toolchain.
- npm 10 or newer.
- A current evergreen browser for WebGL and module Worker support.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Python downloads the pinned Pyodide runtime only
when the first Python program is run; the landing page does not pay that startup cost.

## Quality gate

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Additional checks used by CI:

```bash
npm run format:check
npm audit --omit=dev
VITE_BASE_PATH=/nexus-code-v4/ npm run build
```

`npm run build` includes `scripts/verify-build.mjs`. The verifier checks the static
entry point, manifest, `.nojekyll`, configured base path, all emitted asset references,
the CodeMirror and Three.js chunks, and both execution Worker bundles.

## Core experience

### Learning and execution

- The content registry discovers five independent track modules and exposes one typed
  `Track → World → Lesson → Task` model.
- Python runs through Pyodide in a dedicated Worker with per-run stdin, stdout/stderr
  capture, serialized runs, a six-second timeout, and worker reconstruction.
- JavaScript runs in a disposable Worker with `console`, `input()`, top-level `await`,
  a four-second timeout, and bounded output.
- HTML/CSS renders in an iframe with an empty sandbox token set: scripts, forms,
  same-origin access, popups, and top-level navigation are not granted.
- Java and C++ use transparent source-structure checks. Native compiler execution is
  intentionally outside the client-only security model.

### Adaptive command center

The `/command` route turns existing progress into a focused operational plan:

- ranked recommendations prioritize unfinished fragments, active-track momentum, and
  deliberate exploration;
- 15/25/45-minute focus protocols persist in storage v6;
- the skill constellation visualizes all five language tracks through an interactive,
  accessible Three.js scene;
- world-level diagnostics and a 14-day learning pulse remain local and deterministic.

### Spatial learning

The `/lab` route contains deterministic visual models for:

1. JavaScript execution and asynchronous sequencing.
2. Breadth-first graph search.
3. Recursive call-stack expansion and unwind.

Scenes can be dragged, stepped, replayed, and queried by selecting nodes. Scene data is
pure and unit-tested. Render density, device pixel ratio, animation, observers, and
resource disposal are handled independently from the explanatory UI.

### Progress and continuity

All progress is stored locally under `nexus-code:state` (schema v6):

- required and bonus task completion;
- lesson completion and unlock order;
- Signal Energy (XP), levels, achievements, streaks, and activity;
- profile data, themes, weekly target, focus-session length, bookmarks, and visual-depth preference;
- bounded per-task code and stdin drafts.

The profile provides JSON export/import for backups or migration between browsers.
XP transactions are idempotent, so repeating a solved task cannot award duplicate XP.

## Themes, accessibility, and resilience

- Field Codex light theme and Night Observatory dark theme.
- Keyboard-accessible navigation, Atlas, command palette, task tabs, lesson controls,
  scene step controls, and settings.
- Skip link, structured landmarks, live status regions, focus-visible styling, and
  non-color validation states.
- A user reduced-motion setting works alongside the operating-system preference.
- The minimal depth setting avoids WebGL while preserving the same learning content.
- WebGL context loss, Worker timeouts, offline Pyodide startup, malformed storage, and
  application render failures have explicit recovery paths.
- Responsive layouts cover wide desktop, laptop, tablet, narrow mobile, and safe-area
  constraints.

## Architecture

```text
src/
├── app/                     routing, shell, error boundary, product configuration
├── components/              reusable learning, navigation, progress, and UI modules
├── content/
│   ├── _shared/             typed content factories
│   ├── v4/                  v4 curriculum worlds
│   ├── v41/                 automation and orchestration worlds
│   └── {track}/             track modules and existing worlds
├── features/
│   ├── code-runner/         CodeMirror, validation, runtimes, Workers, completion
│   ├── command-center/      adaptive 3D mastery constellation
│   ├── progress/            reducer, selectors, achievements, adaptive routing
│   └── visual-lab/          deterministic scene data and Three.js renderer
├── pages/                   landing, tracks, Atlas, 3D Lab, lesson, and profile routes
├── services/storage/        schema validation and v1 → v6 migration
├── styles/                  both themes and adaptive spatial design system
├── types/                   content, progress, and runtime contracts
└── vendor/                  audited tiny install-resilience fallback
```

Three.js and CodeMirror are isolated into explicit lazy production chunks. Pyodide is
loaded at runtime from its pinned CDN inside its Worker, never on the UI thread.

More detail:

- [Architecture](docs/ARCHITECTURE.md)
- [Curriculum inventory](docs/CURRICULUM.md)
- [Content authoring](docs/CONTENT_AUTHORING.md)
- [Security model](docs/SECURITY.md)
- [Dependency resilience](docs/DEPENDENCY_RESILIENCE.md)
- [Manual QA checklist](docs/QA_CHECKLIST.md)
- [Verification report v4.1](docs/VERIFICATION_4.1.md)
- [Verification report v4.0](docs/VERIFICATION.md)

## GitHub Pages

The deploy workflow runs for pushes to `main`:

1. install with `npm ci`;
2. audit production dependencies;
3. typecheck, lint, format-check, and test;
4. build with `VITE_BASE_PATH=/<repository-name>/`;
5. verify the emitted site;
6. deploy the exact build artifact to GitHub Pages.

In the repository, set **Settings → Pages → Build and deployment → Source** to
**GitHub Actions**. The resulting URL is normally:

```text
https://<owner>.github.io/<repository-name>/
```

For repository creation, remotes, authentication, and first push, see
[GitHub Publishing](docs/GITHUB_PUBLISHING.md).

## Scripts

| Command                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Start the Vite development server              |
| `npm run typecheck`    | Run strict TypeScript checks                   |
| `npm run lint`         | Run ESLint with zero warnings                  |
| `npm run test`         | Run the Vitest suite once                      |
| `npm run test:watch`   | Run Vitest in watch mode                       |
| `npm run build`        | Typecheck, build, and verify production output |
| `npm run verify:dist`  | Verify an existing `dist` directory            |
| `npm run preview`      | Serve the production output locally            |
| `npm run format`       | Format the repository with Prettier            |
| `npm run format:check` | Verify formatting without changing files       |

## Privacy and security

NEXUS has no application backend, account system, analytics, or embedded credentials.
Progress remains in the current browser unless the user exports it. Browser Workers
and iframe sandboxing reduce accidental interference, but they are not equivalent to
an adversarial server sandbox. Do not add secrets to client code or execute untrusted
Java/C++ binaries without an isolated backend.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md), then run the complete quality gate before
opening a pull request. Content contributions must keep IDs globally unique and include
two required tasks, one bonus task, explicit validation, objectives, and teaching
material.

## License

Released under the [MIT License](LICENSE).
