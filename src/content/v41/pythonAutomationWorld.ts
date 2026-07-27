import type { CurriculumWorldSpec } from "../_shared/defineLesson";
import { exactBonus, exactTask } from "../v4/lessonTools";

export const pythonAutomationWorld: CurriculumWorldSpec = {
  id: "automation-forge",
  title: "Automation Forge",
  subtitle: "Build reusable protocols for reliable Python operations",
  description:
    "Move beyond isolated scripts with lazy pipelines, behavior wrappers, resource protocols, executable tests, and a production-style automation capstone.",
  landmark: "The Orchestration Engine",
  accent: "cyan",
  lessons: [
    {
      id: "python-generators",
      title: "Generator Pipelines",
      subtitle: "Process sequences without materializing every value",
      objectives: [
        "Explain lazy iteration",
        "Build generator functions with yield",
        "Compose memory-efficient processing stages",
      ],
      conceptHeading: "A generator produces the next value only when the consumer asks",
      explanation: [
        "A generator function pauses at yield and retains its local state. This makes it possible to process large or unbounded streams without building a complete list first.",
        "Generator expressions and yield from let small stages compose into readable pipelines. The consumer controls how far the pipeline advances.",
      ],
      bullets: [
        "Use yield instead of accumulating a result list.",
        "Keep stages focused on one transformation.",
        "Convert to a list only at a boundary that truly needs all values.",
      ],
      syntax:
        "def active(readings):\n    for reading in readings:\n        if reading > 0:\n            yield reading",
      example: {
        title: "Demand-driven recovery",
        description: "Only the first three transformed values are requested.",
        code: "def squares():\n    number = 1\n    while True:\n        yield number * number\n        number += 1\n\nstream = squares()\nprint([next(stream) for _ in range(3)])",
        output: "[1, 4, 9]",
      },
      fieldNote:
        "A lazy pipeline is not automatically faster. Its primary advantage is bounded memory and the ability to stop early.",
      mistakes: [
        "Returning a value instead of yielding multiple values.",
        "Trying to reuse an exhausted generator object.",
        "Hiding side effects inside a stage that appears to be a pure transformation.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-generators-filter",
            title: "Filter an energy stream",
            description:
              "Complete positive_even so it lazily yields only positive even readings.",
            expectedBehavior: "Print 2|8|12.",
            starterCode:
              'def positive_even(readings):\n    # Yield accepted readings one at a time\n    pass\n\nvalues = [-4, 2, 3, 8, 0, 12, -2]\nprint("|".join(str(value) for value in positive_even(values)))\n',
            hints: [
              "Loop over readings inside the generator.",
              "A value is even when value % 2 == 0.",
            ],
          },
          "2|8|12",
        ),
        exactTask(
          {
            id: "python-generators-pipeline",
            title: "Compose a lazy pipeline",
            description:
              "Implement normalize and label, then compose them without intermediate lists.",
            expectedBehavior: "Print NX-20,NX-30,NX-40.",
            starterCode:
              'def normalize(values):\n    # Yield values multiplied by ten\n    pass\n\ndef label(values):\n    # Yield NX-<value> strings\n    pass\n\npipeline = label(normalize(range(2, 5)))\nprint(",".join(pipeline))\n',
            hints: [
              "Each function should contain a for loop and yield.",
              "Pass the generator returned by normalize directly to label.",
            ],
          },
          "NX-20,NX-30,NX-40",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-generators-window-bonus",
          title: "Recover sliding windows",
          description:
            "Create windows(values, size) that lazily yields overlapping tuples.",
          expectedBehavior: "Print (1, 2, 3);(2, 3, 4);(3, 4, 5).",
          starterCode:
            'def windows(values, size):\n    # Yield every complete overlapping tuple\n    pass\n\nprint(";".join(str(window) for window in windows([1, 2, 3, 4, 5], 3)))\n',
          hints: [
            "Convert the finite input to a list for indexed slicing.",
            "The last valid start is len(items) - size.",
          ],
        },
        "(1, 2, 3);(2, 3, 4);(3, 4, 5)",
        "The forge emits overlapping observation frames without exposing its indexing machinery.",
      ),
      durationMinutes: 32,
    },
    {
      id: "python-decorator-protocols",
      title: "Protocol Wrappers",
      subtitle: "Add reusable behavior around functions",
      objectives: [
        "Explain functions as first-class values",
        "Preserve metadata with functools.wraps",
        "Build parameterized decorators",
      ],
      conceptHeading: "A decorator replaces a function with a controlled wrapper",
      explanation: [
        "Functions can be passed, returned, and stored like other values. A decorator receives a function and returns another callable that may validate, measure, retry, cache, or log the original operation.",
        "functools.wraps copies identifying metadata and exposes the wrapped function. Parameterized decorators add an outer factory layer for configuration.",
      ],
      bullets: [
        "Forward positional and keyword arguments deliberately.",
        "Return the original function result.",
        "Keep cross-cutting behavior separate from domain logic.",
      ],
      syntax:
        "from functools import wraps\n\ndef traced(function):\n    @wraps(function)\n    def wrapper(*args, **kwargs):\n        return function(*args, **kwargs)\n    return wrapper",
      example: {
        title: "Count verified calls",
        description: "The wrapper records usage while preserving the calculation.",
        code: "def counted(function):\n    calls = 0\n    def wrapper(*args):\n        nonlocal calls\n        calls += 1\n        return calls, function(*args)\n    return wrapper\n\n@counted\ndef double(value): return value * 2\nprint(double(6))",
        output: "(1, 12)",
      },
      fieldNote:
        "Decorators are best for behavior shared across many functions. A one-off wrapper often adds indirection without enough reuse.",
      mistakes: [
        "Calling the decorated function while defining the decorator.",
        "Dropping the wrapped result.",
        "Forgetting nonlocal when updating closure state.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-decorators-trace",
            title: "Trace a transformation",
            description:
              "Complete traced so it prints the function name and returned value before returning it.",
            expectedBehavior: "Print RUN:amplify, RESULT:42, then 42.",
            starterCode:
              "from functools import wraps\n\ndef traced(function):\n    # Return a metadata-preserving wrapper\n    pass\n\n@traced\ndef amplify(value):\n    return value * 2\n\nprint(amplify(21))\n",
            hints: [
              "The wrapper accepts *args and **kwargs.",
              "Use function.__name__ and store the result before printing it.",
            ],
          },
          "RUN:amplify\nRESULT:42\n42",
        ),
        exactTask(
          {
            id: "python-decorators-threshold",
            title: "Build a validation decorator",
            description:
              "Implement minimum(limit) so decorated numeric results below the limit become the limit.",
            expectedBehavior: "Print 10 then 14.",
            starterCode:
              "def minimum(limit):\n    # Return a decorator configured by limit\n    pass\n\n@minimum(10)\ndef energy(value):\n    return value * 2\n\nprint(energy(3))\nprint(energy(7))\n",
            hints: [
              "Three nested functions are needed: factory, decorator, wrapper.",
              "Return max(limit, function(*args, **kwargs)).",
            ],
          },
          "10\n14",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-decorators-retry-bonus",
          title: "Retry a fragile signal",
          description:
            "Create retry(attempts) that repeats a function after ValueError and reports the successful result.",
          expectedBehavior: "Print ATTEMPT=1, ATTEMPT=2, then OK.",
          starterCode:
            'def retry(attempts):\n    # Return a bounded retry decorator\n    pass\n\nstate = {"calls": 0}\n\n@retry(3)\ndef connect():\n    state["calls"] += 1\n    print(f"ATTEMPT={state[\'calls\']}")\n    if state["calls"] < 2:\n        raise ValueError("offline")\n    return "OK"\n\nprint(connect())\n',
          hints: [
            "Loop at most attempts times inside the wrapper.",
            "Re-raise after the last failure instead of swallowing it.",
          ],
        },
        "ATTEMPT=1\nATTEMPT=2\nOK",
        "The wrapper stabilizes a transient channel while keeping failure bounded and visible.",
      ),
      durationMinutes: 36,
    },
    {
      id: "python-context-managers",
      title: "Resource Gates",
      subtitle: "Guarantee setup and cleanup around critical work",
      objectives: [
        "Explain the context manager protocol",
        "Implement __enter__ and __exit__",
        "Use contextlib.contextmanager for focused resources",
      ],
      conceptHeading: "A context manager makes cleanup part of control flow",
      explanation: [
        "The with statement calls __enter__, executes the protected block, and then calls __exit__ even when the block raises an exception. This creates reliable boundaries for files, locks, transactions, and temporary state.",
        "Class-based managers are useful when the resource has meaningful state. contextlib.contextmanager provides a concise generator-based form for simpler protocols.",
      ],
      bullets: [
        "Acquire resources in __enter__.",
        "Release them in __exit__ or after yield in a finally block.",
        "Return False from __exit__ when exceptions should propagate.",
      ],
      syntax:
        "class Gate:\n    def __enter__(self): return self\n    def __exit__(self, exc_type, exc, traceback): return False",
      example: {
        title: "Visible resource lifecycle",
        description: "Cleanup runs after the protected block.",
        code: "class Gate:\n    def __enter__(self): print('OPEN'); return self\n    def __exit__(self, *error): print('CLOSE')\n\nwith Gate():\n    print('WORK')",
        output: "OPEN\nWORK\nCLOSE",
      },
      fieldNote:
        "Suppress an exception only when the context manager can fully resolve it. Silent partial recovery makes failures harder to diagnose.",
      mistakes: [
        "Returning a truthy value accidentally and suppressing errors.",
        "Performing cleanup only after the with block instead of in the protocol.",
        "Yielding more than once in a generator-based context manager.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-context-managers-gate",
            title: "Implement a resource gate",
            description:
              "Complete ArchiveGate so it announces entry, returns its label, and always announces closure.",
            expectedBehavior: "Print OPEN:NX, INSIDE:NX, CLOSE:NX.",
            starterCode:
              'class ArchiveGate:\n    def __init__(self, label):\n        self.label = label\n\n    def __enter__(self):\n        # Open and return a useful value\n        pass\n\n    def __exit__(self, exc_type, exc, traceback):\n        # Close without suppressing errors\n        pass\n\nwith ArchiveGate("NX") as label:\n    print(f"INSIDE:{label}")\n',
            hints: [
              "Print before returning self.label from __enter__.",
              "Print in __exit__ and return False.",
            ],
          },
          "OPEN:NX\nINSIDE:NX\nCLOSE:NX",
        ),
        exactTask(
          {
            id: "python-context-managers-temporary",
            title: "Restore temporary state",
            description:
              "Use contextmanager to temporarily change config['mode'] and restore the original value.",
            expectedBehavior: "Print safe, active, safe.",
            starterCode:
              'from contextlib import contextmanager\n\nconfig = {"mode": "safe"}\n\n@contextmanager\ndef temporary_mode(mode):\n    # Apply mode, yield, and restore safely\n    pass\n\nprint(config["mode"])\nwith temporary_mode("active"):\n    print(config["mode"])\nprint(config["mode"])\n',
            hints: [
              "Store the original mode before changing it.",
              "Use try/finally around yield.",
            ],
          },
          "safe\nactive\nsafe",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-context-managers-transaction-bonus",
          title: "Rollback a failed transaction",
          description:
            "Create Transaction that restores a list snapshot when the block raises ValueError and suppresses only that error.",
          expectedBehavior: "Print ROLLBACK then ['stable'].",
          starterCode:
            'class Transaction:\n    def __init__(self, records):\n        self.records = records\n\n    def __enter__(self):\n        # Store a snapshot and return the records\n        pass\n\n    def __exit__(self, exc_type, exc, traceback):\n        # Roll back ValueError only\n        pass\n\nrecords = ["stable"]\nwith Transaction(records) as current:\n    current.append("damaged")\n    raise ValueError("reject")\nprint(records)\n',
          hints: [
            "Copy the list with self.records.copy().",
            "Restore with slice assignment so existing references see the rollback.",
          ],
        },
        "ROLLBACK\n['stable']",
        "The gate reverses a damaged mutation while preserving the original list identity.",
      ),
      durationMinutes: 36,
    },
    {
      id: "python-test-design",
      title: "Executable Contracts",
      subtitle: "Design tests around behavior and failure boundaries",
      objectives: [
        "Separate arrange, act, and assert phases",
        "Test normal, boundary, and invalid cases",
        "Build deterministic table-driven checks",
      ],
      conceptHeading: "A useful test describes a contract, not an implementation detail",
      explanation: [
        "Tests are executable examples of expected behavior. Strong tests cover representative normal inputs, boundaries where behavior changes, and invalid inputs that must fail predictably.",
        "Table-driven tests reduce duplication and make missing cases visible. Deterministic inputs and explicit messages turn failures into useful diagnostic signals.",
      ],
      bullets: [
        "Name the behavior under test.",
        "Keep each failing assertion easy to diagnose.",
        "Avoid depending on time, randomness, or global state unless controlled.",
      ],
      syntax:
        "for value, expected in cases:\n    actual = transform(value)\n    assert actual == expected, (value, actual)",
      example: {
        title: "Boundary table",
        description: "Three cases pin down both sides of a threshold.",
        code: "def classify(value): return 'high' if value >= 10 else 'low'\nfor value, expected in [(9, 'low'), (10, 'high'), (11, 'high')]:\n    assert classify(value) == expected\nprint('3 CASES OK')",
        output: "3 CASES OK",
      },
      fieldNote:
        "A test suite can pass while the product is wrong when all tests repeat the same mistaken assumption. Derive cases from the requirement boundary.",
      mistakes: [
        "Testing only one happy-path value.",
        "Catching every exception and allowing invalid behavior to pass.",
        "Asserting several unrelated contracts in one opaque test.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-test-design-table",
            title: "Build a boundary table",
            description:
              "Add enough cases to verify clamp at values below, inside, and above 0..100, then print the case count.",
            expectedBehavior: "Print 5 CASES OK.",
            starterCode:
              'def clamp(value):\n    return max(0, min(100, value))\n\ncases = [\n    # Add five (input, expected) pairs\n]\nfor value, expected in cases:\n    assert clamp(value) == expected, f"{value=}"\nprint(f"{len(cases)} CASES OK")\n',
            hints: [
              "Include a negative value, 0, an interior value, 100, and a value over 100.",
              "Each tuple contains input and expected output.",
            ],
          },
          "5 CASES OK",
        ),
        exactTask(
          {
            id: "python-test-design-errors",
            title: "Verify an error contract",
            description:
              "Confirm parse_energy rejects both a negative integer and non-numeric text with ValueError.",
            expectedBehavior: "Print REJECTED=2.",
            starterCode:
              'def parse_energy(raw):\n    value = int(raw)\n    if value < 0:\n        raise ValueError("energy must be positive")\n    return value\n\nrejected = 0\nfor raw in ["-1", "offline"]:\n    # Verify ValueError and update rejected\n    pass\nprint(f"REJECTED={rejected}")\n',
            hints: [
              "Call parse_energy inside try.",
              "Increment only inside except ValueError.",
            ],
          },
          "REJECTED=2",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-test-design-runner-bonus",
          title: "Build a micro test runner",
          description:
            "Run named zero-argument tests, report PASS/FAIL, and print a deterministic summary.",
          expectedBehavior: "Print PASS:double, FAIL:triple, SUMMARY=1/2.",
          starterCode:
            'def test_double():\n    assert 2 * 2 == 4\n\ndef test_triple():\n    assert 3 * 3 == 8\n\ntests = [("double", test_double), ("triple", test_triple)]\npassed = 0\n# Execute every test and report without stopping early\nprint(f"SUMMARY={passed}/{len(tests)}")\n',
          hints: [
            "Catch AssertionError around each test call.",
            "Print PASS and increment only when no exception occurs.",
          ],
        },
        "PASS:double\nFAIL:triple\nSUMMARY=1/2",
        "The forge converts separate assertions into a transparent operational report.",
      ),
      durationMinutes: 34,
    },
    {
      id: "python-automation-capstone",
      title: "Orchestration Engine",
      subtitle: "Combine parsing, validation, transformation, and reporting",
      objectives: [
        "Model a multi-stage automation pipeline",
        "Separate rejected records from valid output",
        "Produce a deterministic operational summary",
      ],
      conceptHeading: "Production automation is a sequence of explicit contracts",
      explanation: [
        "A reliable pipeline separates acquisition, parsing, validation, transformation, aggregation, and presentation. Each stage has one responsibility and can be tested independently.",
        "Invalid records should become visible structured outcomes rather than disappearing. Deterministic ordering and bounded error messages make repeated runs comparable.",
      ],
      bullets: [
        "Normalize input before applying business rules.",
        "Preserve enough context to diagnose rejected records.",
        "Keep reporting separate from calculation.",
      ],
      syntax:
        "records = parse(source)\nvalid, rejected = validate(records)\nsummary = aggregate(valid)\nrender(summary, rejected)",
      example: {
        title: "Small staged pipeline",
        description: "Parsing and filtering remain separate generator stages.",
        code: "def numbers(lines):\n    for line in lines:\n        yield int(line)\n\ndef positive(values):\n    for value in values:\n        if value > 0:\n            yield value\n\nprint(sum(positive(numbers(['5', '-2', '7']))))",
        output: "12",
      },
      fieldNote:
        "Do not use exceptions as the normal path for expected rejected records. Reserve them for inputs the stage cannot interpret or invariants it cannot preserve.",
      mistakes: [
        "Mixing parsing, validation, and printing in one loop.",
        "Allowing one malformed record to abort every valid record.",
        "Depending on dictionary insertion order when a sorted report is required.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-automation-capstone-pipeline",
            title: "Process a telemetry batch",
            description:
              "Implement process so valid NAME,ENERGY rows are normalized and summed while invalid rows are counted.",
            expectedBehavior: "Print atlas=42, core=100, rejected=2.",
            starterCode:
              'rows = ["core,55", "atlas,42", "broken", "core,45", "void,-3"]\n\ndef process(lines):\n    totals = {}\n    rejected = 0\n    # Parse, validate, and aggregate\n    return totals, rejected\n\ntotals, rejected = process(rows)\nfor name in sorted(totals):\n    print(f"{name}={totals[name]}")\nprint(f"rejected={rejected}")\n',
            hints: [
              "split(',', 1) and catch ValueError around unpacking/int conversion.",
              "Reject negative energy and accumulate valid totals with dict.get.",
            ],
          },
          "atlas=42\ncore=100\nrejected=2",
        ),
        exactTask(
          {
            id: "python-automation-capstone-report",
            title: "Render an operational report",
            description:
              "Build report so records are sorted by descending energy then name, with a total line.",
            expectedBehavior: "Print CORE:70, ATLAS:50, PRISM:50, TOTAL:170.",
            starterCode:
              'records = {"PRISM": 50, "CORE": 70, "ATLAS": 50}\n\ndef report(values):\n    # Return report lines in deterministic priority order\n    pass\n\nprint("\\n".join(report(records)))\n',
            hints: [
              "Sort items with key=lambda item: (-item[1], item[0]).",
              "Append TOTAL after the detail lines.",
            ],
          },
          "CORE:70\nATLAS:50\nPRISM:50\nTOTAL:170",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-automation-capstone-bonus",
          title: "Build an audited pipeline",
          description:
            "Create run_pipeline that returns an immutable-style report containing valid rows, rejected reasons, and a checksum.",
          expectedBehavior: "Print VALID=A:10|C:30, REJECTED=2, CHECKSUM=40.",
          starterCode:
            'rows = ["A:10", "B:x", "C:30", "D:-1"]\n\ndef run_pipeline(lines):\n    # Return {valid: tuple[str, ...], rejected: tuple[str, ...], checksum: int}\n    pass\n\nresult = run_pipeline(rows)\nprint("VALID=" + "|".join(result["valid"]))\nprint(f"REJECTED={len(result[\'rejected\'])}")\nprint(f"CHECKSUM={result[\'checksum\']}")\n',
          hints: [
            "Record malformed and negative rows in rejected instead of stopping.",
            "Store normalized valid labels in a tuple in input order.",
          ],
        },
        "VALID=A:10|C:30\nREJECTED=2\nCHECKSUM=40",
        "The Orchestration Engine emits a reproducible audit record for every accepted and rejected signal.",
      ),
      durationMinutes: 45,
    },
  ],
};
