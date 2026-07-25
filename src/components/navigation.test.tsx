import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "../router";
import { AppShell } from "./layout/AppShell";
import { ProgressProvider } from "../features/progress/ProgressContext";

describe("application navigation", () => {
  it("provides primary routes and current-route state", () => {
    render(
      <MemoryRouter initialEntries={["/tracks"]}>
        <ProgressProvider>
          <AppShell>
            <main>content</main>
          </AppShell>
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Expeditions" })).toHaveClass("active");
    expect(screen.getAllByRole("link", { name: /NEXUS home/i })[0]).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /Signal Energy/i })).toBeInTheDocument();
  });

  it("opens the command palette with Ctrl+K and searches the lesson catalog", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ProgressProvider>
          <AppShell>
            <main>content</main>
          </AppShell>
        </ProgressProvider>
      </MemoryRouter>,
    );
    await user.keyboard("{Control>}k{/Control}");
    const search = screen.getByRole("textbox", {
      name: "Search the NEXUS catalog",
    });
    expect(search).toHaveFocus();
    await user.type(search, "generator");
    expect(screen.getByRole("option", { name: /Lazy Signal Streams/i })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Quick archive search" }),
    ).not.toBeInTheDocument();
  });

  it("restores focus after closing quick search", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ProgressProvider>
          <AppShell>
            <main id="main-content">content</main>
          </AppShell>
        </ProgressProvider>
      </MemoryRouter>,
    );
    const trigger = screen.getByRole("button", { name: "Open quick search" });
    await user.click(trigger);
    expect(
      screen.getByRole("textbox", { name: "Search the NEXUS catalog" }),
    ).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Close quick search" }));
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("moves focus to main content without changing the hash route", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/tracks"]}>
        <ProgressProvider>
          <AppShell>
            <main id="main-content">content</main>
          </AppShell>
        </ProgressProvider>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("link", { name: "Skip to main content" }));
    expect(screen.getByRole("main")).toHaveFocus();
    expect(screen.getByRole("link", { name: "Expeditions" })).toHaveClass("active");
  });
});
