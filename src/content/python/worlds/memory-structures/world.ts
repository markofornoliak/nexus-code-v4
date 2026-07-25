import type { World } from "../../../../types";

export const world: Omit<World, "lessons"> = {
  id: "memory-structures",
  trackId: "python",
  order: 3,
  title: "Memory Structures",
  subtitle: "Map the organism's internal collections",
  description:
    "Store groups of values, organize labeled records, package behavior into functions, and restore a complete scanner.",
  landmark: "The Mnemonic Atrium",
  accent: "cyan",
  status: "available",
};
