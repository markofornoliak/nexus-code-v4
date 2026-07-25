import type { CurriculumLessonSpec } from "../_shared/defineLesson";
import { createCurriculumLesson } from "../_shared/defineLesson";
import { outputBonus, outputTask } from "../_shared/taskBuilders";
import type { World } from "../../types";

const lessons: CurriculumLessonSpec[] = [
  {
    id: "python-iterators-generators",
    title: "Lazy Signal Streams",
    subtitle: "Produce values on demand with iterators and generators",
    objectives: [
      "Explain the iterator protocol",
      "Build a generator with yield",
      "Choose lazy processing for a data stream",
    ],
    conceptHeading: "A generator produces the next value only when it is requested",
    explanation: [
      "Every for loop consumes an iterator. A generator function creates one with ordinary Python syntax: yield pauses the function, preserves its local state, and resumes it for the next request.",
      "Lazy streams avoid building a complete list before work can begin. They are especially useful for large inputs, pipelines, and sequences whose final length is not known in advance.",
    ],
    bullets: [
      "Use yield instead of return for each generated value.",
      "Consume a generator once with a loop, next(), or a collection constructor.",
      "Keep each generator stage focused on one transformation.",
    ],
    syntax:
      "def readings(source):\n    for item in source:\n        yield transform(item)",
    example: {
      title: "Generate a countdown",
      description: "Local state is preserved between yielded values.",
      code: "def countdown(start):\n    while start > 0:\n        yield start\n        start -= 1\n\nprint(list(countdown(3)))",
      output: "[3, 2, 1]",
    },
    fieldNote:
      "A generator is not a stored list. Once its values have been consumed, create a new generator to iterate again.",
    mistakes: [
      "Using return where each value should be yielded.",
      "Trying to index a generator like a list.",
      "Consuming the stream once for debugging and expecting it to restart.",
    ],
    tasks: [
      outputTask(
        {
          id: "python-iterators-generators-countdown",
          title: "Open a countdown channel",
          description:
            "Complete countdown(start) so it yields every integer down to 1, then print the values joined by spaces.",
          expectedBehavior: "For a start of 4, print 4 3 2 1.",
          starterCode:
            'def countdown(start):\n    # Yield values lazily\n    pass\n\nprint(" ".join(str(value) for value in countdown(4)))',
          hints: ["Use while start > 0.", "Decrease start after every yield."],
        },
        "4 3 2 1",
      ),
      outputTask(
        {
          id: "python-iterators-generators-squares",
          title: "Filter a lazy current",
          description:
            "Write even_squares(values) that yields the square of each even value.",
          expectedBehavior: "For range(1, 7), print 4|16|36.",
          starterCode:
            'def even_squares(values):\n    # Yield only even squares\n    pass\n\nprint("|".join(str(value) for value in even_squares(range(1, 7))))',
          hints: ["Test value % 2 == 0 before yield.", "Yield value ** 2."],
        },
        "4|16|36",
      ),
    ],
    bonusTask: outputBonus(
      {
        id: "python-iterators-generators-bonus",
        title: "Running energy stream",
        description:
          "Read space-separated integers and create running_totals(values), yielding the cumulative total after each value.",
        expectedBehavior: "For 3 5 2 7, print 3 8 10 17.",
        starterCode:
          'def running_totals(values):\n    # Preserve and yield the cumulative total\n    pass\n\nvalues = [int(item) for item in input().split()]\nprint(" ".join(str(total) for total in running_totals(values)))',
        hints: ["Initialize total before the loop.", "Add first, then yield total."],
        defaultInput: "3 5 2 7",
      },
      "3 8 10 17",
      "The laboratory opens a streaming channel that never needs the full output in memory.",
    ),
    durationMinutes: 27,
  },
  {
    id: "python-parallel-iteration",
    title: "Parallel Coordinates",
    subtitle: "Traverse indexes and related sequences with enumerate and zip",
    objectives: [
      "Number values with enumerate",
      "Pair related sequences with zip",
      "Evaluate collections with any and all",
    ],
    conceptHeading: "Iteration tools express relationships without manual index control",
    explanation: [
      "enumerate supplies an index and value together. zip advances several iterables in parallel and emits tuples of related values. Both remove brittle index arithmetic from ordinary loops.",
      "any reports whether at least one condition is true; all requires every condition to be true. Generator expressions let these checks stop as soon as the answer is known.",
    ],
    bullets: [
      "Pass start=1 when labels should begin at one.",
      "zip stops when the shortest input is exhausted.",
      "Use any and all with readable boolean expressions.",
    ],
    syntax: "for index, (name, value) in enumerate(zip(names, values), start=1): …",
    example: {
      title: "Label paired readings",
      description: "Two sequences become one numbered report.",
      code: 'names = ["NX", "Atlas"]\nvalues = [88, 73]\nfor index, (name, value) in enumerate(zip(names, values), start=1):\n    print(f"{index}. {name}={value}")',
      output: "1. NX=88\n2. Atlas=73",
    },
    fieldNote:
      "When two lists must always stay aligned, consider storing records or objects instead. zip is best when separate sequences are already the correct input boundary.",
    mistakes: [
      "Incrementing a second manual counter beside enumerate.",
      "Assuming zip raises an error for unequal lengths.",
      "Building a list only to pass it immediately into any or all.",
    ],
    tasks: [
      outputTask(
        {
          id: "python-parallel-iteration-enumerate",
          title: "Number three specimens",
          description:
            "Use enumerate with start=1 to print a numbered report for Atlas, Nexus, and Prism.",
          expectedBehavior: "Print 1:Atlas, 2:Nexus, and 3:Prism.",
          starterCode:
            'names = ["Atlas", "Nexus", "Prism"]\n# Use enumerate, not a manual counter\n',
          hints: ["Unpack index and name in the loop header."],
        },
        "1:Atlas\n2:Nexus\n3:Prism",
      ),
      outputTask(
        {
          id: "python-parallel-iteration-zip",
          title: "Pair sensor arrays",
          description:
            "Zip the supplied names and values, then print one name=value line per pair.",
          expectedBehavior: "Print NX=88, ATLAS=73, and ECHO=41.",
          starterCode:
            'names = ["NX", "ATLAS", "ECHO"]\nvalues = [88, 73, 41]\n# Pair and report\n',
          hints: ["for name, value in zip(names, values):"],
        },
        "NX=88\nATLAS=73\nECHO=41",
      ),
    ],
    bonusTask: outputBonus(
      {
        id: "python-parallel-iteration-bonus",
        title: "Readiness matrix",
        description:
          "Pair names and energy values, report each READY when energy is at least 50, then print ANY and ALL readiness.",
        expectedBehavior:
          "Print NX:READY, ATLAS:READY, ECHO:WAIT, ANY=True, and ALL=False.",
        starterCode:
          'names = ["NX", "ATLAS", "ECHO"]\nenergy = [88, 73, 41]\n# Build one readiness list and report it\n',
        hints: [
          "Create booleans with a comprehension over energy.",
          "Use zip for the report and any/all for the summary.",
        ],
      },
      "NX:READY\nATLAS:READY\nECHO:WAIT\nANY=True\nALL=False",
      "Three previously independent coordinate channels lock into one verified matrix.",
    ),
    durationMinutes: 25,
  },
  {
    id: "python-testing-assertions",
    title: "Verification Chamber",
    subtitle: "Turn expectations into repeatable executable checks",
    objectives: [
      "Write focused assertions",
      "Test normal and boundary cases",
      "Separate pure logic from reporting",
    ],
    conceptHeading: "A test is an executable statement about expected behavior",
    explanation: [
      "assert compares an observed condition with the program contract and raises AssertionError when the expectation is false. Small tests make refactoring safer because accidental behavior changes become visible.",
      "Test representative normal input, boundaries, and one failure case. Pure functions are easiest to verify because the same input always produces the same output without hidden state.",
    ],
    bullets: [
      "Give each assertion one clear reason to fail.",
      "Cover lower and upper boundaries explicitly.",
      "Print success only after every assertion has passed.",
    ],
    syntax: 'assert actual == expected, "diagnostic message"',
    example: {
      title: "Verify a bounded function",
      description: "Three checks cover normal, lower, and upper behavior.",
      code: 'def clamp(value):\n    return max(0, min(100, value))\n\nassert clamp(40) == 40\nassert clamp(-3) == 0\nassert clamp(130) == 100\nprint("tests passed")',
      output: "tests passed",
    },
    fieldNote:
      "Assertions document developer expectations. Validate untrusted user input with explicit conditions and exceptions instead of relying on assert.",
    mistakes: [
      "Writing a test that repeats the implementation rather than the expected result.",
      "Testing only the easiest middle value.",
      "Catching every AssertionError and hiding a broken contract.",
    ],
    tasks: [
      outputTask(
        {
          id: "python-testing-assertions-clamp",
          title: "Verify an energy clamp",
          description:
            "Implement clamp(value, low, high), then make all four supplied assertions pass.",
          expectedBehavior: "Print CLAMP TESTS PASSED.",
          starterCode:
            'def clamp(value, low, high):\n    # Return value constrained to the interval\n    pass\n\nassert clamp(7, 0, 10) == 7\nassert clamp(-3, 0, 10) == 0\nassert clamp(18, 0, 10) == 10\nassert clamp(5, 5, 5) == 5\nprint("CLAMP TESTS PASSED")',
          hints: ["max(low, min(high, value)) handles every supplied case."],
        },
        "CLAMP TESTS PASSED",
      ),
      outputTask(
        {
          id: "python-testing-assertions-normalize",
          title: "Test a text boundary",
          description:
            "Implement normalize(text) to strip surrounding whitespace and lowercase text. Preserve internal spaces.",
          expectedBehavior: "After three assertions, print NORMALIZE TESTS PASSED.",
          starterCode:
            'def normalize(text):\n    # Normalize only the boundary and letter case\n    pass\n\nassert normalize("  NEXUS ") == "nexus"\nassert normalize("Field Note") == "field note"\nassert normalize("") == ""\nprint("NORMALIZE TESTS PASSED")',
          hints: ["Chain strip() and lower()."],
        },
        "NORMALIZE TESTS PASSED",
      ),
    ],
    bonusTask: outputBonus(
      {
        id: "python-testing-assertions-bonus",
        title: "Table-driven classifier tests",
        description:
          "Implement classify(score): invalid outside 0..100, high from 80, stable from 50, otherwise low. Verify every supplied case.",
        expectedBehavior: "Print 7 CASES VERIFIED.",
        starterCode:
          'def classify(score):\n    # Implement the complete contract\n    pass\n\ncases = [\n    (-1, "invalid"), (0, "low"), (49, "low"),\n    (50, "stable"), (79, "stable"), (80, "high"), (101, "invalid"),\n]\nfor score, expected in cases:\n    assert classify(score) == expected\nprint(f"{len(cases)} CASES VERIFIED")',
        hints: [
          "Reject the invalid range first.",
          "Check high before stable, then use the fallback.",
        ],
      },
      "7 CASES VERIFIED",
      "The Verification Chamber begins guarding every boundary in the scoring protocol.",
    ),
    durationMinutes: 28,
  },
  {
    id: "python-decorators",
    title: "Protocol Wrappers",
    subtitle: "Extend callable behavior without rewriting core logic",
    objectives: [
      "Recognize a function as a value",
      "Build and apply a decorator",
      "Preserve a wrapped function's result",
    ],
    conceptHeading: "A decorator receives a callable and returns a callable",
    explanation: [
      "Functions can be stored, passed, and returned like other Python values. A decorator wraps one function with reusable behavior such as logging, validation, counting, or timing.",
      "The wrapper should forward arguments and return the original result unless changing that contract is deliberate. Decorators are strongest for one concern shared by several functions.",
    ],
    bullets: [
      "Define the wrapper inside the decorator.",
      "Forward flexible arguments with *args and **kwargs.",
      "Return the wrapper, then apply the decorator with @name.",
    ],
    syntax:
      "def decorate(function):\n    def wrapper(*args, **kwargs):\n        return function(*args, **kwargs)\n    return wrapper",
    example: {
      title: "Trace a function call",
      description: "The decorator adds a visible protocol around existing logic.",
      code: 'def traced(function):\n    def wrapper(*args, **kwargs):\n        print(f"CALL:{function.__name__}")\n        return function(*args, **kwargs)\n    return wrapper\n\n@traced\ndef boost(value):\n    return value * 2\n\nprint(boost(9))',
      output: "CALL:boost\n18",
    },
    fieldNote:
      "Production decorators commonly use functools.wraps so metadata such as __name__ continues to describe the original function.",
    mistakes: [
      "Calling the function while returning the wrapper definition.",
      "Forgetting to return the wrapped result.",
      "Using a decorator for logic needed by only one simple function.",
    ],
    tasks: [
      outputTask(
        {
          id: "python-decorators-uppercase",
          title: "Uppercase a returned signal",
          description:
            "Complete uppercase_result so it converts the wrapped function's returned string to uppercase.",
          expectedBehavior: "Print NEXUS ONLINE.",
          starterCode:
            'def uppercase_result(function):\n    def wrapper(*args, **kwargs):\n        # Call, transform, and return\n        pass\n    return wrapper\n\n@uppercase_result\ndef status(name):\n    return f"{name} online"\n\nprint(status("nexus"))',
          hints: ["Call function(*args, **kwargs), then apply .upper()."],
        },
        "NEXUS ONLINE",
      ),
      outputTask(
        {
          id: "python-decorators-call-count",
          title: "Count protocol calls",
          description:
            "Complete counted so wrapper.calls increases on every call. Invoke pulse three times.",
          expectedBehavior: "Print 3.",
          starterCode:
            'def counted(function):\n    def wrapper(*args, **kwargs):\n        # Increment the wrapper counter and call the function\n        pass\n    wrapper.calls = 0\n    return wrapper\n\n@counted\ndef pulse():\n    return "ok"\n\npulse()\npulse()\npulse()\nprint(pulse.calls)',
          hints: ["Use wrapper.calls += 1 before forwarding the call."],
        },
        "3",
      ),
    ],
    bonusTask: outputBonus(
      {
        id: "python-decorators-bonus",
        title: "Validated input protocol",
        description:
          "Create require_non_negative so decorated numeric functions raise ValueError for a negative first argument. Report accepted and rejected calls.",
        expectedBehavior: "Print 18 then REJECTED.",
        starterCode:
          'def require_non_negative(function):\n    # Return a validating wrapper\n    pass\n\n@require_non_negative\ndef boost(value):\n    return value * 2\n\nprint(boost(9))\ntry:\n    boost(-2)\nexcept ValueError:\n    print("REJECTED")',
        hints: [
          "Define wrapper(value, *args, **kwargs).",
          "Raise ValueError before calling the function when value < 0.",
        ],
      },
      "18\nREJECTED",
      "A reusable validation membrane now surrounds every compatible signal function.",
    ),
    durationMinutes: 30,
  },
  {
    id: "python-systems-capstone",
    title: "Field Console",
    subtitle: "Combine streaming, validation, tests, and reporting",
    objectives: [
      "Design a staged processing system",
      "Verify the core rules with assertions",
      "Produce a deterministic operational report",
    ],
    conceptHeading: "A reliable system makes boundaries, stages, and evidence visible",
    explanation: [
      "The Field Console combines the complete Python path: parse external text, reject malformed records, stream accepted values through focused transformations, and format one stable report.",
      "Executable assertions verify the rules before the report runs. The result is not merely code that works once, but a small system whose behavior can be explained, tested, and extended.",
    ],
    bullets: [
      "Keep parsing separate from aggregation.",
      "Use a generator for accepted records.",
      "Verify edge cases before producing the final report.",
    ],
    syntax: "raw input → parser → validated generator → aggregation → verified report",
    example: {
      title: "Verified miniature pipeline",
      description: "A pure parser and an assertion protect the reporting stage.",
      code: 'def parse(line):\n    name, raw = line.split(":", 1)\n    return name.strip(), int(raw)\n\nassert parse(" NX : 8 ") == ("NX", 8)\nprint(parse("Atlas:13"))',
      output: "('Atlas', 13)",
    },
    fieldNote:
      "A capstone is complete when another developer can change one stage, rerun the tests, and understand whether the contract still holds.",
    mistakes: [
      "Silently accepting malformed or out-of-range values.",
      "Testing only after printing the final report.",
      "Depending on input order when the output contract requires sorting.",
    ],
    tasks: [
      outputTask(
        {
          id: "python-systems-capstone-stream",
          title: "Stream valid records",
          description:
            "Implement valid_records(lines): parse name:energy, ignore malformed values and energy outside 0..100, then print accepted records.",
          expectedBehavior: "Print Atlas=91, Nexus=77, and Prism=66.",
          starterCode:
            'def valid_records(lines):\n    # Yield normalized (name, energy) records\n    pass\n\nlines = ["Atlas:91", "broken", "Echo:140", "Nexus:77", "Prism:66"]\nfor name, energy in valid_records(lines):\n    print(f"{name}={energy}")',
          hints: [
            "Split once and catch ValueError.",
            "Yield only when name is non-empty and 0 <= energy <= 100.",
          ],
        },
        "Atlas=91\nNexus=77\nPrism=66",
      ),
      outputTask(
        {
          id: "python-systems-capstone-summary",
          title: "Verify and summarize",
          description:
            "Implement summarize(values) returning count, rounded mean, and maximum. Make the assertions pass, then print the report.",
          expectedBehavior: "Print COUNT=3, MEAN=78.0, MAX=91.",
          starterCode:
            'def summarize(values):\n    # Return (count, mean, maximum)\n    pass\n\nassert summarize([10]) == (1, 10.0, 10)\nassert summarize([2, 4]) == (2, 3.0, 4)\ncount, mean, maximum = summarize([91, 77, 66])\nprint(f"COUNT={count}")\nprint(f"MEAN={mean:.1f}")\nprint(f"MAX={maximum}")',
          hints: ["Use len, sum, and max.", "Return three values as a tuple."],
        },
        "COUNT=3\nMEAN=78.0\nMAX=91",
      ),
    ],
    bonusTask: outputBonus(
      {
        id: "python-systems-capstone-bonus",
        title: "Complete recovery console",
        description:
          "Read six name:energy lines, reject malformed/out-of-range records, sort valid records by energy descending then name, and print the operational summary.",
        expectedBehavior:
          "Report VALID=4, REJECTED=2, TOP=Atlas:91, AVERAGE=72.0, then the ordered names Atlas|Nexus|Prism|Echo.",
        starterCode:
          "raw_lines = [input() for _ in range(6)]\n# Parse, validate, verify, rank, and report\n",
        hints: [
          "Count every input that does not produce a valid record.",
          "Sort records with key=lambda item: (-item[1], item[0]).",
          "The valid energies are 91, 77, 66, and 54.",
        ],
        defaultInput: "Atlas:91\nbroken\nEcho:54\nNexus:77\nPrism:66\nLost:140",
      },
      "VALID=4\nREJECTED=2\nTOP=Atlas:91\nAVERAGE=72.0\nORDER=Atlas|Nexus|Prism|Echo",
      "The Verification Engine enters a stable cycle; Python Core now spans seven connected sectors.",
    ),
    durationMinutes: 45,
  },
];

export function createPythonSystemsWorld(firstPrerequisite: string): World {
  let previousLessonId = firstPrerequisite;
  const builtLessons = lessons.map((lesson, index) => {
    const built = createCurriculumLesson(
      "python",
      "python",
      "systems-laboratory",
      index + 1,
      lesson,
      previousLessonId,
    );
    previousLessonId = built.id;
    return built;
  });

  return {
    id: "systems-laboratory",
    trackId: "python",
    order: 7,
    title: "Systems Laboratory",
    subtitle: "Make Python programs observable, testable, and reusable",
    description:
      "Lazy streams, parallel iteration, executable tests, decorators, and a verified capstone turn isolated techniques into dependable systems.",
    landmark: "The Verification Engine",
    accent: "amber",
    status: "available",
    lessons: builtLessons,
  };
}
