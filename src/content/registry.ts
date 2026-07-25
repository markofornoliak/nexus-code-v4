import type { Lesson, Track, World } from "../types";

interface TrackModule {
  track: Track;
}

const modules = import.meta.glob<TrackModule>("./*/index.ts", {
  eager: true,
});

export const tracks: Track[] = Object.values(modules)
  .map((module) => module.track)
  .filter((track): track is Track => Boolean(track?.id))
  .sort((left, right) => left.order - right.order);

export function getTrack(trackId: string): Track | undefined {
  return tracks.find((track) => track.id === trackId);
}

export function getWorld(trackId: string, worldId: string): World | undefined {
  return getTrack(trackId)?.worlds.find((world) => world.id === worldId);
}

export function getLesson(
  trackId: string,
  lessonId: string,
): { track: Track; world: World; lesson: Lesson } | undefined {
  const track = getTrack(trackId);
  if (!track) return undefined;

  for (const world of track.worlds) {
    const lesson = world.lessons.find((candidate) => candidate.id === lessonId);
    if (lesson) return { track, world, lesson };
  }
  return undefined;
}

export function getOrderedLessons(track: Track): Lesson[] {
  return track.worlds
    .slice()
    .sort((left, right) => left.order - right.order)
    .flatMap((world) =>
      world.lessons.slice().sort((left, right) => left.order - right.order),
    );
}

export function getAdjacentLessons(
  track: Track,
  lessonId: string,
): { previous?: Lesson; next?: Lesson } {
  const lessons = getOrderedLessons(track);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return {};
  return {
    ...(index > 0 ? { previous: lessons[index - 1] } : {}),
    ...(index < lessons.length - 1 ? { next: lessons[index + 1] } : {}),
  };
}
