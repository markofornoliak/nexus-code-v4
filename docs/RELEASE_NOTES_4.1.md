# NEXUS CODE 4.1 release notes

Version 4.1 extends the v4 spatial-learning foundation with adaptive learning
intelligence, a second interactive Three.js system, and ten advanced executable lessons.
All previous content and progress identifiers remain unchanged.

## Adaptive Command Center

The new `/command` route provides a decision-oriented operational view rather than a
second profile screen:

- a recovery score derived from archive completion, current streak, and recent active
  days;
- ranked next-best actions that prioritize partially completed lessons, then active-track
  momentum, then new language exploration;
- persistent 15, 25, and 45-minute focus protocols;
- language synchronization and world-level depth diagnostics;
- a 14-day activity pulse and compact continuity report;
- direct routes into the recommended lesson, Atlas, and selected expedition.

All recommendations are derived from the existing `UserProgress` record. No parallel
analytics store or external tracking service was added.

## Skill constellation

`SkillConstellation` adds a dedicated mastery visualization with:

- deterministic track-node placement around a central archive core;
- drag/touch orbit control and pointer raycasting;
- direct track activation from a 3D node;
- selected-track synchronization with semantic controls;
- bounded device pixel ratio and viewport-aware animation;
- reduced-motion behavior;
- WebGL context-loss fallback;
- explicit geometry, material, observer, listener, and renderer disposal;
- a complete non-WebGL/minimal-depth representation.

The canvas remains progressive enhancement. Every metric and navigation action is also
available through accessible HTML.

## Curriculum expansion

The release expands the catalog from 90 to 100 lessons, 18 to 20 worlds, 180 to 200
required tasks, and 90 to 100 optional bonus challenges.

### Python: Automation Forge

1. Lazy Signal Streams — generators and composable lazy pipelines.
2. Protocol Wrappers — decorators, metadata, configuration, and bounded retries.
3. Resource Gates — class and generator context managers with rollback protocols.
4. Executable Contracts — boundary tables, failure contracts, and a micro test runner.
5. Orchestration Engine — parsed, validated, audited automation pipelines.

### JavaScript: Runtime Orchestration

1. Event Channel Mesh — publish/subscribe, unsubscribe, and one-shot listeners.
2. Deterministic State Reactor — immutable reducers, replay, and undo.
3. Concurrent Signal Array — `Promise.all`, `Promise.allSettled`, and bounded pools.
4. Computation Cache — memoization, bounded insertion order, and diagnostics.
5. Coordination Mesh — observable asynchronous state and cached in-flight work.

## Progress and compatibility

Storage schema v6 adds only `focusSessionMinutes`. The migration chain now supports
v1 through v5 imports and defaults existing users to 25 minutes. Lesson completion,
task completion, XP, streaks, activity, drafts, bookmarks, names, themes, achievements,
and all earlier preferences remain intact.

Three new relics recognize Automation Forge completion, Runtime Orchestration completion,
and 100 restored lessons. The existing 90-lesson relic remains a historical v4 milestone.

## Repository and delivery

- Product and package version advanced to 4.1.0.
- CI and Pages workflows continue to run install, audit, typecheck, lint, formatting,
  tests, production build, and static-output verification.
- Documentation, curriculum inventory, architecture, QA checklist, and publishing
  guidance were updated for the new route and storage schema.
