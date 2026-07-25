import { appendCurriculumWorld, createCurriculumTrack } from "../_shared/defineLesson";
import { patternBonus, patternTask } from "../_shared/taskBuilders";
import { cppV4World } from "../v4/cppWorld";

const cppTask = (
  id: string,
  title: string,
  description: string,
  expectedBehavior: string,
  starterCode: string,
  pattern: string,
  hints: string[],
) =>
  patternTask(
    { id, title, description, expectedBehavior, starterCode, hints },
    pattern,
    "is",
  );

const cppBonus = (
  id: string,
  title: string,
  description: string,
  expectedBehavior: string,
  starterCode: string,
  pattern: string,
  hints: string[],
  discoveryText: string,
) =>
  patternBonus(
    { id, title, description, expectedBehavior, starterCode, hints },
    pattern,
    discoveryText,
    "is",
  );

const baseTrack = createCurriculumTrack({
  id: "cpp",
  order: 5,
  language: "C++",
  title: "Machine Substrate",
  archiveName: "The Memory Engine",
  description:
    "Explore C++17-compatible entry points, typed control flow, functions, references, vectors, and class-based resource modeling.",
  icon: "C+",
  accent: "cyan",
  execution: {
    kind: "static",
    editorLanguage: "cpp",
    fileExtension: "cpp",
    supportsStdin: false,
    actionLabel: "Analyze structure",
    runtimeLabel: "C++ structure analyzer",
  },
  worlds: [
    {
      id: "memory-engine",
      title: "Memory Engine",
      subtitle: "Compiled foundations and explicit data movement",
      description:
        "Five fragments reconstruct the path from main and streams to functions, references, vectors, and resource-owning classes.",
      landmark: "The Address Turbine",
      accent: "cyan",
      lessons: [
        {
          id: "cpp-entry-point",
          title: "Machine Ignition",
          subtitle: "Build a compiled console entry point",
          objectives: [
            "Include the iostream header",
            "Declare int main",
            "Write output with std::cout",
          ],
          conceptHeading: "A C++ program begins at main and is transformed by a compiler",
          explanation: [
            "The preprocessor makes declarations from headers available. int main() is the application entry point and returns a status code to the environment.",
            "std::cout writes to the standard output stream. The std:: prefix names the standard-library namespace explicitly.",
          ],
          bullets: [
            "Use a modern C++ compiler.",
            "End statements with semicolons.",
            "Prefer explicit std:: qualification in beginner code.",
          ],
          syntax:
            '#include <iostream>\n\nint main() {\n    std::cout << "online\\n";\n    return 0;\n}',
          example: {
            title: "Minimal machine pulse",
            description:
              "The source includes its stream declaration and returns success.",
            code: '#include <iostream>\n\nint main() {\n    std::cout << "NEXUS online\\n";\n    return 0;\n}',
          },
          fieldNote:
            "The browser validates requested source structures; compile with a C++17 toolchain for runtime and diagnostics.",
          mistakes: [
            "Omitting the iostream include.",
            "Writing cout without std:: or a namespace declaration.",
            "Using single quotes for a multi-character string.",
          ],
          tasks: [
            cppTask(
              "cpp-entry-point-main",
              "Restore main",
              "Include iostream and add int main() returning 0.",
              "The source has the header, entry point, and success return.",
              "// Build the minimal C++ program\n",
              "#include\\s*<iostream>[\\s\\S]*int\\s+main\\s*\\(\\s*\\)[\\s\\S]*return\\s+0\\s*;",
              ["Put the include before main."],
            ),
            cppTask(
              "cpp-entry-point-output",
              "Transmit the first signal",
              "Print NEXUS online with std::cout.",
              "The stream insertion contains the required text.",
              "#include <iostream>\n\nint main() {\n    // Print signal\n    return 0;\n}\n",
              'std::cout\\s*<<\\s*"NEXUS online(?:\\\\n)?"',
              ["Use the << stream insertion operator."],
            ),
          ],
          bonusTask: cppBonus(
            "cpp-entry-point-bonus",
            "Coordinate transmitter",
            "Declare int sector = 3 and print Sector: followed by sector.",
            "The typed variable and chained stream output are present.",
            "#include <iostream>\n\nint main() {\n    // Build coordinate transmitter\n    return 0;\n}\n",
            'int\\s+sector\\s*=\\s*3\\s*;[\\s\\S]*std::cout\\s*<<\\s*"Sector:\\s*"\\s*<<\\s*sector',
            ["Stream several values by chaining <<."],
            "The Address Turbine receives a valid process entry signal.",
          ),
        },
        {
          id: "cpp-types-control",
          title: "Control Engine",
          subtitle: "Route strongly typed values through decisions and loops",
          objectives: [
            "Declare fundamental types",
            "Write ordered conditional branches",
            "Use a range-based for loop",
          ],
          conceptHeading: "Types determine representation and valid operations",
          explanation: [
            "int, double, bool, and char are fundamental types. std::string is a standard-library class for text and requires the string header.",
            "A range-based for loop reads every item from a container. const references avoid copying larger values when the loop only needs to inspect them.",
          ],
          bullets: [
            "Use double when fractional values matter.",
            "Order thresholds from highest to lowest.",
            "Use const auto& to inspect container objects.",
          ],
          syntax: "for (const int value : values) {\n    std::cout << value;\n}",
          example: {
            title: "Typed energy branch",
            description: "A numeric value selects one output path.",
            code: 'int energy = 61;\nif (energy >= 80) {\n    std::cout << "high";\n} else if (energy >= 40) {\n    std::cout << "stable";\n} else {\n    std::cout << "faint";\n}',
          },
          fieldNote:
            "Compiler warnings about conversions often expose lost precision or signed/unsigned mismatches.",
          mistakes: [
            "Using = inside a condition instead of ==.",
            "Performing integer division when a fractional result is expected.",
            "Copying every large object in a read-only loop.",
          ],
          tasks: [
            cppTask(
              "cpp-types-control-values",
              "Declare machine readings",
              "Declare int energy=88, double ratio=0.75, and bool active=true.",
              "All three declarations are structurally present.",
              "int main() {\n    // Declare readings\n    return 0;\n}\n",
              "int\\s+energy\\s*=\\s*88\\s*;[\\s\\S]*double\\s+ratio\\s*=\\s*0\\.75\\s*;[\\s\\S]*bool\\s+active\\s*=\\s*true\\s*;",
              ["C++ uses bool rather than boolean."],
            ),
            cppTask(
              "cpp-types-control-range",
              "Iterate a vector",
              "Create std::vector<int> values{3,8,13} and use a range-based for loop.",
              "The vector and typed range loop are present.",
              "#include <vector>\n\nint main() {\n    // Vector and range loop\n    return 0;\n}\n",
              "std::vector\\s*<\\s*int\\s*>\\s+values\\s*\\{\\s*3\\s*,\\s*8\\s*,\\s*13\\s*\\}\\s*;[\\s\\S]*for\\s*\\(\\s*(?:const\\s+)?int\\s+value\\s*:\\s*values\\s*\\)",
              ["The colon separates loop variable and container."],
            ),
          ],
          bonusTask: cppBonus(
            "cpp-types-control-bonus",
            "Energy classifier",
            "Write a complete 80/40 high, stable, faint branch.",
            "The source contains two ordered conditions and an else fallback.",
            "int main() {\n    int energy = 61;\n    // Classify\n    return 0;\n}\n",
            "if\\s*\\(\\s*energy\\s*>=\\s*80\\s*\\)[\\s\\S]*else\\s+if\\s*\\(\\s*energy\\s*>=\\s*40\\s*\\)[\\s\\S]*else\\s*\\{",
            ["Write the highest threshold first."],
            "The Control Engine resolves every energy band.",
          ),
        },
        {
          id: "cpp-functions-references",
          title: "Reference Channels",
          subtitle: "Design functions and control copying",
          objectives: [
            "Declare typed functions",
            "Pass read-only values by const reference",
            "Return computed results",
          ],
          conceptHeading:
            "References let functions access existing objects without copying",
          explanation: [
            "A function declaration states its return type and parameter types. Passing a std::string as const std::string& avoids copying while preventing mutation.",
            "Use pass-by-value for small fundamental values and when the function needs its own copy. Use a non-const reference only when mutation is an explicit contract.",
          ],
          bullets: [
            "Prefer const references for large read-only inputs.",
            "Return a value for computations.",
            "Make mutations visible in the function name and signature.",
          ],
          syntax: "std::string label(const std::string& name, int energy) { … }",
          example: {
            title: "Read-only label builder",
            description: "The input string is borrowed without mutation.",
            code: 'std::string label(const std::string& name, int energy) {\n    return name + ":" + std::to_string(energy);\n}',
          },
          fieldNote:
            "A reference is an alias, not an owning object. Its lifetime cannot safely exceed the referred value.",
          mistakes: [
            "Returning a reference to a local variable.",
            "Using non-const reference for an input-only parameter.",
            "Forgetting a return on a non-void path.",
          ],
          tasks: [
            cppTask(
              "cpp-functions-references-boost",
              "Declare a boost function",
              "Create int boost(int value) returning value * 2.",
              "The typed signature and return expression are present.",
              "// Add boost above main\n\nint main() {\n    return 0;\n}\n",
              "int\\s+boost\\s*\\(\\s*int\\s+value\\s*\\)\\s*\\{[\\s\\S]*return\\s+value\\s*\\*\\s*2\\s*;",
              ["Define the return type before the function name."],
            ),
            cppTask(
              "cpp-functions-references-label",
              "Borrow a string safely",
              'Create std::string label(const std::string& name) returning name + " / NX".',
              "The parameter is a const reference and the function returns a string.",
              "#include <string>\n\n// Add label function\n",
              'std::string\\s+label\\s*\\(\\s*const\\s+std::string\\s*&\\s*name\\s*\\)[\\s\\S]*return\\s+name\\s*\\+\\s*"\\s*/\\s*NX"\\s*;',
              ["Place const before std::string and & after the type."],
            ),
          ],
          bonusTask: cppBonus(
            "cpp-functions-references-bonus",
            "Explicit mutation channel",
            "Create void clampEnergy(int& energy) that sets values above 100 to 100 and below 0 to 0.",
            "The non-const reference and both boundary assignments are present.",
            "// Add clampEnergy\n\nint main() {\n    int energy = 140;\n    clampEnergy(energy);\n    return 0;\n}\n",
            "void\\s+clampEnergy\\s*\\(\\s*int\\s*&\\s*energy\\s*\\)[\\s\\S]*energy\\s*>\\s*100[\\s\\S]*energy\\s*=\\s*100[\\s\\S]*energy\\s*<\\s*0[\\s\\S]*energy\\s*=\\s*0",
            ["The & makes mutation of the caller's integer explicit."],
            "A controlled mutation current passes through the Reference Channels.",
          ),
        },
        {
          id: "cpp-vectors-algorithms",
          title: "Vector Basin",
          subtitle: "Store dynamic sequences and apply standard algorithms",
          objectives: [
            "Use std::vector",
            "Add values with push_back",
            "Sort and search with standard algorithms",
          ],
          conceptHeading:
            "Standard containers and algorithms separate storage from operations",
          explanation: [
            "std::vector owns a contiguous, dynamically sized sequence. It supports efficient indexed access and appending at the end.",
            "Algorithms such as std::sort and std::find operate through iterators. Reusing standard algorithms reduces custom loop defects.",
          ],
          bullets: [
            "Include vector and algorithm.",
            "Use begin() and end() iterator bounds.",
            "Check find against end() for absence.",
          ],
          syntax: "std::sort(values.begin(), values.end());",
          example: {
            title: "Order a dynamic sequence",
            description: "The algorithm sorts the vector in place.",
            code: "std::vector<int> values{8, 3, 13};\nstd::sort(values.begin(), values.end());",
          },
          fieldNote:
            "Iterator ranges are half-open: begin is included and end points just past the final item.",
          mistakes: [
            "Dereferencing end().",
            "Forgetting the algorithm header.",
            "Keeping references to vector elements across reallocation.",
          ],
          tasks: [
            cppTask(
              "cpp-vectors-algorithms-append",
              "Build a vector",
              "Declare vector<int> values{3,8} and push_back(13).",
              "The typed vector and append operation are present.",
              "#include <vector>\n\nint main() {\n    // Build sequence\n    return 0;\n}\n",
              "std::vector\\s*<\\s*int\\s*>\\s+values\\s*\\{\\s*3\\s*,\\s*8\\s*\\}\\s*;[\\s\\S]*values\\.push_back\\s*\\(\\s*13\\s*\\)",
              ["push_back appends one value."],
            ),
            cppTask(
              "cpp-vectors-algorithms-sort",
              "Sort with the standard library",
              "Call std::sort across the complete values vector.",
              "sort receives begin and end iterators.",
              "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{13, 3, 8};\n    // Sort\n    return 0;\n}\n",
              "std::sort\\s*\\(\\s*values\\.begin\\s*\\(\\s*\\)\\s*,\\s*values\\.end\\s*\\(\\s*\\)\\s*\\)",
              ["Pass the half-open iterator range."],
            ),
          ],
          bonusTask: cppBonus(
            "cpp-vectors-algorithms-bonus",
            "Search an ordered basin",
            "Sort values, then use std::binary_search to store whether 13 exists.",
            "The source sorts first and performs binary_search on the same range.",
            "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{21, 3, 13, 8};\n    // Sort and search\n    return 0;\n}\n",
            "std::sort\\s*\\([\\s\\S]*values\\.end\\s*\\(\\s*\\)[\\s\\S]*bool\\s+found\\s*=\\s*std::binary_search\\s*\\(\\s*values\\.begin\\s*\\(\\s*\\)\\s*,\\s*values\\.end\\s*\\(\\s*\\)\\s*,\\s*13\\s*\\)",
            ["binary_search requires the earlier sorted order."],
            "The Vector Basin aligns for logarithmic search.",
          ),
        },
        {
          id: "cpp-classes",
          title: "Resource Mechanism",
          subtitle: "Model state with classes and RAII",
          objectives: [
            "Declare private class state",
            "Initialize fields with an initializer list",
            "Expose const member functions",
          ],
          conceptHeading: "C++ objects bind resource lifetime to scope",
          explanation: [
            "A class combines state and behavior. Constructor initializer lists construct fields directly before the constructor body runs.",
            "A member function ending in const promises not to change observable object state. RAII extends this idea: resources are acquired by objects and released automatically when those objects leave scope.",
          ],
          bullets: [
            "Keep fields private by default.",
            "Prefer initializer lists.",
            "Mark read-only member functions const.",
          ],
          syntax:
            "class Relic {\nprivate:\n    int energy_;\npublic:\n    Relic(int energy) : energy_(energy) {}\n    int energy() const { return energy_; }\n};",
          example: {
            title: "Const-observable energy cell",
            description:
              "Construction establishes state and the getter promises read-only access.",
            code: "class Cell {\nprivate:\n    int energy_;\npublic:\n    explicit Cell(int energy) : energy_(energy) {}\n    int energy() const { return energy_; }\n};",
          },
          fieldNote:
            "The static analyzer does not compile or inspect ownership bugs; use compiler warnings and sanitizers in a native toolchain.",
          mistakes: [
            "Assigning every field in the constructor body instead of initializing it.",
            "Exposing mutable fields publicly.",
            "Omitting const from read-only methods.",
          ],
          tasks: [
            cppTask(
              "cpp-classes-field",
              "Construct a cell",
              "Create class Cell with private int energy_ and public constructor initializer list.",
              "Private state and direct initialization are present.",
              "class Cell {\n    // Add private state and public constructor\n};\n",
              "class\\s+Cell[\\s\\S]*private\\s*:[\\s\\S]*int\\s+energy_\\s*;[\\s\\S]*public\\s*:[\\s\\S]*Cell\\s*\\(\\s*int\\s+energy\\s*\\)\\s*:\\s*energy_\\s*\\(\\s*energy\\s*\\)",
              ["The initializer list follows the parameter list after a colon."],
            ),
            cppTask(
              "cpp-classes-const",
              "Expose read-only energy",
              "Add int energy() const returning energy_.",
              "The getter is const-qualified.",
              "class Cell {\nprivate:\n    int energy_;\npublic:\n    explicit Cell(int energy) : energy_(energy) {}\n    // Add getter\n};\n",
              "int\\s+energy\\s*\\(\\s*\\)\\s*const\\s*\\{[\\s\\S]*return\\s+energy_\\s*;",
              ["const appears after the parameter parentheses."],
            ),
          ],
          bonusTask: cppBonus(
            "cpp-classes-bonus",
            "Complete relic mechanism",
            "Create Relic with private string name_, int energy_, initializer-list constructor, label() const, and charge(int).",
            "The class contains typed private state, construction, observation, and mutation.",
            "#include <string>\n\nclass Relic {\n    // Build complete mechanism\n};\n",
            "private\\s*:[\\s\\S]*std::string\\s+name_[\\s\\S]*int\\s+energy_[\\s\\S]*Relic\\s*\\(\\s*const\\s+std::string\\s*&\\s*name\\s*,\\s*int\\s+energy\\s*\\)\\s*:[\\s\\S]*std::string\\s+label\\s*\\(\\s*\\)\\s*const[\\s\\S]*void\\s+charge\\s*\\(\\s*int\\s+amount\\s*\\)",
            ["Use a const reference for the constructor name parameter."],
            "The Resource Mechanism assembles a complete scoped object.",
          ),
          durationMinutes: 38,
        },
      ],
    },
  ],
  futureWorlds: ["Ranges Observatory", "Concurrency Reactor", "Systems Network"],
});

export const track = appendCurriculumWorld(baseTrack, cppV4World);
