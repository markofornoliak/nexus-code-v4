import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-lists",
  worldId: "memory-structures",
  order: 1,
  title: "Mutable Specimen Rows",
  subtitle: "Store and transform ordered collections",
  objectives: [
    "Create and index lists",
    "Append, update, and remove items",
    "Iterate through list values",
  ],
  durationMinutes: 25,
  prerequisites: ["python-loops"],
  sections: [
    {
      type: "theory",
      block: {
        id: "list-basics",
        heading: "A list is an ordered, mutable collection",
        paragraphs: [
          "Lists use square brackets and may contain any Python values. Their order is preserved, and positions are numbered from zero. Negative indexes count backward from the end.",
          "Because lists are mutable, methods such as .append() and .remove() change the existing list. Direct index assignment replaces one item.",
        ],
        syntax:
          'relics = ["key", "lens", "coil"]\nrelics.append("seal")\nrelics[0] = "neural key"',
      },
    },
    {
      type: "theory",
      block: {
        id: "slices-and-iteration",
        heading: "Slices recover a range of positions",
        paragraphs: [
          "list[start:stop] creates a new list from start up to, but not including, stop. Leaving out a boundary means the beginning or end.",
          "A for loop can visit each item directly. Use enumerate() when you need both the index and value.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "specimen-list",
        title: "Catalog inspection",
        description: "The list grows, then every value is transmitted.",
        language: "python",
        code: 'specimens = ["crystal", "coil"]\nspecimens.append("key")\nfor item in specimens:\n    print(item)',
        output: "crystal\ncoil\nkey",
      },
    },
  ],
  commonMistakes: [
    "Using index 1 for the first item; Python indexing begins at 0.",
    "Assigning the result of list.append() back to the variable; append returns None.",
    "Accessing an index outside the current list length.",
  ],
  tasks: [
    {
      id: "lists-catalog",
      title: "Expand a specimen catalog",
      description:
        'Start with ["lens", "coil"], append "key", replace "lens" with "prism", then print each item.',
      expectedBehavior: "The output is prism, coil, key on separate lines.",
      starterCode: 'specimens = ["lens", "coil"]\n# Mutate the list, then iterate\n',
      hints: ["Replace index 0, and use append() for the new final item."],
      validation: { mode: "trimmed-exact", expected: "prism\ncoil\nkey" },
    },
    {
      id: "lists-sum-energy",
      title: "Sum stored charges",
      description: "Use a loop to total [12, 8, 15, 5] and print the result.",
      expectedBehavior: "The console prints 40.",
      starterCode: "charges = [12, 8, 15, 5]\ntotal = 0\n# Accumulate every charge\n",
      hints: ["Add the loop variable to total during each pass."],
      validation: { mode: "trimmed-exact", expected: "40" },
    },
  ],
  bonusTask: {
    id: "lists-bonus",
    title: "Recover the central slice",
    description:
      "From readings = [4, 8, 15, 16, 23, 42], print the slice containing 15, 16, and 23.",
    expectedBehavior: "The console prints [15, 16, 23].",
    starterCode: "readings = [4, 8, 15, 16, 23, 42]\n# Slice positions 2 through 4\n",
    hints: ["The stop index is excluded, so the slice should stop at index 5."],
    validation: { mode: "trimmed-exact", expected: "[15, 16, 23]" },
    discoveryText: "The central readings form a familiar recovered sequence.",
  },
});
