import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-conditions",
  worldId: "logic-chambers",
  order: 3,
  title: "Branching Corridor",
  subtitle: "Choose which instructions should execute",
  objectives: [
    "Write if, elif, and else branches",
    "Use indentation to define blocks",
    "Order conditions from specific to general",
  ],
  durationMinutes: 25,
  prerequisites: ["python-booleans"],
  sections: [
    {
      type: "theory",
      block: {
        id: "conditional-flow",
        heading: "A conditional selects one path",
        paragraphs: [
          "An if statement evaluates a condition. When the result is True, its indented block runs. Optional elif branches test further conditions only when earlier branches failed, and else handles every remaining case.",
          "At most one branch in an if/elif/else chain runs. After the chain finishes, execution continues with the next statement at the outer indentation level.",
        ],
        syntax:
          'if integrity >= 90:\n    print("stable")\nelif integrity >= 60:\n    print("recoverable")\nelse:\n    print("critical")',
      },
    },
    {
      type: "theory",
      block: {
        id: "indentation",
        heading: "Indentation is part of Python syntax",
        paragraphs: [
          "Python uses indentation instead of braces to group statements. Four spaces per level is the standard convention.",
          "All statements in one block must align. A colon ends the if, elif, or else header and announces the indented block that follows.",
        ],
        tone: "warning",
      },
    },
    {
      type: "example",
      example: {
        id: "signal-grade",
        title: "Grade a recovered signal",
        description: "The first matching branch supplies the label.",
        language: "python",
        code: 'strength = 64\nif strength >= 80:\n    print("strong")\nelif strength >= 40:\n    print("stable")\nelse:\n    print("faint")',
        output: "stable",
      },
    },
  ],
  commonMistakes: [
    "Forgetting the colon after an if or elif condition.",
    "Mixing tabs and spaces or misaligning statements in one block.",
    "Putting a broad condition before a more specific one, making the later branch unreachable.",
  ],
  tasks: [
    {
      id: "conditions-temperature",
      title: "Classify chamber temperature",
      description:
        'Read an integer. Print "cold" below 15, "stable" from 15 through 27, and "hot" above 27.',
      expectedBehavior: "With input 23, the console prints stable.",
      starterCode: "temperature = int(input())\n# Build the three-way branch\n",
      defaultInput: "23",
      hints: ["Test the lower boundary first, then the upper boundary in elif."],
      validation: { mode: "trimmed-exact", expected: "stable" },
    },
    {
      id: "conditions-clearance",
      title: "Route a clearance signal",
      description:
        'Given clearance = 4, print "core access" for 5+, "sector access" for 3+, otherwise "denied".',
      expectedBehavior: "The console prints sector access.",
      starterCode: "clearance = 4\n# Order the conditions from highest threshold down\n",
      hints: ["Check clearance >= 5 before clearance >= 3."],
      validation: { mode: "trimmed-exact", expected: "sector access" },
    },
  ],
  bonusTask: {
    id: "conditions-bonus",
    title: "Parity scanner",
    description:
      'Read an integer and print "even" when divisible by 2, otherwise print "odd".',
    expectedBehavior: "With input 137, the output is odd.",
    starterCode: "number = int(input())\n# Use remainder inside a condition\n",
    defaultInput: "137",
    hints: ["An even number has number % 2 equal to zero."],
    validation: { mode: "one-of", expected: ["odd"], trim: true },
    discoveryText:
      "The branch corridor divides the number stream into alternating channels.",
  },
});
