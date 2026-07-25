import type { Task } from "../types";
import { normalizeOutput, validateTask } from "./validation";

function task(validation: Task["validation"]): Task {
  return {
    id: "test-task",
    title: "Test",
    description: "Test",
    expectedBehavior: "Test",
    starterCode: "",
    hints: ["Inspect the output."],
    validation,
  };
}

describe("task validation", () => {
  it("normalizes line endings", () => {
    expect(normalizeOutput("a\r\nb\rc")).toBe("a\nb\nc");
  });

  it.each([
    [task({ mode: "exact", expected: "Alpha\n" }), "Alpha\n", "print('Alpha')"],
    [task({ mode: "trimmed-exact", expected: "Alpha" }), "  Alpha\n", ""],
    [
      task({ mode: "contains", expected: "signal", caseSensitive: false }),
      "SIGNAL online",
      "",
    ],
    [task({ mode: "regex", pattern: "^A-\\d+$" }), "A-17", ""],
    [
      task({ mode: "one-of", expected: ["yes", "y"], caseSensitive: false, trim: true }),
      " Y ",
      "",
    ],
    [
      task({ mode: "code-pattern", pattern: "for\\s+\\w+\\s+in", output: "3" }),
      "3\n",
      "for n in [3]:\n print(n)",
    ],
  ])("accepts a supported validation strategy", (candidate, output, code) => {
    expect(validateTask(candidate, output, code).success).toBe(true);
  });

  it("does not accept a clean run with the wrong output", () => {
    const result = validateTask(
      task({ mode: "trimmed-exact", expected: "42" }),
      "41",
      "print(41)",
    );
    expect(result.success).toBe(false);
    expect(result.expectedResult).toBe("42");
    expect(result.actualResult).toBe("41");
  });

  it("runs registered custom validators without executable content data", () => {
    const inventory = task({
      mode: "custom",
      validatorId: "inventory-summary",
      expectedDescription: "Category counts and total",
    });
    expect(
      validateTask(inventory, "relic: 2\nkey: 2\ncoil: 1\nTOTAL: 5\n", "print('report')")
        .success,
    ).toBe(true);
    expect(validateTask(inventory, "relic: 99\nTOTAL: 99", "").success).toBe(false);
  });
});
