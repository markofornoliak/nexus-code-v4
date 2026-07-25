import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Boxes,
  Gauge,
  Network,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "../router";
import { NexusScene } from "../features/visual-lab/NexusScene";
import type { SceneKind } from "../features/visual-lab/sceneModel";
import { useProgress } from "../features/progress/ProgressContext";

interface LabStep {
  title: string;
  explanation: string;
  code: string;
  metric: string;
}

interface LabExperiment {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  kind: SceneKind;
  icon: typeof Network;
  labels: string[];
  steps: LabStep[];
  lessonRoute: string;
  lessonLabel: string;
}

const experiments: LabExperiment[] = [
  {
    id: "execution",
    title: "Execution Pipeline",
    subtitle: "From source text to durable progress",
    description:
      "Trace how one learner action crosses the editor, isolated runtime, validator, and versioned progress system.",
    kind: "execution-flow",
    icon: Braces,
    labels: ["Source", "Worker", "Output", "Validator", "Progress"],
    lessonRoute: "/learn/javascript/javascript-promise-coordination",
    lessonLabel: "Temporal Relay",
    steps: [
      {
        title: "Capture source",
        explanation:
          "CodeMirror owns the editable document while the lesson keeps a bounded autosaved draft.",
        code: "const source = editor.state.doc.toString();",
        metric: "INPUT / TEXT",
      },
      {
        title: "Cross the worker boundary",
        explanation:
          "The runtime receives inert strings. Learner code never executes on the React interface thread.",
        code: 'worker.postMessage({ type: "run", code, stdin });',
        metric: "ISOLATION / ON",
      },
      {
        title: "Capture the result",
        explanation:
          "stdout, stderr, duration, and status return as a bounded structured message.",
        code: "const { stdout, stderr, durationMs } = result;",
        metric: "OUTPUT / BOUNDED",
      },
      {
        title: "Validate the contract",
        explanation:
          "The selected task checks output and, when required, source structure instead of rewarding execution alone.",
        code: "const verdict = validateTask(task, stdout, code);",
        metric: "CONTRACT / CHECKED",
      },
      {
        title: "Commit progress once",
        explanation:
          "The reducer rejects duplicate task identifiers before awarding Signal Energy.",
        code: 'dispatch({ type: "record-task", taskId: task.id });',
        metric: "XP / IDEMPOTENT",
      },
    ],
  },
  {
    id: "graph",
    title: "Graph Pathfinder",
    subtitle: "Breadth-first discovery wave",
    description:
      "Advance a visible frontier through an unweighted graph and observe why first discovery gives a shortest hop route.",
    kind: "graph-search",
    icon: Network,
    labels: ["A / Start", "B", "C", "D", "E", "F / Goal"],
    lessonRoute: "/learn/python/python-breadth-first-search",
    lessonLabel: "Breadth Wave",
    steps: [
      {
        title: "Seed A",
        explanation:
          "The start enters both the queue and visited set so no edge can enqueue it again.",
        code: 'queue = deque(["A"])\nvisited = {"A"}',
        metric: "DISTANCE / 0",
      },
      {
        title: "Discover B",
        explanation:
          "B is one edge from A. Its parent becomes A at the moment it enters the queue.",
        code: 'parents["B"] = "A"\nqueue.append("B")',
        metric: "DISTANCE / 1",
      },
      {
        title: "Discover C",
        explanation:
          "C joins the same frontier layer. FIFO order keeps both distance-one nodes ahead of deeper routes.",
        code: 'parents["C"] = "A"\nqueue.append("C")',
        metric: "DISTANCE / 1",
      },
      {
        title: "Expand D",
        explanation:
          "The frontier advances to distance two without duplicating a node already discovered from another branch.",
        code: 'if "D" not in visited:\n    distance["D"] = 2',
        metric: "DISTANCE / 2",
      },
      {
        title: "Expand E",
        explanation:
          "E is reached through the alternate branch but remains in the same breadth layer as D.",
        code: 'distance["E"] = distance["C"] + 1',
        metric: "DISTANCE / 2",
      },
      {
        title: "Reach F",
        explanation:
          "The first arrival at F has minimum hop count. Parent links now reconstruct A→B→D→F.",
        code: 'route = ["A", "B", "D", "F"]',
        metric: "DISTANCE / 3",
      },
    ],
  },
  {
    id: "stack",
    title: "Call-Stack Observatory",
    subtitle: "Recursive descent and unwind",
    description:
      "Watch stack frames accumulate toward a base case, then return values in the reverse order.",
    kind: "call-stack",
    icon: Boxes,
    labels: ["main()", "sum(4)", "sum(3)", "sum(2)", "sum(1)", "sum(0)"],
    lessonRoute: "/learn/python/python-recursion",
    lessonLabel: "Recursive Echoes",
    steps: [
      {
        title: "Enter main",
        explanation:
          "The caller requests a complete recursive result before it can continue.",
        code: "result = recursive_sum(4)",
        metric: "FRAMES / 1",
      },
      {
        title: "Push sum(4)",
        explanation:
          "The frame keeps n=4 and waits for the smaller result recursive_sum(3).",
        code: "return 4 + recursive_sum(3)",
        metric: "FRAMES / 2",
      },
      {
        title: "Push sum(3)",
        explanation: "Each call reduces the state and creates one pending addition.",
        code: "return 3 + recursive_sum(2)",
        metric: "FRAMES / 3",
      },
      {
        title: "Push sum(2)",
        explanation:
          "The structure repeats, but the argument proves progress toward termination.",
        code: "return 2 + recursive_sum(1)",
        metric: "FRAMES / 4",
      },
      {
        title: "Push sum(1)",
        explanation: "One final recursive edge remains before the base condition.",
        code: "return 1 + recursive_sum(0)",
        metric: "FRAMES / 5",
      },
      {
        title: "Resolve the base case",
        explanation:
          "sum(0) returns immediately. Pending frames unwind to 1, 3, 6, and finally 10.",
        code: "if n == 0:\n    return 0",
        metric: "RETURN / 10",
      },
    ],
  },
];

