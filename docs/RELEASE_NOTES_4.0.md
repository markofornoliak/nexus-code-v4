# NEXUS CODE 4.0 release notes

## Spatial interface

- Replaced the landing atlas ornament with an interactive Three.js archive core.
- Added the `/lab` route with execution-flow, graph-search, and call-stack experiments.
- Added collapsible 3D concept reactors to lesson theory.
- Added adaptive, immersive, and minimal render modes to profile settings.
- Implemented deterministic scene models, node selection, pointer rotation, autoplay,
  pixel-density limits, visibility pausing, WebGL context-loss recovery, and complete
  DOM fallbacks.
- Extended both Field Codex and Night Observatory themes across the new UI with
  desktop, tablet, phone, reduced-motion, and non-WebGL layouts.

## Curriculum

- Expanded the catalog from 65 to 90 lessons and from 13 to 18 worlds.
- Added Graph Nexus to Python: representations, BFS, DFS, dynamic programming, and
  weighted shortest paths.
- Added State Reactor to JavaScript: Map/Set, classes, closures, generators, and
  Promise coordination.
- Added Interface Reactor to HTML/CSS: tokens, container queries, accessible forms,
  motion, and a complete adaptive interface.
- Added Contract Forge to Java: inheritance, interfaces, exceptions, streams, and
  layered architecture.
- Added Ownership Reactor to C++: RAII, smart pointers, templates, STL/lambdas, and
  explicit lifetime design.
- Added eight achievements, including 75/90-lesson milestones and 5,000 XP mastery.

## Learning workflow

- Added three deterministic daily missions derived from same-day local activity.
- Added a recommended-coordinate action to each mission deck.
- Added language-specific CodeMirror completion scaffolds and line wrapping.
- Added explicit Worker/Pyodide restart controls after runtime errors and timeouts.
- Added a fast offline failure message before attempting a new Pyodide download.

## Compatibility and reliability

- Raised local storage to version 5 with an additive `visualMode` preference.
- Preserved all earlier lesson/task IDs and chained migrations from versions 1–4.
- Isolated Three.js into a lazy production chunk.
- Extended production verification to require Three.js, CodeMirror, Pyodide Worker,
  and JavaScript Worker assets.
- Added deterministic tests for spatial models, completion sources, daily missions,
  v4 storage migration, the 90-lesson catalog, and the non-WebGL lab route.

## Repository and deployment

- Updated GitHub Actions to supported `actions/checkout@v6` and
  `actions/setup-node@v6`.
- Added Dependabot groups for npm and GitHub Actions.
- Kept separate pull-request CI and `main` GitHub Pages deployment workflows.
- Added first-publish and manual deployment documentation.
