import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProgressProvider } from "../features/progress/ProgressContext";
import { MemoryRouter } from "../router";
import AtlasPage from "./AtlasPage";

function renderAtlas() {
  return render(
    <MemoryRouter initialEntries={["/atlas"]}>
      <ProgressProvider>
        <AtlasPage />
      </ProgressProvider>
    </MemoryRouter>,
  );
}

describe("learning atlas", () => {
  it("searches the complete cross-language catalog", async () => {
    const user = userEvent.setup();
    renderAtlas();
    expect(screen.getByText("100 coordinates match")).toBeInTheDocument();
    await user.type(
      screen.getByRole("searchbox", { name: "Search lessons" }),
      "lazy signal streams",
    );
    expect(screen.getByRole("heading", { name: "Lazy Signal Streams" })).toBeVisible();
    expect(screen.getByText("1 coordinate matches")).toBeInTheDocument();
  });

  it("creates a persistent lesson bookmark from a result card", async () => {
    const user = userEvent.setup();
    renderAtlas();
    const bookmark = screen.getByRole("button", {
      name: "Add bookmark for The First Signal",
    });
    await user.click(bookmark);
    expect(
      screen.getByRole("button", {
        name: "Remove bookmark for The First Signal",
      }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText("1", { selector: ".atlas-hero-readouts strong" }),
    ).toBeInTheDocument();
  });
});
