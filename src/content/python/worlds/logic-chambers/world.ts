import type { World } from "../../../../types";

export const world: Omit<World, "lessons"> = {
  id: "logic-chambers",
  trackId: "python",
  order: 2,
  title: "Logic Chambers",
  subtitle: "Restore the archive's decision pathways",
  description:
    "Compare signals, combine truth values, branch through decisions, and repeat controlled processes.",
  landmark: "The Reasoning Lens",
  accent: "amber",
  status: "available",
};
