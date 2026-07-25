import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-variables",
  worldId: "signal-awakening",
  order: 2,
  title: "Signal Vessels",
  subtitle: "Store values under meaningful names",
  objectives: [
    "Assign values to variables",
    "Recognize int, float, str, and bool values",
    "Choose readable snake_case names",
  ],
  durationMinutes: 18,
  prerequisites: ["python-first-signal"],
  sections: [
    {
      type: "theory",
      block: {
        id: "assignment",
        heading: "Variables label values",
        paragraphs: [
          "A variable is a name that refers to a value. The assignment operator = evaluates the expression on its right and binds the result to the name on its left.",
          "Python uses dynamic typing: the value carries its type, so you do not declare a variable's type separately. Reassignment can point the same name to a new value, although frequent type changes make programs harder to understand.",
        ],
        syntax: 'signal_strength = 82\narchive_name = "NEXUS"\nis_stable = True',
      },
    },
    {
      type: "theory",
      block: {
        id: "primitive-types",
        heading: "Four foundational value types",
        paragraphs: [
          "Integers represent whole numbers, floats represent decimal numbers, strings represent text, and booleans represent exactly True or False.",
          "The built-in type() function can identify a value's type while you are investigating unfamiliar data.",
        ],
        bullets: [
          "int: 7, -12, 0",
          "float: 3.5, -0.25",
          'str: "sector-7"',
          "bool: True or False",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "variable-report",
        title: "Specimen labels",
        description: "Names preserve different kinds of archive data.",
        language: "python",
        code: 'sector = "A-17"\nsamples = 4\npurity = 98.5\nactive = True\nprint(sector, samples, purity, active)',
        output: "A-17 4 98.5 True",
      },
    },
  ],
  commonMistakes: [
    "Putting quotation marks around a variable name when you intend to print its stored value.",
    "Using spaces or hyphens inside variable names.",
    "Writing true or false instead of Python's capitalized True and False.",
  ],
  tasks: [
    {
      id: "variables-sample-count",
      title: "Label a specimen count",
      description:
        "Create a variable named sample_count with the integer 12, then print it.",
      expectedBehavior: "The console prints 12.",
      starterCode: "# Bind the value, then transmit it\n",
      hints: ["The name belongs on the left side of = and 12 belongs on the right."],
      validation: {
        mode: "code-pattern",
        pattern: "\\bsample_count\\s*=\\s*12\\b",
        output: "12",
      },
    },
    {
      id: "variables-four-types",
      title: "Assemble a status record",
      description:
        'Store "Theta" in sector, 7 in fragments, 91.4 in integrity, and True in online. Print the four values in that order.',
      expectedBehavior: "The console prints: Theta 7 91.4 True",
      starterCode:
        'sector = ""\nfragments = 0\nintegrity = 0.0\nonline = False\n\n# Print all four variables\n',
      hints: ["print() accepts several values separated by commas."],
      validation: { mode: "trimmed-exact", expected: "Theta 7 91.4 True" },
    },
  ],
  bonusTask: {
    id: "variables-bonus",
    title: "Controlled reassignment",
    description:
      "Set energy to 40, add 15 to it using reassignment, and print the result.",
    expectedBehavior: "The final output is 55.",
    starterCode: "energy = 40\n# Reassign energy using its current value\n",
    hints: [
      "The expression energy + 15 can appear on the right side of a new assignment.",
    ],
    validation: {
      mode: "code-pattern",
      pattern: "energy\\s*=\\s*energy\\s*\\+\\s*15",
      output: "55",
    },
    discoveryText: "The vessel accepts a second charge without losing its identity.",
  },
});
