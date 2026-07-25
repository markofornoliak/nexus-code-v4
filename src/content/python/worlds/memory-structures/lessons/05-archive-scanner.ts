import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-archive-scanner",
  worldId: "memory-structures",
  order: 5,
  title: "Archive Scanner Protocol",
  subtitle: "Integrate input, collections, loops, conditions, and functions",
  objectives: [
    "Decompose a small program into data and behavior",
    "Process multiple records with a loop",
    "Produce a validated summary from user input",
  ],
  durationMinutes: 40,
  prerequisites: ["python-functions"],
  sections: [
    {
      type: "theory",
      block: {
        id: "integrated-design",
        heading: "Small programs become clearer when divided into stages",
        paragraphs: [
          "The scanner protocol has four stages: receive data, normalize it, classify each specimen, and report a summary. Separating these stages prevents one long block from mixing unrelated decisions.",
          "Represent repeated records with a list and labeled totals with a dictionary. Put reusable classification behavior in a function.",
        ],
        bullets: [
          "Input stage: read a count, then one record per line.",
          "Processing stage: normalize text and update counts.",
          "Decision stage: classify values with conditions.",
          "Output stage: print a stable, predictable report.",
        ],
      },
    },
    {
      type: "theory",
      block: {
        id: "incremental-build",
        heading: "Build and verify one layer at a time",
        paragraphs: [
          "First make the input loop collect exactly the expected number of values. Next print the collection temporarily to confirm it. Then add the dictionary count and final formatting.",
          "This incremental workflow makes mistakes local and observable. Once each layer is stable, remove temporary diagnostic output that would interfere with the required report.",
        ],
        tone: "field-note",
      },
    },
    {
      type: "example",
      example: {
        id: "mini-scanner",
        title: "Minimal category scanner",
        description: "A dictionary accumulates counts for normalized input labels.",
        language: "python",
        code: 'counts = {}\nfor _ in range(3):\n    category = input().strip().lower()\n    counts[category] = counts.get(category, 0) + 1\nprint(counts["relic"])',
        output: "2",
      },
    },
    {
      type: "callout",
      id: "final-protocol",
      title: "Recovery protocol",
      body: "Treat the standard tasks as component tests. The bonus task is the integrated expedition: plan its data flow before writing the complete program.",
      tone: "note",
    },
  ],
  commonMistakes: [
    "Reading a different number of input lines than the stated specimen count.",
    "Accessing a new dictionary category before giving it a default count.",
    "Leaving diagnostic prints in output that must follow a specific format.",
  ],
  tasks: [
    {
      id: "scanner-category-count",
      title: "Count normalized categories",
      description:
        "Read four category lines, normalize them to lowercase, and print how many are relic.",
      expectedBehavior: "For Relic, crystal, RELIC, key the output is 2.",
      starterCode:
        'categories = []\nfor _ in range(4):\n    # Read and normalize one category\n    pass\n\n# Count and print "relic"\n',
      defaultInput: "Relic\ncrystal\nRELIC\nkey",
      hints: ['Append input().strip().lower(), then use categories.count("relic").'],
      validation: { mode: "trimmed-exact", expected: "2" },
    },
    {
      id: "scanner-energy-function",
      title: "Classify recovered energy",
      description:
        'Define energy_band(value): "high" for 80+, "stable" for 40+, otherwise "faint". Print results for 91, 55, and 12.',
      expectedBehavior: "The output is high, stable, faint on separate lines.",
      starterCode:
        "def energy_band(value):\n    # Return the correct band\n    pass\n\nfor reading in [91, 55, 12]:\n    print(energy_band(reading))",
      hints: ["Order thresholds from highest to lowest."],
      validation: { mode: "trimmed-exact", expected: "high\nstable\nfaint" },
    },
  ],
  bonusTask: {
    id: "scanner-bonus",
    title: "Integrated expedition: Archive Scanner",
    description:
      "Read a specimen count, then that many category lines. Build a dictionary of normalized counts. Print each category and count in first-seen order, then print TOTAL: <count>.",
    expectedBehavior:
      "For five inputs (relic, key, Relic, coil, key), report relic: 2, key: 2, coil: 1, and TOTAL: 5.",
    starterCode:
      "def normalize_category(raw):\n    return raw.strip().lower()\n\nspecimen_count = int(input())\ncounts = {}\n# Read, count, and report the archive inventory\n",
    defaultInput: "5\nrelic\nkey\nRelic\ncoil\nkey",
    hints: [
      "Dictionaries preserve the order in which each category is first inserted.",
      "Use counts.get(category, 0) + 1, then iterate with counts.items().",
    ],
    validation: {
      mode: "custom",
      validatorId: "inventory-summary",
      expectedDescription: "Category counts and a numeric TOTAL",
    },
    discoveryText:
      "The archive core accepts your scanner as a native restoration instrument.",
  },
});
