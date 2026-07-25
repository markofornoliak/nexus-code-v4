import { ArrowLeft, ArrowRight, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import { Link, useParams } from "../router";
import { ProgressBar } from "../components/common/ProgressBar";
import { StatusChip } from "../components/common/StatusChip";
import { WorldMap } from "../components/tracks/WorldMap";
import { achievements } from "../content/achievements";
import { getTrack } from "../content/registry";
import { useProgress } from "../features/progress/ProgressContext";
import { selectTrackProgress } from "../features/progress/progressSelectors";
import NotFoundPage from "./NotFoundPage";

export default function TrackPage() {
  const { trackId = "" } = useParams();
  const { state } = useProgress();
  const track = getTrack(trackId);
  if (!track)
    return (
      <NotFoundPage embedded message="This expedition does not exist in the archive." />
    );

  const progress = selectTrackProgress(track, state.progress);
  const trackAchievements = achievements.filter((achievement) => {
    const condition = achievement.condition;
    return (
      (condition.type === "track-completed" && condition.trackId === track.id) ||
      (condition.type === "world-completed" && condition.trackId === track.id) ||
      (condition.type === "lesson-completed" &&
        track.worlds.some((world) =>
          world.lessons.some((lesson) => lesson.id === condition.lessonId),
        ))
    );
  });

  return (
    <main id="main-content" className="page-shell track-page">
      <Link className="back-link" to="/tracks">
        <ArrowLeft aria-hidden="true" /> Expedition index
      </Link>
      <header className={`track-hero accent-${track.accent}`}>
        <div className="track-hero-glyph" aria-hidden="true">
          {track.icon}
        </div>
        <div className="track-hero-copy">
          <div className="chip-row">
            <StatusChip tone={track.status === "available" ? "active" : "warning"}>
              {track.status === "available" ? "Archive online" : "Preview channel"}
            </StatusChip>
            <span>{track.difficulty} expedition</span>
            <span>{track.execution.runtimeLabel}</span>
          </div>
          <p className="archive-label">{track.archiveName}</p>
          <h1>{track.title}</h1>
          <p>{track.description}</p>
          <div className="track-hero-stats">
            <div>
              <strong>{track.worlds.length}</strong>
              <span>sectors</span>
            </div>
            <div>
              <strong>
                {track.worlds.reduce((count, world) => count + world.lessons.length, 0)}
              </strong>
              <span>fragments</span>
            </div>
            <div>
              <strong>{progress.percent}%</strong>
              <span>restored</span>
            </div>
          </div>
          <ProgressBar
            value={progress.percent}
            label={`${track.language} expedition progress`}
          />
        </div>
      </header>

      {track.status === "available" ? (
        <>
          <section className="map-section-heading">
            <div>
              <p className="eyebrow">Neural route / keyboard accessible</p>
              <h2>Expedition map</h2>
            </div>
            <p>
              Restore fragments in sequence. Completed nodes carry Signal Energy into the
              next pathway.
            </p>
          </section>
          <WorldMap track={track} progress={state.progress} />
          <section className="track-rewards">
            <div>
              <span className="eyebrow">Relics in this expedition</span>
              <h2>Recoverable artifacts</h2>
            </div>
            <div className="reward-list">
              {trackAchievements.map((achievement) => (
                <div key={achievement.id}>
                  <Sparkles aria-hidden="true" />
                  <span>{achievement.name}</span>
                  <small>{achievement.rarity}</small>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="preview-roadmap">
          <div className="preview-lessons">
            <p className="eyebrow">Recovered preview fragments</p>
            <h2>Inspect the threshold chamber</h2>
            {track.worlds.flatMap((world) =>
              world.lessons.map((lesson) => (
                <Link key={lesson.id} to={`/learn/${track.id}/${lesson.id}`}>
                  <span>{String(lesson.order).padStart(2, "0")}</span>
                  <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.subtitle}</p>
                  </div>
                  <Clock3 aria-hidden="true" />
                  <small>{lesson.durationMinutes} min</small>
                  <ArrowRight aria-hidden="true" />
                </Link>
              )),
            )}
          </div>
          <aside className="future-worlds">
            <LockKeyhole aria-hidden="true" />
            <span className="eyebrow">Future recovery plan</span>
            <h2>Sealed archive regions</h2>
            <ol>
              {track.futureWorlds?.map((world, index) => (
                <li key={world}>
                  <span>0{index + 2}</span>
                  <strong>{world}</strong>
                  <small>Awaiting reconstruction</small>
                </li>
              ))}
            </ol>
            <p>
              Preview routes remain readable; execution and progression are intentionally
              disabled until the complete curriculum is restored.
            </p>
          </aside>
        </section>
      )}
    </main>
  );
}
