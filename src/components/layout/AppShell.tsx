import {
  Command,
  Flame,
  Menu,
  MoonStar,
  Signal,
  SunMedium,
  UserRound,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { type MouseEvent, type PropsWithChildren, useEffect, useState } from "react";
import { NavLink } from "../../router";
import { calculateLevelProgress } from "../../lib/gamification";
import { useProgress } from "../../features/progress/ProgressContext";
import { Logo } from "../common/Logo";
import { CommandPalette } from "../navigation/CommandPalette";

export function AppShell({ children }: PropsWithChildren) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);
  const { state, dispatch, storageNotice, dismissStorageNotice } = useProgress();
  const level = calculateLevelProgress(state.progress.totalXp);

  const navItems = [
    { to: "/", label: "Archive" },
    { to: "/tracks", label: "Expeditions" },
    { to: "/atlas", label: "Atlas" },
    { to: "/lab", label: "3D Lab" },
    { to: "/profile", label: "Relic vault" },
  ];

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const isFieldCodex = state.preferences.theme === "field-codex";
    document.documentElement.style.colorScheme = isFieldCodex ? "light" : "dark";
    document.documentElement.style.backgroundColor = isFieldCodex ? "#f2efe4" : "#06120f";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isFieldCodex ? "#f2efe4" : "#06120f");
  }, [state.preferences.theme]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeMenu = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeAfterNavigation = () => setMenuOpen(false);
    window.addEventListener("keydown", closeMenu);
    window.addEventListener("hashchange", closeAfterNavigation);
    return () => {
      window.removeEventListener("keydown", closeMenu);
      window.removeEventListener("hashchange", closeAfterNavigation);
    };
  }, [menuOpen]);

  const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = document.getElementById("main-content");
    if (!main) return;
    main.setAttribute("tabindex", "-1");
    main.focus();
  };

  return (
    <div
      className={`app-shell${state.preferences.reducedMotion ? " force-reduced-motion" : ""}`}
      data-theme={state.preferences.theme}
      data-visual-mode={state.preferences.visualMode}
    >
      <a className="skip-link" href="#main-content" onClick={skipToContent}>
        Skip to main content
      </a>
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-metrics">
          <button
            className="command-trigger"
            type="button"
            aria-label="Open quick search"
            onClick={() => setPaletteOpen(true)}
          >
            <Command size={15} aria-hidden="true" />
            <span>Search archive</span>
            <kbd>⌘/Ctrl K</kbd>
          </button>
          <span
            className={`connection-state${online ? " is-online" : " is-offline"}`}
            role="status"
            aria-live="polite"
          >
            {online ? <Wifi aria-hidden="true" /> : <WifiOff aria-hidden="true" />}
            <span>{online ? "Online" : "Offline"}</span>
          </span>
          <NavLink
            className="header-metric"
            to="/profile"
            aria-label={`${state.progress.totalXp} Signal Energy`}
          >
            <Signal size={16} aria-hidden="true" />
            <span>{state.progress.totalXp}</span>
            <small>LV {level.level}</small>
          </NavLink>
          <NavLink
            className="header-metric"
            to="/profile"
            aria-label={`${state.progress.streak.currentStreak} day Pulse Chain`}
          >
            <Flame size={16} aria-hidden="true" />
            <span>{state.progress.streak.currentStreak}</span>
          </NavLink>
          <NavLink className="profile-link" to="/profile" aria-label="Open profile">
            <UserRound size={18} aria-hidden="true" />
          </NavLink>
          <button
            className="profile-link theme-switch"
            type="button"
            aria-label={
              state.preferences.theme === "field-codex"
                ? "Switch to night observatory theme"
                : "Switch to field codex theme"
            }
            onClick={() =>
              dispatch({
                type: "set-theme",
                theme:
                  state.preferences.theme === "field-codex"
                    ? "night-observatory"
                    : "field-codex",
              })
            }
          >
            {state.preferences.theme === "field-codex" ? (
              <MoonStar size={18} aria-hidden="true" />
            ) : (
              <SunMedium size={18} aria-hidden="true" />
            )}
          </button>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      {storageNotice && (
        <div className="storage-notice" role="status">
          <span>{storageNotice}</span>
          <button type="button" onClick={dismissStorageNotice}>
            Dismiss
          </button>
        </div>
      )}
      <CommandPalette
        open={paletteOpen}
        onOpen={() => setPaletteOpen(true)}
        onClose={() => setPaletteOpen(false)}
      />
      {children}
      <footer className="site-footer">
        <Logo compact />
        <p>NEXUS v4 / Living Code Archive / Spatial learning system</p>
        <p>Built for keyboard, touch, and curious minds.</p>
      </footer>
    </div>
  );
}
