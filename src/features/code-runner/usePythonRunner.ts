import { useCodeRunner } from "./useCodeRunner";

/**
 * Compatibility wrapper retained for integrations that imported the original
 * Python-only hook before NEXUS 2.0 introduced language-aware execution.
 */
export function usePythonRunner() {
  return useCodeRunner("python");
}
