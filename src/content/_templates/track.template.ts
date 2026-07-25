import type { Track } from "../../types";

// Copy this folder, export `track` from index.ts, and the global registry discovers it.
export const track: Track = {
  id: "language-id",
  order: 99,
  language: "Language",
  title: "Expedition title",
  archiveName: "Archive sector name",
  description: "What the complete expedition teaches.",
  difficulty: "beginner",
  status: "coming-soon",
  icon: "ID",
  accent: "cyan",
  execution: {
    kind: "static",
    editorLanguage: "javascript",
    fileExtension: "txt",
    supportsStdin: false,
    actionLabel: "Analyze structure",
    runtimeLabel: "Static analyzer",
  },
  worlds: [],
  futureWorlds: ["Foundations", "Control", "Structures"],
};
