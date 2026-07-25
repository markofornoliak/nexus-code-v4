import {
  ArrowRight,
  Braces,
  FlaskConical,
  Layers3,
  RadioTower,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "../router";
import { PRODUCT } from "../app/config/product";
import { achievements } from "../content/achievements";
import { tracks } from "../content/registry";
import { useProgress } from "../features/progress/ProgressContext";
import {
  selectContinueLesson,
  selectTrackProgress,
} from "../features/progress/progressSelectors";
import { AchievementCard } from "../components/achievements/AchievementCard";
import { TrackCard } from "../components/tracks/TrackCard";
import { NexusCoreExperience } from "../features/visual-lab/NexusCoreExperience";
import { MissionDeck } from "../components/progress/MissionDeck";

export default function LandingPage() {
  const { state } = useProgress();
  const python = tracks[0];
  if (!python) return null;
  const continueSelection = selectContinueLesson(state.progress);
  const availableTracks = tracks.filter((track) => track.status === "available");
  const lessonCount = availableTracks.reduce(
    (total, track) =>
      total +
      track.worlds.reduce(
        (worldTotal, world) =>
          worldTotal +
          world.lessons.filter((lesson) => lesson.status === "available").length,
        0,
      ),
    0,
  );
  const worldCount = availableTracks.reduce(
    (total, track) => total + track.worlds.length,
    0,
  );
  const primaryRoute = continueSelection
    ? `/learn/${continueSelection.track.id}/${continueSelection.lesson.id}`
    : "/tracks/python";
  const pythonProgress = selectTrackProgress(python, state.progress);

  return (
    <main id="main-content">
      <section className="hero field-hero section-shell">
        <aside className="field-coordinate-rail" aria-hidden="true">
          <span>90°</span>
          <span>60°</span>
          <span>30°</span>
          <strong>0° / NX</strong>
          <span>−30°</span>
          <span>−60°</span>
        </aside>
        <div className="hero-copy">
          <p className="eyebrow">
            Plate 03 / Bioluminescent field codex / Archive online
          </p>
          <h1>
            Recover the logic.
            <em>Rebuild the signal.</em>
          </h1>
          <p className="hero-description">
            NEXUS is a programming platform found inside a dormant computational organism.
            Restore Python, JavaScript, web, Java, and C++ fragments through executable
            challenges, live previews, structural analysis, and a persistent learning map.
          </p>
          <div className="button-row">
            <Link className="button button-primary" to={primaryRoute}>
              {continueSelection
                ? `Continue ${continueSelection.track.language}`
                : "Begin Python expedition"}{" "}
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/tracks">
              Inspect all expeditions
            </Link>
          </div>
        </div>
        <NexusCoreExperience initialTrackId={continueSelection?.track.id ?? "python"} />
      </section>

      <section className="field-support-strip section-shell" aria-label="Archive metrics">
        <div>
          <span>01 / Fragments</span>
          <strong>{lessonCount}+</strong>
          <small>Executable learning coordinates</small>
        </div>
        <div>
          <span>02 / Sectors</span>
          <strong>{String(worldCount).padStart(2, "0")}</strong>
          <small>Connected archive regions</small>
        </div>
        <div className="field-module-readout">
          <span>03 / Active module</span>
          <strong>{continueSelection?.track.language ?? "Python"}</strong>
          <small>{continueSelection?.lesson.title ?? "Signal Awakening"}</small>
        </div>
        <div className="field-progress-readout">
          <span>04 / Restoration</span>
          <strong>{pythonProgress.percent}%</strong>
          <div aria-hidden="true">
            <span style={{ width: `${pythonProgress.percent}%` }} />
          </div>
          <small>{state.progress.totalXp} Signal Energy recovered</small>
        </div>
      </section>

      <MissionDeck />

      <section className="manifesto-band">
        <div className="section-shell manifesto-grid">
          <div>
            <span className="eyebrow">The living code archive</span>
            <h2>Knowledge is not consumed. It is reconstructed.</h2>
          </div>
          <p>
            Every lesson is a dormant logic fragment. Every correct program carries Signal
            Energy through a damaged path. Your progress turns a sealed archive into a
            working system.
          </p>
        </div>
      </section>

      <section className="section-shell feature-section">
        <header className="section-intro">
          <span className="section-number">01 / INSTRUMENTS</span>
          <div>
            <p className="eyebrow">A serious learning workspace</p>
            <h2>Field equipment for learning by doing</h2>
            <p>
              Theory, executable specimens, input channels, validation, and durable
              progress operate as one coherent system.
            </p>
          </div>
        </header>
        <div className="feature-grid">
          {[
            {
              icon: Braces,
              label: "Live execution",
              title: "Two isolated code runtimes",
              text: "Dedicated Workers run Python through Pyodide and modern JavaScript, capture output, and interrupt runaway loops.",
            },
            {
              icon: FlaskConical,
              label: "Active recovery",
              title: "Validation beyond “it ran”",
              text: "Output, source structure, custom checks, and sandboxed HTML previews validate each task against an explicit contract.",
            },
            {
              icon: Layers3,
              label: "Extensible archive",
              title: "Ninety typed lessons",
              text: "Eighteen worlds across five language expeditions share one content-first architecture and a searchable learning atlas.",
            },
            {
              icon: ShieldCheck,
              label: "Local continuity",
              title: "Progress stays on your device",
              text: "Versioned migrations, autosaved code drafts, export/import, and duplicate-XP protection preserve work.",
            },
          ].map(({ icon: Icon, label, title, text }, index) => (
            <article className="feature-instrument" key={title}>
              <div className="instrument-index">0{index + 1}</div>
              <Icon aria-hidden="true" />
              <span>{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell journey-preview">
        <header className="section-intro">
          <span className="section-number">02 / EXPEDITION</span>
          <div>
            <p className="eyebrow">Python Core / Active</p>
            <h2>Eight sectors. One complete path from syntax to graph systems.</h2>
          </div>
        </header>
        <div className="journey-line">
          {python.worlds.map((world, index) => (
            <article key={world.id}>
              <div className="journey-node">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <small>{world.landmark}</small>
                <h3>{world.title}</h3>
                <p>{world.description}</p>
                <strong>{world.lessons.length} fragments</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell track-preview-section">
        <header className="section-intro">
          <span className="section-number">03 / LANGUAGES</span>
          <div>
            <p className="eyebrow">Archive sectors</p>
            <h2>Five operational language expeditions</h2>
          </div>
        </header>
        <div className="track-preview-grid">
          {tracks.slice(0, 3).map((track, index) => (
            <TrackCard
              featured={index === 0}
              key={track.id}
              track={track}
              progress={selectTrackProgress(track, state.progress)}
            />
          ))}
        </div>
        <Link className="text-link" to="/tracks">
          Explore all {availableTracks.length} expeditions{" "}
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <section className="relic-preview-section">
        <div className="section-shell">
          <header className="section-intro">
            <span className="section-number">04 / RELICS</span>
            <div>
              <p className="eyebrow">Gamification with meaning</p>
              <h2>Rare artifacts record real mastery</h2>
              <p>
                Signal Energy measures recovered work. Pulse Chains reward continuity.
                Relics mark specific accomplishments instead of decorative clicks.
              </p>
            </div>
          </header>
          <div className="relic-preview-grid">
            {achievements.slice(0, 3).map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={index === 0}
                compact
              />
            ))}
          </div>
          <div className="gamification-readout">
            <RadioTower aria-hidden="true" />
            <div>
              <span>Signal Energy</span>
              <strong>Task +25 / Bonus +40 / Fragment +60</strong>
            </div>
            <Sparkles aria-hidden="true" />
            <div>
              <span>Relic catalog</span>
              <strong>{achievements.length} recoverable specimens</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta section-shell">
        <div className="cta-core" aria-hidden="true">
          NX
        </div>
        <div>
          <span className="eyebrow">{PRODUCT.metaphor}</span>
          <h2>The first signal is waiting.</h2>
          <p>
            {continueSelection
              ? `Resume ${continueSelection.lesson.title} and keep the archive moving.`
              : "Open the Serpentine Archive and write the program that wakes it."}
          </p>
        </div>
        <Link className="button button-primary" to={primaryRoute}>
          {continueSelection ? "Resume fragment" : "Start recovering"}{" "}
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
