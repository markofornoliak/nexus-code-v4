export interface LearningActivity {
  id: string;
  type: "task" | "bonus" | "lesson" | "achievement";
  label: string;
  xp: number;
  occurredAt: string;
}

export interface LessonProgress {
  lessonId: string;
  completedTaskIds: string[];
  completedBonusTaskIds: string[];
  isCompleted: boolean;
  xpAwarded: number;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
}

export interface WorldProgress {
  worldId: string;
  completedLessons: number;
  totalLessons: number;
  percent: number;
  isCompleted: boolean;
}

export interface TrackProgress {
  trackId: string;
  completedLessons: number;
  totalLessons: number;
  percent: number;
  isCompleted: boolean;
  worlds: WorldProgress[];
}

export interface StreakState {
  lastActiveDate: string | null;
  currentStreak: number;
  longestStreak: number;
  countedToday: boolean;
}

export interface UserProgress {
  displayName: string;
  totalXp: number;
  lessons: Record<string, LessonProgress>;
  unlockedAchievementIds: string[];
  achievementDates: Record<string, string>;
  streak: StreakState;
  activity: LearningActivity[];
}

export interface UserPreferences {
  reducedMotion: boolean;
  editorFontSize: number;
  hintsExpanded: boolean;
  theme: "field-codex" | "night-observatory";
  visualMode: "adaptive" | "minimal" | "immersive";
  weeklyLessonGoal: number;
}

export interface TaskDraft {
  code: string;
  stdin: string;
  updatedAt: string;
}

export interface StoredApplicationState {
  version: number;
  progress: UserProgress;
  preferences: UserPreferences;
  drafts: Record<string, TaskDraft>;
  bookmarkedLessonIds: string[];
}

export interface WeeklyGoalProgress {
  completed: number;
  target: number;
  percent: number;
  weekStartsAt: string;
}

export interface ActivityDay {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface LevelProgress {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  percent: number;
}
