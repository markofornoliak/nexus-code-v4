import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-comparisons",
  worldId: "logic-chambers",
  order: 1,
  title: "Calibration Scales",
  subtitle: "Compare values and recover Boolean results",
  objectives: [
    "Use equality and ordering operators",
    "Distinguish assignment from equality",
    "Compare numbers and strings predictably",
  ],
  durationMinutes: 18,
  prerequisites: ["python-arithmetic"],
  sections: [
    {
      type: "theory",
      block: {
        id: "comparison-results",
        heading: "Every comparison produces True or False",
        paragraphs: [
          "Comparison operators ask a precise question about two values. == checks equality, != checks inequality, and <, <=, >, >= compare order.",
          "The result is a Boolean value, which can be stored, printed, or later used to control a decision.",
        ],
        syntax: "integrity = 84\nis_safe = integrity >= 75\nprint(is_safe)",
      },
    },
    {
      type: "theory",
      block: {
        id: "string-comparison",
        heading: "Text comparisons are case-sensitive",
        paragraphs: [
          'Two strings are equal only when their characters and capitalization match. "Nexus" == "NEXUS" is False.',
          "Ordering strings uses Unicode character order, not dictionary meaning. Normalize with .lower() when case should not affect a user-facing comparison.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "threshold-check",
        title: "Integrity threshold",
        description: "Three comparisons inspect the same value.",
        language: "python",
        code: "integrity = 72\nprint(integrity == 72)\nprint(integrity > 80)\nprint(integrity != 0)",
        output: "True\nFalse\nTrue",
      },
    },
  ],
  commonMistakes: [
    "Using = when asking whether values are equal; equality uses ==.",
    "Reversing <= and >= when expressing a threshold.",
    "Assuming strings with different capitalization compare as equal.",
  ],
  tasks: [
    {
      id: "comparisons-threshold",
      title: "Check archive integrity",
      description: "Set integrity to 76 and print whether it is at least 70.",
      expectedBehavior: "The console prints True.",
      starterCode: "integrity = 76\n# Print the threshold comparison\n",
      hints: ["The phrase at least corresponds to >=."],
      validation: { mode: "trimmed-exact", expected: "True" },
    },
    {
      id: "comparisons-three-questions",
      title: "Run three calibrations",
      description:
        "With a = 12 and b = 19, print whether a equals b, a is smaller than b, and b is not 20.",
      expectedBehavior: "The output is False, True, True on separate lines.",
      starterCode: "a = 12\nb = 19\n# Print three comparisons\n",
      hints: ["Use ==, <, and != in the same order as the questions."],
      validation: { mode: "trimmed-exact", expected: "False\nTrue\nTrue" },
    },
  ],
  bonusTask: {
    id: "comparisons-bonus",
    title: "Case-neutral identity scan",
    description:
      'Compare entered text with "nexus" without caring about capitalization and print the Boolean result.',
    expectedBehavior: "With input NeXuS, the console prints True.",
    starterCode: "candidate = input()\n# Normalize and compare\n",
    defaultInput: "NeXuS",
    hints: ["Call .lower() on the entered string before comparing."],
    validation: { mode: "trimmed-exact", expected: "True" },
    discoveryText: "The identity scanner now sees beneath typographic noise.",
  },
});
