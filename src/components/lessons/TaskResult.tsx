import { CheckCircle2, CircleAlert, TerminalSquare } from "lucide-react";
import type { CodeExecutionResult, ValidationResult } from "../../types";

interface TaskResultProps {
  execution: CodeExecutionResult | null;
  validation: ValidationResult | null;
}

export function TaskResult({ execution, validation }: TaskResultProps) {
  if (!execution) {
    return (
      <section className="task-result is-idle" aria-live="polite">
        <TerminalSquare aria-hidden="true" />
        <div>
          <h3>Console awaiting transmission</h3>
          <p>Run the code to inspect output and validate the selected task.</p>
        </div>
      </section>
    );
  }

  const success = execution.status === "success" && validation?.success;
  const failed = execution.status !== "success" || validation?.success === false;
  return (
    <section
      className={`task-result${success ? " is-success" : ""}${failed ? " is-error" : ""}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="task-result-heading">
        {success ? (
          <CheckCircle2 aria-hidden="true" />
        ) : (
          <CircleAlert aria-hidden="true" />
        )}
        <div>
          <span className="instrument-label">
            {execution.status === "timeout" ? "Safety interrupt" : "Validation report"}
          </span>
          <h3>
            {execution.status !== "success"
              ? "The program did not complete cleanly"
              : (validation?.summary ?? "Execution complete")}
          </h3>
        </div>
        <small>{execution.durationMs} ms</small>
      </div>
      {validation && !validation.success && (
        <dl className="validation-grid">
          <div>
            <dt>Expected</dt>
            <dd>{validation.expectedResult}</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>{validation.validationMethod}</dd>
          </div>
          {validation.hint && (
            <div>
              <dt>Recovery hint</dt>
              <dd>{validation.hint}</dd>
            </div>
          )}
        </dl>
      )}
    </section>
  );
}
