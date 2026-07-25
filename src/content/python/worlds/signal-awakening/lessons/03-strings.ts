import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-strings",
  worldId: "signal-awakening",
  order: 3,
  title: "Encoded Manuscripts",
  subtitle: "Compose, inspect, and format text",
  objectives: [
    "Combine strings with concatenation",
    "Use f-strings to embed values",
    "Apply common string methods",
  ],
  durationMinutes: 20,
  prerequisites: ["python-variables"],
  sections: [
    {
      type: "theory",
      block: {
        id: "string-operations",
        heading: "Strings are ordered text sequences",
        paragraphs: [
          "A string stores characters in a fixed order. The + operator concatenates strings, while len() returns the number of characters, including spaces and punctuation.",
          "String methods create transformed strings. For example, .upper() returns uppercase text and .strip() removes whitespace from both ends. Strings themselves are immutable: the original value does not change unless you reassign the result.",
        ],
        syntax: 'fragment = "  dormant signal  "\nclean = fragment.strip().upper()',
      },
    },
    {
      type: "theory",
      block: {
        id: "f-strings",
        heading: "F-strings insert expressions into text",
        paragraphs: [
          "Prefix a quoted string with f and place variables or expressions inside braces. Python evaluates each brace expression and converts the result to text.",
          "F-strings are usually clearer than manually converting and concatenating several values.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "formatted-record",
        title: "Formatted archive label",
        description: "A number becomes part of a readable report.",
        language: "python",
        code: 'sector = "Kappa"\nfragments = 3\nprint(f"Sector {sector}: {fragments} fragments")',
        output: "Sector Kappa: 3 fragments",
      },
    },
  ],
  commonMistakes: [
    "Concatenating a string and a number with + without converting the number.",
    "Forgetting the f prefix before a formatted string.",
    "Expecting .upper() to mutate the original string automatically.",
  ],
  tasks: [
    {
      id: "strings-field-label",
      title: "Format a sector label",
      description:
        'Given sector = "Delta" and depth = 8, use an f-string to print "Sector Delta / depth 8".',
      expectedBehavior: "The report uses both variables and exact punctuation.",
      starterCode: 'sector = "Delta"\ndepth = 8\n# Build the label with an f-string\n',
      hints: ["Begin the quoted string with f and place variable names inside {braces}."],
      validation: {
        mode: "code-pattern",
        pattern: "print\\s*\\(\\s*f[\"']",
        output: "Sector Delta / depth 8",
      },
    },
    {
      id: "strings-clean-transmission",
      title: "Clean a noisy transmission",
      description:
        "Strip the outer spaces from raw_signal, convert it to uppercase, and print it.",
      expectedBehavior: "The console prints ARCHIVE ONLINE.",
      starterCode:
        'raw_signal = "   archive online   "\n# Clean and normalize the text\n',
      hints: ["Methods can be chained: value.strip().upper()."],
      validation: { mode: "trimmed-exact", expected: "ARCHIVE ONLINE" },
    },
  ],
  bonusTask: {
    id: "strings-bonus",
    title: "Measure a fragment",
    description:
      'Print "CODE contains 4 symbols" by storing "CODE" in a variable and using len() inside an f-string.',
    expectedBehavior:
      "The output includes the word, its measured length, and the label symbols.",
    starterCode: 'fragment = "CODE"\n# Measure and report in one f-string\n',
    hints: ["An f-string brace may contain len(fragment)."],
    validation: { mode: "trimmed-exact", expected: "CODE contains 4 symbols" },
    discoveryText: "The archive annotates every symbol with a microscopic coordinate.",
  },
});
