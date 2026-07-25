import { XP_RULES } from "../app/config/gamification";
import type { LevelProgress } from "../types";

export function xpRequiredForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return Math.round(XP_RULES.levelBase * safeLevel ** XP_RULES.levelGrowth);
}

export function totalXpAtLevel(level: number): number {
  let total = 0;
  for (let current = 1; current < Math.max(1, Math.floor(level)); current += 1) {
    total += xpRequiredForLevel(current);
  }
  return total;
}

export function calculateLevelProgress(totalXp: number): LevelProgress {
  const safeXp = Math.max(0, Math.floor(Number.isFinite(totalXp) ? totalXp : 0));
  let level = 1;
  let xpBeforeLevel = 0;

  while (safeXp >= xpBeforeLevel + xpRequiredForLevel(level)) {
    xpBeforeLevel += xpRequiredForLevel(level);
    level += 1;
  }

  const nextLevelXp = xpRequiredForLevel(level);
  const currentLevelXp = safeXp - xpBeforeLevel;
  return {
    level,
    currentLevelXp,
    nextLevelXp,
    percent: Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100)),
  };
}
