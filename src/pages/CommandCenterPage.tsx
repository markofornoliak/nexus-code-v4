import {
  ArrowRight,
  BrainCircuit,
  Clock3,
  Crosshair,
  Flame,
  Gauge,
  Route,
  SignalHigh,
  Sparkles,
  Target,
} from "lucide-react";
import { type CSSProperties, useMemo, useState } from "react";
import { Link } from "../router";
import { tracks } from "../content/registry";
import { useProgress } from "../features/progress/ProgressContext";
import {
  selectActivityDays,
  selectCommandCenterSnapshot,
  selectWorldSkillSignals,
} from "../features/progress/progressSelectors";
import { SkillConstellation } from "../features/command-center/SkillConstellation";
import type { FocusSessionMinutes } from "../types";

const focusOptions: FocusSessionMinutes[] = [15, 25, 45];

function priorityLabel(priority: "resume" | "momentum" | "explore") {
  if (priority === "resume") return "Open fragment";
  if (priority === "momentum") return "Momentum route";
  return "New signal";
}

export default function CommandCenterPage() {
  const { state, dispatch } = useProgress();
  const [selectedTrackId, setSelectedTrackId] = useState(
    tracks.find((track) => track.status === "available")?.id ?? "python",
  );
  const focusMinutes = state.preferences.focusSessionMinutes;
  const snapshot = useMemo(
    () => selectCommandCenterSnapshot(state.progress, focusMinutes),
    [focusMinutes, state.progress],
  );
  const activityDays = useMemo(
    () => selectActivityDays(state.progress, 14),
    [state.progress],
  );
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) ?? tracks[0];
  const worldSignals = selectedTrack
    ? selectWorldSkillSignals(selectedTrack, state.progress)
    : [];
  const primary = snapshot.recommendations[0];

  return (
    <main id="main-content" className="page-shell command-center-page">
      <section className="command-center-hero">
        <div className="command-center-copy">
          <span className="eyebrow">Operator intelligence / Adaptive routing</span>
          <h1>
            Command <em>Center</em>
          </h1>
          <p>
            A live operational view of your learning archive. NEXUS converts completed
            tasks, open fragments, continuity, and track depth into a focused next-step
            protocol.
          </p>
          <div className="button-row">
            {primary ? (
              <Link className="button button-primary" to={primary.route}>
                Start {primary.minutes}-minute protocol <ArrowRight aria-hidden="true" />
              </Link>
            ) : (
              <Link className="button button-primary" to="/tracks">
                Inspect expeditions <ArrowRight aria-hidden="true" />
              </Link>
            )}
            <Link className="button button-secondary" to="/atlas">
              Open learning atlas
            </Link>
          </div>
        </div>
        <div
          className="recovery-orb"
          aria-label={`${snapshot.recoveryScore}% recovery score`}
        >
          <div
            className="recovery-orb-ring"
            style={
              {
                "--recovery-score": `${snapshot.recoveryScore * 3.6}deg`,
              } as CSSProperties
            }
          >
            <span>
              <strong>{snapshot.recoveryScore}</strong>
              <small>Recovery score</small>
            </span>
          </div>
          <dl>
            <div>
              <dt>Archive</dt>
              <dd>{snapshot.overallPercent}%</dd>
            </div>
            <div>
              <dt>Active tracks</dt>
              <dd>{snapshot.activeTracks}</dd>
            </div>
            <div>
              <dt>Pulse chain</dt>
              <dd>{state.progress.streak.currentStreak}d</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="focus-protocol" aria-labelledby="focus-protocol-title">
        <div>
          <span className="eyebrow">Session architecture</span>
          <h2 id="focus-protocol-title">Choose the size of the next recovery window</h2>
          <p>
            Recommendations automatically respect this time budget and favor unfinished
            work before opening a new language signal.
          </p>
        </div>
        <div
          className="focus-options"
          role="radiogroup"
          aria-label="Focus session length"
        >
          {focusOptions.map((minutes) => (
            <button
              key={minutes}
              type="button"
              role="radio"
              aria-checked={focusMinutes === minutes}
              className={focusMinutes === minutes ? "is-selected" : undefined}
              onClick={() => dispatch({ type: "set-focus-session-minutes", minutes })}
            >
              <Clock3 aria-hidden="true" />
              <strong>{minutes}</strong>
              <span>minutes</span>
              <small>
                {minutes === 15
                  ? "Quick repair"
                  : minutes === 25
                    ? "Deep focus"
                    : "Full expedition"}
              </small>
            </button>
          ))}
        </div>
      </section>

      <SkillConstellation
        signals={snapshot.skillSignals}
        reducedMotion={state.preferences.reducedMotion}
        minimal={state.preferences.visualMode === "minimal"}
      />

      <section className="adaptive-routing" aria-labelledby="adaptive-routing-title">
        <header className="section-intro">
          <span className="section-number">01 / ROUTING</span>
          <div>
            <p className="eyebrow">Next best actions</p>
            <h2 id="adaptive-routing-title">A queue built from real learning state</h2>
            <p>
              Open drafts and partially restored fragments come first. NEXUS then protects
              momentum in active tracks before suggesting new territory.
            </p>
          </div>
        </header>
        <div className="recommendation-grid">
          {snapshot.recommendations.length === 0 && (
            <article className="command-empty-state">
              <Sparkles aria-hidden="true" />
              <p className="eyebrow">Archive synchronized</p>
              <h3>Every available fragment is restored.</h3>
              <p>
                Revisit the Visual Lab, complete optional transmissions, or inspect the
                atlas while the next expedition is being prepared.
              </p>
              <div className="button-row">
                <Link className="button button-primary" to="/lab">
                  Open Visual Lab <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="button button-secondary" to="/atlas">
                  Review atlas
                </Link>
              </div>
            </article>
          )}
          {snapshot.recommendations.map((recommendation, index) => (
            <article className="recommendation-card" key={recommendation.id}>
              <header>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{priorityLabel(recommendation.priority)}</small>
              </header>
              <div className="recommendation-icon" aria-hidden="true">
                {recommendation.priority === "resume" ? (
                  <Crosshair />
                ) : recommendation.priority === "momentum" ? (
                  <Route />
                ) : (
                  <Sparkles />
                )}
              </div>
              <p className="archive-label">
                {recommendation.trackLabel} / {recommendation.worldLabel}
              </p>
              <h3>{recommendation.title}</h3>
              <p>{recommendation.description}</p>
              <div className="recommendation-metrics">
                <span>
                  <Clock3 aria-hidden="true" /> {recommendation.minutes} min
                </span>
                <span>
                  <Gauge aria-hidden="true" /> {recommendation.progressPercent}% restored
                </span>
              </div>
              <Link className="text-link" to={recommendation.route}>
                Enter fragment <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="skill-diagnostics" aria-labelledby="skill-diagnostics-title">
        <header>
          <div>
            <span className="eyebrow">Depth diagnostics</span>
            <h2 id="skill-diagnostics-title">World-by-world signal strength</h2>
          </div>
          <div
            className="diagnostic-track-tabs"
            role="tablist"
            aria-label="Track diagnostics"
          >
            {snapshot.skillSignals.map((signal) => (
              <button
                key={signal.id}
                type="button"
                id={`diagnostic-tab-${signal.trackId}`}
                role="tab"
                aria-controls="diagnostic-world-panel"
                aria-selected={signal.trackId === selectedTrack?.id}
                className={
                  signal.trackId === selectedTrack?.id ? "is-selected" : undefined
                }
                onClick={() => setSelectedTrackId(signal.trackId)}
              >
                {signal.label}
              </button>
            ))}
          </div>
        </header>
        <div className="skill-diagnostic-layout">
          <div
            id="diagnostic-world-panel"
            className="world-signal-list"
            role="tabpanel"
            aria-labelledby={
              selectedTrack ? `diagnostic-tab-${selectedTrack.id}` : undefined
            }
          >
            {worldSignals.map((signal, index) => (
              <article key={signal.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <header>
                    <h3>{signal.label}</h3>
                    <strong>{signal.percent}%</strong>
                  </header>
                  <p>{signal.detail}</p>
                  <div className="world-signal-bar" aria-hidden="true">
                    <i style={{ width: `${signal.percent}%` }} />
                  </div>
                  <small>
                    {signal.completed} / {signal.total} fragments restored
                  </small>
                </div>
              </article>
            ))}
          </div>
          <aside className="continuity-panel">
            <SignalHigh aria-hidden="true" />
            <span className="eyebrow">14-day continuity</span>
            <h3>Learning pulse</h3>
            <div
              className="activity-sparkline"
              aria-label="Activity over the last 14 days"
            >
              {activityDays.map((day) => (
                <span
                  key={day.date}
                  data-intensity={day.intensity}
                  title={`${day.date}: ${day.count} activities`}
                />
              ))}
            </div>
            <dl>
              <div>
                <dt>
                  <Target aria-hidden="true" /> Restored
                </dt>
                <dd>
                  {snapshot.completedLessons}/{snapshot.totalLessons}
                </dd>
              </div>
              <div>
                <dt>
                  <Flame aria-hidden="true" /> Longest pulse
                </dt>
                <dd>{state.progress.streak.longestStreak} days</dd>
              </div>
              <div>
                <dt>
                  <BrainCircuit aria-hidden="true" /> Signal energy
                </dt>
                <dd>{state.progress.totalXp} XP</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}
