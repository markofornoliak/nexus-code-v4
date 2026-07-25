import {
  calculateLevelProgress,
  totalXpAtLevel,
  xpRequiredForLevel,
} from "./gamification";

describe("gamification calculations", () => {
  it("grows level thresholds predictably", () => {
    expect(xpRequiredForLevel(1)).toBe(180);
    expect(xpRequiredForLevel(2)).toBeGreaterThan(xpRequiredForLevel(1));
    expect(totalXpAtLevel(3)).toBe(xpRequiredForLevel(1) + xpRequiredForLevel(2));
  });

  it("calculates level and progress without exceeding 100 percent", () => {
    expect(calculateLevelProgress(0)).toEqual({
      level: 1,
      currentLevelXp: 0,
      nextLevelXp: 180,
      percent: 0,
    });
    const atLevelTwo = calculateLevelProgress(180);
    expect(atLevelTwo.level).toBe(2);
    expect(atLevelTwo.currentLevelXp).toBe(0);
    expect(atLevelTwo.percent).toBe(0);
  });

  it("sanitizes invalid XP", () => {
    expect(calculateLevelProgress(-100).level).toBe(1);
    expect(calculateLevelProgress(Number.NaN).currentLevelXp).toBe(0);
  });
});
