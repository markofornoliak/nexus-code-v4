import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-functions",
  worldId: "memory-structures",
  order: 4,
  title: "Reusable Logic Modules",
  subtitle: "Package behavior behind clear interfaces",
  objectives: [
    "Define and call functions",
    "Pass arguments through parameters",
    "Return values instead of relying only on print",
  ],
  durationMinutes: 30,
  prerequisites: ["python-dictionaries"],
  sections: [
    {
      type: "theory",
      block: {
        id: "function-contract",
        heading: "A function names a reusable operation",
        paragraphs: [
          "The def keyword creates a function. Parameters are local names that receive argument values when the function is called.",
          "Defining a function does not execute its body. The indented statements run only when a call reaches the function.",
        ],
        syntax:
          'def label_signal(sector, strength):\n    return f"{sector}:{strength}"\n\nreport = label_signal("A7", 91)\nprint(report)',
      },
    },
    {
      type: "theory",
      block: {
        id: "return-values",
        heading: "return sends a result back to the caller",
        paragraphs: [
          "print() displays information, while return makes a value available to the rest of the program. A returned value can be stored, compared, or passed to another function.",
          "When execution reaches return, that function call ends immediately. A function without an explicit return produces None.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "stability-function",
        title: "Reusable stability check",
        description: "The function can classify any numeric integrity value.",
        language: "python",
        code: "def is_stable(integrity):\n    return integrity >= 70\n\nprint(is_stable(82))\nprint(is_stable(45))",
        output: "True\nFalse",
      },
    },
  ],
  commonMistakes: [
    "Defining a function but never calling it.",
    "Printing a result inside a function when the caller needs to reuse the value.",
    "Using a local variable outside the function where it was created.",
  ],
  tasks: [
    {
      id: "functions-amplify",
      title: "Build an amplifier module",
      description:
        "Define amplify(signal, factor) that returns their product. Call it with 7 and 6 and print the returned value.",
      expectedBehavior: "The console prints 42.",
      starterCode:
        "def amplify(signal, factor):\n    # Return the amplified value\n    pass\n\n# Call the function and print its result\n",
      hints: ["Replace pass with return signal * factor."],
      validation: {
        mode: "code-pattern",
        pattern: "def\\s+amplify\\s*\\([^)]*\\)[\\s\\S]*return",
        output: "42",
      },
    },
    {
      id: "functions-classifier",
      title: "Classify an integrity reading",
      description:
        'Define classify(value) returning "stable" for 70 or more and "critical" otherwise. Print classify(64).',
      expectedBehavior: "The console prints critical.",
      starterCode:
        "def classify(value):\n    # Return one of two labels\n    pass\n\nprint(classify(64))",
      hints: ["Use if inside the function and return a string from each path."],
      validation: { mode: "trimmed-exact", expected: "critical" },
    },
  ],
  bonusTask: {
    id: "functions-bonus",
    title: "Compose a specimen label",
    description:
      'Define a function that accepts name and energy, returns "<name> / <energy>u", then call it for prism and 88.',
    expectedBehavior: "The console prints prism / 88u.",
    starterCode:
      "def specimen_label(name, energy):\n    # Return a formatted label\n    pass\n\n# Print one generated label\n",
    hints: ["Return an f-string, then call the function inside print()."],
    validation: {
      mode: "custom",
      validatorId: "function-used",
      expectedDescription: "A called function producing prism / 88u",
    },
    discoveryText:
      "The module accepts different specimens without changing its internal design.",
  },
});
