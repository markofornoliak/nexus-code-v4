import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "../router";
import { AchievementCard } from "./achievements/AchievementCard";
import { LessonProgress } from "./lessons/LessonProgress";
import { TaskResult } from "./lessons/TaskResult";
import { TrackCard } from "./tracks/TrackCard";
import { achievements } from "../content/achievements";
import { getLesson, getTrack } from "../content/registry";
import { defaultProgress } from "../services/storage/schema";
import { selectTrackProgress } from "../features/progress/progressSelectors";

describe("core components", () => {
  it("renders a track card with a working action", () => {
    const python = getTrack("python");
    if (!python) throw new Error("Fixture missing");
    render(
      <MemoryRouter>
        <TrackCard
          track={python}
          progress={selectTrackProgress(python, defaultProgress)}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Python" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /enter expedition/i })).toHaveAttribute(
      "href",
      "/tracks/python",
    );
  });

  it("renders structured success feedback", () => {
    render(
      <TaskResult
        execution={{ status: "success", stdout: "42\n", stderr: "", durationMs: 12 }}
        validation={{
          success: true,
          summary: "Signal matches.",
          expectedResult: "42",
          actualResult: "42",
          validationMethod: "Exact",
        }}
      />,
    );
    expect(screen.getByText("Signal matches.")).toBeInTheDocument();
    expect(screen.getByText("12 ms")).toBeInTheDocument();
  });

  it("shows lesson task progress", () => {
    const entry = getLesson("python", "python-first-signal");
    if (!entry) throw new Error("Fixture missing");
    render(<LessonProgress lesson={entry.lesson} />);
    expect(screen.getByText(/0 of 2 tasks stabilized/i)).toBeInTheDocument();
  });

  it("distinguishes locked and unlocked achievement visuals", () => {
    const achievement = achievements[0];
    if (!achievement) throw new Error("Fixture missing");
    const { rerender } = render(
      <AchievementCard achievement={achievement} unlocked={false} />,
    );
    expect(screen.getByText("Encrypted specimen")).toBeInTheDocument();
    rerender(<AchievementCard achievement={achievement} unlocked />);
    expect(screen.getByText(achievement.name)).toBeInTheDocument();
  });
});
