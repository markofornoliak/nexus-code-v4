import type { CurriculumWorldSpec } from "../_shared/defineLesson";
import { structureBonus, structureTask } from "./lessonTools";

export const cppV4World: CurriculumWorldSpec = {
  id: "ownership-reactor",
  title: "Ownership Reactor",
  subtitle: "Make lifetime, generic behavior, and algorithms explicit",
  description:
    "Advance the Memory Engine with RAII, smart pointers, templates, STL algorithms, and a resource-safe C++17 capstone.",
  landmark: "The Lifetime Crucible",
  accent: "violet",
  lessons: [
    {
      id: "cpp-raii",
      title: "Lifetime Seals",
      subtitle: "Bind resource lifetime to object lifetime",
      objectives: [
        "Explain deterministic destruction",
        "Use constructors and destructors as a lifetime pair",
        "Prevent accidental copying of unique resources",
      ],
      conceptHeading: "RAII makes cleanup a consequence of leaving scope",
      explanation: [
        "Resource Acquisition Is Initialization stores a resource inside an object whose constructor establishes ownership and whose destructor releases it. Stack unwinding then performs cleanup on normal returns and exceptions.",
        "When a resource must not be duplicated, delete copy operations or implement the full ownership semantics deliberately.",
      ],
      bullets: [
        "Acquire fully before construction succeeds.",
        "Release in the destructor without throwing.",
        "Define or delete copy and move behavior explicitly.",
      ],
      syntax:
        "class Handle {\npublic:\n    Handle();\n    ~Handle();\n    Handle(const Handle&) = delete;\n};",
      example: {
        title: "Scoped trace",
        description: "The destructor runs automatically at the closing brace.",
        code: '#include <iostream>\nclass Trace {\npublic:\n    Trace() { std::cout << "open\\n"; }\n    ~Trace() { std::cout << "close\\n"; }\n};\n{\n    Trace trace;\n}',
      },
      fieldNote:
        "Prefer existing standard-library RAII types such as vector, string, fstream, lock_guard, and smart pointers before writing a custom owner.",
      mistakes: [
        "Allocating in a constructor and omitting the destructor.",
        "Allowing a default shallow copy of an owning raw pointer.",
        "Throwing an exception from a destructor.",
      ],
      tasks: [
        structureTask(
          {
            id: "cpp-raii-handle",
            title: "Seal a unique handle",
            description:
              "Create FileHandle with constructor, noexcept destructor, and deleted copy operations.",
            expectedBehavior:
              "The class expresses unique scoped ownership and cannot be copied accidentally.",
            starterCode:
              "class FileHandle {\n    // Define unique lifetime semantics\n};\n",
            hints: [
              "Add a public constructor and ~FileHandle() noexcept.",
              "Delete both copy constructor and copy assignment.",
            ],
          },
          "class\\s+FileHandle[\\s\\S]*public\\s*:[\\s\\S]*FileHandle\\s*\\([\\s\\S]*~FileHandle\\s*\\(\\s*\\)\\s*noexcept[\\s\\S]*FileHandle\\s*\\(\\s*const\\s+FileHandle\\s*&\\s*\\)\\s*=\\s*delete\\s*;[\\s\\S]*operator\\s*=\\s*\\(\\s*const\\s+FileHandle\\s*&\\s*\\)\\s*=\\s*delete\\s*;",
        ),
        structureTask(
          {
            id: "cpp-raii-fstream",
            title: "Read through scoped storage",
            description:
              "Open std::ifstream inside a function, verify it, and read lines without manual close.",
            expectedBehavior:
              "The standard RAII stream closes automatically when the function exits.",
            starterCode:
              "#include <fstream>\n#include <string>\n\nvoid read_archive(const std::string& path) {\n    // Open, validate, and read using RAII\n}\n",
            hints: [
              "Construct std::ifstream input(path).",
              "Use if (!input) and std::getline(input, line).",
            ],
          },
          "void\\s+read_archive\\s*\\(\\s*const\\s+std::string\\s*&\\s*path\\s*\\)[\\s\\S]*std::ifstream\\s+\\w+\\s*\\(\\s*path\\s*\\)[\\s\\S]*if\\s*\\(\\s*!\\s*\\w+\\s*\\)[\\s\\S]*std::getline\\s*\\(",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "cpp-raii-bonus",
          title: "Movable unique socket",
          description:
            "Delete copy operations and declare noexcept move constructor and move assignment.",
          expectedBehavior: "SocketHandle is transferable but never duplicated.",
          starterCode:
            "class SocketHandle {\npublic:\n    SocketHandle();\n    ~SocketHandle() noexcept;\n    // Define copy and move contracts\n};\n",
          hints: [
            "Delete const-reference copy operations.",
            "Move operations accept SocketHandle&& and are noexcept.",
          ],
        },
        "SocketHandle\\s*\\(\\s*const\\s+SocketHandle\\s*&\\s*\\)\\s*=\\s*delete[\\s\\S]*operator\\s*=\\s*\\(\\s*const\\s+SocketHandle\\s*&\\s*\\)\\s*=\\s*delete[\\s\\S]*SocketHandle\\s*\\(\\s*SocketHandle\\s*&&\\s*\\)\\s*noexcept[\\s\\S]*operator\\s*=\\s*\\(\\s*SocketHandle\\s*&&\\s*\\)\\s*noexcept",
        "The Lifetime Seal permits ownership transfer while structurally forbidding duplication.",
      ),
      durationMinutes: 38,
    },
    {
      id: "cpp-smart-pointers",
      title: "Ownership Vectors",
      subtitle: "Express dynamic ownership with smart pointers",
      objectives: [
        "Prefer unique_ptr for single ownership",
        "Use make_unique and move",
        "Reserve shared_ptr for genuine shared lifetime",
      ],
      conceptHeading: "Smart pointers make dynamic ownership visible in the type",
      explanation: [
        "std::unique_ptr owns one dynamic object and releases it automatically. It cannot be copied, but std::move can transfer ownership deliberately.",
        "std::shared_ptr uses reference-counted shared lifetime. It adds cost and can leak through cycles, so it should represent real shared ownership rather than uncertainty.",
      ],
      bullets: [
        "Use make_unique and make_shared.",
        "Pass non-owning access by reference or raw pointer with clear lifetime.",
        "Break shared cycles with weak_ptr.",
      ],
      syntax: "auto node = std::make_unique<Node>(42);\nauto next = std::move(node);",
      example: {
        title: "Transfer one owner",
        description: "After the move, next owns the node and source is empty.",
        code: "#include <memory>\nauto source = std::make_unique<int>(42);\nauto next = std::move(source);",
      },
      fieldNote:
        "A raw pointer can be a valid non-owning observer. Ownership is the concept to make explicit, not the goal of removing every asterisk.",
      mistakes: [
        "Constructing two shared_ptr values from the same raw pointer.",
        "Copying a unique_ptr instead of moving it.",
        "Using shared_ptr to avoid deciding who owns an object.",
      ],
      tasks: [
        structureTask(
          {
            id: "cpp-smart-unique",
            title: "Create one owned node",
            description:
              "Create std::unique_ptr<Node> with make_unique, then move it into active.",
            expectedBehavior:
              "Dynamic ownership is created and transferred without raw new/delete.",
            starterCode:
              "#include <memory>\n\nstruct Node {\n    explicit Node(int value) : value(value) {}\n    int value;\n};\n\nint main() {\n    // Create and transfer unique ownership\n}\n",
            hints: [
              "Use std::make_unique<Node>(42).",
              "Use std::move when assigning the second owner.",
            ],
          },
          "std::unique_ptr\\s*<\\s*Node\\s*>\\s+\\w+\\s*=\\s*std::make_unique\\s*<\\s*Node\\s*>\\s*\\(\\s*42\\s*\\)[\\s\\S]*std::unique_ptr\\s*<\\s*Node\\s*>\\s+\\w+\\s*=\\s*std::move\\s*\\(",
        ),
        structureTask(
          {
            id: "cpp-smart-vector",
            title: "Store polymorphic nodes",
            description:
              "Create vector<unique_ptr<Signal>> and push a make_unique<Pulse>().",
            expectedBehavior:
              "The vector uniquely owns subtype objects through a polymorphic base.",
            starterCode:
              "#include <memory>\n#include <vector>\n\nstruct Signal { virtual ~Signal() = default; };\nstruct Pulse : Signal { };\n\nint main() {\n    // Build the polymorphic owner collection\n}\n",
            hints: [
              "The vector element type is std::unique_ptr<Signal>.",
              "push_back accepts std::make_unique<Pulse>().",
            ],
          },
          "std::vector\\s*<\\s*std::unique_ptr\\s*<\\s*Signal\\s*>\\s*>\\s+\\w+[\\s\\S]*\\.push_back\\s*\\(\\s*std::make_unique\\s*<\\s*Pulse\\s*>\\s*\\(",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "cpp-smart-bonus",
          title: "Break a shared cycle",
          description:
            "Give Node a shared_ptr child and weak_ptr parent, wiring both directions.",
          expectedBehavior:
            "The parent relationship observes shared state without keeping the cycle alive.",
          starterCode:
            "#include <memory>\n\nstruct Node {\n    // Add child ownership and parent observation\n};\n\nint main() {\n    auto parent = std::make_shared<Node>();\n    auto child = std::make_shared<Node>();\n    // Wire the relationship\n}\n",
          hints: ["child is std::shared_ptr<Node>.", "parent is std::weak_ptr<Node>."],
        },
        "std::shared_ptr\\s*<\\s*Node\\s*>\\s+child[\\s\\S]*std::weak_ptr\\s*<\\s*Node\\s*>\\s+parent[\\s\\S]*\\w+->child\\s*=\\s*\\w+[\\s\\S]*\\w+->parent\\s*=\\s*\\w+",
        "The Ownership Vector preserves bidirectional navigation without creating an immortal reference cycle.",
      ),
      durationMinutes: 38,
    },
    {
      id: "cpp-templates",
      title: "Generic Forge",
      subtitle: "Write type-safe behavior once",
      objectives: [
        "Declare function templates",
        "Build class templates",
        "Constrain expectations through operations and static assertions",
      ],
      conceptHeading: "Templates generate type-specific code from one checked pattern",
      explanation: [
        "A function template describes an algorithm in terms of a type parameter. The compiler instantiates it for the concrete types used by the program.",
        "Generic code should require only the operations it actually uses. C++17 static_assert can document and enforce important compile-time assumptions.",
      ],
      bullets: [
        "Prefer descriptive type parameter names.",
        "Keep template definitions visible to translation units.",
        "Let compilation reveal unsupported operations.",
      ],
      syntax: "template <typename T>\nT clamp(T value, T low, T high) { ... }",
      example: {
        title: "Type-preserving maximum",
        description: "The same function pattern serves int and double.",
        code: "template <typename T>\nT larger(T left, T right) {\n    return left < right ? right : left;\n}",
      },
      fieldNote:
        "Templates remove duplication only when the underlying behavior is genuinely the same across types.",
      mistakes: [
        "Putting template definitions only in a separately compiled .cpp file.",
        "Assuming every type supports arithmetic or ordering.",
        "Using macros where a typed template is available.",
      ],
      tasks: [
        structureTask(
          {
            id: "cpp-template-clamp",
            title: "Forge a generic clamp",
            description:
              "Write template <typename T> T clamp_value(T value, T low, T high).",
            expectedBehavior:
              "One type-safe function clamps comparable values without a macro.",
            starterCode: "// Create a generic clamp_value function\n",
            hints: [
              "Put template <typename T> before the function.",
              "Return low, high, or value based on comparisons.",
            ],
          },
          "template\\s*<\\s*typename\\s+T\\s*>\\s*T\\s+clamp_value\\s*\\(\\s*T\\s+value\\s*,\\s*T\\s+low\\s*,\\s*T\\s+high\\s*\\)[\\s\\S]*(?:value\\s*<\\s*low|std::max)[\\s\\S]*(?:value\\s*>\\s*high|std::min)",
        ),
        structureTask(
          {
            id: "cpp-template-class",
            title: "Create a typed reading",
            description:
              "Build template<class T> Reading with private T value_ and const value() getter.",
            expectedBehavior:
              "The class stores and returns any supported reading type without losing type information.",
            starterCode: "// Build the Reading class template\n",
            hints: [
              "Place template <class T> before class Reading.",
              "The getter returns T and is const-qualified.",
            ],
          },
          "template\\s*<\\s*class\\s+T\\s*>\\s*class\\s+Reading[\\s\\S]*private\\s*:[\\s\\S]*T\\s+value_\\s*;[\\s\\S]*public\\s*:[\\s\\S]*Reading\\s*\\(\\s*T\\s+value\\s*\\)[\\s\\S]*T\\s+value\\s*\\(\\s*\\)\\s*const",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "cpp-template-bonus",
          title: "Enforce an arithmetic cell",
          description:
            "Add static_assert(std::is_arithmetic<T>::value) to EnergyCell<T>.",
          expectedBehavior:
            "Unsupported non-numeric instantiations fail with a compile-time contract.",
          starterCode:
            "#include <type_traits>\n\ntemplate <typename T>\nclass EnergyCell {\n    // Enforce arithmetic T and store a value\n};\n",
          hints: [
            "Use static_assert with std::is_arithmetic<T>::value.",
            "Provide a readable second string argument.",
          ],
        },
        'class\\s+EnergyCell[\\s\\S]*static_assert\\s*\\(\\s*std::is_arithmetic\\s*<\\s*T\\s*>\\s*::value\\s*,\\s*"[^"]+"\\s*\\)',
        "The Generic Forge rejects an invalid type before any program can run.",
      ),
      durationMinutes: 36,
    },
    {
      id: "cpp-algorithms-lambdas",
      title: "Algorithm Array",
      subtitle: "Compose STL algorithms with explicit predicates",
      objectives: [
        "Search and transform with standard algorithms",
        "Write readable lambdas",
        "Separate data ownership from algorithm behavior",
      ],
      conceptHeading: "STL algorithms express intent over iterator ranges",
      explanation: [
        "Algorithms such as find_if, count_if, transform, and sort work across containers through iterator ranges. They keep traversal mechanics out of domain logic.",
        "A lambda supplies small local behavior. Capture only the state it needs and use const references for read-only objects.",
      ],
      bullets: [
        "Name the algorithm that matches the intent.",
        "Use begin/end or container iterators consistently.",
        "Avoid broad [&] captures in long-lived callbacks.",
      ],
      syntax:
        "auto online = std::count_if(nodes.begin(), nodes.end(), [](const Node& n) { return n.online(); });",
      example: {
        title: "Count strong readings",
        description: "The predicate states the selection rule.",
        code: "std::vector<int> values{12, 55, 88};\nauto count = std::count_if(values.begin(), values.end(), [](int value) {\n    return value >= 50;\n});",
      },
      fieldNote:
        "An algorithm call should make the operation easier to read. A clear loop is preferable when several unrelated state changes occur together.",
      mistakes: [
        "Forgetting the algorithm header.",
        "Capturing a local reference that outlives its scope.",
        "Sorting when only one minimum or maximum is needed.",
      ],
      tasks: [
        structureTask(
          {
            id: "cpp-algorithm-count",
            title: "Count stable signals",
            description: "Use std::count_if with a lambda to count values at least 50.",
            expectedBehavior: "The source expresses the threshold as an STL predicate.",
            starterCode:
              "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{12, 55, 31, 88};\n    // Count stable values\n}\n",
            hints: [
              "Pass values.begin() and values.end().",
              "The lambda accepts int value and returns value >= 50.",
            ],
          },
          "std::count_if\\s*\\(\\s*values\\.begin\\s*\\(\\s*\\)\\s*,\\s*values\\.end\\s*\\(\\s*\\)\\s*,\\s*\\[\\s*\\]\\s*\\(\\s*int\\s+value\\s*\\)[\\s\\S]*value\\s*>=\\s*50",
        ),
        structureTask(
          {
            id: "cpp-algorithm-transform",
            title: "Normalize a reading vector",
            description:
              "Use std::transform to clamp every input value from 0 to 100 into output.",
            expectedBehavior:
              "A dedicated output vector receives a bounded value for every input.",
            starterCode:
              "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> input{-4, 42, 140};\n    std::vector<int> output(input.size());\n    // Transform into bounded readings\n}\n",
            hints: [
              "Use the four-iterator transform overload.",
              "Return std::max(0, std::min(100, value)) from the lambda.",
            ],
          },
          "std::transform\\s*\\(\\s*input\\.begin\\s*\\(\\s*\\)\\s*,\\s*input\\.end\\s*\\(\\s*\\)\\s*,\\s*output\\.begin\\s*\\(\\s*\\)[\\s\\S]*\\[\\s*\\]\\s*\\(\\s*int\\s+value\\s*\\)[\\s\\S]*std::max\\s*\\(\\s*0\\s*,\\s*std::min\\s*\\(\\s*100\\s*,\\s*value\\s*\\)",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "cpp-algorithm-bonus",
          title: "Sort domain objects by energy",
          description:
            "Sort vector<Signal> descending by energy without exposing mutable fields.",
          expectedBehavior:
            "std::sort uses a const-reference lambda and public energy() accessors.",
          starterCode:
            "#include <algorithm>\n#include <vector>\n\nclass Signal {\npublic:\n    int energy() const { return energy_; }\nprivate:\n    int energy_ = 0;\n};\n\nvoid order(std::vector<Signal>& signals) {\n    // Sort strongest first\n}\n",
          hints: [
            "Lambda parameters are const Signal&.",
            "Return left.energy() > right.energy().",
          ],
        },
        "std::sort\\s*\\(\\s*signals\\.begin\\s*\\(\\s*\\)\\s*,\\s*signals\\.end\\s*\\(\\s*\\)\\s*,\\s*\\[\\s*\\]\\s*\\(\\s*const\\s+Signal\\s*&\\s*\\w+\\s*,\\s*const\\s+Signal\\s*&\\s*\\w+\\s*\\)[\\s\\S]*\\.energy\\s*\\(\\s*\\)\\s*>\\s*\\w+\\.energy\\s*\\(\\s*\\)",
        "The Algorithm Array orders domain objects through their public observation contract.",
      ),
      durationMinutes: 36,
    },
    {
      id: "cpp-ownership-capstone",
      title: "Lifetime Crucible",
      subtitle: "Assemble a resource-safe polymorphic signal graph",
      objectives: [
        "Own polymorphic objects with unique_ptr",
        "Expose non-owning observation safely",
        "Combine templates and algorithms in one system",
      ],
      conceptHeading: "A complete C++ design makes ownership obvious at every boundary",
      explanation: [
        "The capstone stores polymorphic nodes in unique_ptr containers, connects them with non-owning identifiers, and analyzes them through standard algorithms.",
        "Value containers own values, unique_ptr containers own dynamic objects, and references or stable identifiers observe. Keeping those roles distinct prevents double deletion and hidden lifetime coupling.",
      ],
      bullets: [
        "Give every dynamic object one clear owner.",
        "Use a virtual destructor on polymorphic bases.",
        "Return observations without transferring ownership accidentally.",
      ],
      syntax:
        "std::vector<std::unique_ptr<Signal>> signals;\nsignals.push_back(std::make_unique<Pulse>(42));",
      example: {
        title: "Owned polymorphic collection",
        description:
          "The vector destroys every subtype through the virtual base destructor.",
        code: "struct Signal { virtual ~Signal() = default; virtual int energy() const = 0; };\nstd::vector<std::unique_ptr<Signal>> signals;",
      },
      fieldNote:
        "A design is not resource-safe merely because it uses smart pointers. The chosen smart pointer must match the actual ownership relationship.",
      mistakes: [
        "Deleting through a base pointer without a virtual destructor.",
        "Returning an owning pointer when the caller only needs to inspect.",
        "Using shared_ptr for a tree that has one clear owner.",
      ],
      tasks: [
        structureTask(
          {
            id: "cpp-capstone-base",
            title: "Define the polymorphic signal contract",
            description:
              "Create Signal with virtual noexcept destructor and pure virtual energy() const.",
            expectedBehavior:
              "Subtypes can be destroyed through Signal and must report energy.",
            starterCode:
              "class Signal {\n    // Define the safe polymorphic contract\n};\n",
            hints: [
              "Use virtual ~Signal() noexcept = default.",
              "Pure virtual syntax ends energy() const = 0.",
            ],
          },
          "class\\s+Signal[\\s\\S]*virtual\\s+~Signal\\s*\\(\\s*\\)\\s*noexcept\\s*=\\s*default\\s*;[\\s\\S]*virtual\\s+int\\s+energy\\s*\\(\\s*\\)\\s*const\\s*=\\s*0\\s*;",
        ),
        structureTask(
          {
            id: "cpp-capstone-store",
            title: "Build the owning archive",
            description:
              "Create SignalArchive with vector<unique_ptr<Signal>> and add(unique_ptr<Signal>).",
            expectedBehavior:
              "The archive receives and stores transferred unique ownership.",
            starterCode:
              "#include <memory>\n#include <vector>\n\nclass Signal;\n\nclass SignalArchive {\n    // Own signals and accept ownership transfers\n};\n",
            hints: [
              "Keep the vector private.",
              "Move the method parameter into push_back.",
            ],
          },
          "class\\s+SignalArchive[\\s\\S]*private\\s*:[\\s\\S]*std::vector\\s*<\\s*std::unique_ptr\\s*<\\s*Signal\\s*>\\s*>\\s+\\w+[\\s\\S]*public\\s*:[\\s\\S]*void\\s+add\\s*\\(\\s*std::unique_ptr\\s*<\\s*Signal\\s*>\\s+\\w+\\s*\\)[\\s\\S]*\\.push_back\\s*\\(\\s*std::move\\s*\\(",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "cpp-capstone-bonus",
          title: "Find the strongest observer",
          description:
            "Use std::max_element over unique_ptr<Signal> and return const Signal* without transferring ownership.",
          expectedBehavior:
            "The archive exposes a nullable non-owning observer to the strongest object.",
          starterCode:
            "#include <algorithm>\n#include <memory>\n#include <vector>\n\nclass SignalArchive {\n    std::vector<std::unique_ptr<Signal>> signals_;\npublic:\n    const Signal* strongest() const {\n        // Find and observe without transferring ownership\n    }\n};\n",
          hints: [
            "Compare const std::unique_ptr<Signal>& values.",
            "Return nullptr when empty, otherwise iterator->get().",
          ],
        },
        "const\\s+Signal\\s*\\*\\s+strongest\\s*\\(\\s*\\)\\s*const[\\s\\S]*std::max_element\\s*\\(\\s*signals_\\.begin\\s*\\(\\s*\\)\\s*,\\s*signals_\\.end\\s*\\(\\s*\\)[\\s\\S]*const\\s+std::unique_ptr\\s*<\\s*Signal\\s*>\\s*&[\\s\\S]*\\.energy\\s*\\(\\s*\\)[\\s\\S]*\\.get\\s*\\(\\s*\\)",
        "The Lifetime Crucible exposes its strongest signal without surrendering or duplicating ownership.",
      ),
      durationMinutes: 48,
    },
  ],
};
