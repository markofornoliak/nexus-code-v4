# Content authoring guide

NEXUS renders curriculum from typed data. A content addition should not require a new
route, page, progress reducer branch, or validation component.

## Stable identifiers

Treat every track, world, lesson, task, bonus, section, and achievement ID as a
persistent database key.

- Use lowercase kebab-case.
- Prefix lesson and task IDs with their language.
- Never rename a released ID without a dedicated storage migration.
- Never reuse a removed ID for unrelated content.

## Lesson contract

Every available lesson contains:

- three observable objectives;
- a concept explanation and syntax;
- one worked specimen;
- a field protocol;
- three realistic mistakes;
- exactly two required tasks;
- one optional bonus task;
- explicit expected behavior;
- starter code, directional hints, and one validation strategy.

The common `createCurriculumTrack` factory builds worlds and sequential prerequisites.
The original Python file-per-lesson route remains supported by `definePythonLesson`.

## Runtime selection

Set one `track.execution.kind`:

| Kind          | Use                                               |
| ------------- | ------------------------------------------------- |
| `python`      | Executable Python output tasks through Pyodide    |
| `javascript`  | Executable modern JavaScript through a Worker     |
| `web-preview` | HTML/CSS source validation plus sandbox rendering |
| `static`      | Java/C++ source-structure validation              |

Match `editorLanguage`, `fileExtension`, action copy, and input support to the runtime.

## Validation selection

- Prefer `trimmed-exact` for deterministic console tasks.
- Use `one-of` only when multiple outputs are genuinely equivalent.
- Use `code-pattern` when a specific language structure is the learning objective.
- Keep regular expressions focused on the requested contract; they are guidance, not
  a compiler.
- Register a named custom validator only when normalized semantic checks cannot be
  expressed safely with the built-in modes.

The registry test compiles every released regex, enforces global ID uniqueness,
requires two standard tasks per lesson, and verifies the 100-lesson inventory.

## Author checklist

1. Verify prerequisites teach every required concept.
2. Solve each task from its starter code.
3. Test boundary cases and malformed input where relevant.
4. Confirm the default input produces the documented expected output.
5. Verify keyboard task navigation and narrow-screen editor behavior.
6. Run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.
