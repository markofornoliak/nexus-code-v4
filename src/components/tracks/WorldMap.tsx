import { Check, LockKeyhole, Play, Sparkles } from "lucide-react";
import { Link } from "../../router";
import type { Track, UserProgress, World } from "../../types";
import {
  isLessonUnlocked,
  selectWorldProgress,
} from "../../features/progress/progressSelectors";
import { ProgressBar } from "../common/ProgressBar";

interface WorldMapProps {
  track: Track;
  progress: UserProgress;
}

const positions = [
  { x: 14, y: 18 },
  { x: 66, y: 31 },
  { x: 31, y: 49 },
  { x: 76, y: 68 },
  { x: 48, y: 87 },
];

function pathFor(world: World): string {
  const points = positions.slice(0, world.lessons.length);
  if (points.length === 0) return "";
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

export function WorldMap({ track, progress }: WorldMapProps) {
  return (
    <div className="world-map" aria-label={`${track.language} expedition map`}>
      {track.worlds.map((world, worldIndex) => {
        const worldProgress = selectWorldProgress(track, world.id, progress);
        return (
          <section className={`world-sector accent-${world.accent}`} key={world.id}>
            <header className="world-sector-header">
              <div className="world-index" aria-hidden="true">
                {String(worldIndex + 1).padStart(2, "0")}
              </div>
              <div>
                <span className="archive-label">{world.landmark}</span>
                <h2>{world.title}</h2>
                <p>{world.description}</p>
              </div>
              <div className="world-progress-summary">
                <strong>
                  {worldProgress.completedLessons}/{worldProgress.totalLessons}
                </strong>
                <span>fragments</span>
                <ProgressBar
                  compact
                  value={worldProgress.percent}
                  label={`${world.title} progress`}
                />
              </div>
            </header>
            <div className="map-instrument">
              <svg
                className="map-path"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path className="map-path-base" d={pathFor(world)} />
                <path
                  className="map-path-active"
                  d={pathFor(world)}
                  pathLength="100"
                  style={{
                    strokeDasharray: `${worldProgress.percent} ${100 - worldProgress.percent}`,
                  }}
                />
              </svg>
              <div className="map-grid-lines" aria-hidden="true" />
              {world.lessons.map((lesson, index) => {
                const position = positions[index] ?? positions[positions.length - 1];
                if (!position) return null;
                const completed = progress.lessons[lesson.id]?.isCompleted ?? false;
                const unlocked =
                  lesson.status === "preview" ||
                  isLessonUnlocked(track, lesson.id, progress);
                const active = unlocked && !completed;
                const nodeClass = completed
                  ? "is-completed"
                  : active
                    ? "is-active"
                    : "is-locked";
                return (
                  <div
                    className={`map-node-wrap ${nodeClass}`}
                    key={lesson.id}
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  >
                    {unlocked ? (
                      <Link
                        className="map-node"
                        to={`/learn/${track.id}/${lesson.id}`}
                        aria-label={`${lesson.title}, ${completed ? "completed" : "available"}`}
                      >
                        {completed ? (
                          <Check aria-hidden="true" />
                        ) : (
                          <Play aria-hidden="true" />
                        )}
                      </Link>
                    ) : (
                      <button
                        className="map-node"
                        type="button"
                        disabled
                        aria-label={`${lesson.title}, locked`}
                      >
                        <LockKeyhole aria-hidden="true" />
                      </button>
                    )}
                    <div className="map-node-label">
                      <span>Fragment {String(index + 1).padStart(2, "0")}</span>
                      <strong>{lesson.title}</strong>
                      <small>{lesson.durationMinutes} min</small>
                    </div>
                  </div>
                );
              })}
              <div className="world-landmark" aria-hidden="true">
                <Sparkles />
                <span>{world.landmark}</span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
