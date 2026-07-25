import { tracks } from "../content/registry";
import { TrackCard } from "../components/tracks/TrackCard";
import { useProgress } from "../features/progress/ProgressContext";
import { selectTrackProgress } from "../features/progress/progressSelectors";

export default function TracksPage() {
  const { state } = useProgress();
  const activeTracks = tracks.filter((track) => track.status === "available").length;
  const fragmentCount = tracks.reduce(
    (total, track) =>
      total + track.worlds.reduce((count, world) => count + world.lessons.length, 0),
    0,
  );
  return (
    <main id="main-content" className="page-shell tracks-page">
      <header className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Expedition index / 05 language sectors</p>
          <h1>Choose an archive sector.</h1>
          <p>
            All five language directions are operational: executable Python and
            JavaScript, live HTML/CSS previews, and guided Java/C++ source analysis across{" "}
            {fragmentCount} lesson fragments.
          </p>
        </div>
        <div className="index-instrument" aria-hidden="true">
          <span>ACTIVE</span>
          <strong>{String(activeTracks).padStart(2, "0")}</strong>
          <small>OF 05</small>
        </div>
      </header>
      <section className="tracks-grid" aria-label="Programming tracks">
        {tracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            featured={index === 0}
            progress={selectTrackProgress(track, state.progress)}
          />
        ))}
      </section>
    </main>
  );
}
