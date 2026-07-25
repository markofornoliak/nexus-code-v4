import { useCallback, useEffect, useMemo, useState } from "react";
import type { CodeExecutionResult, ExecutionKind, ExecutionStatus } from "../../types";
import { javaScriptService } from "../../services/javascript/JavaScriptService";
import { pyodideService } from "../../services/pyodide/PyodideService";

type RuntimeService = Pick<
  typeof pyodideService,
  "getStatus" | "reset" | "run" | "subscribe"
>;

function runtimeService(kind: ExecutionKind): RuntimeService | null {
  if (kind === "python") return pyodideService;
  if (kind === "javascript") return javaScriptService;
  return null;
}

export function useCodeRunner(kind: ExecutionKind) {
  const service = useMemo(() => runtimeService(kind), [kind]);
  const [status, setStatus] = useState<ExecutionStatus>(service?.getStatus() ?? "idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [result, setResult] = useState<CodeExecutionResult | null>(null);

  useEffect(() => {
    setResult(null);
    setStatusMessage("");
    if (!service) {
      setStatus("idle");
      return;
    }
    setStatus(service.getStatus());
    return service.subscribe((nextStatus, message) => {
      setStatus(nextStatus);
      setStatusMessage(message ?? "");
    });
  }, [service]);

  const run = useCallback(
    async (code: string, stdin: string): Promise<CodeExecutionResult> => {
      setResult(null);
      if (!service) {
        const next: CodeExecutionResult = {
          status: "success",
          stdout:
            kind === "web-preview"
              ? "Preview rendered in the sandbox."
              : "Source structure analyzed.",
          stderr: "",
          durationMs: 0,
        };
        setStatus("success");
        setResult(next);
        return next;
      }
      const next = await service.run(code, stdin);
      setResult(next);
      return next;
    },
    [kind, service],
  );

  const resetExecution = useCallback(() => {
    setResult(null);
    service?.reset();
  }, [service]);

  const clearResult = useCallback(() => setResult(null), []);

  return { status, statusMessage, result, run, resetExecution, clearResult };
}
