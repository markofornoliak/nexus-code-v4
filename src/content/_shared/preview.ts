import { XP_RULES } from "../../app/config/gamification";
import type { Lesson, Track, World } from "../../types";

interface PreviewTrackInput {
  id: string;
  order: number;
  language: string;
  title: string;
  archiveName: string;
  description: string;
  icon: string;
  accent: Track["accent"];
  lessonTitles: [string, string];
  concepts: [string, string];
  futureWorlds: string[];
  execution?: Track["execution"];
}

function previewLesson(
  trackId: string,
  worldId: string,
  order: number,
  title: string,
  concept: string,
): Lesson {
  return {
    id: `${trackId}-preview-${order}`,
    trackId,
    worldId,
    order,
    title,
    subtitle: `Preview fragment: ${concept}`,
    objectives: [
      `Recognize the role of ${concept}`,
      "Inspect the future expedition format",
    ],
    durationMinutes: 6,
    prerequisites: [],
    sections: [
      {
        type: "theory",
        block: {
          id: "preview-field-note",
          heading: "Recovered field note",
          paragraphs: [
            `This preview introduces ${concept} and shows how the ${trackId} expedition will organize theory, examples, and practice.`,
            "Interactive execution and progression will activate when this archive sector is fully restored.",
          ],
          tone: "field-note",
        },
      },
      {
        type: "example",
        example: {
          id: "preview-example",
          title: "Specimen",
          description: "A small syntax sample preserved for inspection.",
          language: trackId,
          code: previewCode[trackId] ?? `// ${concept}`,
        },
      },
    ],
    commonMistakes: [
      "Trying to run a preview fragment before its execution engine is available.",
    ],
    tasks: [],
    bonusTask: {
      id: `${trackId}-preview-bonus`,
      title: "Sealed specimen",
      description: "This task unlocks with the full expedition.",
      expectedBehavior: "Preview only",
      starterCode: "",
      hints: ["Return when this archive sector is restored."],
      validation: { mode: "contains", expected: "" },
      discoveryText: "A future relic signature is present.",
    },
    xpReward: XP_RULES.lessonCompletion,
    status: "preview",
  };
}

const previewCode: Record<string, string> = {
  javascript: `const signal = "online";\nconsole.log(\`Archive: \${signal}\`);`,
  "html-css": `<article class="relic">\n  <h1>Recovered fragment</h1>\n</article>`,
  java: `String signal = "online";\nSystem.out.println(signal);`,
  cpp: `std::string signal = "online";\nstd::cout << signal;`,
};

export function createPreviewTrack(input: PreviewTrackInput): Track {
  const worldId = `${input.id}-threshold`;
  const concepts = input.concepts;
  const world: World = {
    id: worldId,
    trackId: input.id,
    order: 1,
    title: "Threshold Chamber",
    subtitle: "A controlled preview of a sealed expedition",
    description: `Two fragments from the future ${input.language} curriculum are available for inspection.`,
    landmark: "Dormant Interface Gate",
    accent: input.accent === "coral" ? "amber" : input.accent,
    status: "preview",
    lessons: input.lessonTitles.map((title, index) =>
      previewLesson(
        input.id,
        worldId,
        index + 1,
        title,
        concepts[index] ?? "programming foundations",
      ),
    ),
  };

  return {
    id: input.id,
    order: input.order,
    language: input.language,
    title: input.title,
    archiveName: input.archiveName,
    description: input.description,
    difficulty: "beginner",
    status: "preview",
    icon: input.icon,
    accent: input.accent,
    execution:
      input.execution ??
      ({
        kind: "static",
        editorLanguage: input.id === "cpp" ? "cpp" : input.id,
        fileExtension: "txt",
        supportsStdin: false,
        actionLabel: "Analyze structure",
        runtimeLabel: "Static analyzer",
      } as Track["execution"]),
    worlds: [world],
    futureWorlds: input.futureWorlds,
  };
}
