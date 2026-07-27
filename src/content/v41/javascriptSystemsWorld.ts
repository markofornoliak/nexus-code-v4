import type { CurriculumWorldSpec } from "../_shared/defineLesson";
import { exactBonus, exactTask } from "../v4/lessonTools";

export const javascriptSystemsWorld: CurriculumWorldSpec = {
  id: "runtime-orchestration",
  title: "Runtime Orchestration",
  subtitle: "Coordinate events, state, concurrency, caches, and telemetry",
  description:
    "Build the architectural patterns behind robust browser applications: event channels, reducer state machines, controlled concurrency, memoized computation, and observable runtime pipelines.",
  landmark: "The Coordination Mesh",
  accent: "cyan",
  lessons: [
    {
      id: "javascript-event-bus",
      title: "Event Channel Mesh",
      subtitle: "Decouple producers from consumers with publish and subscribe",
      objectives: [
        "Model named event channels",
        "Subscribe and unsubscribe safely",
        "Define deterministic delivery semantics",
      ],
      conceptHeading: "An event bus routes facts without coupling every participant",
      explanation: [
        "A publisher announces that something happened; subscribers decide how to react. A small event bus keeps this relationship explicit by mapping event names to listener collections.",
        "Subscription should return an unsubscribe function. Copying the listener set before delivery prevents mutation during one callback from corrupting the current dispatch cycle.",
      ],
      bullets: [
        "Use Set to avoid duplicate listeners.",
        "Return an unsubscribe closure from subscribe.",
        "Define whether errors stop delivery or are isolated.",
      ],
      syntax:
        "const channels = new Map();\nfunction emit(name, payload) {\n  for (const listener of channels.get(name) ?? []) listener(payload);\n}",
      example: {
        title: "Two listeners, one fact",
        description: "Both subscribers receive the same immutable-style payload.",
        code: "const listeners = new Set();\nlisteners.add(value => console.log(`A:${value}`));\nlisteners.add(value => console.log(`B:${value}`));\nfor (const listener of listeners) listener(42);",
        output: "A:42\nB:42",
      },
      fieldNote:
        "Events represent completed facts. Use commands or direct function calls when a caller needs an immediate return value or guaranteed failure handling.",
      mistakes: [
        "Keeping listeners forever and creating memory leaks.",
        "Mutating a Set while iterating it without defined semantics.",
        "Using vague event names that hide the domain contract.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-event-bus-core",
            title: "Build a small event bus",
            description:
              "Complete subscribe and emit so two listeners receive a signal in registration order.",
            expectedBehavior: "Print A:42 then B:42.",
            starterCode:
              'const channels = new Map();\n\nfunction subscribe(name, listener) {\n  // Register listener and return an unsubscribe function\n}\n\nfunction emit(name, payload) {\n  // Deliver to a stable snapshot\n}\n\nsubscribe("energy", value => console.log(`A:${value}`));\nsubscribe("energy", value => console.log(`B:${value}`));\nemit("energy", 42);\n',
            hints: [
              "Create a Set when the channel is absent.",
              "Iterate over [...listeners] inside emit.",
            ],
          },
          "A:42\nB:42",
        ),
        exactTask(
          {
            id: "javascript-event-bus-unsubscribe",
            title: "Detach a listener",
            description:
              "Implement on so the returned function removes exactly one listener.",
            expectedBehavior: "Print first:1, second:1, second:2.",
            starterCode:
              "const listeners = new Set();\n\nfunction on(listener) {\n  // Add and return a removal closure\n}\n\nfunction publish(value) {\n  for (const listener of [...listeners]) listener(value);\n}\n\nconst offFirst = on(value => console.log(`first:${value}`));\non(value => console.log(`second:${value}`));\npublish(1);\noffFirst();\npublish(2);\n",
            hints: [
              "Set.add registers the function object.",
              "The closure calls listeners.delete(listener).",
            ],
          },
          "first:1\nsecond:1\nsecond:2",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-event-bus-once-bonus",
          title: "Create a one-shot channel",
          description:
            "Implement once so its listener automatically detaches before the second emit.",
          expectedBehavior: "Print BOOT:alpha once.",
          starterCode:
            'const channels = new Map();\n\nfunction subscribe(name, listener) {\n  const set = channels.get(name) ?? new Set();\n  set.add(listener);\n  channels.set(name, set);\n  return () => set.delete(listener);\n}\n\nfunction once(name, listener) {\n  // Subscribe a wrapper that removes itself\n}\n\nfunction emit(name, payload) {\n  for (const listener of [...(channels.get(name) ?? [])]) listener(payload);\n}\n\nonce("boot", value => console.log(`BOOT:${value}`));\nemit("boot", "alpha");\nemit("boot", "beta");\n',
          hints: [
            "Declare off before assigning the unsubscribe function.",
            "Call off inside the wrapper before listener(payload).",
          ],
        },
        "BOOT:alpha",
        "The mesh closes a one-time initialization channel immediately after successful delivery.",
      ),
      durationMinutes: 32,
    },
    {
      id: "javascript-reducers",
      title: "Deterministic State Reactor",
      subtitle: "Model state transitions as pure reducer functions",
      objectives: [
        "Represent actions as explicit objects",
        "Return new state without mutation",
        "Protect transition invariants",
      ],
      conceptHeading: "A reducer turns previous state and an action into next state",
      explanation: [
        "Reducers make transitions replayable because their output depends only on the current state and action. This is useful for UI state, workflows, undo histories, tests, and event-derived systems.",
        "Returning new objects preserves previous snapshots. A default branch should keep unknown actions harmless and visible to tooling.",
      ],
      bullets: [
        "Keep actions small and named by intent.",
        "Never mutate the input state.",
        "Clamp or reject values at the transition boundary.",
      ],
      syntax:
        "function reducer(state, action) {\n  switch (action.type) {\n    case 'charge': return { ...state, energy: state.energy + action.amount };\n    default: return state;\n  }\n}",
      example: {
        title: "Replayable transitions",
        description: "The original state remains unchanged after the action.",
        code: "const state = { energy: 10 };\nconst next = { ...state, energy: state.energy + 5 };\nconsole.log(state.energy, next.energy);",
        output: "10 15",
      },
      fieldNote:
        "Pure reducers can still call pure helper functions. Keep network requests, timers, and random values outside the reducer and place their results in actions.",
      mistakes: [
        "Changing state before returning it.",
        "Using one action type for several unrelated transitions.",
        "Ignoring invalid transitions that should preserve an invariant.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-reducers-energy",
            title: "Implement bounded transitions",
            description:
              "Complete reducer so charge and drain keep energy between 0 and 100 without mutating initial.",
            expectedBehavior: "Print 50,100,0.",
            starterCode:
              'function reducer(state, action) {\n  // Return a new state for charge and drain\n}\n\nconst initial = { energy: 50 };\nconst charged = reducer(initial, { type: "charge", amount: 80 });\nconst drained = reducer(charged, { type: "drain", amount: 150 });\nconsole.log(initial.energy);\nconsole.log(charged.energy);\nconsole.log(drained.energy);\n',
            hints: [
              "Use Math.min for charge and Math.max for drain.",
              "Spread state into each returned object.",
            ],
          },
          "50\n100\n0",
        ),
        exactTask(
          {
            id: "javascript-reducers-history",
            title: "Replay an action log",
            description:
              "Use reduce with transition to recover final count and preserve the original action array.",
            expectedBehavior: "Print COUNT=4 and ACTIONS=4.",
            starterCode:
              'const actions = [\n  { type: "add", value: 3 },\n  { type: "add", value: 4 },\n  { type: "reset" },\n  { type: "add", value: 4 },\n];\n\nfunction transition(state, action) {\n  // Implement add and reset\n}\n\nconst finalState = actions.reduce(transition, { count: 0 });\nconsole.log(`COUNT=${finalState.count}`);\nconsole.log(`ACTIONS=${actions.length}`);\n',
            hints: [
              "reset returns { count: 0 }.",
              "Unknown actions return state unchanged.",
            ],
          },
          "COUNT=4\nACTIONS=4",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-reducers-undo-bonus",
          title: "Add one-level undo",
          description:
            "Implement a reducer with present and past arrays so undo restores the previous energy.",
          expectedBehavior: "Print ENERGY=30 and HISTORY=1.",
          starterCode:
            'function reducer(state, action) {\n  // charge stores the previous value; undo restores it\n}\n\nlet state = { energy: 10, past: [] };\nstate = reducer(state, { type: "charge", amount: 20 });\nstate = reducer(state, { type: "charge", amount: 15 });\nstate = reducer(state, { type: "undo" });\nconsole.log(`ENERGY=${state.energy}`);\nconsole.log(`HISTORY=${state.past.length}`);\n',
          hints: [
            "For charge, append state.energy to past.",
            "For undo, read the last item and slice it away.",
          ],
        },
        "ENERGY=30\nHISTORY=1",
        "The reactor reconstructs a prior state without mutating its archived snapshots.",
      ),
      durationMinutes: 34,
    },
    {
      id: "javascript-concurrency",
      title: "Concurrent Signal Array",
      subtitle: "Coordinate independent asynchronous work",
      objectives: [
        "Distinguish sequential and concurrent awaiting",
        "Use Promise.all and Promise.allSettled",
        "Preserve result ordering and failure visibility",
      ],
      conceptHeading: "Concurrency begins work before waiting for every result",
      explanation: [
        "Independent promises can run at the same time when they are created before awaiting. Promise.all preserves input order but rejects on the first failure; Promise.allSettled reports every outcome.",
        "Choose the combinator from the business contract. A screen that requires every resource may fail fast, while a telemetry panel may render partial success and list rejected channels.",
      ],
      bullets: [
        "Start independent operations before awaiting.",
        "Use allSettled when partial results matter.",
        "Map outcomes into explicit success and failure records.",
      ],
      syntax: "const results = await Promise.allSettled(tasks.map(task => task()));",
      example: {
        title: "Ordered concurrent values",
        description: "Promise.all keeps result order even when completion order differs.",
        code: "const values = await Promise.all([Promise.resolve('A'), Promise.resolve('B')]);\nconsole.log(values.join('>'));",
        output: "A>B",
      },
      fieldNote:
        "Concurrency is not unlimited parallelism. Real systems should bound the number of simultaneous network or CPU-heavy operations.",
      mistakes: [
        "Awaiting each independent operation before starting the next.",
        "Using Promise.all when one failure should not hide other outcomes.",
        "Assuming settlement order matches input order.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-concurrency-all",
            title: "Aggregate independent channels",
            description:
              "Start all read functions and print their values in the original function order.",
            expectedBehavior: "Print atlas|core|prism.",
            starterCode:
              'const readers = [\n  () => Promise.resolve("atlas"),\n  () => Promise.resolve("core"),\n  () => Promise.resolve("prism"),\n];\n\n// Start and await every reader concurrently\n',
            hints: [
              "Map each function to function().",
              "Await Promise.all and join the resulting array.",
            ],
          },
          "atlas|core|prism",
        ),
        exactTask(
          {
            id: "javascript-concurrency-settled",
            title: "Report partial success",
            description:
              "Use allSettled to print fulfilled values and rejected reasons without aborting.",
            expectedBehavior: "Print OK:A, ERROR:offline, OK:C.",
            starterCode:
              'const tasks = [\n  Promise.resolve("A"),\n  Promise.reject(new Error("offline")),\n  Promise.resolve("C"),\n];\n\nconst outcomes = await Promise.allSettled(tasks);\n// Report every outcome in input order\n',
            hints: [
              "Check outcome.status.",
              "Rejected reasons are Error objects here, so read reason.message.",
            ],
          },
          "OK:A\nERROR:offline\nOK:C",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-concurrency-pool-bonus",
          title: "Build a bounded worker pool",
          description:
            "Process numeric jobs with two logical workers and print results in original order.",
          expectedBehavior: "Print 2,4,6,8,10.",
          starterCode:
            'async function runPool(items, limit, worker) {\n  // Process with at most limit active worker loops\n}\n\nconst results = await runPool([1, 2, 3, 4, 5], 2, async value => value * 2);\nconsole.log(results.join(","));\n',
          hints: [
            "Keep a shared nextIndex counter and a results array.",
            "Start Math.min(limit, items.length) async loops with Promise.all.",
          ],
        },
        "2,4,6,8,10",
        "The array bounds concurrency while preserving each job's original coordinate.",
      ),
      durationMinutes: 38,
    },
    {
      id: "javascript-memoization",
      title: "Computation Cache",
      subtitle: "Reuse deterministic results without stale behavior",
      objectives: [
        "Identify pure cacheable computations",
        "Build stable cache keys",
        "Track hits, misses, and invalidation",
      ],
      conceptHeading: "Memoization trades memory for avoided repeated computation",
      explanation: [
        "A memoized function stores results by input key. It is safe when the function is deterministic and the key fully represents every input that affects the result.",
        "Caches need boundaries: size limits, expiration, invalidation, or lifecycle ownership. Hidden unbounded caches turn a speed optimization into a memory leak.",
      ],
      bullets: [
        "Cache only pure or explicitly versioned work.",
        "Distinguish a missing key from a cached undefined value.",
        "Expose cache behavior when diagnosis matters.",
      ],
      syntax: "const cache = new Map();\nif (cache.has(key)) return cache.get(key);",
      example: {
        title: "One calculation, two reads",
        description: "The second call returns the stored result.",
        code: "const cache = new Map();\nlet calls = 0;\nfunction square(n) {\n  if (cache.has(n)) return cache.get(n);\n  calls += 1;\n  const value = n * n;\n  cache.set(n, value);\n  return value;\n}\nsquare(8); square(8);\nconsole.log(calls);",
        output: "1",
      },
      fieldNote:
        "JSON.stringify is not a universal stable key for objects. Property order, unsupported values, and large inputs can make it incorrect or expensive.",
      mistakes: [
        "Caching a result that depends on mutable external state.",
        "Using truthiness instead of Map.has for cached zero or undefined.",
        "Never evicting entries from a long-lived cache.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-memoization-core",
            title: "Memoize a deterministic function",
            description:
              "Complete memoize so repeated arguments reuse results and calls remains 2.",
            expectedBehavior: "Print 25,25,36,CALLS=2.",
            starterCode:
              "function memoize(functionToCache) {\n  // Return a one-argument cached wrapper\n}\n\nlet calls = 0;\nconst square = memoize(value => {\n  calls += 1;\n  return value * value;\n});\nconsole.log(square(5));\nconsole.log(square(5));\nconsole.log(square(6));\nconsole.log(`CALLS=${calls}`);\n",
            hints: [
              "Create the Map once inside memoize.",
              "Use cache.has(value) before computing.",
            ],
          },
          "25\n25\n36\nCALLS=2",
        ),
        exactTask(
          {
            id: "javascript-memoization-lru",
            title: "Limit cache size",
            description:
              "Implement remember so the oldest key is evicted when the third distinct value is stored.",
            expectedBehavior: "Print A=false, B=true, C=true.",
            starterCode:
              'const cache = new Map();\n\nfunction remember(key, value, limit = 2) {\n  // Refresh existing keys and evict the oldest when needed\n}\n\nremember("A", 1);\nremember("B", 2);\nremember("C", 3);\nconsole.log(`A=${cache.has("A")}`);\nconsole.log(`B=${cache.has("B")}`);\nconsole.log(`C=${cache.has("C")}`);\n',
            hints: [
              "Delete an existing key before setting it to refresh insertion order.",
              "The oldest key is cache.keys().next().value.",
            ],
          },
          "A=false\nB=true\nC=true",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-memoization-stats-bonus",
          title: "Expose cache diagnostics",
          description:
            "Return a cached function with stats() that reports hits, misses, and size.",
          expectedBehavior: "Print HITS=2 MISSES=2 SIZE=2.",
          starterCode:
            "function instrumentedMemo(functionToCache) {\n  // Return a wrapper with wrapper.stats()\n}\n\nconst double = instrumentedMemo(value => value * 2);\ndouble(2);\ndouble(2);\ndouble(3);\ndouble(2);\nconst stats = double.stats();\nconsole.log(`HITS=${stats.hits} MISSES=${stats.misses} SIZE=${stats.size}`);\n",
          hints: [
            "Keep hits and misses in the factory closure.",
            "Assign a stats function as a property of wrapper.",
          ],
        },
        "HITS=2 MISSES=2 SIZE=2",
        "The cache exposes its own operational value instead of hiding behind perceived speed.",
      ),
      durationMinutes: 36,
    },
    {
      id: "javascript-runtime-capstone",
      title: "Coordination Mesh",
      subtitle: "Build an observable asynchronous state pipeline",
      objectives: [
        "Connect events to pure state transitions",
        "Aggregate partial asynchronous results",
        "Produce deterministic runtime telemetry",
      ],
      conceptHeading:
        "Robust runtime architecture separates facts, transitions, and effects",
      explanation: [
        "Events describe facts, reducers calculate next state, and asynchronous effects acquire external results. Keeping these roles separate makes a system easier to test and replay.",
        "Operational telemetry should report successes, failures, and final state without changing the underlying domain behavior. Stable ordering makes incidents comparable across runs.",
      ],
      bullets: [
        "Translate effect outcomes into actions.",
        "Keep the reducer synchronous and pure.",
        "Render telemetry from recorded facts rather than scattered logs.",
      ],
      syntax:
        "const outcomes = await Promise.allSettled(requests);\nstate = outcomes.reduce((state, outcome) => reducer(state, toAction(outcome)), initial);",
      example: {
        title: "Outcome-driven state",
        description: "Fulfilled and rejected operations become explicit counts.",
        code: "const outcomes = await Promise.allSettled([Promise.resolve(1), Promise.reject('x')]);\nconst state = outcomes.reduce((s, o) => ({ ...s, [o.status]: s[o.status] + 1 }), { fulfilled: 0, rejected: 0 });\nconsole.log(state);",
        output: '{"fulfilled":1,"rejected":1}',
      },
      fieldNote:
        "Architecture is useful when it clarifies change and failure. Do not add event buses, reducers, and caches to a small linear script without a concrete coordination problem.",
      mistakes: [
        "Mutating state inside asynchronous callbacks.",
        "Logging failures without reflecting them in system state.",
        "Letting one rejected promise abort every independent result.",
      ],
      tasks: [
        exactTask(
          {
            id: "javascript-runtime-capstone-state",
            title: "Reduce runtime outcomes",
            description:
              "Convert settled outcomes into a state summary with success values and error messages.",
            expectedBehavior: "Print VALUES=A|C, ERRORS=offline, TOTAL=3.",
            starterCode:
              'const operations = [\n  Promise.resolve("A"),\n  Promise.reject(new Error("offline")),\n  Promise.resolve("C"),\n];\n\nconst outcomes = await Promise.allSettled(operations);\nconst initial = { values: [], errors: [], total: 0 };\nconst state = outcomes.reduce((current, outcome) => {\n  // Return the next immutable state\n}, initial);\n\nconsole.log(`VALUES=${state.values.join("|")}`);\nconsole.log(`ERRORS=${state.errors.join("|")}`);\nconsole.log(`TOTAL=${state.total}`);\n',
            hints: [
              "Increment total in both branches.",
              "Append with [...current.values, outcome.value] or the error message equivalent.",
            ],
          },
          "VALUES=A|C\nERRORS=offline\nTOTAL=3",
        ),
        exactTask(
          {
            id: "javascript-runtime-capstone-events",
            title: "Drive state from events",
            description:
              "Complete dispatch so actions update state through reducer and notify subscribers after each transition.",
            expectedBehavior: "Print 5 then 12 then FINAL=12.",
            starterCode:
              'let state = { energy: 0 };\nconst subscribers = new Set();\n\nfunction reducer(current, action) {\n  if (action.type === "charge") return { energy: current.energy + action.amount };\n  return current;\n}\n\nfunction subscribe(listener) {\n  subscribers.add(listener);\n  return () => subscribers.delete(listener);\n}\n\nfunction dispatch(action) {\n  // Transition and publish the new state\n}\n\nsubscribe(current => console.log(current.energy));\ndispatch({ type: "charge", amount: 5 });\ndispatch({ type: "charge", amount: 7 });\nconsole.log(`FINAL=${state.energy}`);\n',
            hints: [
              "Assign state = reducer(state, action).",
              "Notify a snapshot of subscribers with the new state.",
            ],
          },
          "5\n12\nFINAL=12",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "javascript-runtime-capstone-bonus",
          title: "Create an observable cached loader",
          description:
            "Build load so duplicate keys reuse promises, outcomes emit telemetry, and the final report is deterministic.",
          expectedBehavior: "Print MISS:A, HIT:A, MISS:B, RESULTS=A|A|B, REQUESTS=2.",
          starterCode:
            'const cache = new Map();\nlet requests = 0;\n\nfunction load(key) {\n  // Cache the in-flight promise and report HIT or MISS\n}\n\nconst results = await Promise.all([load("A"), load("A"), load("B")]);\nconsole.log(`RESULTS=${results.join("|")}`);\nconsole.log(`REQUESTS=${requests}`);\n',
          hints: [
            "On a hit, log before returning cache.get(key).",
            "On a miss, increment requests and cache Promise.resolve(key).",
          ],
        },
        "MISS:A\nHIT:A\nMISS:B\nRESULTS=A|A|B\nREQUESTS=2",
        "The Coordination Mesh deduplicates in-flight work while keeping every cache decision observable.",
      ),
      durationMinutes: 44,
    },
  ],
};
