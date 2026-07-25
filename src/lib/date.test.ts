import { sanitizeStreak, updateStreak } from "./date";

describe("daily streak", () => {
  it("counts only once per local date", () => {
    const first = updateStreak(
      { lastActiveDate: null, currentStreak: 0, longestStreak: 0, countedToday: false },
      "2026-07-20",
    );
    const repeated = updateStreak(first, "2026-07-20");
    expect(repeated.currentStreak).toBe(1);
    expect(repeated.countedToday).toBe(true);
  });

  it("increments on consecutive dates and resets after a missed date", () => {
    const state = {
      lastActiveDate: "2026-07-20",
      currentStreak: 4,
      longestStreak: 4,
      countedToday: true,
    };
    expect(updateStreak(state, "2026-07-21").currentStreak).toBe(5);
    const missed = updateStreak(state, "2026-07-23");
    expect(missed.currentStreak).toBe(1);
    expect(missed.longestStreak).toBe(4);
  });

  it("repairs corrupted streak values", () => {
    expect(
      sanitizeStreak({
        lastActiveDate: "not-a-date",
        currentStreak: -9,
        longestStreak: -2,
        countedToday: true,
      }),
    ).toEqual({
      lastActiveDate: null,
      currentStreak: 0,
      longestStreak: 0,
      countedToday: false,
    });
  });
});
