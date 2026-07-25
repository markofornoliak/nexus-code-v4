export type ExecutionStatus =
  "idle" | "initializing" | "ready" | "running" | "success" | "error" | "timeout";

export interface CodeExecutionResult {
  status: "success" | "error" | "timeout";
  stdout: string;
  stderr: string;
  durationMs: number;
}

export interface ValidationResult {
  success: boolean;
  summary: string;
  expectedResult: string;
  actualResult: string;
  hint?: string;
  validationMethod: string;
}
