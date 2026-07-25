import { defaultStoredState, STORAGE_KEY } from "./schema";
import {
  exportStoredState,
  importStoredState,
  loadStoredState,
  saveStoredState,
} from "./storage";

describe("versioned local storage", () => {
  it("serializes and loads validated state", () => {
    const state = structuredClone(defaultStoredState);
    state.progress.totalXp = 275;
    expect(saveStoredState(state)).toBe(true);
    expect(loadStoredState().state.progress.totalXp).toBe(275);
  });

  it("recovers from corrupted JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{broken");
    const loaded = loadStoredState();
    expect(loaded.recoveredFromCorruption).toBe(true);
    expect(loaded.state.progress.totalXp).toBe(0);
  });

  it("validates progress imports and rejects executable-shaped junk", () => {
    const serialized = exportStoredState(defaultStoredState);
    expect(importStoredState(serialized)?.version).toBe(5);
    expect(importStoredState('{"version":2,"progress":"alert(1)"}')).toBeNull();
  });

  it("migrates version two progress without discarding earned XP", () => {
    const previous = {
      version: 2,
      progress: { ...defaultStoredState.progress, totalXp: 725 },
      preferences: defaultStoredState.preferences,
    };
    const migrated = importStoredState(JSON.stringify(previous));
    expect(migrated?.version).toBe(5);
    expect(migrated?.progress.totalXp).toBe(725);
    expect(migrated?.drafts).toEqual({});
    expect(migrated?.bookmarkedLessonIds).toEqual([]);
    expect(migrated?.preferences.theme).toBe("field-codex");
  });

  it("migrates version three drafts while adding planning and spatial fields", () => {
    const previous = {
      version: 3,
      progress: { ...defaultStoredState.progress, totalXp: 940 },
      preferences: {
        reducedMotion: true,
        editorFontSize: 17,
        hintsExpanded: true,
      },
      drafts: {
        "task-one": {
          code: "print('preserved')",
          stdin: "",
          updatedAt: "2026-07-24T10:00:00.000Z",
        },
      },
    };
    const migrated = importStoredState(JSON.stringify(previous));
    expect(migrated?.version).toBe(5);
    expect(migrated?.progress.totalXp).toBe(940);
    expect(migrated?.drafts["task-one"]?.code).toBe("print('preserved')");
    expect(migrated?.preferences.reducedMotion).toBe(true);
    expect(migrated?.preferences.weeklyLessonGoal).toBe(3);
    expect(migrated?.preferences.visualMode).toBe("adaptive");
    expect(migrated?.bookmarkedLessonIds).toEqual([]);
  });

  it("migrates version four state without changing progress or bookmarks", () => {
    const previous = {
      ...structuredClone(defaultStoredState),
      version: 4,
      preferences: {
        ...defaultStoredState.preferences,
        visualMode: undefined,
      },
      bookmarkedLessonIds: ["python-first-signal"],
    };
    const migrated = importStoredState(JSON.stringify(previous));
    expect(migrated?.version).toBe(5);
    expect(migrated?.preferences.visualMode).toBe("adaptive");
    expect(migrated?.bookmarkedLessonIds).toEqual(["python-first-signal"]);
  });

  it("bounds imported drafts and keeps inert text only", () => {
    const state = structuredClone(defaultStoredState);
    state.drafts["task-one"] = {
      code: "console.log('safe text')",
      stdin: "NX",
      updatedAt: "2026-07-25T10:00:00.000Z",
    };
    expect(importStoredState(exportStoredState(state))?.drafts["task-one"]?.stdin).toBe(
      "NX",
    );
  });

  it("bounds and sanitizes v5 preferences and bookmark identifiers", () => {
    const state = structuredClone(defaultStoredState);
    state.preferences.weeklyLessonGoal = 99;
    state.bookmarkedLessonIds = ["python-first-signal", "python-testing-assertions"];
    const imported = importStoredState(exportStoredState(state));
    expect(imported?.preferences.weeklyLessonGoal).toBe(14);
    expect(imported?.preferences.visualMode).toBe("adaptive");
    expect(imported?.bookmarkedLessonIds).toEqual([
      "python-first-signal",
      "python-testing-assertions",
    ]);
  });
});
