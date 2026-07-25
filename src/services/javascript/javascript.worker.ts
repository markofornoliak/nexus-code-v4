interface RunMessage {
  type: "run";
  id: string;
  code: string;
  stdin: string;
}

interface ResultMessage {
  type: "result";
  id: string;
  ok: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
}

const workerScope = self as DedicatedWorkerGlobalScope;
const OUTPUT_LIMIT = 100_000;

function printable(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "undefined") return "undefined";
  if (typeof value === "function") return `[Function ${value.name || "anonymous"}]`;
  if (typeof value === "symbol" || typeof value === "bigint") return value.toString();
  try {
    return JSON.stringify(value) ?? Object.prototype.toString.call(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
}

workerScope.addEventListener("message", (event: MessageEvent<RunMessage>) => {
  if (event.data.type !== "run") return;
  const { id, code, stdin } = event.data;
  const startedAt = performance.now();
  const output: string[] = [];
  const errors: string[] = [];
  let outputSize = 0;
  let outputTruncated = false;
  const inputLines = stdin.replace(/\r\n?/g, "\n").split("\n");
  let inputIndex = 0;
  const append = (target: string[], values: unknown[]) => {
    if (outputTruncated) return;
    const line = values.map(printable).join(" ");
    const remaining = OUTPUT_LIMIT - outputSize;
    if (line.length + 1 > remaining) {
      target.push(`${line.slice(0, Math.max(0, remaining))}\n[NEXUS output truncated]`);
      outputTruncated = true;
      outputSize = OUTPUT_LIMIT;
      return;
    }
    target.push(line);
    outputSize += line.length + 1;
  };
  const consoleProxy = {
    log: (...values: unknown[]) => append(output, values),
    info: (...values: unknown[]) => append(output, values),
    warn: (...values: unknown[]) => append(errors, values),
    error: (...values: unknown[]) => append(errors, values),
  };
  const input = () => inputLines[inputIndex++] ?? "";
  // The dedicated, disposable Worker is the execution boundary for learner code.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const execute = Function(
    "console",
    "input",
    `"use strict";\nreturn (async () => {\n${code}\n})();\n//# sourceURL=nexus-lesson.js`,
  ) as (consoleArg: typeof consoleProxy, inputArg: () => string) => Promise<unknown>;
  void execute(consoleProxy, input)
    .then(() => {
      const message: ResultMessage = {
        type: "result",
        id,
        ok: true,
        stdout: output.length > 0 ? `${output.join("\n")}\n` : "",
        stderr: errors.length > 0 ? `${errors.join("\n")}\n` : "",
        durationMs: Math.round(performance.now() - startedAt),
      };
      workerScope.postMessage(message);
    })
    .catch((error: unknown) => {
      const message: ResultMessage = {
        type: "result",
        id,
        ok: false,
        stdout: output.length > 0 ? `${output.join("\n")}\n` : "",
        stderr:
          error instanceof Error ? `${error.name}: ${error.message}` : String(error),
        durationMs: Math.round(performance.now() - startedAt),
      };
      workerScope.postMessage(message);
    });
});
