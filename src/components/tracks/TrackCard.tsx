import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { Link } from "../../router";
import type { Track } from "../../types";
import type { TrackProgress } from "../../types";
import { ProgressBar } from "../common/ProgressBar";
import { StatusChip } from "../common/StatusChip";

interface TrackCardProps {
  track: Track;
  progress: TrackProgress;
  featured?: boolean;
}

export function TrackCard({ track, progress, featured = false }: TrackCardProps) {
  const lessonCount = track.worlds.reduce(
    (count, world) => count + world.lessons.length,
    0,
  );
  const statusLabel =
    track.status === "available"
      ? "Active expedition"
      : track.status === "preview"
        ? "Preview access"
        : "Sealed";

  return (
    <article
      className={`track-card accent-${track.accent}${featured ? " is-featured" : ""}`}
    >
      <div className="track-card-top">
        <div className="track-glyph" aria-hidden="true">
          {track.icon}
        </div>
        <StatusChip tone={track.status === "available" ? "active" : "warning"}>
          {statusLabel}
        </StatusChip>
      </div>
      <div>
        <p className="archive-label">{track.archiveName}</p>
        <h2>{track.language}</h2>
        <h3>{track.title}</h3>
        <p>{track.description}</p>
      </div>
      <dl className="track-metadata">
        <div>
          <dt>Difficulty</dt>
          <dd>{track.difficulty}</dd>
        </div>
        <div>
          <dt>Sectors</dt>
          <dd>{track.worlds.length}</dd>
        </div>
        <div>
          <dt>Fragments</dt>
          <dd>{lessonCount}</dd>
        </div>
      </dl>
      <ProgressBar value={progress.percent} label={`${track.language} progress`} />
      <Link className="track-action" to={`/tracks/${track.id}`}>
        {track.status === "available" ? "Enter expedition" : "Inspect preview"}
        {track.status === "coming-soon" ? (
          <LockKeyhole size={17} aria-hidden="true" />
        ) : (
          <ArrowUpRight size={17} aria-hidden="true" />
        )}
      </Link>
    </article>
  );
}
