import { getLesson } from "../../content/registry";
import { defaultStoredState } from "../../services/storage/schema";
import { progressReducer } from "./progressReducer";

const entry = getLesson("python", "python-first-signal");
if (!entry) throw new Error("Fixture lesson missing.");
const [firstTask, secondTask] = entry.lesson.tasks;
if (!firstTask || !secondTask) throw new Error("Fixture tasks missing.");

describe("progress reducer", () => {
  it("awards task XP only once", () => {
    const action = {
      type: "record-task" as const,
      lesson: entry.lesson,
      taskId: firstTask.id,
      label: firstTask.title,
      bonus: false,
      now: new Date("2026-07-20T10:00:00"),
    };
    const once = progressReducer(structuredClone(defaultStoredState), action);
    const twice = progressReducer(once, action);
    expect(once.progress.totalXp).toBe(25);
    expect(twice.progress.totalXp).toBe(25);
    expect(twice.progress.lessons[entry.lesson.id]?.completedTaskIds).toEqual([
      firstTask.id,
    ]);
  });

  it("prevents lesson completion until every standard task is done", () => {
    const initial = structuredClone(defaultStoredState);
    const incomplete = progressReducer(initial, {
      type: "complete-lesson",
      lesson: entry.lesson,
    });
    expect(incomplete.progress.totalXp).toBe(0);

    const afterFirst = progressReducer(initial, {
      type: "record-task",
      lesson: entry.lesson,
      taskId: firstTask.id,
      label: firstTask.title,
      bonus: false,
    });
    const afterSecond = progressReducer(afterFirst, {
      type: "record-task",
      lesson: entry.lesson,
      taskId: secondTask.id,
      label: secondTask.title,
      bonus: false,
    });
    const complete = progressReducer(afterSecond, {
      type: "complete-lesson",
      lesson: entry.lesson,
    });
    const duplicate = progressReducer(complete, {
      type: "complete-lesson",
      lesson: entry.lesson,
    });
    expect(complete.progress.lessons[entry.lesson.id]?.isCompleted).toBe(true);
    expect(complete.progress.totalXp).toBe(110);
    expect(duplicate.progress.totalXp).toBe(110);
  });

  it("autosaves and clears bounded task drafts without changing XP", () => {
    const saved = progressReducer(structuredClone(defaultStoredState), {
      type: "save-draft",
      taskId: firstTask.id,
      code: "print('draft')",
      stdin: "NX",
      now: new Date("2026-07-25T12:00:00.000Z"),
    });
    expect(saved.drafts[firstTask.id]).toEqual({
      code: "print('draft')",
      stdin: "NX",
      updatedAt: "2026-07-25T12:00:00.000Z",
    });
    expect(saved.progress.totalXp).toBe(0);
    const cleared = progressReducer(saved, {
      type: "clear-draft",
      taskId: firstTask.id,
    });
    expect(cleared.drafts[firstTask.id]).toBeUndefined();
  });

  it("stores v5 bookmarks, visual mode, and a bounded weekly goal", () => {
    const bookmarked = progressReducer(structuredClone(defaultStoredState), {
      type: "toggle-bookmark",
      lessonId: entry.lesson.id,
    });
    expect(bookmarked.bookmarkedLessonIds).toEqual([entry.lesson.id]);
    const removed = progressReducer(bookmarked, {
      type: "toggle-bookmark",
      lessonId: entry.lesson.id,
    });
    expect(removed.bookmarkedLessonIds).toEqual([]);

    const themed = progressReducer(removed, {
      type: "set-theme",
      theme: "night-observatory",
    });
    const spatial = progressReducer(themed, {
      type: "set-visual-mode",
      visualMode: "immersive",
    });
    const planned = progressReducer(spatial, {
      type: "set-weekly-lesson-goal",
      goal: 80,
    });
    expect(planned.preferences.theme).toBe("night-observatory");
    expect(planned.preferences.visualMode).toBe("immersive");
    expect(planned.preferences.weeklyLessonGoal).toBe(14);
  });
});
