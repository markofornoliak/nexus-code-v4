import type {
  Completion,
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from "@codemirror/autocomplete";
import type { EditorLanguage } from "../../types";

const completions: Record<EditorLanguage, Completion[]> = {
  python: [
    { label: "print", type: "function", detail: "print(value)", apply: "print()" },
    {
      label: "def",
      type: "keyword",
      detail: "function definition",
      apply: "def function_name():\n    pass",
    },
    {
      label: "for",
      type: "keyword",
      detail: "for item in iterable",
      apply: "for item in iterable:\n    pass",
    },
    {
      label: "if",
      type: "keyword",
      detail: "conditional branch",
      apply: "if condition:\n    pass",
    },
    {
      label: "class",
      type: "keyword",
      detail: "class definition",
      apply: "class ClassName:\n    def __init__(self):\n        pass",
    },
  ],
  javascript: [
    {
      label: "console.log",
      type: "function",
      detail: "write to lesson output",
      apply: "console.log();",
    },
    {
      label: "function",
      type: "keyword",
      detail: "function declaration",
      apply: "function functionName() {\n  \n}",
    },
    {
      label: "async function",
      type: "keyword",
      detail: "asynchronous function",
      apply: "async function functionName() {\n  \n}",
    },
    {
      label: "for...of",
      type: "keyword",
      detail: "iterate values",
      apply: "for (const item of items) {\n  \n}",
    },
    {
      label: "try...catch",
      type: "keyword",
      detail: "contain a failure",
      apply: "try {\n  \n} catch (error) {\n  \n}",
    },
  ],
  html: [
    {
      label: "section",
      type: "type",
      detail: "labeled semantic section",
      apply:
        '<section aria-labelledby="section-title">\n  <h2 id="section-title">Title</h2>\n</section>',
    },
    {
      label: "button",
      type: "type",
      detail: "native action control",
      apply: '<button type="button">Action</button>',
    },
    {
      label: "@media reduced",
      type: "keyword",
      detail: "reduced-motion override",
      apply:
        "@media (prefers-reduced-motion: reduce) {\n  .animated { animation: none; }\n}",
    },
    {
      label: "@container",
      type: "keyword",
      detail: "local component query",
      apply: "@container (min-width: 32rem) {\n  .component { }\n}",
    },
    {
      label: ":focus-visible",
      type: "keyword",
      detail: "keyboard focus treatment",
      apply:
        ":focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 3px;\n}",
    },
  ],
  java: [
    {
      label: "main",
      type: "function",
      detail: "Java 8 entry point",
      apply: "public static void main(String[] args) {\n    \n}",
    },
    {
      label: "class",
      type: "keyword",
      detail: "public class",
      apply: "public class ClassName {\n    \n}",
    },
    {
      label: "constructor",
      type: "function",
      detail: "constructor skeleton",
      apply: "public ClassName() {\n    \n}",
    },
    {
      label: "override",
      type: "keyword",
      detail: "override annotation",
      apply: "@Override\npublic void methodName() {\n    \n}",
    },
    {
      label: "try-with-resources",
      type: "keyword",
      detail: "scoped resource",
      apply: "try (Resource resource = new Resource()) {\n    \n}",
    },
  ],
  cpp: [
    {
      label: "main",
      type: "function",
      detail: "C++17 entry point",
      apply: "int main() {\n    return 0;\n}",
    },
    {
      label: "class",
      type: "keyword",
      detail: "encapsulated class",
      apply: "class ClassName {\nprivate:\n    \npublic:\n    \n};",
    },
    {
      label: "vector",
      type: "type",
      detail: "dynamic sequence",
      apply: "std::vector<int> values;",
    },
    {
      label: "unique_ptr",
      type: "type",
      detail: "unique ownership",
      apply: "auto value = std::make_unique<Type>();",
    },
    {
      label: "template",
      type: "keyword",
      detail: "function template",
      apply: "template <typename T>\nT function_name(T value) {\n    return value;\n}",
    },
  ],
};

export function getLanguageCompletions(language: EditorLanguage): readonly Completion[] {
  return completions[language];
}

export function nexusCompletionSource(language: EditorLanguage): CompletionSource {
  return (context: CompletionContext): CompletionResult | null => {
    const word = context.matchBefore(/[\w.@-]*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;
    return {
      from: word.from,
      options: completions[language],
      validFor: /^[\w.@-]*$/,
    };
  };
}
