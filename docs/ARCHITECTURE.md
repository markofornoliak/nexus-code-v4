# NEXUS architecture

## State boundaries

| State                                             | Owner                          | Persistence              |
| ------------------------------------------------- | ------------------------------ | ------------------------ |
| Track, world, lesson, task, achievement content   | `src/content` registry         | Build-time modules       |
| User XP, task completion, relics, streak, profile | progress reducer               | Versioned `localStorage` |
| Theme, visual depth, weekly target, bookmarks     | progress reducer               | Versioned `localStorage` |
| Editor text and selected task                     | `LessonPage`                   | Current route            |
| Per-task code and input drafts                    | progress reducer               | Versioned `localStorage` |
| Python runtime and execution queue                | `PyodideService`               | Worker lifetime only     |
| JavaScript runtime and execution queue            | `JavaScriptService`            | Worker lifetime only     |
| HTML preview document                             | `LessonPage` sandbox           | Current route            |
| Runtime output and validation result              | `useCodeRunner` / `LessonPage` | Deliberately ephemeral   |
| 3D scene coordinates and state                    | pure visual-lab scene model    | Recomputed per view      |
| WebGL renderer, geometry, and animation           | `NexusScene`                   | Component lifetime only  |
| Navigation and route params                       | `src/router` context           | URL hash                 |

## Content discovery

The root registry uses `import.meta.glob("./*/index.ts", { eager: true })` to discover
language modules. The original Python worlds continue to discover files under
`worlds/**/lessons/*.ts`; the expansion and remaining tracks use typed curriculum
factories. Both routes produce the same `Track → World → Lesson → Task` domain model,
so renderers remain independent of curriculum size.

`src/lib/catalogSearch.ts` flattens that registry into a deterministic 90-entry search
index at build time. Atlas and command-palette results therefore share the same typed
content source, preserve track/world/lesson ordering, and require no network service.

## Progress transaction

1. The selected runtime or analyzer finishes without an execution error.
2. The selected validation strategy produces a structured result.
3. A successful result dispatches `record-task`.
4. The reducer rejects duplicate task IDs before awarding XP.
5. Streak and achievement conditions are recalculated.
6. The provider persists the versioned state after a short debounce.

Lesson XP is a separate explicit transaction and is available only when every standard
task ID exists in that lesson's progress record.

## Execution isolation

Pyodide is loaded lazily inside a dedicated Web Worker. Runs are serialized. Python
`sys.stdin` is replaced with an in-memory, multiline input queue for each run; stdout
and stderr are redirected into text buffers. A six-second main-thread timer terminates
the worker when code does not return, then the next run creates a fresh runtime.

Modern JavaScript runs in a separate disposable Worker with console and input adapters,
serialized operations, a four-second timeout, and bounded output. Learner HTML renders
inside a sandboxed `iframe` without script permission. Java and C++ use source-pattern
validation and clearly identify that a native compiler remains necessary.

These are practical client-side isolation boundaries, not security boundaries
equivalent to a server sandbox. The application contains no secrets and never injects
runtime output as application HTML.

## Spatial rendering

`src/features/visual-lab/sceneModel.ts` owns deterministic nodes, edges, and step state.
It has no DOM or Three.js dependency, which keeps the instructional model independently
testable. `NexusScene` dynamically imports Three.js only when WebGL is supported and
the user has not selected minimal depth. It caps pixel density, scales scene density by
preference, pauses outside the viewport, observes resize, handles pointer selection and
context loss, and disposes geometries, materials, renderer state, observers, and event
listeners on teardown.

The semantic fallback uses the same scene model. Lab explanations, step controls, code,
progress, and curriculum links are ordinary HTML and never depend on a successful
canvas render.

## Storage migration

Storage version 5 adds the adaptive/minimal/immersive visual-depth preference. Imports
from version 1 first gain version 2 preferences; version 2 gains the bounded draft map;
version 3 gains the v4 planning fields; version 4 gains the v5 spatial preference.
Existing lesson IDs, task IDs, drafts, XP, streaks, achievement dates, bookmarks, and
activity records remain unchanged. The five new worlds only append IDs, so previous
completion remains valid.

## Deployment

The dependency-free typed `HashRouter` in `src/router` makes nested navigation
refresh-safe on static hosting. It implements exact routes, named parameters, active
links, redirects, a fallback route, and an in-memory test adapter. Vite's `base` is
normalized from `VITE_BASE_PATH`. GitHub Actions derives that path from
`github.event.repository.name`, so hashed assets, dynamic imports, and emitted Worker
URLs resolve under `https://username.github.io/repository-name/`. The production build
then runs `scripts/verify-build.mjs`, which rejects missing references, development
source paths, absent Workers, absent CodeMirror or Three.js chunks, or a missing
`.nojekyll`.
