import type { Task, ValidationResult } from "../types";

type CustomValidator = (
  output: string,
  code: string,
) => Omit<ValidationResult, "validationMethod">;

const customValidators: Record<string, CustomValidator> = {
  "inventory-summary": (output) => {
    const normalized = normalizeOutput(output).toLowerCase();
    const requiredLines = ["relic: 2", "key: 2", "coil: 1", "total: 5"];
    const hasCount = requiredLines.every((line) => normalized.includes(line));
    const hasCategory = ["relic", "key", "coil"].every((category) =>
      normalized.includes(category),
    );
    return {
      success: hasCount && hasCategory,
      summary:
        hasCount && hasCategory
          ? "Every category count and the final total are correct."
          : "One or more category counts or the final total are incorrect.",
      expectedResult: "relic: 2, key: 2, coil: 1, and TOTAL: 5",
      actualResult: output,
      hint: "Build the total from your dictionary values, then label the printed result.",
    };
  },
  "function-used": (output, code) => {
    const definesFunction = /\bdef\s+[a-zA-Z_]\w*\s*\(/.test(code);
    const hasOutput = normalizeOutput(output).trim() === "prism / 88u";
    return {
      success: definesFunction && hasOutput,
      summary:
        definesFunction && hasOutput
          ? "A reusable function generated a visible signal."
          : "Define a function and call it so that it prints a result.",
      expectedResult: "A function definition and non-empty output",
      actualResult: output,
      hint: "After the def block, call the function by name.",
    };
  },
};

export function normalizeOutput(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}

function compareCase(value: string, caseSensitive = true): string {
  return caseSensitive ? value : value.toLocaleLowerCase();
}

function result(
  success: boolean,
  summary: string,
  expectedResult: string,
  actualResult: string,
  validationMethod: string,
  hint?: string,
): ValidationResult {
  return {
    success,
    summary,
    expectedResult,
    actualResult,
    validationMethod,
    ...(hint ? { hint } : {}),
  };
}

export function validateTask(
  task: Task,
  rawOutput: string,
  code: string,
): ValidationResult {
  const output = normalizeOutput(rawOutput);
  const validation = task.validation;

  switch (validation.mode) {
    case "exact": {
      const actual = compareCase(output, validation.caseSensitive);
      const expected = compareCase(
        normalizeOutput(validation.expected),
        validation.caseSensitive,
      );
      return result(
        actual === expected,
        actual === expected
          ? "Exact transmission recovered."
          : "Output differs from the expected transmission.",
        validation.expected,
        output,
        "Exact output",
        task.hints[0],
      );
    }
    case "trimmed-exact": {
      const actual = compareCase(output.trim(), validation.caseSensitive);
      const expected = compareCase(
        normalizeOutput(validation.expected).trim(),
        validation.caseSensitive,
      );
      return result(
        actual === expected,
        actual === expected
          ? "Signal matches after whitespace normalization."
          : "The visible text does not match yet.",
        validation.expected,
        output,
        "Trimmed exact output",
        task.hints[0],
      );
    }
    case "contains": {
      const actual = compareCase(output, validation.caseSensitive);
      const expected = compareCase(validation.expected, validation.caseSensitive);
      return result(
        actual.includes(expected),
        actual.includes(expected)
          ? "Required fragment detected."
          : "Required text is missing from the output.",
        `Output containing: ${validation.expected}`,
        output,
        "Contains text",
        task.hints[0],
      );
    }
    case "regex": {
      const matches = new RegExp(validation.pattern, validation.flags).test(
        output.trim(),
      );
      return result(
        matches,
        matches ? "Output structure accepted." : "Output structure is not recognized.",
        `Pattern: /${validation.pattern}/${validation.flags ?? ""}`,
        output,
        "Regular expression",
        task.hints[0],
      );
    }
    case "one-of": {
      const actualBase = validation.trim ? output.trim() : output;
      const actual = compareCase(actualBase, validation.caseSensitive);
      const success = validation.expected.some((candidate) => {
        const normalized = validation.trim
          ? normalizeOutput(candidate).trim()
          : normalizeOutput(candidate);
        return compareCase(normalized, validation.caseSensitive) === actual;
      });
      return result(
        success,
        success
          ? "Accepted transmission variant detected."
          : "Output is not one of the accepted variants.",
        validation.expected.join(" OR "),
        output,
        "Multiple acceptable outputs",
        task.hints[0],
      );
    }
    case "code-pattern": {
      const hasPattern = new RegExp(validation.pattern, validation.flags).test(code);
      const outputMatches =
        validation.output === undefined ||
        output.trim() === normalizeOutput(validation.output).trim();
      return result(
        hasPattern && outputMatches,
        hasPattern && outputMatches
          ? "Required code structure and output recovered."
          : "The solution must use the requested source structure.",
        validation.output ?? `Code matching /${validation.pattern}/`,
        output,
        "Code pattern check",
        task.hints[0],
      );
    }
    case "custom": {
      const validator = customValidators[validation.validatorId];
      if (!validator) {
        return result(
          false,
          "This validation strategy is unavailable.",
          validation.expectedDescription,
          output,
          `Custom: ${validation.validatorId}`,
        );
      }
      return {
        ...validator(output, code),
        validationMethod: `Custom: ${validation.validatorId}`,
      };
    }
  }
}
