import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock3,
  Compass,
  LockKeyhole,
  Search,
  Signal,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "../router";
import { tracks } from "../content/registry";
import { lessonCatalog, searchLessonCatalog } from "../lib/catalogSearch";
import { useProgress } from "../features/progress/ProgressContext";
import {
  isLessonUnlocked,
  selectRecoveryQueue,
  selectWeeklyGoalProgress,
} from "../features/progress/progressSelectors";
import { ProgressBar } from "../components/common/ProgressBar";

type AtlasFilter = "all" | "available" | "bookmarked" | "completed";

export default function AtlasPage() {
  const { state, dispatch } = useProgress();
  const [query, setQuery] = useState("");
  const [trackId, setTrackId] = useState("all");
  const [filter, setFilter] = useState<AtlasFilter>("all");
  const [visibleLimit, setVisibleLimit] = useState(18);
  const weeklyGoal = selectWeeklyGoalProgress(
    state.progress,
    state.preferences.weeklyLessonGoal,
  );
  const queue = selectRecoveryQueue(state.progress, 4);

  const matchingEntries = useMemo(() => {
    const entries = searchLessonCatalog(query, {
      ...(trackId === "all" ? {} : { trackId }),
    });
    return entries.filter((entry) => {
      const completed = state.progress.lessons[entry.lesson.id]?.isCompleted === true;
      const available = isLessonUnlocked(entry.track, entry.lesson.id, state.progress);
      if (filter === "completed") return completed;
      if (filter === "bookmarked")
        return state.bookmarkedLessonIds.includes(entry.lesson.id);
      if (filter === "available") return available && !completed;
      return true;
    });
  }, [filter, query, state.bookmarkedLessonIds, state.progress, trackId]);

  const visibleEntries = matchingEntries.slice(0, visibleLimit);

  return (
    <main id="main-content" className="page-shell atlas-page">
      <header className="atlas-hero">
        <div>
          <p className="eyebrow">Cross-expedition cartography / Live catalog</p>
          <h1>Your learning field atlas.</h1>
          <p>
            Search every recovered fragment, mark important coordinates, and build a
            focused route through all five programming languages.
          </p>
          <div className="atlas-hero-readouts">
            <span>
              <Signal aria-hidden="true" />
              <strong>{lessonCatalog.length}</strong> searchable fragments
            </span>
            <span>
              <Bookmark aria-hidden="true" />
              <strong>{state.bookmarkedLessonIds.length}</strong> saved coordinates
            </span>
          </div>
        </div>
        <aside className="weekly-goal-card">
          <div>
            <Target aria-hidden="true" />
            <span>Weekly recovery target</span>
          </div>
          <strong>
            {weeklyGoal.completed}
            <small>/{weeklyGoal.target}</small>
          </strong>
          <ProgressBar
            value={weeklyGoal.percent}
            label="Weekly lesson goal progress"
            compact
          />
          <p>
            {weeklyGoal.completed >= weeklyGoal.target
              ? "Target stabilized. Extra fragments strengthen the signal."
              : `${weeklyGoal.target - weeklyGoal.completed} fragment${weeklyGoal.target - weeklyGoal.completed === 1 ? "" : "s"} remain this week.`}
          </p>
        </aside>
      </header>

      <section className="recovery-queue" aria-labelledby="recovery-queue-heading">
        <header>
          <div>
            <p className="eyebrow">Recommended route</p>
            <h2 id="recovery-queue-heading">Resume from live coordinates</h2>
          </div>
          <span>{queue.length} reachable signals</span>
        </header>
        {queue.length === 0 ? (
          <div className="recovery-queue-empty">
            <CheckCircle2 aria-hidden="true" />
            <div>
              <h3>Every operational pathway is restored.</h3>
              <p>
                Revisit a saved fragment, attempt bonus channels, or inspect the full
                catalog while the next archive sector is prepared.
              </p>
            </div>
            <button
              className="button button-secondary"
              type="button"
              onClick={() =>
                document.getElementById("catalog-heading")?.scrollIntoView({
                  behavior: state.preferences.reducedMotion ? "auto" : "smooth",
                  block: "start",
                })
              }
            >
              Review all coordinates <ArrowRight aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="recovery-queue-grid">
            {queue.map(({ track, lesson }, index) => {
              const lessonProgress = state.progress.lessons[lesson.id];
              const completedTasks = lessonProgress?.completedTaskIds.length ?? 0;
              return (
                <article className={`queue-card accent-${track.accent}`} key={lesson.id}>
                  <div className="queue-index">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Compass aria-hidden="true" />
                  </div>
                  <p>{track.language}</p>
                  <h3>{lesson.title}</h3>
                  <small>
                    {completedTasks}/{lesson.tasks.length} tasks ·{" "}
                    {lesson.durationMinutes} min
                  </small>
                  <ProgressBar
                    value={Math.round((completedTasks / lesson.tasks.length) * 100)}
                    label={`${lesson.title} task progress`}
                    compact
                  />
                  <Link to={`/learn/${track.id}/${lesson.id}`}>
                    Open coordinate <ArrowRight aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="atlas-catalog" aria-labelledby="catalog-heading">
        <header className="atlas-catalog-heading">
          <div>
            <p className="eyebrow">Complete fragment index</p>
            <h2 id="catalog-heading">Search the recovered archive</h2>
          </div>
          <span role="status" aria-live="polite">
            {matchingEntries.length}{" "}
            {matchingEntries.length === 1 ? "coordinate matches" : "coordinates match"}
          </span>
        </header>

        <div className="atlas-search-panel">
          <label className="atlas-search-input">
            <Search aria-hidden="true" />
            <span className="visually-hidden">Search lessons</span>
            <input
              type="search"
              aria-label="Search lessons"
              value={query}
              placeholder="Search loops, classes, grid, promises…"
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleLimit(18);
              }}
            />
            <kbd>{lessonCatalog.length} fragments</kbd>
          </label>
          <div className="atlas-filter-row" aria-label="Filter by language">
            <button
              type="button"
              className={trackId === "all" ? "is-active" : ""}
              aria-pressed={trackId === "all"}
              onClick={() => {
                setTrackId("all");
                setVisibleLimit(18);
              }}
            >
              All languages
            </button>
            {tracks.map((track) => (
              <button
                type="button"
                key={track.id}
                className={trackId === track.id ? "is-active" : ""}
                aria-pressed={trackId === track.id}
                onClick={() => {
                  setTrackId(track.id);
                  setVisibleLimit(18);
                }}
              >
                {track.icon} {track.language}
              </button>
            ))}
          </div>
          <div className="atlas-filter-row status-filters" aria-label="Filter by status">
            {(
              [
                ["all", "All"],
                ["available", "Available now"],
                ["bookmarked", "Bookmarked"],
                ["completed", "Completed"],
              ] as const
            ).map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={filter === value ? "is-active" : ""}
                aria-pressed={filter === value}
                onClick={() => {
                  setFilter(value);
                  setVisibleLimit(18);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visibleEntries.length === 0 ? (
          <div className="atlas-empty">
            <Search aria-hidden="true" />
            <h3>No signal at this coordinate.</h3>
            <p>Change a filter or search for a broader programming concept.</p>
          </div>
        ) : (
          <div className="atlas-results">
            {visibleEntries.map(({ track, world, lesson }) => {
              const completed = state.progress.lessons[lesson.id]?.isCompleted === true;
              const unlocked = isLessonUnlocked(track, lesson.id, state.progress);
              const bookmarked = state.bookmarkedLessonIds.includes(lesson.id);
              return (
                <article
                  className={`atlas-result-card accent-${track.accent}${completed ? " is-completed" : ""}${!unlocked ? " is-locked" : ""}`}
                  key={`${track.id}:${lesson.id}`}
                >
                  <div className="atlas-result-top">
                    <span>{track.icon}</span>
                    <small>
                      {track.language} / {world.title}
                    </small>
                    <button
                      type="button"
                      className={bookmarked ? "is-bookmarked" : ""}
                      aria-label={`${bookmarked ? "Remove" : "Add"} bookmark for ${lesson.title}`}
                      aria-pressed={bookmarked}
                      onClick={() =>
                        dispatch({ type: "toggle-bookmark", lessonId: lesson.id })
                      }
                    >
                      <Bookmark aria-hidden="true" />
                    </button>
                  </div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.subtitle}</p>
                  <div className="atlas-result-meta">
                    <span>
                      <Clock3 aria-hidden="true" /> {lesson.durationMinutes} min
                    </span>
                    <span>
                      {completed ? (
                        <>
                          <CheckCircle2 aria-hidden="true" /> Restored
                        </>
                      ) : unlocked ? (
                        <>
                          <Signal aria-hidden="true" /> Available
                        </>
                      ) : (
                        <>
                          <LockKeyhole aria-hidden="true" /> Sequenced
                        </>
                      )}
                    </span>
                  </div>
                  <Link
                    to={
                      unlocked ? `/learn/${track.id}/${lesson.id}` : `/tracks/${track.id}`
                    }
                  >
                    {unlocked ? "Open fragment" : "View required route"}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {matchingEntries.length > visibleEntries.length && (
          <button
            className="button button-secondary atlas-load-more"
            type="button"
            onClick={() => setVisibleLimit((limit) => limit + 18)}
          >
            Reveal {Math.min(18, matchingEntries.length - visibleEntries.length)} more
            coordinates
          </button>
        )}
      </section>
    </main>
  );
}
