import type { World } from "../../../../types";

export const world: Omit<World, "lessons"> = {
  id: "signal-awakening",
  trackId: "python",
  order: 1,
  title: "Signal Awakening",
  subtitle: "Teach the dormant archive to speak",
  description:
    "Recover Python's basic syntax, values, text, input channels, and arithmetic signals.",
  landmark: "The Pulse Orrery",
  accent: "lime",
  status: "available",
};
