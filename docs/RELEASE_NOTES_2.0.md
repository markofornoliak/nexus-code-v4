# NEXUS CODE 2.0 — Archive Expansion

## Headline

NEXUS grows from one complete 15-lesson Python expedition plus four previews into five
operational language paths with 60 lessons and four execution strategies.

## Added

- 15 new Python lessons across Data Currents, Object Foundry, and Algorithm
  Observatory.
- 10 executable JavaScript lessons and a dedicated Worker runtime.
- 10 HTML/CSS lessons with a sandboxed live viewport.
- 5 Java 8 lessons and 5 C++ lessons with language-aware editing and structural
  validation.
- CodeMirror modes for JavaScript, HTML, Java, and C++.
- Per-task code/input draft autosave.
- Storage schema v3 with safe v1/v2 migration.
- Dynamic “continue learning” entry point.
- Twelve new achievements.
- Online/offline status, explicit reduced-motion control, keyboard arrow navigation
  for task tabs, PWA metadata, and improved mobile editor layout.
- Pull-request quality workflow and formatting gate in Pages deployment.
- Dependency-free typed hash routing with parameter, navigation, active-link, and
  fallback coverage.
- Production dependency audit gate with zero known vulnerabilities at release time.

## Preserved

- All original Python lesson and task IDs.
- Existing XP, lesson completion, bonus completion, streak, profile, activity, and
  achievement records.
- Hash-based routes and GitHub Pages repository-subpath behavior.
- Original Living Code Archive visual identity.

## Runtime boundaries

Pyodide still requires a network download on the first Python run. Java and C++ do not
compile inside the browser; their tasks validate requested source structures and
explicitly direct learners to a native compiler for runtime diagnostics.
