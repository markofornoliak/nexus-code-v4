import {
  ArrowRight,
  BookOpen,
  Boxes,
  BrainCircuit,
  Compass,
  Library,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "../../router";
import { searchLessonCatalog } from "../../lib/catalogSearch";
import { useProgress } from "../../features/progress/ProgressContext";
import { selectRecoveryQueue } from "../../features/progress/progressSelectors";

interface CommandPaletteProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  meta: string;
  to: string;
  icon: typeof Search;
}

const routes: CommandItem[] = [
  { id: "archive", label: "Archive", meta: "Home", to: "/", icon: Library },
  {
    id: "expeditions",
    label: "Expeditions",
    meta: "Language tracks",
    to: "/tracks",
    icon: Compass,
  },
  {
    id: "atlas",
    label: "Learning atlas",
    meta: "Search every fragment",
    to: "/atlas",
    icon: Search,
  },
  {
    id: "command",
    label: "Command Center",
    meta: "Adaptive learning intelligence",
    to: "/command",
    icon: BrainCircuit,
  },
  {
    id: "profile",
    label: "Relic vault",
    meta: "Progress and settings",
    to: "/profile",
    icon: UserRound,
  },
  {
    id: "lab",
    label: "3D Concept Lab",
    meta: "Interactive algorithm models",
    to: "/lab",
    icon: Boxes,
  },
];

export function CommandPalette({ open, onOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { state } = useProgress();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const queue = selectRecoveryQueue(state.progress, 4);

  useEffect(() => {
    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) onClose();
        else onOpen();
      } else if (event.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onClose, onOpen, open]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open]);

  const items = useMemo<CommandItem[]>(() => {
    if (query.trim()) {
      return searchLessonCatalog(query, { limit: 9 }).map((entry) => ({
        id: entry.id,
        label: entry.lesson.title,
        meta: `${entry.track.language} · ${entry.world.title}`,
        to: `/learn/${entry.track.id}/${entry.lesson.id}`,
        icon: BookOpen,
      }));
    }
    const continueItems = queue.map<CommandItem>((selection) => ({
      id: `continue:${selection.track.id}:${selection.lesson.id}`,
      label: selection.lesson.title,
      meta: `Continue ${selection.track.language}`,
      to: `/learn/${selection.track.id}/${selection.lesson.id}`,
      icon: BookOpen,
    }));
    return [...continueItems, ...routes];
  }, [query, queue]);

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(Math.max(0, items.length - 1));
  }, [activeIndex, items.length]);

  if (!open) return null;

  const choose = (item: CommandItem) => {
    navigate(item.to);
    onClose();
  };

  const handleKeys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(items.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1),
      );
    } else if (event.key === "Enter") {
      const item = items[activeIndex];
      if (item) choose(item);
    }
  };

  const trapDialogFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      event.preventDefault();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Quick archive search"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={trapDialogFocus}
      >
        <header>
          <Search aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeys}
            placeholder="Search lessons, worlds, or languages…"
            aria-label="Search the NEXUS catalog"
            aria-controls="command-results"
            aria-activedescendant={items[activeIndex]?.id}
          />
          <button type="button" onClick={onClose} aria-label="Close quick search">
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="command-caption">
          <span>{query ? `${items.length} matches` : "Continue or navigate"}</span>
          <span>
            <kbd>↑↓</kbd> move <kbd>↵</kbd> open
          </span>
        </div>
        <div id="command-results" className="command-results" role="listbox">
          {items.length === 0 ? (
            <div className="command-empty">
              No fragment matches this signal. Try a concept such as loops, grid, or
              classes.
            </div>
          ) : (
            items.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  id={item.id}
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={index === activeIndex ? "is-active" : ""}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(item)}
                >
                  <Icon aria-hidden="true" />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.meta}</small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </button>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
