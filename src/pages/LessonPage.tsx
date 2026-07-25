import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Copy,
  Lightbulb,
  LockKeyhole,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Signal,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams } from "../router";
import { CodeEditor } from "../features/code-runner/CodeEditor";
import { useCodeRunner } from "../features/code-runner/useCodeRunner";
import { useProgress } from "../features/progress/ProgressContext";
import { isLessonUnlocked } from "../features/progress/progressSelectors";
import { getAdjacentLessons, getLesson } from "../content/registry";
import type { Task, ValidationResult } from "../types";
import { validateTask } from "../lib/validation";
import { LessonProgress } from "../components/lessons/LessonProgress";
import { LessonConceptReactor } from "../components/lessons/LessonConceptReactor";
import { LessonSectionRenderer } from "../components/lessons/LessonSectionRenderer";
import { TaskResult } from "../components/lessons/TaskResult";
import { StatusChip } from "../components/common/StatusChip";
import NotFoundPage from "./NotFoundPage";

export default function LessonPage() {
  const { trackId = "", lessonId = "" } = useParams();
  const entry = getLesson(trackId, lessonId);
  const { state, dispatch } = useProgress();
  const runner = useCodeRunner(entry?.track.execution.kind ?? "python");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [previewDocument, setPreviewDocument] = useState("");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const draftsRef = useRef(state.drafts);
  draftsRef.current = state.drafts;
  const lessonForTasks = entry?.lesson;
  const clearExecutionResult = runner.clearResult;
  const isPreview =
    !entry || entry.lesson.status === "preview" || entry.track.status !== "available";

  const taskOptions = useMemo(() => {
    if (!lessonForTasks) return [];
    return [
      ...lessonForTasks.tasks.map((task) => ({ task, bonus: false })),
      { task: lessonForTasks.bonusTask, bonus: true },
    ];
  }, [lessonForTasks]);

  const selected = taskOptions.find((option) => option.task.id === selectedTaskId);

  const activateTask = useCallback(
    (task: Task) => {
      const draft = draftsRef.current[task.id];
      setSelectedTaskId(task.id);
      setCode(draft?.code ?? task.starterCode);
      setStdin(draft?.stdin ?? task.defaultInput ?? "");
      setPreviewDocument("");
      setValidation(null);
      clearExecutionResult();
    },
    [clearExecutionResult],
  );

  useEffect(() => {
    const first = taskOptions[0];
    if (!first) return;
    activateTask(first.task);
  }, [lessonId, taskOptions, activateTask]);

  useEffect(() => {
    if (!selected || isPreview) return;
    const timeout = window.setTimeout(() => {
      dispatch({
        type: "save-draft",
        taskId: selected.task.id,
        code,
        stdin,
      });
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [code, dispatch, isPreview, selected, stdin]);

  if (!entry) {
    return (
      <NotFoundPage embedded message="The requested learning fragment is unavailable." />
    );
  }

  const { track, world, lesson } = entry;
  const lessonProgress = state.progress.lessons[lesson.id];
  const adjacent = getAdjacentLessons(track, lesson.id);
  const unlocked =
    lesson.status === "preview" || isLessonUnlocked(track, lesson.id, state.progress);
  const allStandardComplete = lesson.tasks.every((task) =>
    lessonProgress?.completedTaskIds.includes(task.id),
  );

  if (!unlocked) {
    return (
      <main id="main-content" className="locked-lesson page-shell">
        <LockKeyhole aria-hidden="true" />
        <p className="eyebrow">Neural path sealed</p>
        <h1>{lesson.title}</h1>
        <p>Restore the preceding fragment before entering this chamber.</p>
        <Link className="button button-primary" to={`/tracks/${track.id}`}>
          <ArrowLeft aria-hidden="true" /> Return to expedition map
        </Link>
      </main>
    );
  }

  const chooseTask = (task: Task) => {
    activateTask(task);
  };

  const navigateTaskTabs = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const lastIndex = taskOptions.length - 1;
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? lastIndex
          : event.key === "ArrowRight"
            ? (currentIndex + 1) % taskOptions.length
            : (currentIndex - 1 + taskOptions.length) % taskOptions.length;
    const next = taskOptions[nextIndex];
    if (!next) return;
    chooseTask(next.task);
    window.requestAnimationFrame(() => {
      document.getElementById(`task-tab-${next.task.id}`)?.focus();
    });
  };

  const runCode = async () => {
    if (!selected || isPreview) return;
    setValidation(null);
    if (track.execution.kind === "web-preview") {
      setPreviewDocument(code);
    }
    const execution = await runner.run(code, stdin);
    if (execution.status !== "success") return;
    const result = validateTask(selected.task, execution.stdout, code);
    setValidation(result);
    if (result.success) {
      dispatch({
        type: "record-task",
        lesson,
        taskId: selected.task.id,
        label: `${lesson.title}: ${selected.task.title}`,
        bonus: selected.bonus,
      });
    }
  };

  const resetTask = () => {
    if (!selected) return;
    setCode(selected.task.starterCode);
    setStdin(selected.task.defaultInput ?? "");
    setPreviewDocument("");
    setValidation(null);
    runner.clearResult();
    dispatch({ type: "clear-draft", taskId: selected.task.id });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 1800);
  };

  const bookmarked = state.bookmarkedLessonIds.includes(lesson.id);

  return (
    <main id="main-content" className={`lesson-page${focusMode ? " is-focus-mode" : ""}`}>
      <div className="lesson-topbar page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/tracks">Expeditions</Link>
          <ChevronRight aria-hidden="true" />
          <Link to={`/tracks/${track.id}`}>{track.language}</Link>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page">{lesson.title}</span>
        </nav>
        <div className="lesson-top-metrics">
          <span>
            <Clock3 aria-hidden="true" /> {lesson.durationMinutes} min
          </span>
          <span>
            <Signal aria-hidden="true" /> +{lesson.xpReward}
          </span>
          <StatusChip
            tone={
              lessonProgress?.isCompleted ? "success" : isPreview ? "warning" : "active"
            }
          >
            {lessonProgress?.isCompleted
              ? "Restored"
              : isPreview
                ? "Preview"
                : "Active fragment"}
          </StatusChip>
          <button
            className={`lesson-bookmark${bookmarked ? " is-bookmarked" : ""}`}
            type="button"
            aria-label={`${bookmarked ? "Remove" : "Add"} bookmark for ${lesson.title}`}
            aria-pressed={bookmarked}
            onClick={() => dispatch({ type: "toggle-bookmark", lessonId: lesson.id })}
          >
            <Bookmark aria-hidden="true" />
            <span>{bookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      <header className="lesson-header page-shell">
        <div>
          <p className="eyebrow">
            {world.title} / Fragment {String(lesson.order).padStart(2, "0")}
          </p>
          <h1>{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
        </div>
        <div className="lesson-coordinate" aria-hidden="true">
          <span>SECTOR</span>
          <strong>
            {String(world.order).padStart(2, "0")}:{String(lesson.order).padStart(2, "0")}
          </strong>
          <small>{track.icon} / NX</small>
        </div>
      </header>

      <div className="lesson-layout page-shell">
        <article className="theory-column">
          <section className="objectives-panel">
            <span className="instrument-label">Recovery objectives</span>
            <h2>After this fragment, you can:</h2>
            <ul>
              {lesson.objectives.map((objective) => (
                <li key={objective}>
                  <Check aria-hidden="true" /> {objective}
                </li>
              ))}
            </ul>
            {lesson.prerequisites.length > 0 && (
              <p>
                Prerequisite signal: <strong>{lesson.prerequisites.join(", ")}</strong>
              </p>
            )}
          </section>

          <LessonConceptReactor lesson={lesson} track={track} />

          {lesson.sections.map((section) => {
            const key =
              section.type === "theory"
                ? section.block.id
                : section.type === "example"
                  ? section.example.id
                  : section.id;
            return <LessonSectionRenderer key={key} section={section} />;
          })}

          <aside className="common-mistakes">
            <div>
              <span className="instrument-label">Fault signatures</span>
              <h2>Common mistakes</h2>
            </div>
            <ul>
              {lesson.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </aside>

          {!isPreview && <LessonProgress lesson={lesson} progress={lessonProgress} />}
        </article>

        <aside className="workspace-column" aria-label="Practice workspace">
          {isPreview ? (
            <section className="preview-workspace">
              <LockKeyhole aria-hidden="true" />
              <span className="eyebrow">Execution core sealed</span>
              <h2>Preview fragment</h2>
              <p>
                This theory specimen is available to read. Tasks, Signal Energy, and
                execution activate with the complete {track.language} expedition.
              </p>
              <Link className="button button-secondary" to={`/tracks/${track.id}`}>
                Return to roadmap
              </Link>
            </section>
          ) : (
            <div className="workspace-sticky">
              <section className="task-selector-panel">
                <div className="workspace-heading">
                  <div>
                    <span className="instrument-label">Practice console</span>
                    <h2>Stabilize a transmission</h2>
                  </div>
                  <div className="workspace-tools">
                    <Code2 aria-hidden="true" />
                    <button
                      type="button"
                      aria-label={focusMode ? "Exit focus mode" : "Open focus mode"}
                      onClick={() => setFocusMode((value) => !value)}
                    >
                      {focusMode ? (
                        <Minimize2 aria-hidden="true" />
                      ) : (
                        <Maximize2 aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="task-tabs" role="tablist" aria-label="Lesson tasks">
                  {taskOptions.map((option, index) => {
                    const complete = option.bonus
                      ? lessonProgress?.completedBonusTaskIds.includes(option.task.id)
                      : lessonProgress?.completedTaskIds.includes(option.task.id);
                    return (
                      <button
                        key={option.task.id}
                        type="button"
                        role="tab"
                        id={`task-tab-${option.task.id}`}
                        aria-controls="task-panel"
                        aria-label={`${option.bonus ? "Bonus: " : `Task ${index + 1}: `}${option.task.title}${complete ? ", completed" : ""}`}
                        aria-selected={selectedTaskId === option.task.id}
                        tabIndex={selectedTaskId === option.task.id ? 0 : -1}
                        className={`${selectedTaskId === option.task.id ? "is-selected" : ""}${complete ? " is-complete" : ""}${option.bonus ? " is-bonus" : ""}`}
                        onClick={() => chooseTask(option.task)}
                        onKeyDown={(event) => navigateTaskTabs(event, index)}
                      >
                        {option.bonus ? (
                          <Sparkles aria-hidden="true" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                        {complete && (
                          <Check className="tab-check" aria-label="completed" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {selected && (
                  <div
                    id="task-panel"
                    role="tabpanel"
                    aria-labelledby={`task-tab-${selected.task.id}`}
                    className={`task-brief${selected.bonus ? " is-bonus" : ""}`}
                  >
                    <div>
                      <span>
                        {selected.bonus
                          ? "Hidden channel / +40 signal"
                          : "Standard task / +25 signal"}
                      </span>
                      <h3>{selected.task.title}</h3>
                    </div>
                    <p>{selected.task.description}</p>
                    <dl>
                      <dt>Expected behavior</dt>
                      <dd>{selected.task.expectedBehavior}</dd>
                    </dl>
                    <details open={state.preferences.hintsExpanded}>
                      <summary>
                        <Lightbulb aria-hidden="true" /> Recovery hints
                      </summary>
                      <ul>
                        {selected.task.hints.map((hint) => (
                          <li key={hint}>{hint}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </section>

              <section className="editor-panel">
                <div className="editor-toolbar">
                  <div>
                    <span className="editor-light" aria-hidden="true" />
                    fragment.{track.execution.fileExtension}
                  </div>
                  <span>
                    {state.preferences.editorFontSize}px / {track.execution.runtimeLabel}
                    {selected && state.drafts[selected.task.id] ? " / Draft saved" : ""}
                  </span>
                  <kbd>⌘/Ctrl + Enter to run</kbd>
                </div>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  onRun={() => void runCode()}
                  fontSize={state.preferences.editorFontSize}
                  language={track.execution.editorLanguage}
                  ariaLabel={`${track.language} code editor`}
                />
                <div className="editor-actions">
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => void runCode()}
                    disabled={
                      runner.status === "initializing" || runner.status === "running"
                    }
                  >
                    <Play aria-hidden="true" />
                    {runner.status === "initializing"
                      ? "Loading Python…"
                      : runner.status === "running"
                        ? "Running…"
                        : track.execution.actionLabel}
                  </button>
                  <button
                    className="button button-ghost"
                    type="button"
                    onClick={resetTask}
                  >
                    <RotateCcw aria-hidden="true" /> Reset
                  </button>
                  <button
                    className="button button-ghost"
                    type="button"
                    onClick={() => void copyCode()}
                    aria-live="polite"
                  >
                    <Copy aria-hidden="true" />
                    {copyState === "copied"
                      ? "Copied"
                      : copyState === "failed"
                        ? "Copy unavailable"
                        : "Copy code"}
                  </button>
                </div>
                {runner.status === "initializing" && (
                  <p className="runtime-message" role="status">
                    <span className="loading-dot" aria-hidden="true" />
                    Recovering the Python core. The first load requires a network
                    connection.
                  </p>
                )}
                {track.execution.kind === "static" && (
                  <p className="runtime-message">
                    Source checks validate the requested Java 8/C++ structure. Use a
                    native compiler for runtime and compiler diagnostics.
                  </p>
                )}
                {runner.statusMessage && runner.status === "error" && !runner.result && (
                  <div className="runtime-recovery" role="alert">
                    <p>{runner.statusMessage}</p>
                    <button
                      className="button button-ghost"
                      type="button"
                      onClick={runner.resetExecution}
                    >
                      <RotateCcw aria-hidden="true" /> Restart runtime
                    </button>
                  </div>
                )}
              </section>

              {track.execution.kind === "web-preview" && (
                <section className="web-preview-panel" aria-label="HTML preview">
                  <div>
                    <span className="instrument-label">Sandbox viewport</span>
                    <strong>Rendered document</strong>
                  </div>
                  {previewDocument ? (
                    <iframe
                      title="Rendered lesson document"
                      sandbox=""
                      srcDoc={previewDocument}
                    />
                  ) : (
                    <p>Run the fragment to render it inside an isolated document.</p>
                  )}
                </section>
              )}

              <section className="input-console-panel">
                {track.execution.supportsStdin && (
                  <div className="stdin-panel">
                    <label htmlFor="standard-input">Standard input queue</label>
                    <p>One input() call consumes one line.</p>
                    <textarea
                      id="standard-input"
                      value={stdin}
                      rows={3}
                      spellCheck={false}
                      onChange={(event) => setStdin(event.target.value)}
                      placeholder="Optional input lines…"
                    />
                  </div>
                )}
                <div className="console-panel">
                  <div>
                    <TerminalSquare aria-hidden="true" />
                    <span>
                      {track.execution.kind === "static"
                        ? "Analysis output"
                        : "Program output"}
                    </span>
                  </div>
                  <pre aria-label="Program output">
                    {runner.result
                      ? `${runner.result.stdout}${runner.result.stderr}`
                      : "— awaiting execution —"}
                  </pre>
                </div>
              </section>

              <TaskResult execution={runner.result} validation={validation} />

              {runner.result &&
                (runner.result.status === "error" ||
                  runner.result.status === "timeout") && (
                  <button
                    className="runtime-reset-button"
                    type="button"
                    onClick={runner.resetExecution}
                  >
                    <RotateCcw aria-hidden="true" /> Reset isolated runtime
                  </button>
                )}

              {selected?.bonus && validation?.success && (
                <aside className="discovery-message">
                  <Sparkles aria-hidden="true" />
                  <div>
                    <span>Hidden channel recovered</span>
                    <p>{lesson.bonusTask.discoveryText}</p>
                  </div>
                </aside>
              )}

              <section
                className={`completion-control${allStandardComplete ? " is-ready" : ""}`}
              >
                <div>
                  <span className="instrument-label">Fragment completion</span>
                  <h3>
                    {lessonProgress?.isCompleted
                      ? "Neural pathway restored"
                      : allStandardComplete
                        ? "All required transmissions are stable"
                        : "Complete every standard task"}
                  </h3>
                </div>
                <button
                  className="button button-primary"
                  type="button"
                  disabled={!allStandardComplete || lessonProgress?.isCompleted}
                  onClick={() => dispatch({ type: "complete-lesson", lesson })}
                >
                  {lessonProgress?.isCompleted ? (
                    <>
                      <Check aria-hidden="true" /> Restored
                    </>
                  ) : (
                    <>
                      Restore fragment <Signal aria-hidden="true" />
                    </>
                  )}
                </button>
              </section>
            </div>
          )}
        </aside>
      </div>

      <nav className="lesson-navigation page-shell" aria-label="Lesson navigation">
        {adjacent.previous ? (
          <Link to={`/learn/${track.id}/${adjacent.previous.id}`}>
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>Previous fragment</small>
              <strong>{adjacent.previous.title}</strong>
            </span>
          </Link>
        ) : (
          <Link to={`/tracks/${track.id}`}>
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>Return to</small>
              <strong>Expedition map</strong>
            </span>
          </Link>
        )}
        {adjacent.next &&
          (lessonProgress?.isCompleted || adjacent.next.status === "preview" ? (
            <Link className="next-link" to={`/learn/${track.id}/${adjacent.next.id}`}>
              <span>
                <small>Next fragment</small>
                <strong>{adjacent.next.title}</strong>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <span className="next-link is-disabled" aria-label="Next fragment locked">
              <span>
                <small>Next fragment</small>
                <strong>{adjacent.next.title}</strong>
              </span>
              <LockKeyhole aria-hidden="true" />
            </span>
          ))}
      </nav>
    </main>
  );
}
