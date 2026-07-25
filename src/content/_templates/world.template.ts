import type { World } from "../../types";

// Register the exported world once in the language's index.ts.
export const world: Omit<World, "lessons"> = {
  id: "unique-world-id",
  trackId: "language-id",
  order: 99,
  title: "World title",
  subtitle: "World learning promise",
  description: "Scope and narrative description.",
  landmark: "Visual landmark name",
  accent: "lime",
  status: "available",
};
