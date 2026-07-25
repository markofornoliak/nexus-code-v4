import type { CurriculumWorldSpec } from "../_shared/defineLesson";
import { exactBonus, exactTask } from "./lessonTools";

export const javascriptV4World: CurriculumWorldSpec = {
  id: "state-reactor",
  title: "State Reactor",
  subtitle: "Build durable state, lazy protocols, and concurrent workflows",
  description:
    "Move beyond basic transformations into Maps, classes, closures, generators, and failure-aware Promise coordination inside the JavaScript Worker.",
  landmark: "The Temporal Relay",
  accent: "cyan",
  lessons: [
    {
      id: "javascript-map-set",
      title: "Identity Matrix",
      subtitle: "Model unique values and keyed records",
      objectives: [
        "Deduplicate values with Set",
        "Store arbitrary keyed data in Map",
        "Transform collection entries deterministically",
      ],
      conceptHeading: "Set and Map make identity an explicit data contract",
      explanation: [
        "Set stores each value once and provides constant-time average membership checks. Map keeps insertion-ordered key-value pairs without converting keys into object-property strings.",
        "Both collections are iterable. Convert, filter, or sort their values when a stable visible report is required.",
      ],
      bullets: [
        "Use Set for uniqueness and membership.",
        "Use Map when keys are dynamic or not just strings.",
        "Check Map.has when absence differs from a stored undefined.",
      ],
      syntax:
        'const seen = new Set(["A", "A", "B"]);\nconst energy = new Map([["A", 42]]);',
      example: {
        title: "Unique ordered channels",
        description: "Set preserves first-insertion order while removing duplicates.",
        code: 'const channels = new Set(["core", "ui", "core"]);\nconsole.log([...channels].join(">"));',
        output: "core>ui",
      },
      fieldNote:
        "Object is still excellent for fixed record shapes. Map is the stronger choice when keys themselves are application data.",
      mistakes: [
        "Reading a Map with bracket notation.",
        "Expecting Set to compare separate objects by their contents.",
        "Sorting a Set in place instead of converting it to an array.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-map-set-unique",
            title: "Deduplicate signal channels",
            description:
              "Remove duplicate channel names, sort them, and print the result plus count.",
            expectedBehavior: "Print atlas,core,relay and UNIQUE=3.",
            starterCode:
              'const channels = ["relay", "core", "relay", "atlas", "core"];\n// Deduplicate, sort, and report\n',
            hints: [
              "Construct a Set from channels.",
              "Spread the Set into an array before sorting.",
            ],
          },
          "atlas,core,relay\nUNIQUE=3",
        ),
        exactTask(
          {
            id: "javascript-map-set-energy",
            title: "Update a keyed energy ledger",
            description:
              "Create a Map, add 12 to Prism, and print entries sorted by key.",
            expectedBehavior: "Print Atlas:64 then Prism:100.",
            starterCode:
              'const energy = new Map([["Prism", 88], ["Atlas", 64]]);\n// Charge Prism and report sorted entries\n',
            hints: [
              "Use get and set to update Prism.",
              "Sort [...energy.entries()] by the key.",
            ],
          },
          "Atlas:64\nPrism:100",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-map-set-bonus",
          title: "Index repeated telemetry",
          description: "Count each reading with a Map and print keys alphabetically.",
          expectedBehavior: "Print fault=2, online=3, quiet=1.",
          starterCode:
            'const readings = ["online", "fault", "online", "quiet", "fault", "online"];\nconst counts = new Map();\n// Build and report the frequency index\n',
          hints: [
            "Default a missing count with counts.get(reading) ?? 0.",
            "Sort the keys before mapping them to key=value.",
          ],
        },
        "fault=2, online=3, quiet=1",
        "The Identity Matrix condenses repeated telemetry into a precise frequency signature.",
      ),
      durationMinutes: 28,
    },
    {
      id: "javascript-classes",
      title: "State Capsules",
      subtitle: "Protect invariants with classes and private fields",
      objectives: [
        "Initialize instances with constructors",
        "Encapsulate mutable state",
        "Expose behavior through methods and getters",
      ],
      conceptHeading: "A class packages state transitions behind a stable interface",
      explanation: [
        "Each new instance receives its own fields. Methods express allowed operations so callers do not need to reproduce validation rules.",
        "Private fields beginning with # are enforced by the JavaScript language. Getters can expose a read-only view while methods preserve invariants during mutation.",
      ],
      bullets: [
        "Validate constructor arguments at the boundary.",
        "Keep mutable details private.",
        "Return useful values from state-changing methods.",
      ],
      syntax:
        "class Cell {\n  #energy = 0;\n  charge(amount) { this.#energy += amount; }\n}",
      example: {
        title: "Bounded charge capsule",
        description: "The method keeps energy within its allowed range.",
        code: "class Cell {\n  #energy = 90;\n  charge(amount) { this.#energy = Math.min(100, this.#energy + amount); }\n  get energy() { return this.#energy; }\n}\nconst cell = new Cell();\ncell.charge(20);\nconsole.log(cell.energy);",
        output: "100",
      },
      fieldNote:
        "A class is valuable when several operations must protect the same invariant, not merely because a value can be placed inside an object.",
      mistakes: [
        "Forgetting this when accessing instance fields.",
        "Returning the private field before applying validation.",
        "Using one shared mutable object as a prototype value.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-classes-cell",
            title: "Construct a bounded cell",
            description:
              "Complete Cell so charge clamps energy from 0 to 100, then print two readings.",
            expectedBehavior: "Print 100 then 0.",
            starterCode:
              "class Cell {\n  #energy;\n  constructor(energy) {\n    // Initialize safely\n  }\n  charge(amount) {\n    // Apply a bounded transition\n  }\n  get energy() {\n    // Expose the reading\n  }\n}\n\nconst cell = new Cell(90);\ncell.charge(20);\nconsole.log(cell.energy);\ncell.charge(-150);\nconsole.log(cell.energy);\n",
            hints: [
              "Math.max(0, Math.min(100, value)) clamps a number.",
              "The getter returns this.#energy.",
            ],
          },
          "100\n0",
        ),
        exactTask(
          {
            id: "javascript-classes-inheritance",
            title: "Specialize a signal",
            description:
              "Complete PulseSignal so describe() extends the base output with frequency.",
            expectedBehavior: "Print NX:42Hz.",
            starterCode:
              'class Signal {\n  constructor(name) { this.name = name; }\n  describe() { return this.name; }\n}\n\nclass PulseSignal extends Signal {\n  constructor(name, frequency) {\n    // Initialize base and local state\n  }\n  describe() {\n    // Extend the base description\n  }\n}\n\nconsole.log(new PulseSignal("NX", 42).describe());\n',
            hints: [
              "Call super(name) before using this.",
              "Use super.describe() inside the override.",
            ],
          },
          "NX:42Hz",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-classes-bonus",
          title: "Observable reactor",
          description:
            "Create Reactor with private energy and history, then report all accepted transitions.",
          expectedBehavior: "Print ENERGY=75 and HISTORY=50>70>75.",
          starterCode:
            'class Reactor {\n  #energy;\n  #history;\n  constructor(initial) {\n    // Initialize bounded state and history\n  }\n  charge(amount) {\n    // Update and record\n  }\n  report() {\n    // Return an immutable summary object\n  }\n}\n\nconst reactor = new Reactor(50);\nreactor.charge(20);\nreactor.charge(5);\nconst report = reactor.report();\nconsole.log(`ENERGY=${report.energy}`);\nconsole.log(`HISTORY=${report.history.join(">")}`);\n',
          hints: [
            "Store a new history entry after each transition.",
            "Return a copy with [...this.#history].",
          ],
        },
        "ENERGY=75\nHISTORY=50>70>75",
        "The State Capsule reveals a complete history without exposing its mutable core.",
      ),
      durationMinutes: 34,
    },
    {
      id: "javascript-closures",
      title: "Closure Vault",
      subtitle: "Preserve private lexical state",
      objectives: [
        "Explain lexical scope",
        "Create stateful function factories",
        "Avoid accidental shared closure state",
      ],
      conceptHeading: "A closure retains access to the scope where it was created",
      explanation: [
        "When an inner function outlives the outer call, its referenced variables remain available. This enables factories, counters, configuration binding, and private state without a class.",
        "Each factory call creates a separate lexical environment. Place state inside the factory when instances must not interfere with one another.",
      ],
      bullets: [
        "Return a function that references outer variables.",
        "Use closures to bind configuration once.",
        "Keep large captured objects out of long-lived closures when unnecessary.",
      ],
      syntax: "function makeCounter() {\n  let value = 0;\n  return () => ++value;\n}",
      example: {
        title: "Independent counters",
        description: "Each factory call owns a separate value binding.",
        code: "function counter() { let n = 0; return () => ++n; }\nconst a = counter();\nconst b = counter();\nconsole.log(a(), a(), b());",
        output: "1 2 1",
      },
      fieldNote:
        "Closures are not automatically private when the captured object is also returned elsewhere. Privacy depends on the references you expose.",
      mistakes: [
        "Declaring state outside the factory and sharing it globally.",
        "Calling the factory on every use and resetting its state.",
        "Capturing a loop variable with the wrong declaration semantics.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-closures-counter",
            title: "Build independent pulse counters",
            description:
              "Complete makePulse so each returned function increments its own counter by step.",
            expectedBehavior: "Print 2,4,5,6.",
            starterCode:
              "function makePulse(step) {\n  // Capture a private count\n}\n\nconst even = makePulse(2);\nconst five = makePulse(5);\nconsole.log(even());\nconsole.log(even());\nconsole.log(five());\nconsole.log(even());\n",
            hints: [
              "Declare count inside makePulse.",
              "Return an inner function that updates and returns count.",
            ],
          },
          "2\n4\n5\n6",
        ),
        exactTask(
          {
            id: "javascript-closures-formatter",
            title: "Bind a reporting protocol",
            description:
              "Create makeFormatter(prefix, unit) and use it for two energy readings.",
            expectedBehavior: "Print NX-01:42u and NX-01:88u.",
            starterCode:
              'function makeFormatter(prefix, unit) {\n  // Return a configured formatter\n}\n\nconst formatEnergy = makeFormatter("NX-01", "u");\nconsole.log(formatEnergy(42));\nconsole.log(formatEnergy(88));\n',
            hints: [
              "Return a function accepting value.",
              "The inner function can use both outer parameters.",
            ],
          },
          "NX-01:42u\nNX-01:88u",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-closures-bonus",
          title: "Rate-limited channel",
          description:
            "Create a channel that accepts only its first three transmissions and then returns SEALED.",
          expectedBehavior: "Print A, B, C, SEALED.",
          starterCode:
            'function createChannel(limit) {\n  // Capture remaining capacity\n}\n\nconst transmit = createChannel(3);\nfor (const value of ["A", "B", "C", "D"]) {\n  console.log(transmit(value));\n}\n',
          hints: [
            "Keep a sent counter inside the factory.",
            "Increment only accepted transmissions.",
          ],
        },
        "A\nB\nC\nSEALED",
        "The Closure Vault seals itself exactly when its private transmission budget is exhausted.",
      ),
      durationMinutes: 30,
    },
    {
      id: "javascript-generators",
      title: "Lazy Sequence Engine",
      subtitle: "Produce values on demand with generators",
      objectives: [
        "Write a generator with function*",
        "Yield a controlled sequence",
        "Compose lazy filtering pipelines",
      ],
      conceptHeading: "A generator pauses its execution between yielded values",
      explanation: [
        "Calling a generator function creates an iterator without running the entire body. Each next() resumes work until the next yield or return.",
        "Generators represent large or open-ended sequences without allocating every value. Consumers decide how many values to request.",
      ],
      bullets: [
        "Use function* and yield.",
        "Stop infinite generators from the consumer side.",
        "Keep yielded values deterministic and side effects explicit.",
      ],
      syntax:
        "function* range(limit) {\n  for (let i = 0; i < limit; i += 1) yield i;\n}",
      example: {
        title: "Demand three values",
        description: "The spread operator consumes the finite generator.",
        code: 'function* values() { yield 2; yield 4; yield 8; }\nconsole.log([...values()].join(","));',
        output: "2,4,8",
      },
      fieldNote:
        "Spreading an infinite generator never finishes. Consume it with a deliberate bound.",
      mistakes: [
        "Writing function instead of function*.",
        "Returning each sequence value instead of yielding it.",
        "Expanding an unbounded generator into an array.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-generators-range",
            title: "Generate calibrated steps",
            description:
              "Complete range(start, end, step) and print values from 2 through 8.",
            expectedBehavior: "Print 2,4,6,8.",
            starterCode:
              'function* range(start, end, step) {\n  // Yield an inclusive ascending range\n}\n\nconsole.log([...range(2, 8, 2)].join(","));\n',
            hints: ["Use a for loop with value <= end.", "yield value inside the loop."],
          },
          "2,4,6,8",
        ),
        exactTask(
          {
            id: "javascript-generators-filter",
            title: "Filter a lazy current",
            description:
              "Write above(source, threshold) and yield only values greater than 40.",
            expectedBehavior: "Print 55,88.",
            starterCode:
              'function* above(source, threshold) {\n  // Filter lazily\n}\n\nconst readings = [12, 55, 31, 88];\nconsole.log([...above(readings, 40)].join(","));\n',
            hints: [
              "Generators can iterate any iterable with for...of.",
              "Yield only when the condition is true.",
            ],
          },
          "55,88",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-generators-bonus",
          title: "Bound an infinite pulse",
          description:
            "Create an infinite powersOfTwo generator but consume exactly six values.",
          expectedBehavior: "Print 1>2>4>8>16>32.",
          starterCode:
            'function* powersOfTwo() {\n  // Yield forever\n}\n\nconst values = [];\n// Consume exactly six values\nconsole.log(values.join(">"));\n',
          hints: [
            "Use while (true) inside the generator.",
            "Break the consumer loop after six pushes.",
          ],
        },
        "1>2>4>8>16>32",
        "The Lazy Sequence Engine opens an endless channel while the consumer remains in control.",
      ),
      durationMinutes: 32,
    },
    {
      id: "javascript-promise-coordination",
      title: "Temporal Relay",
      subtitle: "Coordinate concurrent success and partial failure",
      objectives: [
        "Run independent promises concurrently",
        "Compare Promise.all and Promise.allSettled",
        "Create a deterministic aggregate report",
      ],
      conceptHeading:
        "Promise coordination turns several future values into one decision",
      explanation: [
        "Promise.all preserves input order and rejects when any input rejects. It is appropriate when the complete result requires every operation.",
        "Promise.allSettled waits for all operations and describes each outcome. It supports dashboards, batch processing, and partial recovery where one failure must not erase other results.",
      ],
      bullets: [
        "Start independent work before awaiting it.",
        "Use all for all-or-nothing contracts.",
        "Use allSettled for complete outcome inventories.",
      ],
      syntax:
        "const results = await Promise.all([loadA(), loadB()]);\nconst outcomes = await Promise.allSettled(tasks);",
      example: {
        title: "Preserve request order",
        description: "Promise.all reports values in input order.",
        code: 'const values = await Promise.all([Promise.resolve("A"), Promise.resolve("B")]);\nconsole.log(values.join(">"));',
        output: "A>B",
      },
      fieldNote:
        "Promise concurrency does not make CPU-heavy JavaScript parallel. Dedicated Workers remain the boundary for CPU isolation.",
      mistakes: [
        "Awaiting each independent promise before starting the next.",
        "Reading value from a rejected allSettled result.",
        "Assuming Promise.all returns completion order.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-promises-all",
            title: "Aggregate concurrent readings",
            description: "Resolve three readings with Promise.all and print their total.",
            expectedBehavior: "Print TOTAL=126.",
            starterCode:
              "const requests = [\n  Promise.resolve(40),\n  Promise.resolve(42),\n  Promise.resolve(44),\n];\n// Await together and report the sum\n",
            hints: [
              "Use await Promise.all(requests).",
              "Reduce the resulting numeric array.",
            ],
          },
          "TOTAL=126",
        ),
        exactTask(
          {
            id: "javascript-promises-settled",
            title: "Inventory every outcome",
            description:
              "Use allSettled and print OK values plus the number of failures.",
            expectedBehavior: "Print OK=42,88 and FAILED=1.",
            starterCode:
              'const requests = [\n  Promise.resolve(42),\n  Promise.reject(new Error("offline")),\n  Promise.resolve(88),\n];\n// Wait for every outcome and summarize\n',
            hints: [
              "Filter outcomes by status.",
              "Fulfilled outcomes have a value field.",
            ],
          },
          "OK=42,88\nFAILED=1",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-promises-bonus",
          title: "Retry a transient relay",
          description:
            "Implement withRetry(operation, attempts) so the supplied operation succeeds on its third call.",
          expectedBehavior: "Print VALUE=online and ATTEMPTS=3.",
          starterCode:
            'async function withRetry(operation, attempts) {\n  // Retry rejected calls up to attempts\n}\n\nlet calls = 0;\nasync function unstable() {\n  calls += 1;\n  if (calls < 3) throw new Error("transient");\n  return "online";\n}\n\nconst value = await withRetry(unstable, 3);\nconsole.log(`VALUE=${value}`);\nconsole.log(`ATTEMPTS=${calls}`);\n',
          hints: [
            "Catch inside a loop and rethrow only after the final attempt.",
            "Return immediately when operation resolves.",
          ],
        },
        "VALUE=online\nATTEMPTS=3",
        "The Temporal Relay survives a transient fault and records the exact recovery cost.",
      ),
      durationMinutes: 40,
    },
  ],
};
