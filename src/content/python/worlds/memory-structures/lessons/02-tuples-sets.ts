import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-tuples-sets",
  worldId: "memory-structures",
  order: 2,
  title: "Fixed Relics & Unique Fields",
  subtitle: "Choose collections by mutability and uniqueness",
  objectives: [
    "Use tuples for fixed ordered records",
    "Use sets for unique membership",
    "Apply set union and intersection",
  ],
  durationMinutes: 24,
  prerequisites: ["python-lists"],
  sections: [
    {
      type: "theory",
      block: {
        id: "tuples",
        heading: "Tuples preserve an ordered record",
        paragraphs: [
          "A tuple is an ordered collection that cannot be changed after creation. Parentheses are conventional; a one-item tuple needs a trailing comma.",
          "Tuples are useful for coordinates, fixed measurements, and values that should be unpacked into separate names.",
        ],
        syntax: 'coordinates = (12, 7)\nx, y = coordinates\nsingle = ("relic",)',
      },
    },
    {
      type: "theory",
      block: {
        id: "sets",
        heading: "Sets retain unique values without positional order",
        paragraphs: [
          "A set automatically removes duplicates and supports fast membership checks with in. Because sets are not positional, you do not access them by index.",
          "Union (|) combines all unique members. Intersection (&) keeps only members shared by both sets. Difference (-) keeps values present only in the left set.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "shared-tags",
        title: "Shared resonance tags",
        description: "Intersection reveals the tag present in both sectors.",
        language: "python",
        code: 'sector_a = {"blue", "cold", "stable"}\nsector_b = {"amber", "warm", "stable"}\nprint("stable" in (sector_a & sector_b))',
        output: "True",
      },
    },
  ],
  commonMistakes: [
    "Trying to change a tuple item after creation.",
    "Creating an empty set with {}; that syntax creates an empty dictionary. Use set().",
    "Relying on set display order in expected output.",
  ],
  tasks: [
    {
      id: "tuples-unpack",
      title: "Unpack archive coordinates",
      description: "Unpack coordinates = (14, 9) into x and y, then print x * y.",
      expectedBehavior: "The console prints 126.",
      starterCode: "coordinates = (14, 9)\n# Unpack, multiply, and print\n",
      hints: ["Use x, y = coordinates."],
      validation: { mode: "trimmed-exact", expected: "126" },
    },
    {
      id: "sets-shared-frequencies",
      title: "Find shared frequencies",
      description:
        "Create the intersection of {2, 3, 5, 8} and {1, 3, 8, 13}; print whether it equals {3, 8}.",
      expectedBehavior: "The console prints True.",
      starterCode:
        "first = {2, 3, 5, 8}\nsecond = {1, 3, 8, 13}\n# Compare their intersection\n",
      hints: ["The & operator computes set intersection."],
      validation: { mode: "trimmed-exact", expected: "True" },
    },
  ],
  bonusTask: {
    id: "tuples-sets-bonus",
    title: "Count unique specimen codes",
    description:
      'Convert ["A", "B", "A", "C", "B", "D"] to a set and print the number of unique codes.',
    expectedBehavior: "The console prints 4.",
    starterCode:
      'codes = ["A", "B", "A", "C", "B", "D"]\n# Remove duplicates and measure\n',
    hints: ["Pass the list to set(), then pass the result to len()."],
    validation: { mode: "trimmed-exact", expected: "4" },
    discoveryText: "Duplicate signatures dissolve, leaving four distinct specimens.",
  },
});
