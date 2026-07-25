import { buildSceneModel, normalizeSceneStep } from "./sceneModel";

describe("3D learning scene model", () => {
  it("normalizes positive and negative steps", () => {
    expect(normalizeSceneStep(7, 5)).toBe(2);
    expect(normalizeSceneStep(-1, 5)).toBe(4);
    expect(normalizeSceneStep(Number.NaN, 5)).toBe(0);
  });

  it.each(["archive-core", "execution-flow", "graph-search", "call-stack"] as const)(
    "builds finite, connected %s coordinates",
    (kind) => {
      const model = buildSceneModel(kind, 2);
      expect(model.nodes.length).toBeGreaterThan(2);
      expect(model.edges.length).toBeGreaterThan(1);
      expect(
        model.nodes.every((node) =>
          node.position.every((coordinate) => Number.isFinite(coordinate)),
        ),
      ).toBe(true);
      expect(
        model.nodes.filter((node) => node.state === "active").length,
      ).toBeGreaterThan(0);
    },
  );

  it("uses supplied labels without exceeding the scene bound", () => {
    const labels = Array.from({ length: 20 }, (_, index) => `Node ${index}`);
    const model = buildSceneModel("archive-core", 0, labels);
    expect(model.nodes).toHaveLength(9);
    expect(model.nodes[1]?.label).toBe("Node 0");
  });
});
