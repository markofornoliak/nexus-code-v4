import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-loops",
  worldId: "logic-chambers",
  order: 5,
  title: "Loop Resonator",
  subtitle: "Repeat controlled operations without duplicated code",
  objectives: [
    "Iterate over ranges with for",
    "Repeat while a condition remains true",
    "Prevent accidental infinite loops",
  ],
  durationMinutes: 28,
  prerequisites: ["python-nested-conditions"],
  sections: [
    {
      type: "theory",
      block: {
        id: "for-loop",
        heading: "for visits each value in a sequence",
        paragraphs: [
          "A for loop assigns each item from an iterable to a loop variable and runs its indented block once per item. range(stop) produces integers from zero up to, but not including, stop.",
          "range(start, stop, step) controls the beginning and interval. The stop value remains exclusive.",
        ],
        syntax: 'for pulse in range(1, 4):\n    print(f"Pulse {pulse}")',
      },
    },
    {
      type: "theory",
      block: {
        id: "while-loop",
        heading: "while repeats while its condition is True",
        paragraphs: [
          "A while loop is useful when repetition depends on changing state rather than a predetermined collection. Something inside the loop must normally move the condition toward False.",
          "A condition that never changes can freeze a program. NEXUS terminates the execution worker after a safety timeout, but you should still reason about the exit condition before running.",
        ],
        tone: "warning",
      },
    },
    {
      type: "example",
      example: {
        id: "countdown",
        title: "Controlled countdown",
        description: "The counter changes on every pass and eventually stops the loop.",
        language: "python",
        code: 'energy = 3\nwhile energy > 0:\n    print(energy)\n    energy -= 1\nprint("stable")',
        output: "3\n2\n1\nstable",
      },
    },
  ],
  commonMistakes: [
    "Expecting range(1, 5) to include 5.",
    "Forgetting to update a while-loop control variable.",
    "Changing a collection while iterating over it without understanding the consequences.",
  ],
  tasks: [
    {
      id: "loops-pulse-sequence",
      title: "Emit five pulses",
      description: "Use a for loop to print Pulse 1 through Pulse 5, one per line.",
      expectedBehavior: "Five numbered pulse lines appear.",
      starterCode: "# Use range() and an f-string\n",
      hints: ["range(1, 6) produces 1, 2, 3, 4, 5."],
      validation: {
        mode: "code-pattern",
        pattern: "for\\s+\\w+\\s+in\\s+range\\s*\\(",
        output: "Pulse 1\nPulse 2\nPulse 3\nPulse 4\nPulse 5",
      },
    },
    {
      id: "loops-energy-drain",
      title: "Drain a charge safely",
      description:
        "Start energy at 4. Use while to print 4, 3, 2, 1, then print depleted.",
      expectedBehavior: "The loop stops and the final line is depleted.",
      starterCode: "energy = 4\n# Build a terminating while loop\n",
      hints: ["Decrease energy by one inside the loop."],
      validation: { mode: "trimmed-exact", expected: "4\n3\n2\n1\ndepleted" },
    },
  ],
  bonusTask: {
    id: "loops-bonus",
    title: "Sum the resonance band",
    description:
      "Use a loop to add every integer from 1 through 100 and print the total.",
    expectedBehavior: "The console prints 5050.",
    starterCode: "total = 0\n# Accumulate 1 through 100\n",
    hints: ["Update total on each pass through range(1, 101)."],
    validation: {
      mode: "code-pattern",
      pattern: "for\\s+\\w+\\s+in\\s+range\\s*\\(",
      output: "5050",
    },
    discoveryText: "A hundred small pulses collapse into one stable resonance.",
  },
});
