import { achievements } from "../../content/achievements";
import { getOrderedLessons, tracks } from "../../content/registry";
import type {
  Achievement,
  AchievementCondition,
  ActivityDay,
  Lesson,
  Track,
  TrackProgress,
  UserProgress,
  WeeklyGoalProgress,
  WorldProgress,
} from "../../types";

export interface ContinueLessonSelection {
  track: Track;
  lesson: Lesson;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  percent: number;
  rewardLabel: string;
}

export function completedTaskCount(progress: UserProgress): number {
  return Object.values(progress.lessons).reduce(
    (total, lesson) => total + lesson.completedTaskIds.length,
    0,
  );
}

export function completedBonusCount(progress: UserProgress): number {
  return Object.values(progress.lessons).reduce(
    (total, lesson) => total + lesson.completedBonusTaskIds.length,
    0,
  );
}

export function completedLessonCount(progress: UserProgress): number {
  return Object.values(progress.lessons).filter((lesson) => lesson.isCompleted).length;
}

export function selectWorldProgress(
  track: Track,
  worldId: string,
  progress: UserProgress,
): WorldProgress {
  const world = track.worlds.find((candidate) => candidate.id === worldId);
  const totalLessons =
    world?.lessons.filter((lesson) => lesson.status === "available").length ?? 0;
  const completedLessons =
    world?.lessons.filter((lesson) => progress.lessons[lesson.id]?.isCompleted).length ??
    0;
  const percent =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  return {
    worldId,
    completedLessons,
    totalLessons,
    percent,
    isCompleted: totalLessons > 0 && completedLessons === totalLessons,
  };
}

export function selectTrackProgress(track: Track, progress: UserProgress): TrackProgress {
  const worlds = track.worlds.map((world) =>
    selectWorldProgress(track, world.id, progress),
  );
  const totalLessons = getOrderedLessons(track).filter(
    (lesson) => lesson.status === "available",
  ).length;
  const completedLessons = getOrderedLessons(track).filter(
    (lesson) => progress.lessons[lesson.id]?.isCompleted,
  ).length;
  return {
    trackId: track.id,
    completedLessons,
    totalLessons,
    percent: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
    isCompleted: totalLessons > 0 && completedLessons === totalLessons,
    worlds,
  };
}

function conditionMet(condition: AchievementCondition, progress: UserProgress): boolean {
  switch (condition.type) {
    case "task-count":
      return completedTaskCount(progress) >= condition.count;
    case "lesson-count":
      return completedLessonCount(progress) >= condition.count;
    case "bonus-count":
      return completedBonusCount(progress) >= condition.count;
    case "total-xp":
      return progress.totalXp >= condition.amount;
    case "streak":
      return progress.streak.currentStreak >= condition.days;
    case "lesson-completed":
      return progress.lessons[condition.lessonId]?.isCompleted === true;
    case "world-completed": {
      const track = tracks.find((candidate) => candidate.id === condition.trackId);
      return track
        ? selectWorldProgress(track, condition.worldId, progress).isCompleted
        : false;
    }
    case "track-completed": {
      const track = tracks.find((candidate) => candidate.id === condition.trackId);
      return track ? selectTrackProgress(track, progress).isCompleted : false;
    }
  }
}

export function newlyUnlockedAchievements(
  progress: UserProgress,
  catalog: Achievement[] = achievements,
): Achievement[] {
  const unlocked = new Set(progress.unlockedAchievementIds);
  return catalog.filter(
    (achievement) =>
      !unlocked.has(achievement.id) && conditionMet(achievement.condition, progress),
  );
}

export function isLessonUnlocked(
  track: Track,
  lessonId: string,
  progress: UserProgress,
): boolean {
  const ordered = getOrderedLessons(track);
  const index = ordered.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) return index === 0;
  const previous = ordered[index - 1];
  return previous ? progress.lessons[previous.id]?.isCompleted === true : false;
}

