import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-nested-conditions",
  worldId: "logic-chambers",
  order: 4,
  title: "Nested Gateways",
  subtitle: "Model decisions that depend on earlier decisions",
  objectives: [
    "Place a conditional inside another block",
    "Choose between nesting and combined Boolean logic",
    "Trace multi-stage decisions",
  ],
  durationMinutes: 24,
  prerequisites: ["python-conditions"],
  sections: [
    {
      type: "theory",
      block: {
        id: "nested-branches",
        heading: "Nested conditions represent dependent stages",
        paragraphs: [
          "A nested if runs only after the outer condition has allowed execution into its block. This is useful when the second question is meaningful only after the first passes.",
          "Each nesting level adds four more spaces. Deep nesting becomes difficult to trace, so combine conditions or reorganize logic when branches extend beyond a few levels.",
        ],
        syntax:
          'if archive_online:\n    if clearance >= 3:\n        print("entry granted")\n    else:\n        print("clearance required")\nelse:\n    print("archive offline")',
      },
    },
    {
      type: "theory",
      block: {
        id: "nest-or-combine",
        heading: "Nesting preserves different failure explanations",
        paragraphs: [
          "archive_online and clearance >= 3 is compact when only success matters. Nesting is better when the program must explain whether the archive is offline or clearance is insufficient.",
          "Select the structure that communicates the domain rule, not simply the one with fewer lines.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "two-stage-scan",
        title: "Two-stage specimen scan",
        description: "Contamination is checked only for an intact sample.",
        language: "python",
        code: 'intact = True\ncontaminated = False\nif intact:\n    if contaminated:\n        print("isolate")\n    else:\n        print("catalog")\nelse:\n    print("discard")',
        output: "catalog",
      },
    },
  ],
  commonMistakes: [
    "Aligning the inner if with the outer if instead of nesting it.",
    "Attaching an else to the wrong indentation level.",
    "Using nesting when one readable Boolean expression would communicate the rule better.",
  ],
  tasks: [
    {
      id: "nested-airlock",
      title: "Control a two-stage airlock",
      description:
        'If power is available, check clearance. Print "open" for clearance 3+, "locked" otherwise. If no power, print "offline".',
      expectedBehavior: "With power True and clearance 2, output is locked.",
      starterCode: "has_power = True\nclearance = 2\n# Build the nested decision\n",
      hints: ["The clearance check belongs inside the has_power block."],
      validation: { mode: "trimmed-exact", expected: "locked" },
    },
    {
      id: "nested-specimen",
      title: "Classify a specimen",
      description:
        'If integrity is at least 50, print "rare" when resonance exceeds 80, otherwise "stable". Below 50 print "damaged".',
      expectedBehavior: "With integrity 72 and resonance 91, output is rare.",
      starterCode:
        "integrity = 72\nresonance = 91\n# First inspect integrity, then resonance\n",
      hints: ["Only test resonance inside the branch for acceptable integrity."],
      validation: { mode: "trimmed-exact", expected: "rare" },
    },
  ],
  bonusTask: {
    id: "nested-bonus",
    title: "Three-factor access diagnosis",
    description:
      'Report "offline", "clearance denied", "key missing", or "access granted" by checking online, clearance 4+, and key in that order.',
    expectedBehavior: "With online True, clearance 5, key False, output is key missing.",
    starterCode:
      "online = True\nclearance = 5\nhas_key = False\n# Preserve a distinct diagnosis for every failed stage\n",
    hints: [
      "Nest each later requirement only inside the success branch of the earlier one.",
    ],
    validation: { mode: "trimmed-exact", expected: "key missing" },
    discoveryText:
      "The gateway exposes not only a decision, but its exact point of failure.",
  },
});
