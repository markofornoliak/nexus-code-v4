import { appendCurriculumWorld, createCurriculumTrack } from "../_shared/defineLesson";
import { patternBonus, patternTask } from "../_shared/taskBuilders";
import { javaV4World } from "../v4/javaWorld";

const javaTask = (
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

const javaBonus = (
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
  id: "java",
  order: 4,
  language: "Java",
  title: "Object Vault",
  archiveName: "The Typed Reliquary",
  description:
    "Reconstruct Java foundations, methods, classes, encapsulation, and collections with browser-side structural checks compatible with Java 8.",
  icon: "J",
  accent: "violet",
  execution: {
    kind: "static",
    editorLanguage: "java",
    fileExtension: "java",
    supportsStdin: false,
    actionLabel: "Analyze structure",
    runtimeLabel: "Java 8 structure analyzer",
  },
  worlds: [
    {
      id: "typed-reliquary",
      title: "Typed Reliquary",
      subtitle: "Strong types and object-oriented foundations",
      description:
        "Five progressive fragments move from a Java 8 entry point to cooperating objects and generic collections.",
      landmark: "The Class Seal",
      accent: "violet",
      lessons: [
        {
          id: "java-entry-point",
          title: "Compiled Pulse",
          subtitle: "Understand classes, main, and console output",
          objectives: [
            "Declare a public class",
            "Write the Java application entry point",
            "Print with System.out.println",
          ],
          conceptHeading: "A Java application enters through a precise method signature",
          explanation: [
            "Java source lives inside classes. The runtime begins a normal console application at public static void main(String[] args).",
            "The public class name and source filename must match exactly. Java is case-sensitive, including System and String.",
          ],
          bullets: [
            "Use Java 8-compatible syntax.",
            "Match braces before compiling.",
            "Keep one public top-level class per file.",
          ],
          syntax:
            'public class Main {\n    public static void main(String[] args) {\n        System.out.println("online");\n    }\n}',
          example: {
            title: "Minimal Java pulse",
            description: "The exact entry point prints one visible line.",
            code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("NEXUS online");\n    }\n}',
          },
          fieldNote:
            "The browser analyzer checks requested source structures; compile the exported code in BlueJ or a JDK for runtime verification.",
          mistakes: [
            "Writing string instead of String.",
            "Changing the main parameter signature.",
            "Using a filename that differs from the public class.",
          ],
          tasks: [
            javaTask(
              "java-entry-point-main",
              "Restore the entry point",
              "Add public static void main(String[] args) to Main.",
              "The class contains the standard Java entry point.",
              "public class Main {\n    // Add entry point\n}\n",
              "public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s+args\\s*\\)",
              ["Type the signature exactly; then add a method body."],
            ),
            javaTask(
              "java-entry-point-output",
              "Print the first signal",
              "Inside main, print NEXUS online.",
              "The source contains a println call with the required text.",
              "public class Main {\n    public static void main(String[] args) {\n        // Print signal\n    }\n}\n",
              'System\\.out\\.println\\s*\\(\\s*"NEXUS online"\\s*\\)\\s*;',
              ["Java statements end with semicolons."],
            ),
          ],
          bonusTask: javaBonus(
            "java-entry-point-bonus",
            "Complete coordinate transmitter",
            "Create ArchiveApp with a main method that declares int sector = 3 and prints Sector: 3.",
            "The class, entry point, typed variable, and output are structurally present.",
            "public class ArchiveApp {\n    // Build the complete transmitter\n}\n",
            "public\\s+class\\s+ArchiveApp[\\s\\S]*public\\s+static\\s+void\\s+main[\\s\\S]*int\\s+sector\\s*=\\s*3\\s*;[\\s\\S]*System\\.out\\.println",
            ["Keep ArchiveApp as the public class name."],
            "The Class Seal accepts a complete Java entry-point signature.",
          ),
        },
        {
          id: "java-types-control",
          title: "Typed Decision Matrix",
          subtitle: "Declare values and route them through control flow",
          objectives: [
            "Use primitive and reference types",
            "Write if / else if / else",
            "Iterate with an enhanced for loop",
          ],
          conceptHeading: "Java types make value contracts explicit at compile time",
          explanation: [
            "Primitive types such as int, double, and boolean store simple values. Reference types such as String and arrays refer to objects.",
            "Control-flow conditions must be boolean expressions. The enhanced for loop reads each value from an array or Iterable without manual indexes.",
          ],
          bullets: [
            "Use == for primitive equality.",
            "Use .equals for String content.",
            "Order numeric thresholds from highest to lowest.",
          ],
          syntax: "for (int value : values) {\n    System.out.println(value);\n}",
          example: {
            title: "Classify energy",
            description: "A typed value enters an ordered branch.",
            code: 'int energy = 61;\nif (energy >= 80) {\n    System.out.println("high");\n} else if (energy >= 40) {\n    System.out.println("stable");\n} else {\n    System.out.println("faint");\n}',
          },
          fieldNote:
            "Compiler errors often reveal a violated type contract before the program can run.",
          mistakes: [
            "Comparing String content with ==.",
            "Assigning a double literal to int without conversion.",
            "Putting a lower threshold before a higher threshold.",
          ],
          tasks: [
            javaTask(
              "java-types-control-fields",
              "Declare typed readings",
              "Declare int energy = 88, double ratio = 0.75, and boolean active = true.",
              "All three typed declarations are present.",
              "public class Readings {\n    public static void main(String[] args) {\n        // Declare readings\n    }\n}\n",
              "int\\s+energy\\s*=\\s*88\\s*;[\\s\\S]*double\\s+ratio\\s*=\\s*0\\.75\\s*;[\\s\\S]*boolean\\s+active\\s*=\\s*true\\s*;",
              ["Each declaration needs an explicit type and semicolon."],
            ),
            javaTask(
              "java-types-control-loop",
              "Iterate an array",
              "Create int[] values = {3, 8, 13} and print values with an enhanced for loop.",
              "The source contains the array and for (int value : values).",
              "public class Sequence {\n    public static void main(String[] args) {\n        // Array and enhanced loop\n    }\n}\n",
              "int\\s*\\[\\s*\\]\\s+values\\s*=\\s*\\{\\s*3\\s*,\\s*8\\s*,\\s*13\\s*\\}\\s*;[\\s\\S]*for\\s*\\(\\s*int\\s+value\\s*:\\s*values\\s*\\)",
              ["The colon separates loop variable from source."],
            ),
          ],
          bonusTask: javaBonus(
            "java-types-control-bonus",
            "Energy classifier",
            "Write a complete high/stable/faint if chain for int energy.",
            "The source contains ordered 80 and 40 thresholds plus an else fallback.",
            "public class Classifier {\n    public static void main(String[] args) {\n        int energy = 61;\n        // Add complete classification\n    }\n}\n",
            "if\\s*\\(\\s*energy\\s*>=\\s*80\\s*\\)[\\s\\S]*else\\s+if\\s*\\(\\s*energy\\s*>=\\s*40\\s*\\)[\\s\\S]*else\\s*\\{",
            ["Use three branches inside main."],
            "The Typed Decision Matrix resolves a complete branch contract.",
          ),
        },
        {
          id: "java-methods",
          title: "Method Chamber",
          subtitle: "Design reusable typed behavior",
          objectives: [
            "Declare parameters and return types",
            "Call static helper methods",
            "Use method overloading deliberately",
          ],
          conceptHeading: "A method signature is a typed behavioral contract",
          explanation: [
            "A method signature names the operation and declares parameter types. Its return type states which value callers receive, or void when no value is returned.",
            "static helpers belong to the class rather than one object. Overloading allows the same method name with different parameter lists, but not with only a different return type.",
          ],
          bullets: [
            "Choose the narrowest useful parameter types.",
            "Return a result instead of changing global fields.",
            "Keep one responsibility per method.",
          ],
          syntax: "public static int clamp(int value, int min, int max) { … }",
          example: {
            title: "Typed clamp contract",
            description: "The method returns a bounded integer.",
            code: "public static int clamp(int value, int min, int max) {\n    return Math.max(min, Math.min(max, value));\n}",
          },
          fieldNote:
            "Write the method signature before the body; it forces the input/output contract to become explicit.",
          mistakes: [
            "Returning no value from a non-void method.",
            "Calling an instance method from static main without an object.",
            "Overloading only by changing the return type.",
          ],
          tasks: [
            javaTask(
              "java-methods-signature",
              "Declare a typed boost",
              "Create public static int boost(int value) returning value * 2.",
              "The source contains the exact signature and an integer return.",
              "public class SignalMath {\n    // Add boost method\n}\n",
              "public\\s+static\\s+int\\s+boost\\s*\\(\\s*int\\s+value\\s*\\)\\s*\\{[\\s\\S]*return\\s+value\\s*\\*\\s*2\\s*;",
              ["The return type and expression are both int-compatible."],
            ),
            javaTask(
              "java-methods-string",
              "Format a relic",
              'Create public static String label(String name, int energy) returning name + ":" + energy.',
              "The typed method returns a composed String.",
              "public class Formatter {\n    // Add label method\n}\n",
              'public\\s+static\\s+String\\s+label\\s*\\(\\s*String\\s+name\\s*,\\s*int\\s+energy\\s*\\)[\\s\\S]*return\\s+name\\s*\\+\\s*":"\\s*\\+\\s*energy\\s*;',
              ["String concatenation uses +."],
            ),
          ],
          bonusTask: javaBonus(
            "java-methods-bonus",
            "Overloaded transmitter",
            "Overload transmit for one String and for String plus int repeats.",
            "Two public static transmit methods have distinct parameter lists.",
            "public class Transmitter {\n    // Add both overloads\n}\n",
            "public\\s+static\\s+void\\s+transmit\\s*\\(\\s*String\\s+message\\s*\\)[\\s\\S]*public\\s+static\\s+void\\s+transmit\\s*\\(\\s*String\\s+message\\s*,\\s*int\\s+repeats\\s*\\)",
            ["Keep the name and return type the same; change parameters."],
            "The Method Chamber stores two compatible behavioral signatures.",
          ),
        },
        {
          id: "java-classes",
          title: "Object Blueprint",
          subtitle: "Encapsulate state in Java objects",
          objectives: [
            "Declare private instance fields",
            "Initialize fields in a constructor",
            "Expose behavior through public methods",
          ],
          conceptHeading:
            "Encapsulation protects state behind an object's public contract",
          explanation: [
            "A class groups fields and methods. A constructor has the class name and no return type; it establishes valid starting state.",
            "Private fields prevent arbitrary external changes. Public methods expose deliberate operations and can enforce invariants.",
          ],
          bullets: [
            "Keep fields private by default.",
            "Use this.field to distinguish instance state.",
            "Validate state changes inside methods.",
          ],
          syntax:
            "public class Signal {\n    private int energy;\n    public Signal(int energy) { this.energy = energy; }\n}",
          example: {
            title: "Encapsulated energy cell",
            description: "Construction and charging protect one private field.",
            code: "public class Cell {\n    private int energy;\n\n    public Cell(int energy) {\n        this.energy = energy;\n    }\n\n    public void charge(int amount) {\n        energy = Math.min(100, energy + amount);\n    }\n\n    public int getEnergy() {\n        return energy;\n    }\n}",
          },
          fieldNote:
            "A getter is not mandatory for every field; expose only the information callers genuinely need.",
          mistakes: [
            "Adding a return type to a constructor.",
            "Shadowing a field without assigning this.field.",
            "Making fields public for convenience.",
          ],
          tasks: [
            javaTask(
              "java-classes-constructor",
              "Construct a relic",
              "Add private name and energy fields plus a constructor that assigns both.",
              "The class has two private fields and a matching constructor.",
              "public class Relic {\n    // Fields and constructor\n}\n",
              "private\\s+String\\s+name\\s*;[\\s\\S]*private\\s+int\\s+energy\\s*;[\\s\\S]*public\\s+Relic\\s*\\(\\s*String\\s+name\\s*,\\s*int\\s+energy\\s*\\)[\\s\\S]*this\\.name\\s*=\\s*name\\s*;[\\s\\S]*this\\.energy\\s*=\\s*energy\\s*;",
              ["A constructor has no void keyword."],
            ),
            javaTask(
              "java-classes-behavior",
              "Add bounded charge behavior",
              "Add public void charge(int amount) that caps energy using Math.min(100,...).",
              "The public method updates the private field with a cap.",
              "public class Cell {\n    private int energy;\n\n    public Cell(int energy) {\n        this.energy = energy;\n    }\n\n    // Add behavior\n}\n",
              "public\\s+void\\s+charge\\s*\\(\\s*int\\s+amount\\s*\\)[\\s\\S]*energy\\s*=\\s*Math\\.min\\s*\\(\\s*100\\s*,\\s*energy\\s*\\+\\s*amount\\s*\\)",
              ["Update energy inside the method body."],
            ),
          ],
          bonusTask: javaBonus(
            "java-classes-bonus",
            "Complete immutable coordinate",
            "Create final private x and y fields, constructor, and public getters.",
            "The Point class exposes read-only coordinate state.",
            "public class Point {\n    // Build immutable coordinate\n}\n",
            "private\\s+final\\s+int\\s+x\\s*;[\\s\\S]*private\\s+final\\s+int\\s+y\\s*;[\\s\\S]*public\\s+Point\\s*\\([\\s\\S]*public\\s+int\\s+getX\\s*\\([\\s\\S]*public\\s+int\\s+getY\\s*\\(",
            ["Assign final fields exactly once in the constructor."],
            "The Object Blueprint seals an immutable coordinate specimen.",
          ),
        },
        {
          id: "java-collections",
          title: "Collection Vault",
          subtitle: "Store typed groups with Java generics",
          objectives: [
            "Declare a generic ArrayList",
            "Add and iterate values",
            "Use a Map for keyed lookup",
          ],
          conceptHeading: "Generics state which value type a collection accepts",
          explanation: [
            "ArrayList is a resizable ordered collection. A type argument such as <String> lets the compiler reject incompatible additions and return known types.",
            "Map stores key-value associations. Use it when lookup by a stable identifier matters more than numeric position.",
          ],
          bullets: [
            "Program to List or Map interfaces when practical.",
            "Use the diamond operator on construction.",
            "Choose a collection based on access needs.",
          ],
          syntax: 'List<String> names = new ArrayList<String>();\nnames.add("Nexus");',
          example: {
            title: "Typed call-sign list",
            description: "The generic contract accepts only String values.",
            code: 'List<String> calls = new ArrayList<String>();\ncalls.add("Nexus");\ncalls.add("Atlas");\nfor (String call : calls) {\n    System.out.println(call);\n}',
          },
          fieldNote:
            "The Java analyzer checks source structure only; imports and runtime behavior still need a Java 8 compiler.",
          mistakes: [
            "Using raw collections without a type argument.",
            "Importing java.awt.List instead of java.util.List.",
            "Changing a collection while iterating it directly.",
          ],
          tasks: [
            javaTask(
              "java-collections-list",
              "Create a typed list",
              "Declare List<String> relics = new ArrayList<String>() and add Prism.",
              "The generic list and add call are present.",
              "import java.util.ArrayList;\nimport java.util.List;\n\npublic class Catalog {\n    // Add typed list field or local variable\n}\n",
              'List\\s*<\\s*String\\s*>\\s+relics\\s*=\\s*new\\s+ArrayList\\s*<\\s*String\\s*>\\s*\\(\\s*\\)\\s*;[\\s\\S]*relics\\.add\\s*\\(\\s*"Prism"\\s*\\)',
              ["Java 8 supports the explicit matching type argument shown."],
            ),
            javaTask(
              "java-collections-map",
              "Create an energy lookup",
              "Declare Map<String,Integer> energy = new HashMap<>() and put Prism,88.",
              "The typed map and keyed value are present.",
              "import java.util.HashMap;\nimport java.util.Map;\n\npublic class EnergyIndex {\n    // Build lookup\n}\n",
              'Map\\s*<\\s*String\\s*,\\s*Integer\\s*>\\s+energy\\s*=\\s*new\\s+HashMap\\s*<[^>]*>\\s*\\(\\s*\\)\\s*;[\\s\\S]*energy\\.put\\s*\\(\\s*"Prism"\\s*,\\s*88\\s*\\)',
              ["Generic types use Integer rather than primitive int."],
            ),
          ],
          bonusTask: javaBonus(
            "java-collections-bonus",
            "Object catalog",
            "Create List<Relic>, add two Relic objects, and iterate with for (Relic relic : relics).",
            "The source models a typed collection of domain objects.",
            "import java.util.ArrayList;\nimport java.util.List;\n\npublic class Catalog {\n    public static void main(String[] args) {\n        // Build and iterate catalog\n    }\n}\n\nclass Relic {\n    private String name;\n    public Relic(String name) { this.name = name; }\n}\n",
            "List\\s*<\\s*Relic\\s*>\\s+relics\\s*=\\s*new\\s+ArrayList[\\s\\S]*relics\\.add\\s*\\(\\s*new\\s+Relic[\\s\\S]*for\\s*\\(\\s*Relic\\s+relic\\s*:\\s*relics\\s*\\)",
            ["Use the same Relic type in declaration, construction, and loop."],
            "The Collection Vault opens around a type-safe object catalog.",
          ),
          durationMinutes: 36,
        },
      ],
    },
  ],
  futureWorlds: ["Concurrency Reactor", "Persistence Vault", "Testing Observatory"],
});

export const track = appendCurriculumWorld(baseTrack, javaV4World);
