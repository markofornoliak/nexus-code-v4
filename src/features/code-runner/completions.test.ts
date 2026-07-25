import { getLanguageCompletions } from "./completions";

describe("CodeMirror learning completions", () => {
  it.each(["python", "javascript", "html", "java", "cpp"] as const)(
    "ships focused %s scaffolds",
    (language) => {
      const entries = getLanguageCompletions(language);
      expect(entries.length).toBeGreaterThanOrEqual(5);
      expect(entries.every((entry) => entry.label && entry.apply)).toBe(true);
    },
  );

  it("includes runtime-specific entry points", () => {
    expect(
      getLanguageCompletions("python").some((entry) => entry.label === "print"),
    ).toBe(true);
    expect(getLanguageCompletions("java").some((entry) => entry.label === "main")).toBe(
      true,
    );
    expect(
      getLanguageCompletions("cpp").some((entry) => entry.label === "unique_ptr"),
    ).toBe(true);
  });
});
