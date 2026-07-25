import { definePythonLesson } from "../_shared/defineLesson";

// Copy this file into a world's lessons directory. The Python registry discovers it automatically.
export default definePythonLesson({
  id: "python-unique-fragment-id",
  worldId: "existing-world-id",
  order: 99,
  title: "Fragment title",
  subtitle: "One-line learning promise",
  objectives: ["Observable objective"],
  durationMinutes: 20,
  prerequisites: [],
  sections: [
    {
      type: "theory",
      block: {
        id: "concept",
        heading: "Concept heading",
        paragraphs: ["Explain the concept with accurate, beginner-safe language."],
      },
    },
  ],
  commonMistakes: ["Describe a realistic mistake."],
  tasks: [
    {
      id: "unique-task-id",
      title: "Practice task",
      description: "State exactly what the learner must build.",
      expectedBehavior: "State the observable result.",
      starterCode: "# Starter code\n",
      hints: ["Give a directional hint without the full answer."],
      validation: { mode: "trimmed-exact", expected: "expected output" },
    },
    {
      id: "second-unique-task-id",
      title: "Second practice task",
      description: "Increase difficulty using only introduced concepts.",
      expectedBehavior: "State the observable result.",
      starterCode: "# Starter code\n",
      hints: ["A useful hint."],
      validation: { mode: "contains", expected: "required fragment" },
    },
  ],
  bonusTask: {
    id: "unique-bonus-id",
    title: "Bonus task",
    description: "Combine concepts.",
    expectedBehavior: "State the observable result.",
    starterCode: "# Bonus starter\n",
    hints: ["A useful hint."],
    validation: { mode: "regex", pattern: "^expected$" },
    discoveryText: "Thematic artifact discovery copy.",
  },
});
