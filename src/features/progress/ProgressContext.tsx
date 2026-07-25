import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { StoredApplicationState } from "../../types";
import { loadStoredState, saveStoredState } from "../../services/storage/storage";
import { progressReducer, type ProgressAction } from "./progressReducer";

interface ProgressContextValue {
  state: StoredApplicationState;
  dispatch: Dispatch<ProgressAction>;
  storageNotice: string | null;
  dismissStorageNotice: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: PropsWithChildren) {
  const initial = useMemo(() => loadStoredState(), []);
  const [state, dispatch] = useReducer(progressReducer, initial.state);
  const [storageNotice, setStorageNotice] = useState<string | null>(
    initial.recoveredFromCorruption
      ? "Stored progress could not be read safely. NEXUS restored a clean archive state."
      : null,
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!saveStoredState(state)) {
        setStorageNotice("Progress could not be saved in this browser session.");
      }
    }, 180);
    return () => window.clearTimeout(timeout);
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      storageNotice,
      dismissStorageNotice: () => setStorageNotice(null),
    }),
    [state, storageNotice],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}
