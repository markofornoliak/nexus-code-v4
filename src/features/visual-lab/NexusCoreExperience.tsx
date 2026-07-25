import { ArrowUpRight, Box, Move3D, RadioTower } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { tracks } from "../../content/registry";
import { useProgress } from "../progress/ProgressContext";
import { selectTrackProgress } from "../progress/progressSelectors";
import { Link } from "../../router";
import { NexusScene } from "./NexusScene";

interface NexusCoreExperienceProps {
  initialTrackId?: string;
}

export function NexusCoreExperience({
  initialTrackId = "python",
}: NexusCoreExperienceProps) {
  const { state } = useProgress();
  const initialIndex = Math.max(
    0,
    tracks.findIndex((track) => track.id === initialTrackId),
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const selected = tracks[selectedIndex] ?? tracks[0];
  const labels = useMemo(() => tracks.map((track) => track.language), []);
  const selectSceneNode = useCallback((nodeId: string) => {
    const match = /^orbit-(\d+)$/.exec(nodeId);
    const nextIndex = Number(match?.[1]);
    if (Number.isInteger(nextIndex) && tracks[nextIndex]) setSelectedIndex(nextIndex);
  }, []);

  if (!selected) return null;
  const progress = selectTrackProgress(selected, state.progress);
  const lessonCount = selected.worlds.reduce(
    (total, world) => total + world.lessons.length,
    0,
  );

  return (
    <section className={`nexus-core-experience accent-${selected.accent}`}>
      <div className="core-scene-header">
        <span>
          <RadioTower aria-hidden="true" />
          NEXUS CORE / V4
        </span>
        <span>
          <Move3D aria-hidden="true" />
          Drag to rotate
        </span>
      </div>
      <NexusScene
        kind="archive-core"
        step={selectedIndex}
        labels={labels}
        visualMode={state.preferences.visualMode}
        reducedMotion={state.preferences.reducedMotion}
        ariaLabel={`Interactive 3D archive core. ${selected.language} is selected.`}
        onNodeSelect={selectSceneNode}
      />
      <div className="core-orbit-selector" aria-label="Select language node">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            className={`accent-${track.accent}${index === selectedIndex ? " is-selected" : ""}`}
            type="button"
            aria-pressed={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
          >
            <span>{track.icon}</span>
            <small>{track.language}</small>
          </button>
        ))}
      </div>
      <div className="core-active-readout" aria-live="polite">
        <div className="core-track-glyph" aria-hidden="true">
          <Box />
          <strong>{selected.icon}</strong>
        </div>
        <div>
          <span>{selected.archiveName}</span>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>
        </div>
        <dl>
          <div>
            <dt>Sectors</dt>
            <dd>{selected.worlds.length}</dd>
          </div>
          <div>
            <dt>Fragments</dt>
            <dd>{lessonCount}</dd>
          </div>
          <div>
            <dt>Restored</dt>
            <dd>{progress.percent}%</dd>
          </div>
        </dl>
        <Link to={`/tracks/${selected.id}`} aria-label={`Open ${selected.language} map`}>
          Open expedition <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
