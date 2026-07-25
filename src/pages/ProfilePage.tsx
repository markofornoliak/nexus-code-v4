import {
  Activity,
  Bookmark,
  Box,
  Download,
  Flame,
  Gauge,
  MoonStar,
  RotateCcw,
  Save,
  Signal,
  Sparkles,
  SunMedium,
  Target,
  Upload,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { Link } from "../router";
import { AchievementCard } from "../components/achievements/AchievementCard";
import { ProgressBar } from "../components/common/ProgressBar";
import { achievements } from "../content/achievements";
import { tracks } from "../content/registry";
import { useProgress } from "../features/progress/ProgressContext";
import {
  completedBonusCount,
  completedLessonCount,
  completedTaskCount,
  selectActivityDays,
  selectTrackProgress,
  selectWeeklyGoalProgress,
} from "../features/progress/progressSelectors";
import { calculateLevelProgress } from "../lib/gamification";
import { lessonCatalog } from "../lib/catalogSearch";
import { exportStoredState, importStoredState } from "../services/storage/storage";

export default function ProfilePage() {
  const { state, dispatch } = useProgress();
  const [name, setName] = useState(state.progress.displayName);
  const [importMessage, setImportMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const level = calculateLevelProgress(state.progress.totalXp);
  const activityDays = selectActivityDays(state.progress, 21);
  const weeklyGoal = selectWeeklyGoalProgress(
    state.progress,
    state.preferences.weeklyLessonGoal,
  );
  const bookmarkedLessons = lessonCatalog.filter((entry) =>
    state.bookmarkedLessonIds.includes(entry.lesson.id),
  );

  const saveName = (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: "set-name", displayName: name });
  };

  const exportProgress = () => {
    const blob = new Blob([exportStoredState(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nexus-progress-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importProgress = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      setImportMessage("Import rejected: the file is larger than 1 MB.");
      return;
    }
    const imported = importStoredState(await file.text());
    if (!imported) {
      setImportMessage("Import rejected: this is not a valid NEXUS progress file.");
      return;
    }
    dispatch({ type: "import", state: imported });
    setName(imported.progress.displayName);
    setImportMessage("Progress archive imported successfully.");
    event.target.value = "";
  };

  const resetProgress = () => {
    const confirmed = window.confirm(
      "Reset all NEXUS progress, Signal Energy, Pulse Chain, and recovered relics? Export first if you may need a backup.",
    );
    if (confirmed) {
      dispatch({ type: "reset" });
      setName("Archive Operator");
    }
  };

  return (
    <main id="main-content" className="page-shell profile-page">
      <header className="profile-hero">
        <div className="profile-identity">
          <div className="operator-seal" aria-hidden="true">
            {state.progress.displayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="eyebrow">
              Local operator profile / NX-{String(level.level).padStart(3, "0")}
            </p>
            <h1>{state.progress.displayName}</h1>
            <p>Your restored pathways and recovered artifacts remain on this device.</p>
          </div>
        </div>
        <div className="level-orb">
          <span>Level</span>
          <strong>{level.level}</strong>
          <small>
            {level.currentLevelXp} / {level.nextLevelXp} signal
          </small>
          <ProgressBar value={level.percent} label="Progress to next level" compact />
        </div>
      </header>

      <section className="profile-metrics" aria-label="Learning statistics">
        <article>
          <Signal aria-hidden="true" />
          <span>Signal Energy</span>
          <strong>{state.progress.totalXp}</strong>
          <small>Total recovered</small>
        </article>
        <article>
          <Activity aria-hidden="true" />
          <span>Fragments</span>
          <strong>{completedLessonCount(state.progress)}</strong>
          <small>{completedTaskCount(state.progress)} tasks stabilized</small>
        </article>
        <article>
          <Flame aria-hidden="true" />
          <span>Pulse Chain</span>
          <strong>{state.progress.streak.currentStreak}</strong>
          <small>Longest: {state.progress.streak.longestStreak} days</small>
        </article>
        <article>
          <Save aria-hidden="true" />
          <span>Hidden channels</span>
          <strong>{completedBonusCount(state.progress)}</strong>
          <small>Bonus transmissions</small>
        </article>
      </section>

      <section className="profile-field-dashboard" aria-label="Study planning">
        <article className="goal-field-card">
          <div>
            <Target aria-hidden="true" />
            <span>Weekly field target</span>
          </div>
          <strong>
            {weeklyGoal.completed}
            <small> / {weeklyGoal.target} fragments</small>
          </strong>
          <ProgressBar
            value={weeklyGoal.percent}
            label="Weekly profile goal progress"
            compact
          />
          <p>
            Week started {weeklyGoal.weekStartsAt}.{" "}
            {weeklyGoal.percent >= 100
              ? "Recovery target complete."
              : "Each restored lesson advances this instrument."}
          </p>
        </article>

        <article className="activity-field-card">
          <div>
            <Activity aria-hidden="true" />
            <span>21-day signal record</span>
          </div>
          <div className="activity-heatmap" aria-label="Activity over the last 21 days">
            {activityDays.map((day) => (
              <span
                className={`intensity-${day.intensity}`}
                key={day.date}
                title={`${day.date}: ${day.count} activities`}
                aria-label={`${day.date}: ${day.count} learning activities`}
              />
            ))}
          </div>
          <footer>
            <span>Quiet</span>
            <i className="intensity-1" />
            <i className="intensity-2" />
            <i className="intensity-3" />
            <i className="intensity-4" />
            <span>Strong signal</span>
          </footer>
        </article>

        <article className="bookmark-field-card">
          <div>
            <Bookmark aria-hidden="true" />
            <span>Saved coordinates</span>
          </div>
          {bookmarkedLessons.length === 0 ? (
            <p>
              Bookmark fragments from the Atlas or lesson workspace to build a personal
              recovery list.
            </p>
          ) : (
            <ul>
              {bookmarkedLessons.slice(0, 4).map(({ track, lesson }) => (
                <li key={lesson.id}>
                  <Link to={`/learn/${track.id}/${lesson.id}`}>
                    <span>{track.icon}</span>
                    <strong>{lesson.title}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link className="text-link" to="/atlas">
            Open full atlas
          </Link>
        </article>
      </section>

      <div className="profile-two-column">
        <section className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Expedition telemetry</p>
              <h2>Language restoration</h2>
            </div>
          </div>
          <div className="language-progress-list">
            {tracks.map((track) => {
              const progress = selectTrackProgress(track, state.progress);
              return (
                <div key={track.id}>
                  <span className={`mini-glyph accent-${track.accent}`}>
                    {track.icon}
                  </span>
                  <div>
                    <strong>{track.language}</strong>
                    <small>
                      {progress.completedLessons}/{progress.totalLessons} fragments
                    </small>
                    <ProgressBar
                      value={progress.percent}
                      label={`${track.language} profile progress`}
                      compact
                    />
                  </div>
                  <b>{progress.percent}%</b>
                </div>
              );
            })}
          </div>
        </section>

        <section className="profile-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Recent transmissions</p>
              <h2>Activity record</h2>
            </div>
          </div>
          {state.progress.activity.length === 0 ? (
            <div className="empty-state">
              <Activity aria-hidden="true" />
              <p>
                No recovery activity yet. Stabilize the first Python task to begin the
                record.
              </p>
            </div>
          ) : (
            <ol className="activity-list">
              {state.progress.activity.slice(0, 8).map((item) => (
                <li key={item.id}>
                  <span
                    className={`activity-type type-${item.type}`}
                    aria-hidden="true"
                  />
                  <div>
                    <strong>{item.label}</strong>
                    <time dateTime={item.occurredAt}>
                      {new Date(item.occurredAt).toLocaleString()}
                    </time>
                  </div>
                  <b>{item.xp > 0 ? `+${item.xp}` : "RELIC"}</b>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="relic-vault">
        <header className="section-intro">
          <span className="section-number">RELIC VAULT</span>
          <div>
            <p className="eyebrow">Recovered and encrypted specimens</p>
            <h2>Artifact collection</h2>
            <p>
              {state.progress.unlockedAchievementIds.length} of {achievements.length}{" "}
              relics recovered.
            </p>
          </div>
        </header>
        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={state.progress.unlockedAchievementIds.includes(achievement.id)}
              unlockedAt={state.progress.achievementDates[achievement.id]}
            />
          ))}
        </div>
      </section>

      <section className="profile-settings">
        <div className="settings-column">
          <p className="eyebrow">Operator identity</p>
          <h2>Local profile controls</h2>
          <form onSubmit={saveName}>
            <label htmlFor="display-name">Display name</label>
            <div className="input-button-row">
              <input
                id="display-name"
                value={name}
                maxLength={60}
                onChange={(event) => setName(event.target.value)}
              />
              <button className="button button-secondary" type="submit">
                <Save aria-hidden="true" /> Save
              </button>
            </div>
          </form>
          <label htmlFor="editor-font-size">
            Editor font size: {state.preferences.editorFontSize}px
          </label>
          <input
            id="editor-font-size"
            type="range"
            min="12"
            max="22"
            value={state.preferences.editorFontSize}
            onChange={(event) =>
              dispatch({ type: "set-editor-font-size", size: Number(event.target.value) })
            }
          />
          <label htmlFor="weekly-lesson-goal">
            Weekly lesson goal: {state.preferences.weeklyLessonGoal}
          </label>
          <input
            id="weekly-lesson-goal"
            type="range"
            min="1"
            max="14"
            value={state.preferences.weeklyLessonGoal}
            onChange={(event) =>
              dispatch({
                type: "set-weekly-lesson-goal",
                goal: Number(event.target.value),
              })
            }
          />
          <fieldset className="theme-selector">
            <legend>Interface field mode</legend>
            <button
              type="button"
              aria-pressed={state.preferences.theme === "field-codex"}
              className={state.preferences.theme === "field-codex" ? "is-selected" : ""}
              onClick={() => dispatch({ type: "set-theme", theme: "field-codex" })}
            >
              <SunMedium aria-hidden="true" />
              <span>
                <strong>Field codex</strong>
                <small>Mineral daylight and deep green instruments.</small>
              </span>
            </button>
            <button
              type="button"
              aria-pressed={state.preferences.theme === "night-observatory"}
              className={
                state.preferences.theme === "night-observatory" ? "is-selected" : ""
              }
              onClick={() => dispatch({ type: "set-theme", theme: "night-observatory" })}
            >
              <MoonStar aria-hidden="true" />
              <span>
                <strong>Night observatory</strong>
                <small>Low-light archive surfaces for focused sessions.</small>
              </span>
            </button>
          </fieldset>
          <fieldset className="theme-selector visual-mode-selector">
            <legend>3D visual depth</legend>
            <button
              type="button"
              aria-pressed={state.preferences.visualMode === "adaptive"}
              className={state.preferences.visualMode === "adaptive" ? "is-selected" : ""}
              onClick={() =>
                dispatch({ type: "set-visual-mode", visualMode: "adaptive" })
              }
            >
              <Gauge aria-hidden="true" />
              <span>
                <strong>Adaptive</strong>
                <small>Balances WebGL detail with device capability.</small>
              </span>
            </button>
            <button
              type="button"
              aria-pressed={state.preferences.visualMode === "minimal"}
              className={state.preferences.visualMode === "minimal" ? "is-selected" : ""}
              onClick={() => dispatch({ type: "set-visual-mode", visualMode: "minimal" })}
            >
              <Box aria-hidden="true" />
              <span>
                <strong>Minimal</strong>
                <small>Uses the lightweight semantic scene fallback.</small>
              </span>
            </button>
            <button
              type="button"
              aria-pressed={state.preferences.visualMode === "immersive"}
              className={
                state.preferences.visualMode === "immersive" ? "is-selected" : ""
              }
              onClick={() =>
                dispatch({ type: "set-visual-mode", visualMode: "immersive" })
              }
            >
              <Sparkles aria-hidden="true" />
              <span>
                <strong>Immersive</strong>
                <small>Raises scene density on capable devices.</small>
              </span>
            </button>
          </fieldset>
          <label className="toggle-setting" htmlFor="reduced-motion">
            <input
              id="reduced-motion"
              type="checkbox"
              checked={state.preferences.reducedMotion}
              onChange={(event) =>
                dispatch({
                  type: "set-reduced-motion",
                  reduced: event.target.checked,
                })
              }
            />
            <span>
              <strong>Reduce interface motion</strong>
              <small>Stops decorative orbits, pulses, and transitions.</small>
            </span>
          </label>
        </div>
        <div className="settings-column archive-transfer">
          <p className="eyebrow">Archive continuity</p>
          <h2>Export, import, or reset</h2>
          <p>
            Exported files contain inert progress data only. Imports are size-limited and
            validated before they can replace local state.
          </p>
          <div className="button-row">
            <button
              className="button button-secondary"
              type="button"
              onClick={exportProgress}
            >
              <Download aria-hidden="true" /> Export JSON
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              <Upload aria-hidden="true" /> Import JSON
            </button>
            <input
              ref={inputRef}
              className="visually-hidden"
              type="file"
              accept="application/json,.json"
              onChange={(event) => void importProgress(event)}
              aria-label="Import NEXUS progress JSON"
            />
          </div>
          {importMessage && (
            <p className="import-message" role="status">
              {importMessage}
            </p>
          )}
          <button className="danger-button" type="button" onClick={resetProgress}>
            <RotateCcw aria-hidden="true" /> Reset all progress
          </button>
        </div>
      </section>
    </main>
  );
}