export default function LabPage() {
  const { state } = useProgress();
  const [experimentIndex, setExperimentIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const experiment = experiments[experimentIndex] ?? experiments[0];

  useEffect(() => {
    if (!playing || state.preferences.reducedMotion || !experiment) return;
    const interval = window.setInterval(
      () => setStep((current) => (current + 1) % experiment.steps.length),
      Math.round(1800 / speed),
    );
    return () => window.clearInterval(interval);
  }, [experiment, playing, speed, state.preferences.reducedMotion]);

  const activeStep = experiment?.steps[step] ?? experiment?.steps[0];
  const progress = experiment
    ? Math.round(((step + 1) / experiment.steps.length) * 100)
    : 0;
  const selectNode = useCallback(
    (nodeId: string) => {
      const match = /-(\d+)$/.exec(nodeId);
      const next = Number(match?.[1]);
      if (experiment && Number.isInteger(next) && experiment.steps[next]) {
        setStep(next);
        setPlaying(false);
      }
    },
    [experiment],
  );
  const sceneLabels = useMemo(() => experiment?.labels ?? [], [experiment]);

  if (!experiment || !activeStep) return null;

  const selectExperiment = (index: number) => {
    setExperimentIndex(index);
    setStep(0);
    setPlaying(false);
  };

  const moveStep = (direction: -1 | 1) => {
    setPlaying(false);
    setStep(
      (current) =>
        (current + direction + experiment.steps.length) % experiment.steps.length,
    );
  };

  return (
    <main id="main-content" className="page-shell lab-page">
      <header className="lab-hero">
        <div>
          <p className="eyebrow">NEXUS v4 / Spatial learning instrument</p>
          <h1>See code as a living system.</h1>
          <p>
            Rotate, step through, and replay three exact computational models. WebGL is
            progressive enhancement: every explanation and control remains available in
            semantic HTML.
          </p>
        </div>
        <div className="lab-hero-badge" aria-hidden="true">
          <Sparkles />
          <span>THREE.JS</span>
          <strong>3D</strong>
          <small>Adaptive renderer</small>
        </div>
      </header>

      <div className="lab-experiment-tabs" role="tablist" aria-label="3D experiments">
        {experiments.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`lab-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={index === experimentIndex}
              aria-controls="lab-experiment-panel"
              className={index === experimentIndex ? "is-selected" : ""}
              onClick={() => selectExperiment(index)}
            >
              <Icon aria-hidden="true" />
              <span>
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </span>
              <b>0{index + 1}</b>
            </button>
          );
        })}
      </div>

      <section
        id="lab-experiment-panel"
        className="lab-experiment"
        role="tabpanel"
        aria-labelledby={`lab-tab-${experiment.id}`}
      >
        <div className="lab-scene-panel">
          <div className="lab-scene-toolbar">
            <span>{experiment.title} / LIVE MODEL</span>
            <span>{activeStep.metric}</span>
          </div>
          <NexusScene
            kind={experiment.kind}
            step={step}
            labels={sceneLabels}
            visualMode={state.preferences.visualMode}
            reducedMotion={state.preferences.reducedMotion}
            ariaLabel={`${experiment.title}, step ${step + 1} of ${experiment.steps.length}: ${activeStep.title}`}
            onNodeSelect={selectNode}
          />
          <div className="lab-scene-legend">
            <span>
              <i className="is-complete" /> Processed
            </span>
            <span>
              <i className="is-active" /> Active
            </span>
            <span>
              <i /> Pending
            </span>
            <small>Drag scene / select nodes / use controls</small>
          </div>
        </div>

        <aside className="lab-control-panel">
          <div className="lab-control-heading">
            <span className="instrument-label">
              Step {String(step + 1).padStart(2, "0")} /{" "}
              {String(experiment.steps.length).padStart(2, "0")}
            </span>
            <h2>{activeStep.title}</h2>
            <p>{activeStep.explanation}</p>
          </div>
          <pre>
            <code>{activeStep.code}</code>
          </pre>
          <div
            className="lab-step-progress"
            role="progressbar"
            aria-label="Experiment step progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="lab-playback-controls">
            <button type="button" onClick={() => moveStep(-1)} aria-label="Previous step">
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              className="is-primary"
              type="button"
              aria-label={playing ? "Pause experiment" : "Play experiment"}
              aria-pressed={playing}
              disabled={state.preferences.reducedMotion}
              onClick={() => setPlaying((current) => !current)}
            >
              {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              {state.preferences.reducedMotion
                ? "Autoplay reduced"
                : playing
                  ? "Pause"
                  : "Play"}
            </button>
            <button type="button" onClick={() => moveStep(1)} aria-label="Next step">
              <ArrowRight aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(0);
                setPlaying(false);
              }}
              aria-label="Reset experiment"
            >
              <RotateCcw aria-hidden="true" />
            </button>
          </div>
          <label className="lab-speed-control" htmlFor="lab-speed">
            <span>
              <Gauge aria-hidden="true" /> Playback speed
            </span>
            <strong>{speed.toFixed(1)}×</strong>
            <input
              id="lab-speed"
              type="range"
              min="0.5"
              max="2"
              step="0.5"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
          </label>
          <Link className="lab-lesson-link" to={experiment.lessonRoute}>
            <span>
              <small>Continue in curriculum</small>
              <strong>{experiment.lessonLabel}</strong>
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </aside>
      </section>

      <section className="lab-principles">
        <header>
          <span className="section-number">MODEL CONTRACT</span>
          <h2>Exact ideas, optional depth.</h2>
        </header>
        <div>
          <article>
            <strong>01</strong>
            <h3>Deterministic models</h3>
            <p>
              Scene coordinates and state transitions come from pure, unit-tested data.
            </p>
          </article>
          <article>
            <strong>02</strong>
            <h3>Adaptive rendering</h3>
            <p>
              Pixel density, particles, visibility, and animation respond to preferences.
            </p>
          </article>
          <article>
            <strong>03</strong>
            <h3>Accessible fallback</h3>
            <p>
              Reduced motion and non-WebGL devices retain the complete learning contract.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
