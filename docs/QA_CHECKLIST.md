# NEXUS manual QA checklist

Use this checklist after any major layout, learning-engine, or deployment change.

## Viewports

- [ ] 1440 px: hero uses two balanced columns; the archive core and readout are visible.
- [ ] 1024 px: cards reflow cleanly and the learning workspace remains readable.
- [ ] 768 px: navigation collapses; editor appears before long theory content.
- [ ] 390 px: no page-level horizontal overflow; code can scroll inside the editor.
- [ ] 320 px: header controls fit without overlap and essential navigation remains.
- [ ] iPhone safe areas do not cover the header, mobile menu, or command palette.
- [ ] Touch targets remain at least approximately 44 × 44 px where practical.

## Navigation and routes

- [ ] Every header link works from every route.
- [ ] All five track cards open a dedicated track page.
- [ ] Every map follows the correct locked / active / completed sequence.
- [ ] Each of the 20 worlds exposes exactly five lesson nodes.
- [ ] The 3D Lab route opens from desktop, mobile, and command-palette navigation.
- [ ] Lab tabs, scene steps, play/pause, speed, reset, and curriculum links work.
- [ ] An unknown hash route renders the themed 404 screen.
- [ ] Refresh a nested hash route in a repository-subpath production preview.
- [ ] Atlas search, language filters, status filters, and “reveal more” agree.
- [ ] `Ctrl/⌘+K`, arrow keys, Enter, Escape, and Tab containment work in quick search.

## Lesson workspace

- [ ] The first Python run shows a clear runtime initialization state.
- [ ] Starter code resets to the selected task version.
- [ ] Standard input consumes one line for each `input()` call.
- [ ] stdout and stderr are rendered as plain text.
- [ ] Syntax errors and runtime errors are visible and understandable.
- [ ] `while True: pass` is stopped by the six-second worker timeout.
- [ ] `while (true) {}` is stopped by the four-second JavaScript Worker timeout.
- [ ] JavaScript `input()` consumes one queued line and top-level `await` resolves.
- [ ] HTML renders in the preview without script or same-origin sandbox permission.
- [ ] Java and C++ clearly report source analysis rather than browser compilation.
- [ ] Runtime output truncates safely after the configured character limit.
- [ ] Repeated valid runs do not add duplicate XP.
- [ ] Wrong output does not complete a task.
- [ ] Every standard task can be completed with concepts already taught.
- [ ] Bonus completion is optional for lesson completion.
- [ ] Completing all standard tasks enables “Restore fragment.”
- [ ] Completing a fragment unlocks the next map node.
- [ ] Left/right/home/end keys move focus and selection across task tabs.

## Progress

- [ ] Task, bonus, lesson, XP, and achievement state survives refresh.
- [ ] Edited source and input drafts survive refresh and reset per task.
- [ ] Version 1, 2, 3, and 4 exports import as version 5 without losing progress.
- [ ] Version 3 imports retain drafts while adding bookmarks, planning, and visual mode.
- [ ] Adaptive, minimal, and immersive depth settings persist across refresh.
- [ ] Bookmarks survive refresh, export, and import.
- [ ] Weekly target accepts only 1–14 lessons and resets by local Monday.
- [ ] Multiple activities on one local date increment the streak once.
- [ ] A consecutive local date increments the streak.
- [ ] A missed local date resets current streak but preserves longest streak.
- [ ] Profile totals agree with map and lesson progress.
- [ ] Exported JSON imports into a clean browser.
- [ ] Invalid or oversized JSON shows a failure message and changes nothing.
- [ ] Reset requires confirmation and clears all progress.
- [ ] Corrupted local storage produces a recovery notice rather than a blank page.

## Accessibility

- [ ] “Skip to main content” appears on keyboard focus.
- [ ] Activating the skip link focuses main content without changing the hash route.
- [ ] Header, cards, map nodes, task tabs, editor actions, and lesson navigation are keyboard reachable.
- [ ] Focus indicators remain visible against every surface.
- [ ] Heading order is logical on landing, track, lesson, and profile pages.
- [ ] Validation success and failure are not conveyed by color alone.
- [ ] Runtime and validation updates are announced by a screen reader.
- [ ] Reduced-motion mode removes continuous orbit and pulse motion.
- [ ] Reduced motion disables Lab autoplay without hiding manual step controls.
- [ ] Minimal visual depth replaces every WebGL canvas with a complete DOM scene.
- [ ] WebGL-disabled browsers retain scene labels, explanations, and navigation.
- [ ] Canvas pointer dragging does not prevent vertical touch scrolling.
- [ ] The profile reduced-motion control works independently of OS preference.
- [ ] Field Codex and Night Observatory themes preserve readable CodeMirror contrast.
- [ ] Closing quick search restores focus to the control that opened it.
- [ ] Online/offline changes are announced and do not block non-Python learning.
- [ ] Important text passes practical WCAG 2.1 AA contrast review.

## GitHub Pages

- [ ] Repository Settings → Pages → Source is “GitHub Actions.”
- [ ] Workflow derives `VITE_BASE_PATH` from the actual repository name.
- [ ] Built `index.html` uses repository-prefixed hashed assets.
- [ ] `npm run build` reports a successful generated-asset verification.
- [ ] Dynamic route chunks and the Pyodide worker load from the same base.
- [ ] The Three.js chunk loads only when an eligible spatial scene is mounted.
- [ ] No built URL points to `localhost` or assumes the domain root.
- [ ] The landing page does not download Pyodide before a Python run.
- [ ] Pyodide loads over HTTPS from the documented pinned CDN version.

## Command Center v4.1

- [ ] `/command` renders recommendations, focus controls, diagnostics, and activity pulse with JavaScript disabled only where expected.
- [ ] The 3D constellation rotates by drag/touch, node activation opens the correct track, and Reset orbit rebuilds cleanly.
- [ ] Minimal visual mode hides WebGL and exposes the complete semantic constellation fallback.
- [ ] 320–390 px layouts keep all focus controls and recommendations inside the viewport.
- [ ] Light and dark themes preserve readable conic score, progress bars, and focus states.
