# NEXUS CODE 3.0 — Bioluminescent Field Codex

## Headline

NEXUS moves from a dark archive interface to a complete two-theme field system and
adds a cross-language learning command layer. The release grows to 65 lessons while
preserving every earlier lesson, task, achievement, route, and storage identifier.

## Visual system

- New **Bioluminescent Field Codex** default theme: mineral paper, deep-green
  cartographic instruments, acid-lime active signal, coral specimen marks, clipped
  housings, coordinate rails, and topographic routes.
- Optional **Night Observatory** theme with the same information hierarchy.
- Rebuilt landing hero, seven-sector Python route, telemetry strip, Atlas, track
  surfaces, lesson workspace, profile planning instruments, and responsive states.
- Dark workspace token boundary keeps CodeMirror, gutters, selections, console, and
  validation readable inside either application theme.
- iPhone safe-area padding, improved 320 px behavior, 44 px mobile controls, and a
  bottom-sheet command palette.

## Learning and navigation

- New Python world: **Systems Laboratory**.
- Five new lessons: assertions and testing, debugging, robust file handling, lazy
  generators, and context-managed telemetry recovery.
- 65 lessons, 130 required tasks, and 65 bonus challenges across 13 worlds.
- Cross-language **Atlas** with weighted full-text search, language and state filters,
  bookmark controls, progressive results, weekly telemetry, and a recovery queue.
- Global `Ctrl/⌘+K` command palette with live lesson search, keyboard selection,
  contained focus, Escape handling, scroll locking, and focus restoration.
- Persistent bookmarks, two themes, a 1–14 lesson weekly target, and a 21-day activity
  field on the profile.
- Focus mode and lesson bookmarks in the executable workspace.

## Reliability and deployment

- Storage schema v4 migrates v1, v2, and v3 data without discarding XP, lesson/task
  completion, achievements, streaks, activity, profile, or v3 drafts.
- Fixed the skip-to-content control so it no longer collides with hash routing.
- Added an explicit completed-curriculum state to the recovery queue.
- Production builds now verify emitted references, repository base paths, `.nojekyll`,
  CodeMirror, and both runtime Workers.
- GitHub workflows use Node 24-compatible `checkout` and `setup-node` actions.
- Expanded navigation, Atlas, migration, content, and accessibility regression tests.

## Runtime boundaries

- The first Python execution still downloads the pinned Pyodide runtime and therefore
  requires a network connection.
- Java and C++ remain source-structure learning tracks rather than in-browser native
  compilers.
- Progress remains device-local; NEXUS has no account backend or cross-device sync.
- GitHub Pages requires the repository’s one-time **Settings → Pages → GitHub
  Actions** source selection before its first deployment.
