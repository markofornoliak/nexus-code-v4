import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-first-signal",
  worldId: "signal-awakening",
  order: 1,
  title: "The First Signal",
  subtitle: "Make Python produce a visible transmission",
  objectives: [
    "Recognize a Python statement",
    "Call the built-in print function",
    "Distinguish source code from program output",
  ],
  durationMinutes: 14,
  prerequisites: [],
  sections: [
    {
      type: "theory",
      block: {
        id: "programs-and-statements",
        heading: "A program is an ordered set of instructions",
        paragraphs: [
          "Python reads a source file from top to bottom. Each complete instruction is called a statement. The interpreter translates those statements into actions while the program runs.",
          "Text written inside quotation marks is a string. Passing a string to print() sends that text to the output console. Parentheses belong to the function call; quotation marks mark where the string begins and ends.",
        ],
        bullets: [
          "Python is case-sensitive: print and Print are different names.",
          "A simple statement normally occupies one line.",
          "Console output is the result of running code, not part of the code itself.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "first-print",
        title: "Wake-up transmission",
        description: "Two statements execute in their written order.",
        language: "python",
        code: 'print("NEXUS online")\nprint("Signal stable")',
        output: "NEXUS online\nSignal stable",
      },
    },
    {
      type: "callout",
      id: "quotes-note",
      title: "Field note: quote pairs",
      body: "Opening and closing quotes must match. Both single and double quotes work for ordinary Python strings.",
      tone: "field-note",
    },
  ],
  commonMistakes: [
    "Writing Print with a capital P.",
    "Forgetting one quotation mark or one parenthesis.",
    "Typing expected output into the editor instead of producing it with print().",
  ],
  tasks: [
    {
      id: "first-signal-transmit",
      title: "Transmit the archive name",
      description: 'Print the exact text "NEXUS awake".',
      expectedBehavior:
        "The console contains one line with the exact requested capitalization.",
      starterCode: '# Send the first archive signal\nprint("replace me")',
      hints: ["Put the requested text between the quotes inside print()."],
      validation: { mode: "trimmed-exact", expected: "NEXUS awake" },
    },
    {
      id: "first-signal-two-lines",
      title: "Open two channels",
      description: 'Print "Channel A" and then "Channel B" on separate lines.',
      expectedBehavior: "Two console lines appear in the requested order.",
      starterCode: "# Use two print statements\n",
      hints: ["Each print() call ends its output with a new line by default."],
      validation: { mode: "trimmed-exact", expected: "Channel A\nChannel B" },
    },
  ],
  bonusTask: {
    id: "first-signal-bonus",
    title: "Archive banner",
    description: "Create a three-line banner containing NEXUS, RECOVERY, and STARTED.",
    expectedBehavior: "All three words appear, one per line, in that order.",
    starterCode: "# Build a three-line archive banner\n",
    hints: ["Use three print() calls and preserve uppercase letters."],
    validation: { mode: "trimmed-exact", expected: "NEXUS\nRECOVERY\nSTARTED" },
    discoveryText: "The banner reveals an operator signature beneath the console glass.",
  },
});
