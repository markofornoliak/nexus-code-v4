export type SceneKind = "archive-core" | "execution-flow" | "graph-search" | "call-stack";

export interface SceneNode {
  id: string;
  label: string;
  position: readonly [number, number, number];
  color: number;
  state: "idle" | "active" | "complete";
  scale: number;
}

export interface SceneEdge {
  id: string;
  from: string;
  to: string;
  state: "idle" | "active" | "complete";
}

export interface SceneModel {
  kind: SceneKind;
  step: number;
  stepCount: number;
  nodes: SceneNode[];
  edges: SceneEdge[];
}

const COLORS = {
  lime: 0xb7f36b,
  cyan: 0x69d6cf,
  amber: 0xefc86b,
  violet: 0xa68cf3,
  coral: 0xed8d70,
  muted: 0x476c60,
} as const;

const palette = [COLORS.lime, COLORS.amber, COLORS.cyan, COLORS.violet, COLORS.coral];

export function normalizeSceneStep(step: number, stepCount: number): number {
  if (!Number.isFinite(step) || stepCount <= 0) return 0;
  const integer = Math.floor(step);
  return ((integer % stepCount) + stepCount) % stepCount;
}

function stateFor(index: number, activeIndex: number): SceneNode["state"] {
  if (index < activeIndex) return "complete";
  return index === activeIndex ? "active" : "idle";
}

function lineEdges(nodes: SceneNode[], activeIndex: number): SceneEdge[] {
  return nodes.slice(1).map((node, index) => ({
    id: `${nodes[index]?.id ?? "origin"}-${node.id}`,
    from: nodes[index]?.id ?? node.id,
    to: node.id,
    state: index < activeIndex ? "complete" : index === activeIndex ? "active" : "idle",
  }));
}

function archiveCore(labels: string[], step: number): SceneModel {
  const orbitLabels = labels.length > 0 ? labels.slice(0, 8) : ["Python", "JS", "Web"];
  const activeIndex = normalizeSceneStep(step, orbitLabels.length);
  const nodes: SceneNode[] = [
    {
      id: "core",
      label: "NEXUS Core",
      position: [0, 0, 0],
      color: COLORS.lime,
      state: "active",
      scale: 1.5,
    },
    ...orbitLabels.map((label, index): SceneNode => {
      const angle = (index / orbitLabels.length) * Math.PI * 2 - Math.PI / 2;
      const radius = index % 2 === 0 ? 3.05 : 3.45;
      return {
        id: `orbit-${index}`,
        label,
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.64,
          Math.sin(angle * 2) * 0.72,
        ],
        color: palette[index % palette.length] ?? COLORS.lime,
        state: stateFor(index, activeIndex),
        scale: index === activeIndex ? 0.72 : 0.5,
      };
    }),
  ];
  const edges = orbitLabels.map((_, index): SceneEdge => ({
    id: `core-orbit-${index}`,
    from: "core",
    to: `orbit-${index}`,
    state: index < activeIndex ? "complete" : index === activeIndex ? "active" : "idle",
  }));
  return {
    kind: "archive-core",
    step: activeIndex,
    stepCount: orbitLabels.length,
    nodes,
    edges,
  };
}

function executionFlow(labels: string[], step: number): SceneModel {
  const stages =
    labels.length > 0
      ? labels.slice(0, 6)
      : ["Input", "Parse", "Execute", "Validate", "Persist"];
  const activeIndex = normalizeSceneStep(step, stages.length);
  const center = (stages.length - 1) / 2;
  const nodes = stages.map((label, index): SceneNode => ({
    id: `stage-${index}`,
    label,
    position: [
      (index - center) * 1.55,
      Math.sin(index * 1.35) * 0.68,
      Math.cos(index * 0.9) * 0.4,
    ],
    color: palette[index % palette.length] ?? COLORS.cyan,
    state: stateFor(index, activeIndex),
    scale: index === activeIndex ? 0.82 : 0.58,
  }));
  return {
    kind: "execution-flow",
    step: activeIndex,
    stepCount: stages.length,
    nodes,
    edges: lineEdges(nodes, activeIndex),
  };
}

function graphSearch(labels: string[], step: number): SceneModel {
  const graphLabels =
    labels.length >= 6
      ? labels.slice(0, 7)
      : ["A / Start", "B", "C", "D", "E", "F / Goal"];
  const positions: SceneNode["position"][] = [
    [-3.1, 0, 0],
    [-1.5, 1.55, 0.35],
    [-1.45, -1.4, -0.25],
    [0.35, 1.7, -0.4],
    [0.45, -1.35, 0.45],
    [2.8, 0.15, 0],
    [1.45, 2.45, 0.2],
  ];
  const activeIndex = normalizeSceneStep(step, graphLabels.length);
  const nodes = graphLabels.map((label, index): SceneNode => ({
    id: `graph-${index}`,
    label,
    position: positions[index] ?? [index - 3, 0, 0],
    color: palette[index % palette.length] ?? COLORS.violet,
    state: stateFor(index, activeIndex),
    scale: index === activeIndex ? 0.88 : 0.58,
  }));
  const edgePairs = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 5],
    [4, 5],
    [3, 6],
  ];
  const edges = edgePairs
    .filter(
      ([from, to]) => from !== undefined && to !== undefined && nodes[from] && nodes[to],
    )
    .map(([from = 0, to = 0], index): SceneEdge => ({
      id: `graph-edge-${index}`,
      from: nodes[from]?.id ?? "",
      to: nodes[to]?.id ?? "",
      state:
        from < activeIndex && to <= activeIndex
          ? "complete"
          : from === activeIndex || to === activeIndex
            ? "active"
            : "idle",
    }));
  return {
    kind: "graph-search",
    step: activeIndex,
    stepCount: graphLabels.length,
    nodes,
    edges,
  };
}

function callStack(labels: string[], step: number): SceneModel {
  const frames =
    labels.length > 0
      ? labels.slice(0, 7)
      : ["main()", "recover()", "search()", "visit()", "base case"];
  const activeIndex = normalizeSceneStep(step, frames.length);
  const nodes = frames.map((label, index): SceneNode => ({
    id: `frame-${index}`,
    label,
    position: [
      Math.sin(index * 0.75) * 0.48,
      -2.2 + index * 1.05,
      (index - frames.length / 2) * 0.28,
    ],
    color: palette[index % palette.length] ?? COLORS.amber,
    state: stateFor(index, activeIndex),
    scale: index === activeIndex ? 0.94 : 0.66,
  }));
  return {
    kind: "call-stack",
    step: activeIndex,
    stepCount: frames.length,
    nodes,
    edges: lineEdges(nodes, activeIndex),
  };
}

export function buildSceneModel(
  kind: SceneKind,
  step = 0,
  labels: string[] = [],
): SceneModel {
  switch (kind) {
    case "archive-core":
      return archiveCore(labels, step);
    case "execution-flow":
      return executionFlow(labels, step);
    case "graph-search":
      return graphSearch(labels, step);
    case "call-stack":
      return callStack(labels, step);
  }
}
