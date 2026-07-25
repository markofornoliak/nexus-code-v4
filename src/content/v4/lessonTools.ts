import type { BonusTask, Task } from "../../types";
import {
  outputBonus,
  outputTask,
  patternBonus,
  patternTask,
} from "../_shared/taskBuilders";

interface TaskSpec {
  id: string;
  title: string;
  description: string;
  expectedBehavior: string;
  starterCode: string;
  hints: string[];
  defaultInput?: string;
}

function withOptionalInput(spec: TaskSpec): TaskSpec {
  return spec.defaultInput ? { ...spec, defaultInput: spec.defaultInput } : spec;
}

export function exactTask(spec: TaskSpec, expected: string): Task {
  return outputTask(withOptionalInput(spec), expected);
}

export function exactBonus(
  spec: TaskSpec,
  expected: string,
  discoveryText: string,
): BonusTask {
  return outputBonus(withOptionalInput(spec), expected, discoveryText);
}

export function structureTask(spec: TaskSpec, pattern: string, flags = "is"): Task {
  return patternTask(withOptionalInput(spec), pattern, flags);
}

export function structureBonus(
  spec: TaskSpec,
  pattern: string,
  discoveryText: string,
  flags = "is",
): BonusTask {
  return patternBonus(withOptionalInput(spec), pattern, discoveryText, flags);
}
