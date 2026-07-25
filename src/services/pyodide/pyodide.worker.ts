/// <reference lib="webworker" />

interface PyodideApi {
  runPythonAsync: (code: string) => Promise<unknown>;
}

interface PyodideModule {
  loadPyodide: (options: { indexURL: string }) => Promise<PyodideApi>;
}

type IncomingMessage =
  | { type: "initialize"; indexURL: string }
  | { type: "run"; id: string; code: string; stdin: string };

let runtime: PyodideApi | null = null;
let loading: Promise<PyodideApi> | null = null;
let activeIndexUrl = "";

async function initialize(indexURL: string): Promise<PyodideApi> {
  if (runtime) return runtime;
  if (loading && activeIndexUrl === indexURL) return loading;
  activeIndexUrl = indexURL;
  loading = (async () => {
    const moduleUrl = `${indexURL}pyodide.mjs`;
    const pyodideModule = (await import(
      /* @vite-ignore */ moduleUrl
    )) as unknown as PyodideModule;
    runtime = await pyodideModule.loadPyodide({ indexURL });
    return runtime;
  })();
  return loading;
}

function executionScript(code: string, stdin: string): string {
  return `
import io
import json
import sys
import traceback
from contextlib import redirect_stdout, redirect_stderr

_nexus_code = ${JSON.stringify(code)}
_nexus_input = ${JSON.stringify(stdin)}
class _NexusWriter:
    def __init__(self, limit=100000):
        self.limit = limit
        self.parts = []
        self.size = 0
        self.truncated = False

    def write(self, value):
        text = str(value)
        remaining = self.limit - self.size
        if remaining > 0:
            accepted = text[:remaining]
            self.parts.append(accepted)
            self.size += len(accepted)
        if len(text) > remaining:
            self.truncated = True
        return len(text)

    def flush(self):
        pass

    def getvalue(self):
        text = "".join(self.parts)
        if self.truncated:
            text += "\\n[NEXUS output truncated at 100000 characters]\\n"
        return text

_nexus_stdout = _NexusWriter()
_nexus_stderr = _NexusWriter()
_nexus_previous_stdin = sys.stdin
sys.stdin = io.StringIO(_nexus_input)
_nexus_ok = True

try:
    with redirect_stdout(_nexus_stdout), redirect_stderr(_nexus_stderr):
        exec(compile(_nexus_code, "<nexus-fragment>", "exec"), {"__name__": "__main__"})
except BaseException:
    _nexus_ok = False
    traceback.print_exc(file=_nexus_stderr)
finally:
    sys.stdin = _nexus_previous_stdin

json.dumps({
    "ok": _nexus_ok,
    "stdout": _nexus_stdout.getvalue(),
    "stderr": _nexus_stderr.getvalue()
})
`;
}

self.addEventListener("message", (event: MessageEvent<IncomingMessage>) => {
  const message = event.data;
  if (message.type === "initialize") {
    void initialize(message.indexURL)
      .then(() => self.postMessage({ type: "ready" }))
      .catch((error: unknown) =>
        self.postMessage({
          type: "initialization-error",
          message:
            error instanceof Error ? error.message : "Pyodide could not be loaded.",
        }),
      );
    return;
  }

  const startedAt = performance.now();
  void initialize(activeIndexUrl)
    .then((pyodide) =>
      pyodide.runPythonAsync(executionScript(message.code, message.stdin)),
    )
    .then((raw) => {
      const parsed = JSON.parse(String(raw)) as {
        ok: boolean;
        stdout: string;
        stderr: string;
      };
      self.postMessage({
        type: "result",
        id: message.id,
        ok: parsed.ok,
        stdout: parsed.stdout,
        stderr: parsed.stderr,
        durationMs: Math.round(performance.now() - startedAt),
      });
    })
    .catch((error: unknown) => {
      self.postMessage({
        type: "result",
        id: message.id,
        ok: false,
        stdout: "",
        stderr: error instanceof Error ? error.message : "Execution failed.",
        durationMs: Math.round(performance.now() - startedAt),
      });
    });
});

export {};
