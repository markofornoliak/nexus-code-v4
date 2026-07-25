import { lessonCatalog, searchLessonCatalog } from "./catalogSearch";

describe("lesson catalog search", () => {
  it("indexes every lesson across all five tracks", () => {
    expect(lessonCatalog).toHaveLength(90);
    expect(new Set(lessonCatalog.map((entry) => entry.id)).size).toBe(90);
  });

  it("ranks lesson titles and concept text without case sensitivity", () => {
    expect(searchLessonCatalog("GENERATOR")[0]?.lesson.id).toBe(
      "python-iterators-generators",
    );
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
