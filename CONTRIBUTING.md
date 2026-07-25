# Contributing to NEXUS

1. Create a focused branch from `main`.
2. Run `npm install`.
3. Keep curriculum data separate from generic renderers and progress logic.
4. Add or update tests for domain changes.
5. Run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.
6. Use clear commits and describe manual QA in the pull request.

Content additions should follow `docs/CONTENT_AUTHORING.md` and the templates in
`src/content/_templates`. New UI must remain usable at 390 px, with keyboard-only
navigation, reduced motion, and no WebGL. Scene logic belongs in deterministic models
rather than inside render loops. Released content IDs are persistence keys and must not
be renamed without a storage migration.
