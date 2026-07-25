import type { Lesson, Track, World } from "../../types";
import { appendCurriculumWorld } from "../_shared/defineLesson";
import { pythonV4World } from "../v4/pythonWorld";
import { world as logicChambers } from "./worlds/logic-chambers/world";
import { world as memoryStructures } from "./worlds/memory-structures/world";
import { world as signalAwakening } from "./worlds/signal-awakening/world";
import { createPythonExpansionWorlds } from "./expansion";
import { createPythonSystemsWorld } from "./systemsLab";

interface LessonModule {
  default: Lesson;
}

const lessonModules = import.meta.glob<LessonModule>("./worlds/**/lessons/*.ts", {
  eager: true,
});

const lessons = Object.values(lessonModules).map((module) => module.default);

function withLessons(definition: Omit<World, "lessons">): World {
  return {
    ...definition,
    lessons: lessons
      .filter((lesson) => lesson.worldId === definition.id)
      .sort((left, right) => left.order - right.order),
  };
}

const baseTrack: Track = {
  id: "python",
  order: 1,
  language: "Python",
  title: "Python Core",
  archiveName: "The Serpentine Archive",
  description:
    "Restore a forty-lesson pathway from first output through data pipelines, object-oriented design, reliable systems, graph traversal, dynamic programming, and weighted pathfinding.",
  difficulty: "beginner",
  status: "available",
  icon: "PY",
  accent: "lime",
  execution: {
    kind: "python",
    editorLanguage: "python",
    fileExtension: "py",
    supportsStdin: true,
    actionLabel: "Run & validate",
    runtimeLabel: "Python / Pyodide",
  },
  worlds: [
    ...[signalAwakening, logicChambers, memoryStructures].map(withLessons),
    ...createPythonExpansionWorlds("python-archive-scanner"),
    createPythonSystemsWorld("python-algorithm-capstone"),
  ],
};

export const track = appendCurriculumWorld(baseTrack, pythonV4World);
