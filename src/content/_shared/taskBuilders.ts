import type { BonusTask, Task } from "../../types";

interface TaskCopy {
  id: string;
  title: string;
  description: string;
  expectedBehavior: string;
  starterCode: string;
  hints: string[];
  defaultInput?: string;
}

export function outputTask(copy: TaskCopy, expected: string): Task {
  return {
    ...copy,
    validation: { mode: "trimmed-exact", expected },
  };
}

export function outputBonus(
  copy: TaskCopy,
  expected: string,
  discoveryText: string,
): BonusTask {
  return {
    ...outputTask(copy, expected),
    discoveryText,
  };
}

export function patternTask(copy: TaskCopy, pattern: string, flags = "i"): Task {
  return {
    ...copy,
    validation: { mode: "code-pattern", pattern, flags },
  };
}

export function patternBonus(
  copy: TaskCopy,
  pattern: string,
  discoveryText: string,
  flags = "i",
): BonusTask {
  return {
    ...patternTask(copy, pattern, flags),
    discoveryText,
  };
}
