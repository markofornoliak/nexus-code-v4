import { definePythonLesson } from "../../../../_shared/defineLesson";

export default definePythonLesson({
  id: "python-dictionaries",
  worldId: "memory-structures",
  order: 3,
  title: "Labeled Memory Index",
  subtitle: "Store values by meaningful keys",
  objectives: [
    "Create and update dictionaries",
    "Read values safely by key",
    "Iterate through keys and values",
  ],
  durationMinutes: 27,
  prerequisites: ["python-tuples-sets"],
  sections: [
    {
      type: "theory",
      block: {
        id: "dictionary-model",
        heading: "A dictionary maps unique keys to values",
        paragraphs: [
          "Dictionary literals use key: value pairs inside braces. Instead of a numeric position, each value is retrieved through its key.",
          "Assigning to a new key adds a pair; assigning to an existing key replaces its value. Keys must be hashable, so strings, numbers, and tuples are common choices.",
        ],
        syntax:
          'specimen = {"name": "prism", "energy": 82}\nprint(specimen["name"])\nspecimen["stable"] = True',
      },
    },
    {
      type: "theory",
      block: {
        id: "safe-access",
        heading: "get() handles an absent key safely",
        paragraphs: [
          "Direct indexing raises KeyError when a key does not exist. dictionary.get(key, default) returns a fallback instead.",
          "Use .items() to iterate over key-value pairs, .keys() for keys, and .values() for values. Modern Python dictionaries preserve insertion order.",
        ],
      },
    },
    {
      type: "example",
      example: {
        id: "record-update",
        title: "Update a specimen record",
        description: "A field is changed and a missing field receives a default.",
        language: "python",
        code: 'record = {"sector": "Iota", "fragments": 3}\nrecord["fragments"] += 1\nprint(record["fragments"])\nprint(record.get("status", "unknown"))',
        output: "4\nunknown",
      },
    },
  ],
  commonMistakes: [
    "Requesting a missing key with square brackets when no error handling exists.",
    "Confusing a dictionary key with a variable name and omitting its quotes.",
    "Iterating over a dictionary and expecting each item to be a key-value tuple without .items().",
  ],
  tasks: [
    {
      id: "dictionaries-record",
      title: "Build a specimen record",
      description:
        'Create a dictionary with name "neural key", rarity "rare", and energy 90. Print name and energy.',
      expectedBehavior: "The output is neural key and 90 on separate lines.",
      starterCode: "# Create the dictionary, then read two keys\n",
      hints: ["Use string keys inside a dictionary literal."],
      validation: { mode: "trimmed-exact", expected: "neural key\n90" },
    },
    {
      id: "dictionaries-total",
      title: "Total sector fragments",
      description:
        'For counts = {"alpha": 3, "beta": 5, "gamma": 4}, sum the values and print 12.',
      expectedBehavior: "The console prints 12.",
      starterCode:
        'counts = {"alpha": 3, "beta": 5, "gamma": 4}\n# Sum dictionary values\n',
      hints: ["sum() can consume counts.values()."],
      validation: { mode: "trimmed-exact", expected: "12" },
    },
  ],
  bonusTask: {
    id: "dictionaries-bonus",
    title: "Safe status retrieval",
    description:
      'Read the missing "status" key from the given record with get() and the fallback "unclassified"; print it.',
    expectedBehavior: "The console prints unclassified without an exception.",
    starterCode: 'record = {"name": "coil", "energy": 55}\n# Retrieve status safely\n',
    hints: ['Use record.get("status", "unclassified").'],
    validation: {
      mode: "code-pattern",
      pattern: "\\.get\\s*\\(",
      output: "unclassified",
    },
    discoveryText: "The index now answers incomplete queries without collapsing.",
  },
});
