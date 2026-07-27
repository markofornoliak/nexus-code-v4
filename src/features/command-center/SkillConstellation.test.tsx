import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "../../router";
import { SkillConstellation } from "./SkillConstellation";
import type { SkillSignal } from "../progress/progressSelectors";

const signals: SkillSignal[] = [
  {
    id: "skill:python",
    label: "Python",
    detail: "Automation Forge",
    trackId: "python",
    accent: "lime",
    completed: 4,
    total: 40,
    percent: 10,
  },
  {
    id: "skill:javascript",
    label: "JavaScript",
    detail: "Runtime Orchestration",
    trackId: "javascript",
    accent: "amber",
    completed: 11,
    total: 20,
    percent: 55,
  },
];

describe("skill constellation", () => {
  it("keeps the complete mastery interface available without WebGL", () => {
    render(
      <MemoryRouter>
        <SkillConstellation signals={signals} reducedMotion={false} minimal />
      </MemoryRouter>,
    );

    expect(screen.getByRole("img", { name: "Skill network" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset orbit" })).toBeDisabled();
    expect(screen.getByText("10% synchronized")).toBeInTheDocument();
  });

  it("updates the semantic readout when a language card is selected", () => {
    render(
      <MemoryRouter>
        <SkillConstellation signals={signals} reducedMotion minimal />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /JavaScript/i }));
    expect(screen.getByText("55% synchronized")).toBeInTheDocument();
    expect(screen.getAllByText("Runtime Orchestration").length).toBeGreaterThan(0);
  });
});
