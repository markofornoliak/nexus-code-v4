import type { StreakState } from "../types";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateKeyToOrdinal(dateKey: string): number | null {
  if (!DATE_PATTERN.test(dateKey)) return null;
  const [year, month, day] = dateKey.split("-").map(Number);
  if (year === undefined || month === undefined || day === undefined) return null;
  const utc = Date.UTC(year, month - 1, day);
  const parsed = new Date(utc);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }
  return Math.floor(utc / 86_400_000);
}

export function sanitizeStreak(value: Partial<StreakState> | undefined): StreakState {
  const lastActiveDate =
    typeof value?.lastActiveDate === "string" &&
    dateKeyToOrdinal(value.lastActiveDate) !== null
      ? value.lastActiveDate
      : null;
  const currentStreak =
    Number.isInteger(value?.currentStreak) && Number(value?.currentStreak) >= 0
      ? Number(value?.currentStreak)
      : 0;
  const longestStreak =
    Number.isInteger(value?.longestStreak) && Number(value?.longestStreak) >= 0
      ? Math.max(Number(value?.longestStreak), currentStreak)
      : currentStreak;
  return { lastActiveDate, currentStreak, longestStreak, countedToday: false };
}

export function updateStreak(
  current: StreakState,
  activeDateKey = toLocalDateKey(),
): StreakState {
  const safe = sanitizeStreak(current);
  const todayOrdinal = dateKeyToOrdinal(activeDateKey);
  const previousOrdinal = safe.lastActiveDate
    ? dateKeyToOrdinal(safe.lastActiveDate)
    : null;

  if (todayOrdinal === null) return safe;
  if (previousOrdinal === todayOrdinal) {
    return { ...safe, countedToday: true };
  }

  const nextStreak =
    previousOrdinal !== null && todayOrdinal - previousOrdinal === 1
      ? safe.currentStreak + 1
      : 1;

  return {
    lastActiveDate: activeDateKey,
    currentStreak: nextStreak,
    longestStreak: Math.max(safe.longestStreak, nextStreak),
    countedToday: true,
  };
}
