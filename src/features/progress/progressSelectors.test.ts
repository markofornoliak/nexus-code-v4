import { getOrderedLessons, getTrack } from "../../content/registry";
import { defaultProgress } from "../../services/storage/schema";
import {
  isLessonUnlocked,
  selectActivityDays,
  selectContinueLesson,
  selectRecoveryQueue,
  selectTrackProgress,
  selectWeeklyGoalProgress,
} from "./progressSelectors";

describe("progress selectors", () => {
  const python = getTrack("python");
  if (!python) throw new Error("Python fixture missing.");
  const lessons = getOrderedLessons(python);
  const first = lessons[0];
  const second = lessons[1];
  if (!first || !second) throw new Error("Lesson fixture missing.");

  it("unlocks the first fragment and locks its successor", () => {
    expect(isLessonUnlocked(python, first.id, defaultProgress)).toBe(true);
    expect(isLessonUnlocked(python, second.id, defaultProgress)).toBe(false);
  });

  it("unlocks the successor after previous completion", () => {
    const progress = structuredClone(defaultProgress);
    progress.lessons[first.id] = {
      lessonId: first.id,
      completedTaskIds: first.tasks.map((task) => task.id),
      completedBonusTaskIds: [],
      isCompleted: true,
      xpAwarded: 110,
      startedAt: "2026-07-20T10:00:00.000Z",
      completedAt: "2026-07-20T10:05:00.000Z",
      updatedAt: "2026-07-20T10:05:00.000Z",
    };
    expect(isLessonUnlocked(python, second.id, progress)).toBe(true);
    expect(selectTrackProgress(python, progress).completedLessons).toBe(1);
    expect(selectContinueLesson(progress)?.lesson.id).toBe(second.id);
  });

  it("starts a clean archive at the first Python fragment", () => {
    expect(selectContinueLesson(defaultProgress)?.lesson.id).toBe(first.id);
  });

  it("builds a deterministic recovery queue across available tracks", () => {
    const queue = selectRecoveryQueue(defaultProgress, 4);
    expect(queue).toHaveLength(4);
    expect(queue[0]?.lesson.id).toBe(first.id);
    expect(new Set(queue.map((selection) => selection.track.id)).size).toBe(4);
  });

  it("calculates weekly completion and bounded activity intensity", () => {
    const progress = structuredClone(defaultProgress);
    progress.lessons[first.id] = {
      lessonId: first.id,
      completedTaskIds: first.tasks.map((task) => task.id),
      completedBonusTaskIds: [],
      isCompleted: true,
      xpAwarded: 110,
      startedAt: "2026-07-21T08:00:00.000Z",
      completedAt: "2026-07-21T09:00:00.000Z",
      updatedAt: "2026-07-21T09:00:00.000Z",
    };
    progress.activity = [
      {
        id: "one",
        type: "task",
        label: "One",
        xp: 25,
        occurredAt: "2026-07-23T08:00:00.000Z",
      },
      {
        id: "two",
        type: "task",
        label: "Two",
        xp: 25,
        occurredAt: "2026-07-23T09:00:00.000Z",
      },
    ];
    const weekly = selectWeeklyGoalProgress(progress, 3, new Date("2026-07-24T12:00:00"));
    expect(weekly).toMatchObject({ completed: 1, target: 3, percent: 33 });
    const days = selectActivityDays(progress, 3, new Date("2026-07-24T12:00:00"));
    expect(days.map((day) => day.count)).toEqual([0, 2, 0]);
    expect(days[1]?.intensity).toBe(2);
  });
});
