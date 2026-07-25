import type { CurriculumWorldSpec } from "../_shared/defineLesson";
import { exactBonus, exactTask } from "./lessonTools";

export const pythonV4World: CurriculumWorldSpec = {
  id: "graph-nexus",
  title: "Graph Nexus",
  subtitle: "Model connected systems and recover optimal routes",
  description:
    "Represent networks, traverse them predictably, cache repeated work, and combine those ideas in a dependency-aware pathfinding capstone.",
  landmark: "The Pathfinder Core",
  accent: "violet",
  lessons: [
    {
      id: "python-graph-models",
      title: "Connection Lattices",
      subtitle: "Represent networks with adjacency structures",
      objectives: [
        "Model a directed graph with a dictionary",
        "Add edges without duplicating neighbors",
        "Inspect degrees and isolated nodes",
      ],
      conceptHeading: "A graph stores entities and the relationships between them",
      explanation: [
        "An adjacency dictionary maps each node to the nodes reachable in one step. A set is useful while building a graph because it prevents duplicate edges; a sorted list is useful when output must be deterministic.",
        "Directed edges have an origin and destination. Undirected relationships are represented by adding both directions deliberately.",
      ],
      bullets: [
        "Create an entry for every node, including isolated nodes.",
        "Use sets while mutating and sorted values while reporting.",
        "Choose directed or undirected semantics before adding edges.",
      ],
      syntax: 'graph = {"core": {"parser", "runner"}, "parser": set()}',
      example: {
        title: "Read a stable neighborhood",
        description: "Sorting removes set-order uncertainty from the report.",
        code: 'graph = {"A": {"C", "B"}, "B": set(), "C": set()}\nprint(",".join(sorted(graph["A"])))',
        output: "B,C",
      },
      fieldNote:
        "A graph model is a contract. Traversal code becomes simpler when every referenced node also has its own adjacency entry.",
      mistakes: [
        "Using one mutable list as the neighbor collection for several nodes.",
        "Forgetting the reverse edge in an undirected graph.",
        "Depending on set iteration order in visible output.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-graph-models-neighbors",
            title: "Inspect a connection lattice",
            description:
              "Print A's neighbors in sorted order and then its outgoing degree.",
            expectedBehavior: "Print B,C and DEGREE=2.",
            starterCode:
              'graph = {\n    "A": {"C", "B"},\n    "B": {"D"},\n    "C": {"D"},\n    "D": set(),\n}\n# Report A\n',
            hints: [
              "sorted(graph['A']) produces a deterministic list.",
              "The degree is len(graph['A']).",
            ],
          },
          "B,C\nDEGREE=2",
        ),
        exactTask(
          {
            id: "python-graph-models-undirected",
            title: "Build a bidirectional link",
            description:
              "Implement connect(left, right) so both nodes receive the other, then print each neighborhood.",
            expectedBehavior: "Print A:B,C and C:A.",
            starterCode:
              'graph = {"A": {"B"}, "B": {"A"}, "C": set()}\n\ndef connect(left, right):\n    # Add the edge in both directions\n    pass\n\nconnect("A", "C")\nprint("A:" + ",".join(sorted(graph["A"])))\nprint("C:" + ",".join(sorted(graph["C"])))\n',
            hints: [
              "Call add once on graph[left] and once on graph[right].",
              "Do not replace the existing neighbor sets.",
            ],
          },
          "A:B,C\nC:A",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-graph-models-bonus",
          title: "Audit a damaged network",
          description: "Find nodes with no outgoing edges and count every directed edge.",
          expectedBehavior: "Print ORPHANS:D and EDGES:4.",
          starterCode:
            'graph = {\n    "A": {"B", "C"},\n    "B": {"D"},\n    "C": {"D"},\n    "D": set(),\n}\n# Audit the lattice\n',
          hints: [
            "An orphan has an empty neighbor set.",
            "Sum the length of every neighbor set.",
          ],
        },
        "ORPHANS:D\nEDGES:4",
        "The lattice exposes every silent node and confirms its complete edge inventory.",
      ),
      durationMinutes: 30,
    },
    {
      id: "python-breadth-first-search",
      title: "Breadth Wave",
      subtitle: "Explore a network layer by layer",
      objectives: [
        "Implement breadth-first search with a queue",
        "Track visited nodes at enqueue time",
        "Recover unweighted shortest-path distances",
      ],
      conceptHeading: "Breadth-first search expands the nearest frontier first",
      explanation: [
        "A FIFO queue ensures that nodes one edge away are processed before nodes two edges away. Marking a node visited when it enters the queue prevents duplicate work.",
        "In an unweighted graph, the first route that reaches a node uses the fewest edges. Store a parent or distance at that moment to reconstruct useful results.",
      ],
      bullets: [
        "Initialize the queue with the start node.",
        "Mark neighbors before enqueueing them.",
        "Sort neighbors when a deterministic traversal order matters.",
      ],
      syntax:
        "from collections import deque\nqueue = deque([start])\nnode = queue.popleft()",
      example: {
        title: "Expand one frontier",
        description: "The queue preserves discovery layers.",
        code: 'from collections import deque\nqueue = deque(["A"])\nqueue.extend(["B", "C"])\nprint(queue.popleft(), queue.popleft())',
        output: "A B",
      },
      fieldNote:
        "Visited-at-dequeue can add the same node many times. Visited-at-enqueue keeps the queue bounded by the number of nodes.",
      mistakes: [
        "Using pop() and accidentally turning the queue into a stack.",
        "Adding the visited marker after processing rather than discovery.",
        "Assuming BFS minimizes weighted cost.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-bfs-order",
            title: "Transmit breadth order",
            description:
              "Complete bfs(start) and print the deterministic traversal from A.",
            expectedBehavior: "Print A B C D E.",
            starterCode:
              'from collections import deque\n\ngraph = {\n    "A": {"C", "B"},\n    "B": {"D"},\n    "C": {"D"},\n    "D": {"E"},\n    "E": set(),\n}\n\ndef bfs(start):\n    queue = deque([start])\n    visited = {start}\n    order = []\n    # Expand the queue\n    return order\n\nprint(" ".join(bfs("A")))\n',
            hints: [
              "Use popleft inside a while queue loop.",
              "Iterate over sorted(graph[node]).",
            ],
          },
          "A B C D E",
        ),
        exactTask(
          {
            id: "python-bfs-distances",
            title: "Measure hop distance",
            description:
              "Use BFS to build distances from A and print them in sorted key order.",
            expectedBehavior: "Print A:0 B:1 C:1 D:2 E:3.",
            starterCode:
              'from collections import deque\n\ngraph = {\n    "A": {"B", "C"},\n    "B": {"D"},\n    "C": {"D"},\n    "D": {"E"},\n    "E": set(),\n}\n\ndistance = {"A": 0}\nqueue = deque(["A"])\n# Recover every distance\n\nprint(" ".join(f"{node}:{distance[node]}" for node in sorted(distance)))\n',
            hints: [
              "A neighbor's distance is distance[node] + 1.",
              "Only enqueue neighbors absent from distance.",
            ],
          },
          "A:0 B:1 C:1 D:2 E:3",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-bfs-route-bonus",
          title: "Reconstruct the shortest route",
          description:
            "Store parents during BFS and print the shortest route from A to E.",
          expectedBehavior: "Print A>B>D>E.",
          starterCode:
            'from collections import deque\n\ngraph = {\n    "A": ["B", "C"],\n    "B": ["D"],\n    "C": ["D"],\n    "D": ["E"],\n    "E": [],\n}\n\nstart, target = "A", "E"\nparents = {start: None}\nqueue = deque([start])\n# Search, then walk parents backward\n',
          hints: [
            "Set parents[neighbor] = node on first discovery.",
            "Reverse the reconstructed target-to-start list.",
          ],
        },
        "A>B>D>E",
        "A shortest unweighted path ignites across the Pathfinder Core.",
      ),
      durationMinutes: 36,
    },
    {
      id: "python-depth-first-search",
      title: "Depth Descent",
      subtitle: "Trace branches, components, and cycles",
      objectives: [
        "Implement iterative depth-first search",
        "Identify disconnected components",
        "Reason about active and completed traversal states",
      ],
      conceptHeading: "Depth-first search follows one branch before returning",
      explanation: [
        "A stack stores deferred branches. Recursive calls use the interpreter's call stack; an explicit list gives the same last-in-first-out behavior with visible control.",
        "Restarting DFS from every still-unvisited node reveals connected components. In directed graphs, a separate active-path set can expose back edges and cycles.",
      ],
      bullets: [
        "Push neighbors in reverse sorted order for ascending visits.",
        "Keep visited state outside a single component traversal.",
        "Distinguish globally visited nodes from nodes active on the current path.",
      ],
      syntax: "stack = [start]\nnode = stack.pop()",
      example: {
        title: "Stack-controlled branch order",
        description: "Reversed pushes produce stable ascending visits.",
        code: 'stack = ["C", "B"]\nprint(stack.pop())',
        output: "B",
      },
      fieldNote:
        "Traversal order is an implementation detail unless the product contract requires it. Tests should make that contract explicit.",
      mistakes: [
        "Marking only the start node and revisiting every neighbor indefinitely.",
        "Using one active-path set as permanent visited state.",
        "Ignoring nodes that are not reachable from the chosen start.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-dfs-order",
            title: "Descend the lattice",
            description:
              "Complete iterative dfs and print the stable visit order from A.",
            expectedBehavior: "Print A B D E C.",
            starterCode:
              'graph = {\n    "A": {"B", "C"},\n    "B": {"D"},\n    "C": {"E"},\n    "D": {"E"},\n    "E": set(),\n}\n\ndef dfs(start):\n    stack = [start]\n    visited = set()\n    order = []\n    # Descend without revisiting\n    return order\n\nprint(" ".join(dfs("A")))\n',
            hints: [
              "Skip a node when it is already visited.",
              "Extend the stack with reverse-sorted neighbors.",
            ],
          },
          "A B D E C",
        ),
        exactTask(
          {
            id: "python-dfs-components",
            title: "Count isolated sectors",
            description:
              "Traverse the undirected graph and print the number and sizes of components.",
            expectedBehavior: "Print COMPONENTS=3 and SIZES=1,2,3.",
            starterCode:
              'graph = {\n    "A": {"B"}, "B": {"A", "C"}, "C": {"B"},\n    "D": {"E"}, "E": {"D"},\n    "F": set(),\n}\nvisited = set()\nsizes = []\n# Start a DFS for each unseen node\n',
            hints: [
              "Use one stack per component and one shared visited set.",
              "Append the component size, then sort sizes.",
            ],
          },
          "COMPONENTS=3\nSIZES=1,2,3",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-dfs-cycle-bonus",
          title: "Detect a directed cycle",
          description: "Use visiting and visited sets to detect the cycle A→B→C→A.",
          expectedBehavior: "Print CYCLE=True.",
          starterCode:
            'graph = {"A": ["B"], "B": ["C"], "C": ["A"], "D": []}\nvisiting = set()\nvisited = set()\n\ndef has_cycle(node):\n    # Return True for a back edge\n    pass\n\nprint(f"CYCLE={any(has_cycle(node) for node in graph if node not in visited)}")\n',
          hints: [
            "A node already in visiting is on the active call path.",
            "Move a node from visiting to visited after its neighbors finish.",
          ],
        },
        "CYCLE=True",
        "The archive identifies a self-reinforcing route before it can trap the traversal.",
      ),
      durationMinutes: 38,
    },
    {
      id: "python-dynamic-programming",
      title: "Memory of Work",
      subtitle: "Cache overlapping subproblems",
      objectives: [
        "Recognize overlapping recursive work",
        "Memoize results by subproblem state",
        "Build a bottom-up dynamic-programming table",
      ],
      conceptHeading: "Dynamic programming trades stored results for repeated work",
      explanation: [
        "A recursive definition can recompute the same inputs many times. Memoization records each result the first time it is solved and reuses it on later calls.",
        "Bottom-up dynamic programming starts with known base cases and fills a table toward the requested answer. Both forms require a state that fully describes a subproblem.",
      ],
      bullets: [
        "Define base cases before recursive transitions.",
        "Use immutable, hashable memo keys.",
        "Store only state that affects the answer.",
      ],
      syntax:
        "from functools import lru_cache\n@lru_cache(maxsize=None)\ndef solve(state): ...",
      example: {
        title: "Cached Fibonacci state",
        description: "Each integer state is solved once.",
        code: "from functools import lru_cache\n@lru_cache(None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\nprint(fib(10))",
        output: "55",
      },
      fieldNote:
        "Caching is correct only when the same key always means the same subproblem and external mutable state does not change the answer.",
      mistakes: [
        "Caching after making every recursive call.",
        "Using a mutable list as a dictionary key.",
        "Keeping a global cache across unrelated problem instances.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-dp-fibonacci",
            title: "Stabilize recursive growth",
            description:
              "Memoize fib and print fib(20) plus the number of cached states.",
            expectedBehavior: "Print VALUE=6765 and STATES=21.",
            starterCode:
              'from functools import lru_cache\n\n# Add an unbounded cache decorator\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(f"VALUE={fib(20)}")\nprint(f"STATES={fib.cache_info().currsize}")\n',
            hints: [
              "Use @lru_cache(maxsize=None).",
              "States include every integer from 0 through 20.",
            ],
          },
          "VALUE=6765\nSTATES=21",
        ),
        exactTask(
          {
            id: "python-dp-staircase",
            title: "Count recovery routes",
            description:
              "Build a bottom-up table for ways to climb 6 steps using moves of 1 or 2.",
            expectedBehavior: "Print WAYS=13.",
            starterCode:
              "steps = 6\nways = [0] * (steps + 1)\nways[0] = 1\n# Fill the table\n",
            hints: [
              "ways[i] receives ways[i - 1].",
              "When i >= 2, also add ways[i - 2].",
            ],
          },
          "WAYS=13",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-dp-coins-bonus",
          title: "Minimize calibration cells",
          description:
            "Find the minimum number of 1, 3, and 4 energy cells needed to total 10.",
          expectedBehavior: "Print MIN=3.",
          starterCode:
            "target = 10\ncells = [1, 3, 4]\nbest = [0] + [float('inf')] * target\n# Fill minimum counts for every total\n",
          hints: [
            "For each total, consider every cell not larger than it.",
            "Candidate cost is best[total - cell] + 1.",
          ],
        },
        "MIN=3",
        "The memory lattice proves the target can be reached with only three calibration cells.",
      ),
      durationMinutes: 40,
    },
    {
      id: "python-pathfinder-capstone",
      title: "Pathfinder Protocol",
      subtitle: "Combine graphs, priority queues, and deterministic reporting",
      objectives: [
        "Implement weighted shortest-path search",
        "Reconstruct a route from parent links",
        "Validate unreachable and stale frontier states",
      ],
      conceptHeading: "Dijkstra's algorithm expands the cheapest known frontier",
      explanation: [
        "A priority queue orders candidate routes by total cost. When a cheaper route to a neighbor appears, update its distance, record its parent, and push the improved state.",
        "The queue may still contain an older expensive entry. Skip it when its cost no longer equals the best recorded distance. This preserves correctness without editing entries already inside the heap.",
      ],
      bullets: [
        "Use non-negative edge weights.",
        "Store (cost, node) tuples in heapq.",
        "Reconstruct only after the target has a finite distance.",
      ],
      syntax: "from heapq import heappop, heappush\ncost, node = heappop(frontier)",
      example: {
        title: "Cheapest frontier first",
        description: "The heap returns the lowest tuple cost.",
        code: "from heapq import heapify, heappop\nfrontier = [(7, 'runner'), (2, 'parser')]\nheapify(frontier)\nprint(heappop(frontier))",
        output: "(2, 'parser')",
      },
      fieldNote:
        "Dijkstra is not valid with negative edges. Select an algorithm whose assumptions match the data contract.",
      mistakes: [
        "Marking a node final when it is first discovered rather than popped cheapest.",
        "Forgetting to update a parent when a cheaper route appears.",
        "Running weighted search with a plain FIFO queue.",
      ],
      tasks: [
        exactTask(
          {
            id: "python-pathfinder-costs",
            title: "Recover cheapest costs",
            description:
              "Complete Dijkstra from core and print the cheapest cost to every node.",
            expectedBehavior: "Print core:0 parser:2 runner:6 ui:7.",
            starterCode:
              'from heapq import heappop, heappush\n\ngraph = {\n    "core": [("parser", 2), ("runner", 9)],\n    "parser": [("runner", 4), ("ui", 8)],\n    "runner": [("ui", 1)],\n    "ui": [],\n}\n\ndistance = {"core": 0}\nfrontier = [(0, "core")]\n# Recover cheapest costs\n\nprint(" ".join(f"{node}:{distance[node]}" for node in sorted(distance)))\n',
            hints: [
              "Skip entries whose cost differs from distance[node].",
              "Relax an edge when next_cost is smaller than the recorded value.",
            ],
          },
          "core:0 parser:2 runner:6 ui:7",
        ),
        exactTask(
          {
            id: "python-pathfinder-route",
            title: "Reconstruct the optimal route",
            description:
              "Track parents during Dijkstra and print the cheapest core-to-ui route and cost.",
            expectedBehavior: "Print core>parser>runner>ui and COST=7.",
            starterCode:
              'from heapq import heappop, heappush\n\ngraph = {\n    "core": [("parser", 2), ("runner", 9)],\n    "parser": [("runner", 4), ("ui", 8)],\n    "runner": [("ui", 1)],\n    "ui": [],\n}\nstart, target = "core", "ui"\ndistance = {start: 0}\nparents = {start: None}\nfrontier = [(0, start)]\n# Search and reconstruct\n',
            hints: [
              "Set parents[neighbor] = node on every successful relaxation.",
              "Walk from target to None, then reverse the route.",
            ],
          },
          "core>parser>runner>ui\nCOST=7",
        ),
      ],
      bonusTask: exactBonus(
        {
          id: "python-pathfinder-bonus",
          title: "Fault-tolerant route service",
          description:
            "Wrap shortest_path(start, target) so an unknown or unreachable target returns NO ROUTE.",
          expectedBehavior: "Print A>B>C / 5 and then NO ROUTE.",
          starterCode:
            'from heapq import heappop, heappush\n\ngraph = {\n    "A": [("B", 2)],\n    "B": [("C", 3)],\n    "C": [],\n    "X": [],\n}\n\ndef shortest_path(start, target):\n    # Return (route_list, cost) or None\n    pass\n\nfor target in ("C", "X"):\n    result = shortest_path("A", target)\n    if result:\n        route, cost = result\n        print(f\'{">".join(route)} / {cost}\')\n    else:\n        print("NO ROUTE")\n',
          hints: [
            "Reject unknown starts or targets before creating the frontier.",
            "Return None when the queue empties without reaching the target.",
          ],
        },
        "A>B>C / 5\nNO ROUTE",
        "The Pathfinder Core now reports both optimal routes and safe failure states.",
      ),
      durationMinutes: 48,
    },
  ],
};
