import { getOrderedLessons, tracks } from "../content/registry";
import type { Lesson, Track, World } from "../types";

export interface CatalogEntry {
  id: string;
  track: Track;
  world: World;
  lesson: Lesson;
  searchText: string;
}

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#./ -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const lessonCatalog: CatalogEntry[] = tracks.flatMap((track) =>
  track.worlds.flatMap((world) =>
    getOrderedLessons({ ...track, worlds: [world] }).map((lesson) => ({
      id: `${track.id}:${lesson.id}`,
      track,
      world,
      lesson,
      searchText: normalize(
        [
          track.language,
          track.title,
          world.title,
          world.landmark,
          lesson.title,
          lesson.subtitle,
          ...lesson.objectives,
        ].join(" "),
      ),
    })),
  ),
);

function scoreEntry(entry: CatalogEntry, terms: string[]): number {
  const title = normalize(entry.lesson.title);
  const world = normalize(entry.world.title);
  const track = normalize(entry.track.language);
  let score = 0;

  for (const term of terms) {
    if (!entry.searchText.includes(term)) return -1;
    if (title === term) score += 100;
    else if (title.startsWith(term)) score += 45;
    else if (title.includes(term)) score += 24;
    if (world.includes(term)) score += 12;
    if (track.includes(term)) score += 10;
    score += 2;
  }

  return score;
}

export function searchLessonCatalog(
  query: string,
  options: { trackId?: string; limit?: number } = {},
): CatalogEntry[] {
  const terms = normalize(query).split(" ").filter(Boolean);
  const filtered = options.trackId
    ? lessonCatalog.filter((entry) => entry.track.id === options.trackId)
    : lessonCatalog;

  if (terms.length === 0) {
    return filtered.slice(0, options.limit ?? filtered.length);
  }

  return filtered
    .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
    .filter((result) => result.score >= 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.entry.track.order - right.entry.track.order ||
        left.entry.world.order - right.entry.world.order ||
        left.entry.lesson.order - right.entry.lesson.order,
    )
    .slice(0, options.limit ?? filtered.length)
    .map((result) => result.entry);
}
