import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-arithmetic",
  worldId: "signal-awakening",
  order: 5,
  title: "Energy Calculus",
  subtitle: "Transform numeric signals with expressions",
  objectives: [
    "Use arithmetic operators correctly",
    "Predict precedence and use parentheses",
    "Apply floor division, remainder, and exponentiation",
  ],
  durationMinutes: 22,
  prerequisites: ["python-input"],
  sections: [
    {
      type: "theory",
      block: {
        id: "operators",
        heading: "Operators build numeric expressions",
        paragraphs: [
          "Python supports addition (+), subtraction (-), multiplication (*), true division (/), floor division (//), remainder (%), and exponentiation (**). An expression is evaluated to produce a value.",
          "True division always returns a float. Floor division removes the fractional part by rounding down, while remainder reports what is left after division into whole groups.",
        ],
        bullets: ["17 // 5 is 3", "17 % 5 is 2", "2 ** 4 is 16"],
      },
    },
    {
      type: "theory",
      block: {
        id: "precedence",
        heading: "Precedence controls evaluation order",
        paragraphs: [
          "Exponentiation occurs before multiplication and division; multiplication and division occur before addition and subtraction. Operators of equal precedence usually evaluate left to right.",
          "Parentheses make the intended order explicit. Prefer clarity over relying on a reader to remember every precedence rule.",
        ],
        syntax: "raw = 8 + 4 * 3       # 20\ncontrolled = (8 + 4) * 3  # 36",
      },
    },
    {
      type: "example",
      example: {
        id: "energy-allocation",
        title: "Cell allocation",
        description: "Division and remainder separate full cells from excess units.",
        language: "python",
        code: "energy = 53\ncell_capacity = 10\nprint(energy // cell_capacity)\nprint(energy % cell_capacity)",
        output: "5\n3",
      },
    },
  ],
  commonMistakes: [
    "Using ^ for powers; in Python exponentiation is **.",
    "Expecting / to return an integer when division is exact.",
    "Omitting parentheses in an expression whose intended grouping is not obvious.",
  ],
  tasks: [
    {
      id: "arithmetic-cell-allocation",
      title: "Allocate signal cells",
      description:
        "For 68 energy units and cells holding 9 units, print the number of full cells and leftover units on separate lines.",
      expectedBehavior: "The console prints 7, then 5.",
      starterCode: "energy = 68\ncapacity = 9\n# Print full cells, then remainder\n",
      hints: ["Use // for full groups and % for the remainder."],
      validation: { mode: "trimmed-exact", expected: "7\n5" },
    },
    {
      id: "arithmetic-precedence",
      title: "Stabilize the expression",
      description: "Calculate (12 + 8) * 3 - 10 and print the result.",
      expectedBehavior: "The console prints 50.",
      starterCode: "# Preserve the requested grouping\nresult = 0\nprint(result)",
      hints: ["Place 12 + 8 inside parentheses before multiplying."],
      validation: { mode: "trimmed-exact", expected: "50" },
    },
  ],
  bonusTask: {
    id: "arithmetic-bonus",
    title: "Convert archive time",
    description:
      "Given total_seconds = 3672, print full hours, remaining full minutes, and final seconds on separate lines.",
    expectedBehavior: "The output is 1, then 1, then 12.",
    starterCode: "total_seconds = 3672\n# Derive hours, minutes, and seconds\n",
    hints: ["Use // 3600 for hours. Apply % 3600 before calculating remaining minutes."],
    validation: { mode: "trimmed-exact", expected: "1\n1\n12" },
    discoveryText: "The restored clock aligns with the archive's internal rhythm.",
  },
});
