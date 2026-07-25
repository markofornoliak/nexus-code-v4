import { ArrowLeft, Radar } from "lucide-react";
import { Link } from "../router";

interface NotFoundPageProps {
  embedded?: boolean;
  message?: string;
}

export default function NotFoundPage({
  embedded = false,
  message = "This coordinate points outside the recovered archive.",
}: NotFoundPageProps) {
  return (
    <main id={embedded ? undefined : "main-content"} className="not-found-page">
      <div className="lost-radar" aria-hidden="true">
        <Radar />
        <span />
      </div>
      <div>
        <p className="eyebrow">Signal 404 / Coordinate unresolved</p>
        <h1>Fragment not found.</h1>
        <p>{message}</p>
        <Link className="button button-primary" to="/">
          <ArrowLeft aria-hidden="true" /> Return to archive
        </Link>
      </div>
    </main>
  );
}
