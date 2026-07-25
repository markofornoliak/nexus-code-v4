import type { CurriculumWorldSpec } from "../_shared/defineLesson";
import { structureBonus, structureTask } from "./lessonTools";

export const javaV4World: CurriculumWorldSpec = {
  id: "contract-forge",
  title: "Contract Forge",
  subtitle: "Design substitutable objects and failure-aware Java 8 systems",
  description:
    "Extend the Object Vault with abstract types, interfaces, exceptions, streams, and a layered capstone compatible with Java 8 and BlueJ.",
  landmark: "The Interface Anvil",
  accent: "amber",
  lessons: [
    {
      id: "java-inheritance-polymorphism",
      title: "Ancestral Contracts",
      subtitle: "Share a stable type across specialized objects",
      objectives: [
        "Create an abstract base class",
        "Override behavior with @Override",
        "Use base-type references polymorphically",
      ],
      conceptHeading:
        "Inheritance is useful when every subtype honors one behavioral contract",
      explanation: [
        "An abstract class can store shared state and require subclasses to implement specific operations. Code using the base type can then work with every valid subtype.",
        "Polymorphism selects the overriding method at runtime. The @Override annotation asks the compiler to confirm that the intended parent contract really exists.",
      ],
      bullets: [
        "Model a genuine is-a relationship.",
        "Keep base invariants protected through constructors and methods.",
        "Prefer composition when only code reuse is needed.",
      ],
      syntax:
        'abstract class Signal {\n    public abstract String describe();\n}\nclass Pulse extends Signal {\n    @Override public String describe() { return "pulse"; }\n}',
      example: {
        title: "Base-reference dispatch",
        description: "The runtime calls Pulse.describe through a Signal reference.",
        code: 'abstract class Signal {\n    public abstract String describe();\n}\nclass Pulse extends Signal {\n    @Override\n    public String describe() { return "pulse"; }\n}\nSignal signal = new Pulse();\nSystem.out.println(signal.describe());',
      },
      fieldNote:
        "A subclass must remain usable wherever the base type is promised. Do not weaken required behavior or surprise callers with incompatible state rules.",
      mistakes: [
        "Inheriting only to access a helper method.",
        "Changing a method signature and accidentally overloading instead of overriding.",
        "Exposing protected mutable fields to every subclass.",
      ],
      tasks: [
        structureTask(
          {
            id: "java-inheritance-abstract",
            title: "Forge an abstract signal",
            description:
              "Create abstract Signal with private name, constructor, getName(), and abstract strength().",
            expectedBehavior:
              "The base type protects identity and requires a strength contract.",
            starterCode:
              "public abstract class Signal {\n    // Add state, construction, observation, and abstract behavior\n}\n",
            hints: [
              "Declare the class and strength method abstract.",
              "Keep name private and expose it through a public getter.",
            ],
          },
          "public\\s+abstract\\s+class\\s+Signal[\\s\\S]*private\\s+String\\s+name\\s*;[\\s\\S]*public\\s+Signal\\s*\\(\\s*String\\s+name\\s*\\)[\\s\\S]*public\\s+String\\s+getName\\s*\\(\\s*\\)[\\s\\S]*public\\s+abstract\\s+int\\s+strength\\s*\\(\\s*\\)\\s*;",
        ),
        structureTask(
          {
            id: "java-inheritance-override",
            title: "Specialize the pulse",
            description:
              "Create PulseSignal extends Signal, add int frequency, and override strength().",
            expectedBehavior:
              "The subtype initializes base and local state and fulfills the abstract contract.",
            starterCode:
              "abstract class Signal {\n    private String name;\n    public Signal(String name) { this.name = name; }\n    public abstract int strength();\n}\n\npublic class PulseSignal {\n    // Extend Signal and implement the contract\n}\n",
            hints: [
              "Add extends Signal and call super(name).",
              "Place @Override directly before strength().",
            ],
          },
          "class\\s+PulseSignal\\s+extends\\s+Signal[\\s\\S]*private\\s+int\\s+frequency\\s*;[\\s\\S]*PulseSignal\\s*\\(\\s*String\\s+name\\s*,\\s*int\\s+frequency\\s*\\)[\\s\\S]*super\\s*\\(\\s*name\\s*\\)[\\s\\S]*@Override[\\s\\S]*public\\s+int\\s+strength\\s*\\(\\s*\\)",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "java-inheritance-bonus",
          title: "Polymorphic signal array",
          description:
            "Create two Signal subtypes, store them in Signal[], and iterate to call describe().",
          expectedBehavior:
            "One loop dispatches subtype-specific descriptions through the base type.",
          starterCode:
            "public class SignalConsole {\n    public static void main(String[] args) {\n        // Build and traverse a polymorphic array\n    }\n}\n\nabstract class Signal {\n    public abstract String describe();\n}\n",
          hints: [
            "Declare at least two classes extending Signal.",
            "Use for (Signal signal : signals).",
          ],
        },
        "class\\s+\\w+\\s+extends\\s+Signal[\\s\\S]*class\\s+\\w+\\s+extends\\s+Signal[\\s\\S]*Signal\\s*\\[\\s*\\]\\s+signals[\\s\\S]*for\\s*\\(\\s*Signal\\s+signal\\s*:\\s*signals\\s*\\)[\\s\\S]*signal\\.describe\\s*\\(",
        "The Contract Forge accepts multiple specialized signals through one stable ancestral type.",
      ),
      durationMinutes: 36,
    },
    {
      id: "java-interfaces",
      title: "Interface Anvil",
      subtitle: "Compose capabilities without inheriting state",
      objectives: [
        "Declare and implement interfaces",
        "Use Java 8 default methods",
        "Depend on capabilities rather than concrete classes",
      ],
      conceptHeading:
        "An interface names a capability that many unrelated classes can honor",
      explanation: [
        "Interfaces define public method contracts without forcing one state hierarchy. A class can implement several interfaces and remain substitutable for each capability.",
        "Java 8 default methods provide a shared implementation when it logically belongs to the contract. Keep state in implementing objects and use defaults sparingly.",
      ],
      bullets: [
        "Name interfaces by behavior.",
        "Accept interface types in constructors and methods.",
        "Use default only for behavior derivable from the contract.",
      ],
      syntax:
        "interface Transmittable {\n    String payload();\n    default int size() { return payload().length(); }\n}",
      example: {
        title: "Capability-driven reporting",
        description: "The reporter depends only on the Transmittable contract.",
        code: "interface Transmittable { String payload(); }\nclass Reporter {\n    public void print(Transmittable value) {\n        System.out.println(value.payload());\n    }\n}",
      },
      fieldNote:
        "An interface should make a useful promise. Avoid marker interfaces when an enum, annotation, or explicit property would communicate more clearly.",
      mistakes: [
        "Typing every dependency as its concrete implementation.",
        "Putting mutable shared fields in an interface.",
        "Using default methods to hide unrelated utility code.",
      ],
      tasks: [
        structureTask(
          {
            id: "java-interface-capability",
            title: "Define a transmission capability",
            description:
              "Create Transmittable with payload() and a default payloadSize() implementation.",
            expectedBehavior:
              "Implementations provide payload while the interface derives its size.",
            starterCode:
              "public interface Transmittable {\n    // Declare required and default behavior\n}\n",
            hints: [
              "Interface methods are public by contract.",
              "A default method includes the default keyword and body.",
            ],
          },
          "public\\s+interface\\s+Transmittable[\\s\\S]*String\\s+payload\\s*\\(\\s*\\)\\s*;[\\s\\S]*default\\s+int\\s+payloadSize\\s*\\(\\s*\\)[\\s\\S]*payload\\s*\\(\\s*\\)\\.length\\s*\\(\\s*\\)",
        ),
        structureTask(
          {
            id: "java-interface-dependency",
            title: "Inject a storage contract",
            description:
              "Create SignalRepository and make SignalService receive it through its constructor.",
            expectedBehavior:
              "The service depends on an interface field rather than a concrete repository.",
            starterCode:
              "interface SignalRepository {\n    void save(String signal);\n}\n\npublic class SignalService {\n    // Store and receive the contract\n    public void recover(String signal) {\n        // Delegate persistence\n    }\n}\n",
            hints: [
              "Declare private final SignalRepository repository.",
              "Assign it in a public constructor and call repository.save.",
            ],
          },
          "private\\s+final\\s+SignalRepository\\s+repository\\s*;[\\s\\S]*public\\s+SignalService\\s*\\(\\s*SignalRepository\\s+repository\\s*\\)[\\s\\S]*this\\.repository\\s*=\\s*repository\\s*;[\\s\\S]*repository\\.save\\s*\\(\\s*signal\\s*\\)",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "java-interface-bonus",
          title: "Compose two capabilities",
          description:
            "Make ArchiveNode implement Transmittable and Validatable, overriding both contracts.",
          expectedBehavior:
            "One class is substitutable for two independent capabilities.",
          starterCode:
            "interface Transmittable { String payload(); }\ninterface Validatable { boolean isValid(); }\n\npublic class ArchiveNode {\n    // Implement both capabilities\n}\n",
          hints: [
            "Separate interface names with a comma after implements.",
            "Add @Override to each required method.",
          ],
        },
        "class\\s+ArchiveNode\\s+implements\\s+(?:Transmittable\\s*,\\s*Validatable|Validatable\\s*,\\s*Transmittable)[\\s\\S]*@Override[\\s\\S]*String\\s+payload\\s*\\([\\s\\S]*@Override[\\s\\S]*boolean\\s+isValid\\s*\\(",
        "The Interface Anvil combines two capabilities without coupling their state.",
      ),
      durationMinutes: 34,
    },
    {
      id: "java-exceptions",
      title: "Fault Ledger",
      subtitle: "Express and contain failure explicitly",
      objectives: [
        "Throw domain-specific exceptions",
        "Catch errors at a recovery boundary",
        "Use try-with-resources",
      ],
      conceptHeading:
        "Exceptions move failure information to a boundary that can respond",
      explanation: [
        "Throw an exception when a method cannot fulfill its contract. A domain-specific exception names the violated rule more clearly than a generic failure.",
        "Catch only where the program can recover, translate, log, or present a useful message. Java 8 try-with-resources closes AutoCloseable resources even when work fails.",
      ],
      bullets: [
        "Validate arguments near the boundary.",
        "Preserve the original cause when translating exceptions.",
        "Do not use exceptions for ordinary loop control.",
      ],
      syntax:
        'if (energy < 0) throw new IllegalArgumentException("energy");\ntry (Scanner scanner = new Scanner(file)) { ... }',
      example: {
        title: "Domain boundary",
        description: "Invalid energy produces a precise checked contract failure.",
        code: 'class InvalidEnergyException extends Exception {\n    public InvalidEnergyException(String message) { super(message); }\n}\nvoid setEnergy(int energy) throws InvalidEnergyException {\n    if (energy < 0) throw new InvalidEnergyException("Negative energy");\n}',
      },
      fieldNote:
        "Catching Exception everywhere makes failures invisible. Catch the narrow type you can handle and let unexpected defects remain visible.",
      mistakes: [
        "Swallowing an exception with an empty catch block.",
        "Throwing a generic RuntimeException without context.",
        "Closing resources only on the success path.",
      ],
      tasks: [
        structureTask(
          {
            id: "java-exception-domain",
            title: "Create a domain exception",
            description:
              "Define InvalidEnergyException and declare charge(int) throws it when amount is negative.",
            expectedBehavior:
              "The method contract names invalid energy and throws the domain type.",
            starterCode:
              "class InvalidEnergyException {\n    // Extend Exception and forward a message\n}\n\npublic class Cell {\n    public void charge(int amount) {\n        // Reject negative values\n    }\n}\n",
            hints: [
              "Extend Exception and call super(message).",
              "Add throws InvalidEnergyException to charge.",
            ],
          },
          "class\\s+InvalidEnergyException\\s+extends\\s+Exception[\\s\\S]*InvalidEnergyException\\s*\\(\\s*String\\s+message\\s*\\)[\\s\\S]*super\\s*\\(\\s*message\\s*\\)[\\s\\S]*void\\s+charge\\s*\\(\\s*int\\s+amount\\s*\\)\\s+throws\\s+InvalidEnergyException[\\s\\S]*if\\s*\\(\\s*amount\\s*<\\s*0\\s*\\)[\\s\\S]*throw\\s+new\\s+InvalidEnergyException",
        ),
        structureTask(
          {
            id: "java-exception-resource",
            title: "Close a scanner reliably",
            description:
              "Use try-with-resources with Scanner and catch FileNotFoundException.",
            expectedBehavior:
              "The scanner is automatically closed and the missing-file case is contained.",
            starterCode:
              "import java.io.File;\nimport java.io.FileNotFoundException;\nimport java.util.Scanner;\n\npublic class SignalReader {\n    public void read(File file) {\n        // Open, read, and contain the expected failure\n    }\n}\n",
            hints: [
              "Place Scanner construction inside try (...).",
              "Catch FileNotFoundException after the try block.",
            ],
          },
          "try\\s*\\(\\s*Scanner\\s+scanner\\s*=\\s*new\\s+Scanner\\s*\\(\\s*file\\s*\\)\\s*\\)[\\s\\S]*scanner\\.(?:hasNextLine|nextLine)\\s*\\([\\s\\S]*catch\\s*\\(\\s*FileNotFoundException\\s+\\w+\\s*\\)",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "java-exception-bonus",
          title: "Translate a storage failure",
          description:
            "Create ArchiveException with a cause and translate IOException while preserving it.",
          expectedBehavior:
            "The application layer exposes domain language without losing the original cause.",
          starterCode:
            "import java.io.IOException;\n\nclass ArchiveException {\n    // Add a message-and-cause constructor\n}\n\npublic class ArchiveLoader {\n    public void load() throws ArchiveException {\n        try {\n            readArchive();\n        } catch (IOException exception) {\n            // Translate while preserving cause\n        }\n    }\n    private void readArchive() throws IOException { }\n}\n",
          hints: [
            "ArchiveException extends Exception.",
            "Call super(message, cause) and pass exception to the new domain exception.",
          ],
        },
        "class\\s+ArchiveException\\s+extends\\s+Exception[\\s\\S]*ArchiveException\\s*\\(\\s*String\\s+message\\s*,\\s*Throwable\\s+cause\\s*\\)[\\s\\S]*super\\s*\\(\\s*message\\s*,\\s*cause\\s*\\)[\\s\\S]*catch\\s*\\(\\s*IOException\\s+exception\\s*\\)[\\s\\S]*throw\\s+new\\s+ArchiveException\\s*\\([^,]+,\\s*exception\\s*\\)",
        "The Fault Ledger translates an infrastructure error without erasing its evidence.",
      ),
      durationMinutes: 38,
    },
    {
      id: "java-streams",
      title: "Stream Constellation",
      subtitle: "Describe collection transformations in Java 8",
      objectives: [
        "Build filter-map-reduce pipelines",
        "Collect typed results",
        "Keep stream operations free of hidden mutation",
      ],
      conceptHeading: "A stream pipeline describes how data is selected and transformed",
      explanation: [
        "Streams do not store values; they process a source through lazy intermediate operations and one terminal operation. filter selects, map transforms, and collect or reduce produces a result.",
        "Keep lambdas small and side-effect free. A loop remains clearer when the operation needs complex branching, mutation, or early recovery.",
      ],
      bullets: [
        "Create one terminal operation per stream.",
        "Use method references when they improve clarity.",
        "State whether encounter order matters.",
      ],
      syntax:
        "List<String> names = signals.stream()\n    .filter(Signal::isOnline)\n    .map(Signal::getName)\n    .collect(Collectors.toList());",
      example: {
        title: "Select and normalize",
        description: "The pipeline produces a new typed list.",
        code: 'List<String> online = names.stream()\n    .filter(name -> name.startsWith("N"))\n    .map(String::toUpperCase)\n    .collect(Collectors.toList());',
      },
      fieldNote:
        "A stream does not automatically make work parallel or faster. Choose it for expressive transformations, then measure performance.",
      mistakes: [
        "Trying to reuse a stream after a terminal operation.",
        "Mutating the source collection from inside map.",
        "Using parallelStream without a measured, thread-safe reason.",
      ],
      tasks: [
        structureTask(
          {
            id: "java-stream-filter-map",
            title: "Recover online call signs",
            description:
              "Stream signals, filter isOnline, map getName, and collect to List<String>.",
            expectedBehavior: "The source contains a typed filter-map-collect pipeline.",
            starterCode:
              'import java.util.List;\nimport java.util.stream.Collectors;\n\npublic class SignalIndex {\n    public List<String> onlineNames(List<Signal> signals) {\n        // Build the pipeline\n    }\n}\n\nclass Signal {\n    public boolean isOnline() { return true; }\n    public String getName() { return "NX"; }\n}\n',
            hints: [
              "Begin with signals.stream().",
              "End with collect(Collectors.toList()).",
            ],
          },
          "List\\s*<\\s*String\\s*>\\s+onlineNames[\\s\\S]*signals\\.stream\\s*\\(\\s*\\)[\\s\\S]*\\.filter\\s*\\([^)]*(?:isOnline|Signal::isOnline)[\\s\\S]*\\.map\\s*\\([^)]*(?:getName|Signal::getName)[\\s\\S]*\\.collect\\s*\\(\\s*Collectors\\.toList\\s*\\(\\s*\\)\\s*\\)",
        ),
        structureTask(
          {
            id: "java-stream-reduce",
            title: "Aggregate total energy",
            description: "Map Signal values to int energy and sum them with mapToInt.",
            expectedBehavior: "The method returns a primitive int stream sum.",
            starterCode:
              "import java.util.List;\n\npublic class EnergyReport {\n    public int total(List<Signal> signals) {\n        // Aggregate energy\n    }\n}\n\nclass Signal {\n    public int getEnergy() { return 0; }\n}\n",
            hints: [
              "Use mapToInt with Signal::getEnergy or a lambda.",
              "Finish with sum().",
            ],
          },
          "int\\s+total\\s*\\([\\s\\S]*signals\\.stream\\s*\\(\\s*\\)[\\s\\S]*\\.mapToInt\\s*\\([^)]*(?:getEnergy|Signal::getEnergy)[\\s\\S]*\\.sum\\s*\\(\\s*\\)",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "java-stream-bonus",
          title: "Group signals by status",
          description:
            "Use Collectors.groupingBy to produce Map<Boolean,List<Signal>> keyed by isOnline.",
          expectedBehavior:
            "The stream partitions domain objects into typed status groups.",
          starterCode:
            "import java.util.List;\nimport java.util.Map;\nimport java.util.stream.Collectors;\n\npublic class StatusIndex {\n    public Map<Boolean, List<Signal>> group(List<Signal> signals) {\n        // Group by online state\n    }\n}\n\nclass Signal {\n    public boolean isOnline() { return true; }\n}\n",
          hints: [
            "Return signals.stream().collect(...).",
            "Use Collectors.groupingBy(Signal::isOnline).",
          ],
        },
        "Map\\s*<\\s*Boolean\\s*,\\s*List\\s*<\\s*Signal\\s*>\\s*>[\\s\\S]*signals\\.stream\\s*\\(\\s*\\)[\\s\\S]*Collectors\\.groupingBy\\s*\\(\\s*Signal::isOnline\\s*\\)",
        "The Stream Constellation resolves a typed status map through one declarative pipeline.",
      ),
      durationMinutes: 36,
    },
    {
      id: "java-contract-capstone",
      title: "Reliquary Service",
      subtitle: "Assemble a layered Java 8 recovery system",
      objectives: [
        "Separate domain, repository, and service responsibilities",
        "Inject contracts through constructors",
        "Translate validation and storage failures",
      ],
      conceptHeading:
        "Layered design keeps business rules independent from storage details",
      explanation: [
        "A domain object protects its own valid state. A repository interface describes persistence. A service coordinates use cases and depends on the repository contract rather than one storage implementation.",
        "Constructor injection makes required collaborators visible and testable. Exceptions should cross layers in language that the receiving layer can understand.",
      ],
      bullets: [
        "Keep domain rules inside domain types.",
        "Keep I/O details behind interfaces.",
        "Create small services around complete user operations.",
      ],
      syntax:
        "class RecoveryService {\n    private final SignalRepository repository;\n    RecoveryService(SignalRepository repository) { this.repository = repository; }\n}",
      example: {
        title: "Contract-driven service",
        description: "The service can receive a fake repository in a test.",
        code: "interface SignalRepository { void save(Signal signal); }\nclass RecoveryService {\n    private final SignalRepository repository;\n    RecoveryService(SignalRepository repository) { this.repository = repository; }\n    void recover(Signal signal) { repository.save(signal); }\n}",
      },
      fieldNote:
        "More layers are not automatically better. Add a boundary when it protects a distinct responsibility or makes change and testing safer.",
      mistakes: [
        "Constructing the concrete repository inside the service.",
        "Letting persistence classes change domain fields directly.",
        "Returning null for every failure state.",
      ],
      tasks: [
        structureTask(
          {
            id: "java-capstone-domain",
            title: "Protect the Signal domain",
            description:
              "Create final Signal with private final id, bounded energy constructor, and getters.",
            expectedBehavior: "The immutable domain object rejects energy outside 0–100.",
            starterCode:
              "public final class Signal {\n    // Add immutable state and validated construction\n}\n",
            hints: [
              "Use private final fields.",
              "Throw IllegalArgumentException when energy is outside the range.",
            ],
          },
          "public\\s+final\\s+class\\s+Signal[\\s\\S]*private\\s+final\\s+String\\s+id\\s*;[\\s\\S]*private\\s+final\\s+int\\s+energy\\s*;[\\s\\S]*public\\s+Signal\\s*\\(\\s*String\\s+id\\s*,\\s*int\\s+energy\\s*\\)[\\s\\S]*if\\s*\\([^)]*energy\\s*<\\s*0[^)]*\\|\\|[^)]*energy\\s*>\\s*100[\\s\\S]*throw\\s+new\\s+IllegalArgumentException[\\s\\S]*getId\\s*\\([\\s\\S]*getEnergy\\s*\\(",
        ),
        structureTask(
          {
            id: "java-capstone-service",
            title: "Coordinate recovery by contract",
            description:
              "Define SignalRepository and RecoveryService with constructor injection and recover(id, energy).",
            expectedBehavior:
              "The service creates a validated Signal and delegates it to the repository.",
            starterCode:
              "interface SignalRepository {\n    // Declare save contract\n}\n\npublic class RecoveryService {\n    // Inject repository and coordinate recovery\n}\n",
            hints: [
              "The repository saves a Signal.",
              "The service field is private final and assigned in the constructor.",
            ],
          },
          "interface\\s+SignalRepository[\\s\\S]*void\\s+save\\s*\\(\\s*Signal\\s+signal\\s*\\)\\s*;[\\s\\S]*class\\s+RecoveryService[\\s\\S]*private\\s+final\\s+SignalRepository\\s+repository[\\s\\S]*RecoveryService\\s*\\(\\s*SignalRepository\\s+repository\\s*\\)[\\s\\S]*void\\s+recover\\s*\\(\\s*String\\s+id\\s*,\\s*int\\s+energy\\s*\\)[\\s\\S]*new\\s+Signal\\s*\\(\\s*id\\s*,\\s*energy\\s*\\)[\\s\\S]*repository\\.save",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "java-capstone-bonus",
          title: "Create an in-memory test double",
          description:
            "Implement SignalRepository with ArrayList storage and expose an unmodifiable view.",
          expectedBehavior:
            "The repository is usable in tests without allowing callers to mutate its internal list.",
          starterCode:
            "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\npublic class InMemorySignalRepository {\n    // Implement the contract safely\n}\n",
          hints: [
            "Add implements SignalRepository.",
            "Return Collections.unmodifiableList(signals).",
          ],
        },
        "class\\s+InMemorySignalRepository\\s+implements\\s+SignalRepository[\\s\\S]*private\\s+final\\s+List\\s*<\\s*Signal\\s*>\\s+signals\\s*=\\s*new\\s+ArrayList[\\s\\S]*@Override[\\s\\S]*void\\s+save\\s*\\(\\s*Signal\\s+signal\\s*\\)[\\s\\S]*signals\\.add\\s*\\(\\s*signal\\s*\\)[\\s\\S]*Collections\\.unmodifiableList\\s*\\(\\s*signals\\s*\\)",
        "The Reliquary Service gains a deterministic storage double for isolated BlueJ tests.",
      ),
      durationMinutes: 48,
    },
  ],
};
