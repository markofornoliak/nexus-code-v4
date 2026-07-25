import { AlertTriangle, BookOpenText, FlaskConical, NotebookPen } from "lucide-react";
import type { LessonSection } from "../../types";

interface LessonSectionRendererProps {
  section: LessonSection;
}

export function LessonSectionRenderer({ section }: LessonSectionRendererProps) {
  if (section.type === "example") {
    return (
      <section className="lesson-section code-specimen">
        <div className="lesson-section-icon">
          <FlaskConical aria-hidden="true" />
        </div>
        <div className="lesson-section-content">
          <span className="instrument-label">Executable specimen</span>
          <h2>{section.example.title}</h2>
          <p>{section.example.description}</p>
          <pre>
            <code>{section.example.code}</code>
          </pre>
          {section.example.output && (
            <div className="example-output">
              <span>Observed output</span>
              <code>{section.example.output}</code>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "callout") {
    const Icon = section.tone === "warning" ? AlertTriangle : NotebookPen;
    return (
      <aside className={`lesson-callout tone-${section.tone}`}>
        <Icon aria-hidden="true" />
        <div>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </div>
      </aside>
    );
  }

  return (
    <section
      className={`lesson-section theory-block tone-${section.block.tone ?? "default"}`}
    >
      <div className="lesson-section-icon">
        <BookOpenText aria-hidden="true" />
      </div>
      <div className="lesson-section-content">
        <span className="instrument-label">Recovered theory</span>
        <h2>{section.block.heading}</h2>
        {section.block.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {section.block.bullets && (
          <ul>
            {section.block.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {section.block.syntax && (
          <pre>
            <code>{section.block.syntax}</code>
          </pre>
        )}
      </div>
    </section>
  );
}
