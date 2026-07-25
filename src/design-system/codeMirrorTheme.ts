import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const nexusHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "var(--code-keyword)" },
  {
    tag: [tags.name, tags.deleted, tags.character, tags.propertyName],
    color: "var(--code-name)",
  },
  {
    tag: [tags.function(tags.variableName), tags.labelName],
    color: "var(--code-function)",
  },
  {
    tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: "var(--code-constant)",
  },
  { tag: [tags.definition(tags.name), tags.separator], color: "var(--code-definition)" },
  {
    tag: [
      tags.typeName,
      tags.className,
      tags.number,
      tags.changed,
      tags.annotation,
      tags.modifier,
      tags.self,
      tags.namespace,
    ],
    color: "var(--code-type)",
  },
  {
    tag: [
      tags.operator,
      tags.operatorKeyword,
      tags.url,
      tags.escape,
      tags.regexp,
      tags.link,
    ],
    color: "var(--code-operator)",
  },
  { tag: [tags.meta, tags.comment], color: "var(--code-comment)", fontStyle: "italic" },
  { tag: tags.string, color: "var(--code-string)" },
  { tag: tags.invalid, color: "var(--signal-error)" },
]);

export const nexusCodeMirrorTheme = [
  EditorView.theme({
    "&": {
      backgroundColor: "var(--surface-code)",
      color: "var(--text-primary)",
      minHeight: "290px",
      fontSize: "var(--editor-font-size, 14px)",
    },
    "&.cm-focused": {
      outline: "2px solid var(--focus-ring)",
      outlineOffset: "-2px",
    },
    ".cm-content": {
      caretColor: "var(--signal-active)",
      fontFamily: "var(--font-mono)",
      padding: "18px 0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "var(--signal-active)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--surface-inset)",
      borderRight: "1px solid var(--archive-border)",
      color: "var(--text-faint)",
    },
    ".cm-activeLine, .cm-activeLineGutter": {
      backgroundColor: "var(--surface-active)",
    },
    ".cm-selectionBackground, ::selection": {
      backgroundColor: "var(--selection)",
    },
    ".cm-scroller": {
      overflow: "auto",
    },
  }),
  syntaxHighlighting(nexusHighlightStyle),
];
