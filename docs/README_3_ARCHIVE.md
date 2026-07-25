# NEXUS CODE v3 — archived release readme

**Recover the logic. Rebuild the signal.**

[Live application](https://markofornoliak.github.io/nexus-code-v3/) ·
[Source repository](https://github.com/markofornoliak/nexus-code-v3)

NEXUS is a portfolio-grade, static programming learning platform built with React,
TypeScript, Vite, CodeMirror 6, and Pyodide. Release 3.0 contains 65 substantial
lessons across five operational tracks: 35 Python lessons, 10 JavaScript lessons,
10 HTML/CSS lessons, 5 Java lessons, and 5 C++ lessons.

Python and JavaScript execute in disposable Web Workers, HTML/CSS renders in an
isolated preview, and Java/C++ tasks use explicit source-structure validation. The
product runs without a backend, migrates earlier local progress, autosaves code
drafts, and deploys safely to a GitHub Pages repository subpath. Its visual identity
is created with CSS, semantic HTML, compact inline SVG map paths, and open-source
icons, so no required raster assets delay the initial render.

## Visual concept

### The Living Code Archive

Programming knowledge is framed as a vast bio-digital archive discovered inside an
ancient computational organism. Languages are **Expeditions**, worlds are **Archive
Sectors**, lessons are **Fragments**, XP is **Signal Energy**, streaks are **Pulse
Chains**, and achievements are collectible **Relics**.

The name NEXUS refers to a junction where dormant logic fragments reconnect into a
working neural pathway. Release 3.0 introduces the **Bioluminescent Field Codex**:
a light mineral field manual paired with deep-green cartographic instruments,
acid-lime live signals, coral specimen marks, clipped archive housings, and restrained
route motion. It intentionally avoids cartoon mascots, generic gradient cards, and
conventional developer-dashboard composition.

Design principles:

1. **Instrument, not decoration** — labels, grids, readouts, paths, and states explain
   the interface.
2. **Controlled contrast** — dark research surfaces alternate with a pale manuscript
   band; lime, amber, and cyan carry semantic signal states.
3. **Recognizable geometry** — diamond seals, circular orreries, clipped archive
   housings, and precise 1 px borders recur throughout the product.
4. **Motion with purpose** — slow orbits and signal pulses suggest a living system and
   disappear under `prefers-reduced-motion`.
5. **Content remains primary** — visual narrative never obscures theory, code, output,
   focus, or validation.

## Main features

- Five available language tracks backed by one typed domain architecture.
- Expanded curriculum: 13 worlds, 65 lessons, 130 standard tasks, and 65 bonus
  challenges.
- Python Core: 7 worlds and 35 lessons from first output to data pipelines, OOP,
  searching, sorting, recursion, testing, debugging, generators, context managers,
  and a reliability capstone.
- JavaScript: 10 executable lessons covering values, control flow, functions,
  objects, array transformations, JSON, errors, and promises.
- HTML/CSS: 10 lessons with a sandboxed live preview, semantic accessibility,
  Flexbox, Grid, fluid sizing, and media queries.
- Java 8 and C++ foundations: 5 lessons each with CodeMirror language support and
  source-contract validation.
- Reusable lesson-section renderer for theory, syntax, examples, callouts, warnings,
  mistakes, and tasks.
- Language-aware CodeMirror 6 editor with Python, JavaScript, HTML, Java, and C++
  modes, a custom NEXUS theme, keyboard task tabs, and adjustable font size.
- Lazy Pyodide initialization inside a Web Worker.
- Dedicated JavaScript Worker with async/await, console capture, input queue,
  four-second interruption, and bounded output.
- Sandboxed HTML `srcdoc` preview without script permission.
- Multiline standard-input queue for Python `input()`.
- stdout/stderr capture, syntax/runtime feedback, repeatable runs, and six-second
  runaway-code interruption.
- Seven validation modes: exact, trimmed exact, regex, substring, multiple variants,
  code pattern, and registered custom validators.
- Duplicate-XP prevention and explicit lesson completion conditions.
- Signal Energy, calculated levels, daily Pulse Chains, and 21 thematic Relics.
- Cross-language Atlas with full-catalog search, language/status filters, bookmarks,
  recovery recommendations, and progressive result loading.
- Global `Ctrl/⌘+K` command palette with keyboard navigation and focus containment.
- Personal weekly lesson target, 21-day activity field, saved-coordinate panel, and
  light/dark field themes.
- Connected, responsive, keyboard-accessible maps for all five tracks.
- Versioned local storage v4 with v1/v2/v3 migration, safe parsing, bounded autosaved
  drafts and bookmarks, corruption recovery, export, import, and reset confirmation.
- Dependency-free typed hash routing, route-level lazy loading, 404 state, and a
  rendering error boundary.
- Responsive layouts designed around 1440, 1024, 768, 390, and 320 px, including
  safe-area insets and touch-target sizing.
- Practical WCAG 2.1 AA semantics, focus states, live announcements, and reduced motion.
- Unit and component coverage for domain calculations, persistence, registry behavior,
  navigation, feedback, lock rules, and lesson runtime loading.

## Technology stack

| Area        | Technology                                                         |
| ----------- | ------------------------------------------------------------------ |
| UI          | React 19, TypeScript, Tailwind CSS 4, semantic custom CSS          |
| Build       | Vite 6                                                             |
| Navigation  | Native typed hash router with route parameters and memory tests    |
| Editor      | CodeMirror 6 with Python, JS, HTML, Java, and C++ language modes   |
| Python      | Pyodide 0.27.7 loaded lazily from the pinned jsDelivr package path |
| JavaScript  | Disposable dedicated Web Worker with async execution               |
| Web preview | Sandboxed `iframe[srcdoc]` without script permission               |
| Persistence | Browser `localStorage`                                             |
| Tests       | Vitest, React Testing Library, jest-dom, jsdom                     |
| Quality     | ESLint flat config, typescript-eslint, Prettier, strict TypeScript |
| Deployment  | Official GitHub Pages Actions                                      |

## Architecture overview

The application separates build-time curriculum, persistent user progress and drafts,
ephemeral execution state, and presentation state. Generic pages never contain
lesson-specific validation branches. Content additions flow through registries and
typed data files.

```text
Content files ──> content registry ──> generic track/lesson renderers
                                        │
CodeMirror ──> runtime router ──> Python Worker / JavaScript Worker
                              └─> HTML sandbox / source analyzer
                                           │
                                    task validator
                                           │
Progress UI <── selectors <── versioned reducer ──> localStorage + drafts
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for state ownership, content
discovery, progress transactions, execution isolation, and base-path behavior.

## Folder structure

```text
src/
  app/
    App.tsx
    config/
  components/
    achievements/
    common/
    feedback/
    layout/
    lessons/
    tracks/
  content/
    _shared/
    _templates/
    python/worlds/*/lessons/
    javascript/
    html-css/
    java/
    cpp/
    achievements.ts
    registry.ts
  design-system/
  features/
    code-runner/
    progress/
  lib/
  pages/
  router/
  services/
    javascript/
    pyodide/
    storage/
  styles/
  test/
  types/
docs/
.github/workflows/deploy.yml
```

## Installation

Requirements:

- Node.js 20.19 or newer (Node 24 is used in CI).
- npm 10 or newer.
- A modern browser with Web Workers and WebAssembly.

```bash
npm install
```

No environment variables or private API keys are required.

## Local development

```bash
npm run dev
```

Vite prints the local URL. The landing page does not fetch Pyodide. JavaScript,
HTML/CSS, Java, and C++ learning remain available without that download. The first
Python execution downloads the pinned runtime from jsDelivr, so that action requires
network access.

## Required commands

```bash
npm run dev
npm audit --omit=dev
npm run format:check
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

`npm run build` performs strict type checking, creates the production Vite bundle,
and verifies emitted HTML, base-path references, Workers, CodeMirror, manifest, and
`.nojekyll`.

## Production build

For a root deployment:

```bash
npm run build
npm run preview
```

For this repository:

```bash
VITE_BASE_PATH=/nexus-code-v3/ npm run build
npm run preview
```

`vite.config.ts` normalizes missing leading/trailing slashes. Do not hardcode the
repository name in source files.

## Testing

```bash
npm run test
```

The unit suite does **not** download Pyodide. The execution hook and editor are mocked
where runtime loading state is tested. Manual Pyodide, responsiveness, keyboard, and
deployment checks are documented in [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md).
The release command results and production-path audit are recorded in
[docs/VERIFICATION.md](docs/VERIFICATION.md).

The complete learning inventory is documented in
[docs/CURRICULUM.md](docs/CURRICULUM.md), and content extension rules are in
[docs/CONTENT_AUTHORING.md](docs/CONTENT_AUTHORING.md).
See [docs/RELEASE_NOTES_3.0.md](docs/RELEASE_NOTES_3.0.md) for the complete release
delta and compatibility notes.

## GitHub Pages deployment

1. Create a GitHub repository and push this project to its `main` branch.
2. Open **Repository → Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`, or run the workflow manually from the Actions tab.
5. Wait for **Deploy NEXUS to GitHub Pages** to finish.

The Pages source selection is a one-time repository setting. If it has not been set
before the first workflow run, GitHub returns `Get Pages site failed: Not Found`.
Select **GitHub Actions** in Settings → Pages, then rerun the failed workflow.

The workflow:

1. checks out the repository;
2. installs with `npm ci`;
3. audits production dependencies;
4. runs type checking, linting, and formatting checks;
5. runs all automated tests;
6. derives `VITE_BASE_PATH` from `${{ github.event.repository.name }}`;
7. builds;
8. uploads `dist`;
9. deploys through the official Pages action.

The generated `dist` directory is intentionally not committed.

### Repository name configuration

No source edit is required in the included GitHub workflow. It automatically turns a
repository called `repository-name` into `/repository-name/`.

Only a manual production build needs the variable:

```bash
VITE_BASE_PATH=/repository-name/ npm run build
```

If the project is served from a custom domain root, build with `VITE_BASE_PATH=/`.

## Why routing survives static hosting

NEXUS uses its own small typed `HashRouter`. Routes therefore appear after `#` and are
resolved entirely in the browser. A direct refresh always requests the single deployed
`index.html`, so GitHub Pages does not need a custom 404 fallback. Vite applies the same
base path to hashed chunks and the emitted runtime Workers. The router has no runtime
dependency and is covered by parameter, navigation, active-link, and fallback tests.

## Adding a new lesson

1. Copy `src/content/_templates/lesson.template.ts`.
2. Place the new file in:
   `src/content/python/worlds/<world-folder>/lessons/<order>-<slug>.ts`.
3. Give the lesson, tasks, and bonus globally unique IDs.
4. Set `worldId` to an existing world and choose its local `order`.
5. Add real theory, examples, mistakes, starter code, hints, and validations.
6. Add prerequisites using lesson IDs.
7. Run typecheck, tests, and build.

The Python module uses `import.meta.glob` and discovers the file automatically. Route,
track, lesson, progress, and navigation components require no edit.

## Adding a new world

1. Copy `src/content/_templates/world.template.ts` into the new world folder as
   `world.ts`.
2. Give it a unique ID, local order, landmark, semantic accent, and complete copy.
3. Add a `lessons` directory with typed lesson files.
4. Import the world definition once in `src/content/python/index.ts` and include it in
   the ordered world array.

This is the only language-local index edit required.

## Adding a programming language

1. Copy `src/content/_templates/track.template.ts` into
   `src/content/<language-id>/index.ts`.
2. Replace the IDs, name, archive identity, status, metadata, and world modules.
3. Reuse the Python `index.ts` pattern if lesson files should be discovered
   automatically.
4. Implement or register an execution adapter before changing the track to `available`.
5. Add language-specific syntax highlighting to `CodeEditor`.
6. Add tests for registry discovery, task validation, and runtime failure states.

The root registry discovers the new `index.ts`; no global switch statement or route
edit is needed.

## Adding an achievement

Add one typed object to `src/content/achievements.ts`. Supported declarative conditions:

- `task-count`
- `lesson-count`
- `bonus-count`
- `total-xp`
- `streak`
- `lesson-completed`
- `world-completed`
- `track-completed`

The progress reducer evaluates newly satisfied conditions after every XP-bearing
transaction and records the unlock only once.

## Extending task validation

For a declarative strategy:

1. Add a new discriminated-union member to `TaskValidation` in
   `src/types/content.ts`.
2. Add an exhaustive `case` in `src/lib/validation.ts`.
3. Return a complete `ValidationResult`.
4. Add success and failure unit tests.
5. Document authoring syntax in the lesson template.

For a selected advanced task, register a named custom validator in the
`customValidators` map and reference only its inert `validatorId` from content. Imported
progress never carries executable functions.

## Local storage schema

Key: `nexus-code:state`

```ts
interface StoredApplicationState {
  version: number;
  progress: {
    displayName: string;
    totalXp: number;
    lessons: Record<string, LessonProgress>;
    unlockedAchievementIds: string[];
    achievementDates: Record<string, string>;
    streak: StreakState;
    activity: LearningActivity[];
  };
  preferences: {
    reducedMotion: boolean;
    editorFontSize: number;
    hintsExpanded: boolean;
    theme: "field-codex" | "night-observatory";
    weeklyLessonGoal: number;
  };
  drafts: Record<string, TaskDraft>;
  bookmarkedLessonIds: string[];
}
```

Current version: `4`. Reads use guarded JSON parsing, runtime shape validation, value
limits, defaults, and sequential migrations from versions 1, 2, and 3. Existing XP,
completion, achievements, streaks, activity, profile data, and v3 task drafts are
preserved. Invalid state falls back to a clean profile and raises a visible recovery
notice.

## Pyodide and input notes

- Runtime version is pinned to Pyodide `0.27.7`.
- It loads only after the learner runs Python for the first time.
- The runtime operates in a dedicated Worker, not the React main thread.
- Runs are serialized.
- `sys.stdin` becomes an `io.StringIO` built from the Standard Input panel.
- Each `input()` consumes one line; multiple calls require multiple lines.
- stdout and stderr are captured separately and rendered as plain text.
- A six-second watchdog terminates the Worker to recover from common infinite loops.
- After a timeout, the next run creates a fresh runtime and must load it again.

## Known browser limitations

- First Python execution downloads a comparatively large WebAssembly runtime. Duration
  depends on network and browser cache.
- Pyodide CDN unavailability prevents Python execution but not theory, maps, profile, or
  local progress.
- Terminating a Worker is the safest broadly supported interruption strategy; it
  discards that runtime instance.
- Browser Python execution is not a hardened server sandbox. Do not adapt this design
  to process untrusted secrets.
- Progress is device/browser-profile local unless exported manually.
- Private browsing, storage quotas, or aggressive cleanup may remove local progress.
- Local calendar changes can affect date-based streak semantics.

## Performance notes

- Every page route is lazy-loaded.
- Pyodide is absent from the JavaScript bundle and from landing-page requests.
- CodeMirror is isolated in its own production chunk.
- Curriculum data is split with the lesson route.
- SVG paths are small and raster/base64 assets are not bundled.
- Memoization is limited to stable content-derived structures and context values.

The unavoidable large download is the external Pyodide runtime and Python standard
library. It is deferred until real execution is requested.

## Accessibility

- Semantic landmarks, headings, navigation, buttons, links, labels, lists, and progress
  elements.
- Skip link and high-contrast keyboard focus ring.
- Map nodes are links or disabled buttons, never clickable `div` elements.
- Runtime and validation feedback uses live regions.
- Success and failure include icons, labels, and text—not color alone.
- Output is text inside `pre`; learner content is never injected as HTML.
- Responsive lesson stacking preserves actions before lengthy theory on smaller screens.
- Continuous visual motion respects `prefers-reduced-motion`.

## Content security

The project contains no API keys or application secrets. Learner output uses React text
nodes and `pre`, never `dangerouslySetInnerHTML`. Imported progress is length-limited,
parsed as JSON, validated against a fixed data shape, and cannot register code or
validation functions. Release checks include `npm audit --omit=dev`; the full browser
threat model is documented in [docs/SECURITY.md](docs/SECURITY.md).

## Future roadmap

- Add intermediate and advanced worlds to the four non-Python tracks.
- Optional remote native compiler adapters for Java and C++ with explicit consent.
- Optional service-worker caching for the Pyodide distribution.
- Advanced Atlas objective filters and shareable learning routes.
- Instructor-authored content validation CLI.
- Shareable, signed progress snapshots without a central account system.
- Internationalized learning content.
- Automated accessibility and screenshot regression checks in CI.

## Third-party licenses

- React, React DOM — MIT.
- Vite — MIT.
- Tailwind CSS — MIT.
- CodeMirror packages — MIT.
- Lucide icons — ISC.
- Pyodide — Mozilla Public License 2.0; includes Python and compatible packaged
  components. Runtime files are loaded from the pinned jsDelivr package path and are not
  redistributed in this repository.
- TypeScript, ESLint, Prettier, Vitest, Testing Library — their respective permissive
  open-source licenses.

All NEXUS layout, product copy, CSS artwork, archive terminology, course structure, and
application source in this repository are original. See [LICENSE](LICENSE) for project
licensing.
