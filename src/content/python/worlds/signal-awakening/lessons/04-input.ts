import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-input",
  worldId: "signal-awakening",
  order: 4,
  title: "External Input Port",
  subtitle: "Receive values from outside the program",
  objectives: [
    "Read one or more lines with input()",
    "Convert input text to numeric values",
    "Design clear input-output interactions",
  ],
  durationMinutes: 22,
  prerequisites: ["python-strings"],
  sections: [
    {
      type: "theory",
      block: {
        id: "input-channel",
        heading: "input() reads one line as text",
        paragraphs: [
          "Every call to input() consumes the next available line and returns it as a string. In NEXUS, the Standard Input panel acts as that line queue.",
          "Prompts passed to input() are valid Python, but automated task output is easier to validate when instructions are shown in the interface and input() is called without a prompt.",
        ],
        syntax: 'sector = input()\nprint(f"Scanning {sector}")',
      },
    },
    {
      type: "theory",
      block: {
        id: "conversion",
        heading: "Convert numeric text before calculating",
        paragraphs: [
          'The characters "12" form a string, not the integer 12. Use int() for whole numbers and float() for decimal numbers before arithmetic.',
          "Conversion can fail when the supplied text is not a valid number. Beginner programs should first assume valid task input; later systems can handle invalid data with exceptions.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "two-input-lines",
        title: "Two-line intake",
        description: "Each input() consumes one line from the input panel.",
        language: "python",
        code: 'sector = input()\nfragments = int(input())\nprint(f"{sector} contains {fragments} fragments")',
        output: "Lambda contains 5 fragments",
      },
    },
  ],
  commonMistakes: [
    "Trying to add a number directly to the string returned by input().",
    "Supplying several intended inputs on one line instead of separate lines.",
    "Calling input() more times than the input panel provides values.",
  ],
  tasks: [
    {
      id: "input-greet-operator",
      title: "Identify the operator",
      description: 'Read one name and print "Operator <name> connected".',
      expectedBehavior: "With input Ada, the output is Operator Ada connected.",
      starterCode: "name = input()\n# Report the connection\n",
      defaultInput: "Ada",
      hints: ["Insert name into an f-string."],
      validation: { mode: "trimmed-exact", expected: "Operator Ada connected" },
    },
    {
      id: "input-double-energy",
      title: "Amplify incoming energy",
      description: "Read one whole number, double it, and print the result.",
      expectedBehavior: "With input 21, the console prints 42.",
      starterCode: "raw_energy = input()\n# Convert, double, and print\n",
      defaultInput: "21",
      hints: ["Wrap raw_energy with int() before multiplication."],
      validation: { mode: "trimmed-exact", expected: "42" },
    },
  ],
  bonusTask: {
    id: "input-bonus",
    title: "Multi-line coordinates",
    description:
      "Read x and y from two lines, convert both to integers, and print their sum.",
    expectedBehavior: "With inputs 17 and 25, the output is 42.",
    starterCode: "# Read the first and second coordinate\n",
    defaultInput: "17\n25",
    hints: ["Use two separate input() calls; each receives one line."],
    validation: { mode: "trimmed-exact", expected: "42" },
    discoveryText:
      "Two external coordinates resolve into the archive's recurring number.",
  },
});
