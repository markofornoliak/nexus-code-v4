import { defaultProgress } from "../../services/storage/schema";
import { selectDailyMissions } from "./progressSelectors";

describe("daily mission selector", () => {
  it("counts only local activity from the selected day", () => {
    const progress = structuredClone(defaultProgress);
    progress.activity = [
      {
        id: "task-today",
        type: "task",
        label: "Task",
        xp: 25,
        occurredAt: "2026-07-26T10:00:00.000Z",
      },
      {
        id: "lesson-today",
        type: "lesson",
        label: "Lesson",
        xp: 60,
        occurredAt: "2026-07-26T11:00:00.000Z",
      },
      {
        id: "old-task",
        type: "task",
        label: "Old task",
        xp: 25,
        occurredAt: "2026-07-20T10:00:00.000Z",
      },
    ];
    const missions = selectDailyMissions(progress, new Date("2026-07-26T15:00:00.000Z"));
    expect(missions.find((mission) => mission.id === "daily-tasks")?.current).toBe(1);
    expect(missions.find((mission) => mission.id === "daily-fragment")?.percent).toBe(
      100,
    );
    expect(missions.find((mission) => mission.id === "daily-signal")?.current).toBe(85);
  });
});
