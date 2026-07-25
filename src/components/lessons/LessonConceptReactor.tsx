import { ArrowLeft, ArrowRight, Boxes, ChevronDown, ExternalLink } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { Lesson, Track } from "../../types";
import { Link } from "../../router";
import { useProgress } from "../../features/progress/ProgressContext";
import { NexusScene } from "../../features/visual-lab/NexusScene";
import type { SceneKind } from "../../features/visual-lab/sceneModel";

interface LessonConceptReactorProps {
  lesson: Lesson;
  track: Track;
}

function sceneKindFor(lesson: Lesson): SceneKind {
  if (/recurs|method|class|stack|inherit|function/i.test(lesson.id)) return "call-stack";
  if (/graph|search|path|route|tree|map-set/i.test(lesson.id)) return "graph-search";
  return "execution-flow";
}

export function LessonConceptReactor({ lesson, track }: LessonConceptReactorProps) {
  const { state } = useProgress();
  const [expanded, setExpanded] = useState(true);
  const [step, setStep] = useState(0);
  const concepts = useMemo(
    () => [
      lesson.title,
      ...lesson.objectives,
      lesson.tasks[0]?.title ?? "Practice",
      lesson.tasks[1]?.title ?? "Validate",
    ],
    [lesson],
  );
  const kind = sceneKindFor(lesson);
  const activeIndex = step % concepts.length;
  const activeConcept = concepts[activeIndex] ?? lesson.title;
  const selectNode = useCallback(
    (nodeId: string) => {
      const match = /-(\d+)$/.exec(nodeId);
      const index = Number(match?.[1]);
      if (Number.isInteger(index) && concepts[index]) setStep(index);
    },
    [concepts],
  );

  const move = (direction: -1 | 1) => {
    setStep((current) => (current + direction + concepts.length) % concepts.length);
  };

  return (
    <section className={`lesson-concept-reactor accent-${track.accent}`}>
      <header>
        <div>
          <Boxes aria-hidden="true" />
          <span>
            <small>Spatial concept instrument</small>
            <strong>3D Concept Reactor</strong>
          </span>
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`concept-reactor-${lesson.id}`}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Collapse" : "Open model"}
          <ChevronDown aria-hidden="true" />
        </button>
      </header>
      {expanded && (
        <div id={`concept-reactor-${lesson.id}`} className="concept-reactor-body">
          <NexusScene
            kind={kind}
            step={activeIndex}
            labels={concepts}
            visualMode={state.preferences.visualMode}
            reducedMotion={state.preferences.reducedMotion}
            ariaLabel={`${lesson.title} 3D concept model. Active concept: ${activeConcept}.`}
            onNodeSelect={selectNode}
          />
          <div className="concept-reactor-controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous concept">
              <ArrowLeft aria-hidden="true" />
            </button>
            <div aria-live="polite">
              <small>
                NODE {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(concepts.length).padStart(2, "0")}
              </small>
              <strong>{activeConcept}</strong>
            </div>
            <button type="button" onClick={() => move(1)} aria-label="Next concept">
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
          <Link to="/lab">
            Open full spatial lab <ExternalLink aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
