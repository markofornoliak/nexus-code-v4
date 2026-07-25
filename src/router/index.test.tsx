import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter, NavLink, Route, Routes, useParams } from ".";

function LessonProbe() {
  const { lessonId, trackId } = useParams<{
    lessonId: string;
    trackId: string;
  }>();
  return (
    <p>
      {trackId}:{lessonId}
    </p>
  );
}

describe("NEXUS router", () => {
  it("matches typed route segments and marks the current navigation branch", () => {
    render(
      <MemoryRouter initialEntries={["/learn/python/python-first-signal/"]}>
        <NavLink to="/learn">Learning branch</NavLink>
        <Routes>
          <Route path="/learn/:trackId/:lessonId" element={<LessonProbe />} />
          <Route path="*" element={<p>Missing</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("python:python-first-signal")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Learning branch" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("navigates inside memory history without a document reload", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Link to="/tracks">Open tracks</Link>
        <Routes>
          <Route path="/" element={<p>Archive</p>} />
          <Route path="/tracks" element={<p>Track atlas</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Archive")).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Open tracks" }));
    expect(screen.getByText("Track atlas")).toBeInTheDocument();
  });

  it("falls back safely for an unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <Routes>
          <Route path="/" element={<p>Archive</p>} />
          <Route path="*" element={<p>Fragment missing</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Fragment missing")).toBeInTheDocument();
  });
});
