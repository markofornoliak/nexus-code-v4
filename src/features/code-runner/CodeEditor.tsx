import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  bracketMatching,
  foldGutter,
  indentOnInput,
  type LanguageSupport,
} from "@codemirror/language";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import { useEffect, useRef, useState } from "react";
import { nexusCodeMirrorTheme } from "../../design-system/codeMirrorTheme";
import type { EditorLanguage } from "../../types";
import { nexusCompletionSource } from "./completions";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  fontSize: number;
  readOnly?: boolean;
  ariaLabel?: string;
  language?: EditorLanguage;
}

async function languageSupport(language: EditorLanguage): Promise<LanguageSupport> {
  switch (language) {
    case "javascript": {
      const { javascript } = await import("@codemirror/lang-javascript");
      return javascript();
    }
    case "html": {
      const { html } = await import("@codemirror/lang-html");
      return html();
    }
    case "java": {
      const { java } = await import("@codemirror/lang-java");
      return java();
    }
    case "cpp": {
      const { cpp } = await import("@codemirror/lang-cpp");
      return cpp();
    }
    case "python": {
      const { python } = await import("@codemirror/lang-python");
      return python();
    }
  }
}

export function CodeEditor({
  value,
  onChange,
  onRun,
  fontSize,
  readOnly = false,
  ariaLabel = "Code editor",
  language = "python",
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [loadError, setLoadError] = useState<EditorLanguage | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  useEffect(() => {
    let cancelled = false;
    void languageSupport(language)
      .then((support) => {
        const container = containerRef.current;
        if (!container || cancelled) return;
        const state = EditorState.create({
          doc: valueRef.current,
          extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            foldGutter(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            bracketMatching(),
            closeBrackets(),
            autocompletion({ maxRenderedOptions: 12 }),
            rectangularSelection(),
            highlightActiveLine(),
            highlightSelectionMatches(),
            EditorView.lineWrapping,
            support.language.data.of({
              autocomplete: nexusCompletionSource(language),
            }),
            keymap.of([
              {
                key: "Mod-Enter",
                run: () => {
                  onRunRef.current?.();
                  return Boolean(onRunRef.current);
                },
              },
              indentWithTab,
              ...closeBracketsKeymap,
              ...defaultKeymap,
              ...searchKeymap,
              ...historyKeymap,
              ...completionKeymap,
            ]),
            support,
            ...nexusCodeMirrorTheme,
            EditorState.readOnly.of(readOnly),
            EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) onChangeRef.current(update.state.doc.toString());
            }),
          ],
        });
        viewRef.current = new EditorView({ state, parent: container });
      })
      .catch(() => {
        if (!cancelled) setLoadError(language);
      });
    return () => {
      cancelled = true;
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [ariaLabel, language, readOnly]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || view.state.doc.toString() === value) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
    });
  }, [value]);

  return (
    <>
      <div
        className="code-editor"
        ref={containerRef}
        style={{ "--editor-font-size": `${fontSize}px` } as React.CSSProperties}
      />
      {loadError === language && (
        <p className="editor-load-error" role="alert">
          The {language} editor mode could not be loaded. Reload this fragment to retry.
        </p>
      )}
    </>
  );
}
