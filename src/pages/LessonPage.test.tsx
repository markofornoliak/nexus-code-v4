import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "../router";
import { vi } from "vitest";
import { ProgressProvider } from "../features/progress/ProgressContext";
import LessonPage from "./LessonPage";

vi.mock("../features/code-runner/CodeEditor", () => ({
  CodeEditor: ({ ariaLabel }: { ariaLabel?: string }) => (
    <div aria-label={ariaLabel ?? "Mock code editor"} />
  ),
}));

vi.mock("../features/code-runner/useCodeRunner", () => ({
  useCodeRunner: (kind: string) => ({
    status: kind === "python" ? "initializing" : "idle",
    statusMessage: "",
    result: null,
    run: vi.fn(),
    resetExecution: vi.fn(),
    clearResult: vi.fn(),
  }),
}));

describe("lesson page", () => {
  it("renders the Python initialization state and required workspace", () => {
    render(
      <MemoryRouter initialEntries={["/learn/python/python-first-signal"]}>
        <ProgressProvider>
          <Routes>
            <Route path="/learn/:trackId/:lessonId" element={<LessonPage />} />
          </Routes>
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "The First Signal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Loading Python/i })).toBeDisabled();
    expect(
      screen.getByText(/first load requires a network connection/i),
    ).toBeInTheDocument();
  });

  it("shows a clear locked state for an unavailable successor", () => {
    render(
      <MemoryRouter initialEntries={["/learn/python/python-variables"]}>
        <ProgressProvider>
          <Routes>
            <Route path="/learn/:trackId/:lessonId" element={<LessonPage />} />
          </Routes>
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Signal Vessels" })).toBeInTheDocument();
    expect(screen.getByText(/preceding fragment/i)).toBeInTheDocument();
  });

  it("renders the HTML sandbox workflow without a standard-input queue", () => {
    render(
      <MemoryRouter initialEntries={["/learn/html-css/html-document"]}>
        <ProgressProvider>
          <Routes>
            <Route path="/learn/:trackId/:lessonId" element={<LessonPage />} />
          </Routes>
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Document Skeleton" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Render & validate" })).toBeEnabled();
    expect(screen.getByLabelText("HTML / CSS code editor")).toBeInTheDocument();
    expect(screen.queryByLabelText("Standard input queue")).not.toBeInTheDocument();
    expect(screen.getByLabelText("HTML preview")).toBeInTheDocument();
  });

  it("labels Java lessons as source analysis rather than browser execution", () => {
    render(
      <MemoryRouter initialEntries={["/learn/java/java-entry-point"]}>
        <ProgressProvider>
          <Routes>
            <Route path="/learn/:trackId/:lessonId" element={<LessonPage />} />
          </Routes>
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: "Analyze structure" })).toBeEnabled();
    expect(screen.getByText(/native compiler for runtime/i)).toBeInTheDocument();
  });
});
