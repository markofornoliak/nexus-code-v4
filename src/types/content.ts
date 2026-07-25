export type TrackStatus = "available" | "preview" | "coming-soon";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type LessonSectionTone = "default" | "note" | "warning" | "field-note";
export type AchievementRarity = "common" | "uncommon" | "rare" | "mythic";
export type ExecutionKind = "python" | "javascript" | "web-preview" | "static";
export type EditorLanguage = "python" | "javascript" | "html" | "java" | "cpp";

export interface TrackExecution {
  kind: ExecutionKind;
  editorLanguage: EditorLanguage;
  fileExtension: string;
  supportsStdin: boolean;
  actionLabel: string;
  runtimeLabel: string;
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  output?: string;
}

export interface TheoryBlock {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  syntax?: string;
  tone?: LessonSectionTone;
}

export type LessonSection =
  | {
      type: "theory";
      block: TheoryBlock;
    }
  | {
      type: "example";
      example: CodeExample;
    }
  | {
      type: "callout";
      id: string;
      title: string;
      body: string;
      tone: Exclude<LessonSectionTone, "default">;
    };

export type TaskValidation =
  | {
      mode: "exact";
      expected: string;
      caseSensitive?: boolean;
    }
  | {
      mode: "trimmed-exact";
      expected: string;
      caseSensitive?: boolean;
    }
  | {
      mode: "regex";
      pattern: string;
      flags?: string;
    }
  | {
      mode: "contains";
      expected: string;
      caseSensitive?: boolean;
    }
  | {
      mode: "one-of";
      expected: string[];
      caseSensitive?: boolean;
      trim?: boolean;
    }
  | {
      mode: "code-pattern";
      pattern: string;
      flags?: string;
      output?: string;
    }
  | {
      mode: "custom";
      validatorId: string;
      expectedDescription: string;
    };

export interface Task {
  id: string;
  title: string;
  description: string;
  expectedBehavior: string;
  starterCode: string;
  hints: string[];
  validation: TaskValidation;
  defaultInput?: string;
}

export interface BonusTask extends Task {
  discoveryText: string;
}

export interface Lesson {
  id: string;
  trackId: string;
  worldId: string;
  order: number;
  title: string;
  subtitle: string;
  objectives: string[];
  durationMinutes: number;
  prerequisites: string[];
  sections: LessonSection[];
  commonMistakes: string[];
  tasks: Task[];
  bonusTask: BonusTask;
  xpReward: number;
  status: "available" | "preview";
}

export interface World {
  id: string;
  trackId: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  landmark: string;
  accent: "lime" | "amber" | "cyan" | "violet";
  status: "available" | "preview" | "sealed";
  lessons: Lesson[];
}

export interface Track {
  id: string;
  order: number;
  language: string;
  title: string;
  archiveName: string;
  description: string;
  difficulty: Difficulty;
  status: TrackStatus;
  icon: string;
  accent: "lime" | "amber" | "cyan" | "violet" | "coral";
  execution: TrackExecution;
  worlds: World[];
  futureWorlds?: string[];
}

export type AchievementCondition =
  | { type: "task-count"; count: number }
  | { type: "lesson-count"; count: number }
  | { type: "total-xp"; amount: number }
  | { type: "streak"; days: number }
  | { type: "bonus-count"; count: number }
  | { type: "lesson-completed"; lessonId: string }
  | { type: "world-completed"; trackId: string; worldId: string }
  | { type: "track-completed"; trackId: string };

export interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: AchievementRarity;
  icon: string;
  condition: AchievementCondition;
  discoveryText?: string;
}
