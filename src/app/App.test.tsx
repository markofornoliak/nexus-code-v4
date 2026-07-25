import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "../router";
import { ProgressProvider } from "../features/progress/ProgressContext";
import { App } from "./App";

describe("application routes", () => {
  it("renders the landing route through lazy route loading", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: /Recover the logic/i }),
    ).toBeInTheDocument();
  });

  it("renders the themed not-found route", async () => {
    render(
      <MemoryRouter initialEntries={["/unknown-coordinate"]}>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "Fragment not found." }),
    ).toBeInTheDocument();
  });

  it("renders the cross-expedition Atlas route", async () => {
    render(
      <MemoryRouter initialEntries={["/atlas"]}>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "Your learning field atlas." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search lessons" })).toBeInTheDocument();
  });

  it("renders the accessible spatial learning lab without WebGL", async () => {
    render(
      <MemoryRouter initialEntries={["/lab"]}>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "See code as a living system." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Execution pipeline/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
