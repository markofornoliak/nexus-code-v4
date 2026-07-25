import type { StoredApplicationState } from "../../types";
import {
  defaultStoredState,
  STORAGE_KEY,
  STORAGE_VERSION,
  validateStoredState,
} from "./schema";

export interface StorageLoadResult {
  state: StoredApplicationState;
  recoveredFromCorruption: boolean;
}

function cloneDefaults(): StoredApplicationState {
  return structuredClone(defaultStoredState);
}

export function loadStoredState(
  storage: Storage = window.localStorage,
): StorageLoadResult {
  try {
    const serialized = storage.getItem(STORAGE_KEY);
    if (!serialized) return { state: cloneDefaults(), recoveredFromCorruption: false };
    const parsed: unknown = JSON.parse(serialized);
    const state = validateStoredState(parsed);
    if (!state) {
      return { state: cloneDefaults(), recoveredFromCorruption: true };
    }
    return { state, recoveredFromCorruption: false };
  } catch {
    return { state: cloneDefaults(), recoveredFromCorruption: true };
  }
}

export function saveStoredState(
  state: StoredApplicationState,
  storage: Storage = window.localStorage,
): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: STORAGE_VERSION }));
    return true;
  } catch {
    return false;
  }
}

export function clearStoredState(storage: Storage = window.localStorage): void {
  storage.removeItem(STORAGE_KEY);
}

export function exportStoredState(state: StoredApplicationState): string {
  return JSON.stringify({ ...state, version: STORAGE_VERSION }, null, 2);
}

export function importStoredState(serialized: string): StoredApplicationState | null {
  if (serialized.length > 1_000_000) return null;
  try {
    return validateStoredState(JSON.parse(serialized) as unknown);
  } catch {
    return null;
  }
}
