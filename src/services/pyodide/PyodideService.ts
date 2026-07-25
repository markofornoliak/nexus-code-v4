import type { CodeExecutionResult, ExecutionStatus } from "../../types";

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";
const EXECUTION_TIMEOUT_MS = 6_000;
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

interface WorkerReadyMessage {
  type: "ready";
}

interface WorkerErrorMessage {
  type: "initialization-error";
  message: string;
}

type WorkerMessage = WorkerResultMessage | WorkerReadyMessage | WorkerErrorMessage;

export class PyodideService {
  private worker: Worker | null = null;
  private status: ExecutionStatus = "idle";
  private listeners = new Set<StatusListener>();
  private initialization: Promise<void> | null = null;
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

  private createWorker(): Worker {
    const worker = new Worker(new URL("./pyodide.worker.ts", import.meta.url), {
      type: "module",
      name: "nexus-python-runtime",
    });
    worker.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
      this.handleMessage(event.data);
    });
    worker.addEventListener("error", () => {
      this.failInitialization("The Python execution worker could not start.");
    });
    return worker;
  }

  async initialize(): Promise<void> {
    if (
      this.worker &&
      (this.status === "ready" || this.status === "success" || this.status === "error")
    ) {
      return;
    }
    if (this.initialization) return this.initialization;
    this.setStatus("initializing", "Recovering the Python execution core…");
    this.worker = this.createWorker();
    this.initialization = new Promise<void>((resolve, reject) => {
      const unsubscribe = this.subscribe((status, message) => {
        if (status === "ready") {
          unsubscribe();
          resolve();
        }
        if (status === "error") {
          unsubscribe();
          reject(new Error(message ?? "Python runtime initialization failed."));
        }
      });
      this.worker?.postMessage({ type: "initialize", indexURL: PYODIDE_INDEX_URL });
    });
    return this.initialization;
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
    if (!this.worker && typeof navigator !== "undefined" && !navigator.onLine) {
      const result: CodeExecutionResult = {
        status: "error",
        stdout: "",
        stderr:
          "Python is not cached on this device yet. Reconnect once to initialize Pyodide, then retry.",
        durationMs: 0,
      };
      this.setStatus("error", result.stderr);
      return Promise.resolve(result);
    }
    const operation = this.queue.then(async () => {
      try {
        await this.initialize();
      } catch (error) {
        return {
          status: "error" as const,
          stdout: "",
          stderr:
            error instanceof Error
              ? error.message
              : "Python could not be initialized. Check the network and retry.",
          durationMs: 0,
        };
      }

      this.setStatus("running");
      const id = crypto.randomUUID();
      return new Promise<CodeExecutionResult>((resolve) => {
        const timeout = window.setTimeout(() => {
          this.pending.delete(id);
          this.destroyWorker();
          this.setStatus("timeout", "Execution exceeded the six-second safety limit.");
          resolve({
            status: "timeout",
            stdout: "",
            stderr:
              "Execution stopped after six seconds. Check for an infinite loop or unexpectedly heavy work.",
            durationMs: EXECUTION_TIMEOUT_MS,
          });
        }, EXECUTION_TIMEOUT_MS);

        this.pending.set(id, { resolve, timeout });
        this.worker?.postMessage({ type: "run", id, code, stdin });
      });
    });
    this.queue = operation.catch(() => undefined);
    return operation;
  }

  reset(): void {
    this.destroyWorker();
    this.setStatus("idle");
  }

  private handleMessage(message: WorkerMessage): void {
    if (message.type === "ready") {
      this.setStatus("ready");
      return;
    }
    if (message.type === "initialization-error") {
      this.failInitialization(
        `Python could not be loaded. Check your connection and retry. ${message.message}`,
      );
      return;
    }
    const pending = this.pending.get(message.id);
    if (!pending) return;
    window.clearTimeout(pending.timeout);
    this.pending.delete(message.id);
    const result: CodeExecutionResult = {
      status: message.ok ? "success" : "error",
      stdout: message.stdout,
      stderr: message.stderr,
      durationMs: message.durationMs,
    };
    this.setStatus(message.ok ? "success" : "error");
    pending.resolve(result);
  }

  private failInitialization(message: string): void {
    this.initialization = null;
    this.destroyWorker();
    this.setStatus("error", message);
  }

  private destroyWorker(): void {
    this.worker?.terminate();
    this.worker = null;
    this.initialization = null;
    this.pending.forEach(({ resolve, timeout }) => {
      window.clearTimeout(timeout);
      resolve({
        status: "error",
        stdout: "",
        stderr: "Execution core was reset.",
        durationMs: 0,
      });
    });
    this.pending.clear();
  }
}

export const pyodideService = new PyodideService();
