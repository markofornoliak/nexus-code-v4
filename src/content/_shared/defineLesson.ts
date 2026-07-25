import { XP_RULES } from "../../app/config/gamification";
import type { BonusTask, Lesson, LessonSection, Task, Track, World } from "../../types";

type PythonLessonInput = Omit<Lesson, "trackId" | "xpReward" | "status"> & {
  xpReward?: number;
};

export function definePythonLesson(input: PythonLessonInput): Lesson {
  return {
    ...input,
    trackId: "python",
    xpReward: input.xpReward ?? XP_RULES.lessonCompletion,
    status: "available",
  };
}

export interface CurriculumLessonSpec {
  id: string;
  title: string;
  subtitle: string;
  objectives: [string, string, string];
  conceptHeading: string;
  explanation: [string, string];
  bullets: string[];
  syntax?: string;
  example: {
    title: string;
    description: string;
    code: string;
    output?: string;
  };
  fieldNote: string;
  mistakes: [string, string, string];
  tasks: [Task, Task];
  bonusTask: BonusTask;
  durationMinutes?: number;
}

export interface CurriculumWorldSpec {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  landmark: string;
  accent: World["accent"];
  lessons: CurriculumLessonSpec[];
}

export interface CurriculumTrackInput {
  id: string;
  order: number;
  language: string;
  title: string;
  archiveName: string;
  description: string;
  difficulty?: Track["difficulty"];
  icon: string;
  accent: Track["accent"];
  execution: Track["execution"];
  worlds: CurriculumWorldSpec[];
  futureWorlds?: string[];
}

export function createCurriculumLesson(
  trackId: string,
  language: string,
  worldId: string,
  order: number,
  spec: CurriculumLessonSpec,
  prerequisite?: string,
): Lesson {
  const sections: LessonSection[] = [
    {
      type: "theory",
      block: {
        id: `${spec.id}-concept`,
        heading: spec.conceptHeading,
        paragraphs: spec.explanation,
        bullets: spec.bullets,
        ...(spec.syntax ? { syntax: spec.syntax } : {}),
      },
    },
    {
      type: "example",
      example: {
        id: `${spec.id}-example`,
        title: spec.example.title,
        description: spec.example.description,
        language,
        code: spec.example.code,
        ...(spec.example.output ? { output: spec.example.output } : {}),
      },
    },
    {
      type: "callout",
      id: `${spec.id}-field-note`,
      title: "Field protocol",
      body: spec.fieldNote,
      tone: "field-note",
    },
  ];

  return {
    id: spec.id,
    trackId,
    worldId,
    order,
    title: spec.title,
    subtitle: spec.subtitle,
    objectives: spec.objectives,
    durationMinutes: spec.durationMinutes ?? 24,
    prerequisites: prerequisite ? [prerequisite] : [],
    sections,
    commonMistakes: spec.mistakes,
    tasks: spec.tasks,
    bonusTask: spec.bonusTask,
    xpReward: XP_RULES.lessonCompletion,
    status: "available",
  };
}

export function createCurriculumTrack(input: CurriculumTrackInput): Track {
  let previousLessonId: string | undefined;
  const worlds = input.worlds.map((world, worldIndex): World => {
    const built = createCurriculumWorld(
      input.id,
      input.execution.editorLanguage,
      worldIndex + 1,
      world,
      previousLessonId,
    );
    previousLessonId = built.lessons.at(-1)?.id;
    return built;
  });

  return {
    id: input.id,
    order: input.order,
    language: input.language,
    title: input.title,
    archiveName: input.archiveName,
    description: input.description,
    difficulty: input.difficulty ?? "beginner",
    status: "available",
    icon: input.icon,
    accent: input.accent,
    execution: input.execution,
    worlds,
    ...(input.futureWorlds ? { futureWorlds: input.futureWorlds } : {}),
  };
}

export function createCurriculumWorld(
  trackId: string,
  language: string,
  order: number,
  spec: CurriculumWorldSpec,
  prerequisite?: string,
): World {
  let previousLessonId = prerequisite;
  const lessons = spec.lessons.map((lesson, lessonIndex) => {
    const built = createCurriculumLesson(
      trackId,
      language,
      spec.id,
      lessonIndex + 1,
      lesson,
      previousLessonId,
    );
    previousLessonId = built.id;
    return built;
  });

  return {
    id: spec.id,
    trackId,
    order,
    title: spec.title,
    subtitle: spec.subtitle,
    description: spec.description,
    landmark: spec.landmark,
    accent: spec.accent,
    status: "available",
    lessons,
  };
}

/**
 * Appends a typed curriculum sector without rebuilding an existing track.
 * The first new fragment is linked to the previous final fragment, preserving
 * the linear unlock contract and every existing progress identifier.
 */
export function appendCurriculumWorld(track: Track, spec: CurriculumWorldSpec): Track {
  const previousLessonId = track.worlds.at(-1)?.lessons.at(-1)?.id;
  const world = createCurriculumWorld(
    track.id,
    track.execution.editorLanguage,
    track.worlds.length + 1,
    spec,
    previousLessonId,
  );

  return {
    ...track,
    worlds: [...track.worlds, world],
  };
}