export function selectContinueLesson(
  progress: UserProgress,
): ContinueLessonSelection | undefined {
  const recentIds = Object.values(progress.lessons)
    .slice()
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .map((lesson) => lesson.lessonId);

  for (const lessonId of recentIds) {
    for (const track of tracks) {
      if (track.status !== "available") continue;
      const lesson = getOrderedLessons(track).find(
        (candidate) =>
          candidate.id === lessonId &&
          candidate.status === "available" &&
          !progress.lessons[candidate.id]?.isCompleted &&
          isLessonUnlocked(track, candidate.id, progress),
      );
      if (lesson) return { track, lesson };
    }
  }

  for (const track of tracks) {
    if (track.status !== "available") continue;
    const lesson = getOrderedLessons(track).find(
      (candidate) =>
        candidate.status === "available" &&
        !progress.lessons[candidate.id]?.isCompleted &&
        isLessonUnlocked(track, candidate.id, progress),
    );
    if (lesson) return { track, lesson };
  }
  return undefined;
}

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function selectDailyMissions(
  progress: UserProgress,
  now = new Date(),
): DailyMission[] {
  const today = localDateKey(now);
  const todaysActivity = progress.activity.filter((item) => {
    const occurredAt = new Date(item.occurredAt);
    return !Number.isNaN(occurredAt.getTime()) && localDateKey(occurredAt) === today;
  });
  const taskCount = todaysActivity.filter((item) => item.type === "task").length;
  const lessonCount = todaysActivity.filter((item) => item.type === "lesson").length;
  const bonusCount = todaysActivity.filter((item) => item.type === "bonus").length;
  const signal = todaysActivity.reduce((total, item) => total + item.xp, 0);
  const mission = (
    id: string,
    title: string,
    description: string,
    current: number,
    target: number,
    rewardLabel: string,
  ): DailyMission => ({
    id,
    title,
    description,
    current,
    target,
    percent: Math.min(100, Math.round((current / target) * 100)),
    rewardLabel,
  });
  return [
    mission(
      "daily-tasks",
      "Stabilize three signals",
      "Complete three standard practice transmissions.",
      taskCount,
      3,
      "Precision",
    ),
    mission(
      "daily-fragment",
      "Restore one fragment",
      "Finish every standard task in one lesson.",
      lessonCount,
      1,
      "Continuity",
    ),
    mission(
      "daily-bonus",
      "Open a hidden channel",
      "Recover one optional bonus transmission.",
      bonusCount,
      1,
      "Discovery",
    ),
    mission(
      "daily-signal",
      "Conduct 150 signal",
      "Recover 150 Signal Energy from verified work.",
      signal,
      150,
      "Momentum",
    ),
  ];
}

export function selectActivityDays(
  progress: UserProgress,
  days = 14,
  now = new Date(),
): ActivityDay[] {
  const safeDays = Math.max(1, Math.min(90, Math.floor(days)));
  const counts = new Map<string, number>();
  for (const item of progress.activity) {
    const parsed = new Date(item.occurredAt);
    if (Number.isNaN(parsed.getTime())) continue;
    const key = localDateKey(parsed);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from({ length: safeDays }, (_, index) => {
    const date = new Date(now);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (safeDays - index - 1));
    const key = localDateKey(date);
    const count = counts.get(key) ?? 0;
    const intensity: ActivityDay["intensity"] =
      count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;
    return { date: key, count, intensity };
  });
}

export function selectWeeklyGoalProgress(
  progress: UserProgress,
  target: number,
  now = new Date(),
): WeeklyGoalProgress {
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
  const completed = Object.values(progress.lessons).filter((lesson) => {
    if (!lesson.isCompleted || !lesson.completedAt) return false;
    const completedAt = new Date(lesson.completedAt);
    return !Number.isNaN(completedAt.getTime()) && completedAt >= weekStart;
  }).length;
  const safeTarget = Math.max(1, Math.min(14, Math.round(target)));
  return {
    completed,
    target: safeTarget,
    percent: Math.min(100, Math.round((completed / safeTarget) * 100)),
    weekStartsAt: localDateKey(weekStart),
  };
}

export function selectRecoveryQueue(
  progress: UserProgress,
  limit = 4,
): ContinueLessonSelection[] {
  const queue: ContinueLessonSelection[] = [];
  const current = selectContinueLesson(progress);
  if (current) queue.push(current);

  for (const track of tracks) {
    if (track.status !== "available") continue;
    const lesson = getOrderedLessons(track).find(
      (candidate) =>
        candidate.status === "available" &&
        !progress.lessons[candidate.id]?.isCompleted &&
        isLessonUnlocked(track, candidate.id, progress),
    );
    if (
      lesson &&
      !queue.some(
        (selection) =>
          selection.track.id === track.id && selection.lesson.id === lesson.id,
      )
    ) {
      queue.push({ track, lesson });
    }
  }

  return queue.slice(0, Math.max(1, Math.min(10, Math.floor(limit))));
}
