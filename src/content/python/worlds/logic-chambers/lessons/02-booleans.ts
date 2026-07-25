import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-booleans",
  worldId: "logic-chambers",
  order: 2,
  title: "Truth Lattice",
  subtitle: "Combine conditions into precise logical signals",
  objectives: [
    "Combine conditions with and and or",
    "Invert a Boolean with not",
    "Use truth tables to predict expressions",
  ],
  durationMinutes: 22,
  prerequisites: ["python-comparisons"],
  sections: [
    {
      type: "theory",
      block: {
        id: "boolean-operators",
        heading: "Logical operators connect comparisons",
        paragraphs: [
          "and is True only when both operands are True. or is True when at least one operand is True. not reverses a Boolean value.",
          "Python evaluates not before and, and and before or. Parentheses make combined rules easier to audit and protect your intended grouping.",
        ],
        bullets: ["True and False → False", "True or False → True", "not True → False"],
      },
    },
    {
      type: "theory",
      block: {
        id: "range-checks",
        heading: "Python supports chained range comparisons",
        paragraphs: [
          "The expression 10 <= energy <= 50 checks both the lower and upper boundary. It is equivalent to energy >= 10 and energy <= 50.",
          "Choose the form that makes the rule easiest to read. Boundary operators matter: < excludes an endpoint, while <= includes it.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "access-rule",
        title: "Archive access rule",
        description: "Both clearance and system health must be valid.",
        language: "python",
        code: "clearance = 4\nsystem_online = True\naccess = clearance >= 3 and system_online\nprint(access)",
        output: "True",
      },
    },
  ],
  commonMistakes: [
    "Writing && or || from another language instead of and and or.",
    "Using or when every requirement must be satisfied.",
    "Forgetting parentheses in a long mixed and/or expression.",
  ],
  tasks: [
    {
      id: "booleans-safe-range",
      title: "Detect a safe frequency",
      description:
        "Set frequency to 42 and print whether it is between 20 and 60 inclusive.",
      expectedBehavior: "The console prints True.",
      starterCode: "frequency = 42\n# Use a chained comparison\n",
      hints: [
        "Write the lower boundary, variable, and upper boundary in one expression.",
      ],
      validation: {
        mode: "code-pattern",
        pattern: "20\\s*<=\\s*frequency\\s*<=\\s*60",
        output: "True",
      },
    },
    {
      id: "booleans-access-gate",
      title: "Combine gate conditions",
      description:
        "Print whether access is allowed when clearance is at least 2 and either a key is present or override is active.",
      expectedBehavior: "With clearance 3, key False, override True, output is True.",
      starterCode:
        "clearance = 3\nhas_key = False\noverride_active = True\n# Combine the rule and print it\n",
      hints: ["Group the key-or-override choice inside parentheses."],
      validation: { mode: "trimmed-exact", expected: "True" },
    },
  ],
  bonusTask: {
    id: "booleans-bonus",
    title: "Invert the contamination flag",
    description:
      "Given contaminated = False and integrity = 88, print whether the sample is clean and integrity is above 80.",
    expectedBehavior: "The output is True.",
    starterCode: "contaminated = False\nintegrity = 88\n# Use not and and\n",
    hints: ["A clean sample can be expressed as not contaminated."],
    validation: {
      mode: "code-pattern",
      pattern: "not\\s+contaminated\\s+and\\s+integrity\\s*>\\s*80",
      output: "True",
    },
    discoveryText: "The lattice isolates absence as a usable logical signal.",
  },
});
