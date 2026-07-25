import { CheckCircle2, Circle } from "lucide-react";
import type { Lesson } from "../../types";
import type { LessonProgress as LessonProgressType } from "../../types";
import { ProgressBar } from "../common/ProgressBar";

interface LessonProgressProps {
  lesson: Lesson;
  progress?: LessonProgressType;
}

export function LessonProgress({ lesson, progress }: LessonProgressProps) {
  const completeCount = progress?.completedTaskIds.length ?? 0;
  const total = lesson.tasks.length;
  const percent = total === 0 ? 0 : Math.round((completeCount / total) * 100);

  return (
    <section className="lesson-progress-card" aria-labelledby="lesson-progress-title">
      <div className="section-heading-row">
        <div>
          <span className="instrument-label">Restoration state</span>
          <h2 id="lesson-progress-title">
            {progress?.isCompleted
              ? "Fragment stable"
              : `${completeCount} of ${total} tasks stabilized`}
          </h2>
        </div>
        <strong>{lesson.xpReward} signal</strong>
      </div>
      <ProgressBar
        value={progress?.isCompleted ? 100 : percent}
        label="Lesson completion"
      />
      <ul className="task-dot-list" aria-label="Task completion">
        {lesson.tasks.map((task) => {
          const complete = progress?.completedTaskIds.includes(task.id) ?? false;
          return (
            <li key={task.id} className={complete ? "is-complete" : ""}>
              {complete ? (
                <CheckCircle2 aria-hidden="true" />
              ) : (
                <Circle aria-hidden="true" />
              )}
              <span>{task.title}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
