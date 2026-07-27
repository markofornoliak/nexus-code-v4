import { lessonCatalog, searchLessonCatalog } from "./catalogSearch";

describe("lesson catalog search", () => {
  it("indexes every lesson across all five tracks", () => {
    expect(lessonCatalog).toHaveLength(100);
    expect(new Set(lessonCatalog.map((entry) => entry.id)).size).toBe(100);
  });

  it("ranks lesson titles and concept text without case sensitivity", () => {
    expect(
      searchLessonCatalog("GENERATOR").some(
        (result) => result.lesson.id === "python-iterators-generators",
      ),
    ).toBe(true);
    expect(
      searchLessonCatalog("responsive grid").some(
        (entry) => entry.track.id === "html-css",
      ),
    ).toBe(true);
  });

  it("applies a track filter before ranking", () => {
    const matches = searchLessonCatalog("function", {
      trackId: "javascript",
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((entry) => entry.track.id === "javascript")).toBe(true);
  });
});
