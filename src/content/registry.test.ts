import {
  getAdjacentLessons,
  getLesson,
  getOrderedLessons,
  getTrack,
  tracks,
} from "./registry";

describe("content registry", () => {
  it("discovers all five language modules", () => {
    expect(tracks.map((track) => track.id)).toEqual([
      "python",
      "javascript",
      "html-css",
      "java",
      "cpp",
    ]);
  });

  it("assembles the expanded one-hundred-lesson catalog", () => {
    const python = getTrack("python");
    expect(python?.worlds).toHaveLength(9);
    expect(python && getOrderedLessons(python)).toHaveLength(45);
    expect(python?.worlds.every((world) => world.lessons.length === 5)).toBe(true);
    expect(
      tracks.reduce((total, track) => total + getOrderedLessons(track).length, 0),
    ).toBe(100);
    expect(tracks.reduce((total, track) => total + track.worlds.length, 0)).toBe(20);
    expect(python?.worlds.at(-1)?.id).toBe("automation-forge");
    expect(tracks.every((track) => track.status === "available")).toBe(true);
  });

  it("looks up lessons and adjacency without route-specific switches", () => {
    const entry = getLesson("python", "python-variables");
    expect(entry?.world.id).toBe("signal-awakening");
    expect(entry?.lesson.title).toBe("Signal Vessels");
    const adjacent = entry && getAdjacentLessons(entry.track, entry.lesson.id);
    expect(adjacent?.previous?.id).toBe("python-first-signal");
    expect(adjacent?.next?.id).toBe("python-strings");
  });

  it("keeps every content and task identifier globally unique", () => {
    const lessons = tracks.flatMap(getOrderedLessons);
    const lessonIds = lessons.map((lesson) => lesson.id);
    const taskIds = lessons.flatMap((lesson) => [
      ...lesson.tasks.map((task) => task.id),
      lesson.bonusTask.id,
    ]);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
    expect(new Set(taskIds).size).toBe(taskIds.length);
    expect(lessons.every((lesson) => lesson.tasks.length === 2)).toBe(true);
  });

  it("ships valid runtime metadata and compilable validation patterns", () => {
    expect(tracks.map((track) => track.execution.kind)).toEqual([
      "python",
      "javascript",
      "web-preview",
      "static",
      "static",
    ]);
    for (const lesson of tracks.flatMap(getOrderedLessons)) {
      for (const task of [...lesson.tasks, lesson.bonusTask]) {
        expect(task.starterCode.length).toBeGreaterThan(0);
        const validation = task.validation;
        if (validation.mode === "regex" || validation.mode === "code-pattern") {
          expect(() => new RegExp(validation.pattern, validation.flags)).not.toThrow();
        }
      }
    }
  });
});
