import type { CodeExecutionResult, ExecutionStatus } from "../../types";

const EXECUTION_TIMEOUT_MS = 4_000;
const MAX_CODE_LENGTH = 100_000;
const MAX_STDIN_LENGTH = 20_000;

type StatusListener = (status: ExecutionStatus, message?: string) => void;

interface WorkerResultMessage {
  type: "result";
  id: string;
  ok: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export class JavaScriptService {
  private worker: Worker | null = null;
  private status: ExecutionStatus = "idle";
  private listeners = new Set<StatusListener>();
  private queue: Promise<unknown> = Promise.resolve();
  private pending = new Map<
    string,
    {
      resolve: (result: CodeExecutionResult) => void;
      timeout: number;
    }
  >();

  subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  getStatus(): ExecutionStatus {
    return this.status;
  }

  private setStatus(status: ExecutionStatus, message?: string): void {
    this.status = status;
    this.listeners.forEach((listener) => listener(status, message));
  }

  private ensureWorker(): Worker {
    if (this.worker) return this.worker;
    const worker = new Worker(new URL("./javascript.worker.ts", import.meta.url), {
      type: "module",
      name: "nexus-javascript-runtime",
    });
    worker.addEventListener("message", (event: MessageEvent<WorkerResultMessage>) => {
      const pending = this.pending.get(event.data.id);
      if (!pending) return;
      window.clearTimeout(pending.timeout);
      this.pending.delete(event.data.id);
      const result: CodeExecutionResult = {
        status: event.data.ok ? "success" : "error",
        stdout: event.data.stdout,
        stderr: event.data.stderr,
        durationMs: event.data.durationMs,
      };
      this.setStatus(result.status);
      pending.resolve(result);
    });
    worker.addEventListener("error", () => {
      const message = "The JavaScript execution worker stopped unexpectedly.";
      this.destroyWorker(message);
      this.setStatus("error", message);
    });
    this.worker = worker;
    this.setStatus("ready");
    return worker;
  }

  run(code: string, stdin: string): Promise<CodeExecutionResult> {
    if (code.length > MAX_CODE_LENGTH || stdin.length > MAX_STDIN_LENGTH) {
      const result: CodeExecutionResult = {
        status: "error",
        stdout: "",
        stderr:
          code.length > MAX_CODE_LENGTH
            ? "The code fragment exceeds the 100,000-character safety limit."
            : "The input queue exceeds the 20,000-character safety limit.",
        durationMs: 0,
      };
      this.setStatus("error", result.stderr);
      return Promise.resolve(result);
    }
    const operation = this.queue.then(
      () =>
        new Promise<CodeExecutionResult>((resolve) => {
          const worker = this.ensureWorker();
          this.setStatus("running");
          const id = crypto.randomUUID();
          const timeout = window.setTimeout(() => {
            this.pending.delete(id);
            worker.terminate();
            this.worker = null;
            this.setStatus("timeout", "Execution exceeded the four-second safety limit.");
            resolve({
              status: "timeout",
              stdout: "",
              stderr:
                "Execution stopped after four seconds. Check for an infinite loop or unresolved operation.",
              durationMs: EXECUTION_TIMEOUT_MS,
            });
          }, EXECUTION_TIMEOUT_MS);
          this.pending.set(id, { resolve, timeout });
          worker.postMessage({ type: "run", id, code, stdin });
        }),
    );
    this.queue = operation.catch(() => undefined);
    return operation;
  }

  reset(): void {
    this.destroyWorker("JavaScript execution was reset.");
    this.setStatus("idle");
  }

  private destroyWorker(message: string): void {
    this.worker?.terminate();
    this.worker = null;
    this.pending.forEach(({ resolve, timeout }) => {
      window.clearTimeout(timeout);
      resolve({
        status: "error",
        stdout: "",
        stderr: message,
        durationMs: 0,
      });
    });
    this.pending.clear();
  }
}

export const javaScriptService = new JavaScriptService();
