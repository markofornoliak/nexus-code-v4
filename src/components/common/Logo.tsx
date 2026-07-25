import { Link } from "../../router";

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link className="logo" to="/" aria-label="NEXUS home">
      <span className="logo-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {!compact && (
        <span className="logo-word">
          NEXUS
          <small>living code archive</small>
        </span>
      )}
    </Link>
  );
}
