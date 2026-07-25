import {
  Children,
  createContext,
  isValidElement,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type PropsWithChildren,
  type ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type RouterMode = "hash" | "memory";

interface NavigateOptions {
  replace?: boolean;
}

export type NavigateFunction = (to: string, options?: NavigateOptions) => void;

interface RouterValue {
  mode: RouterMode;
  path: string;
  navigate: (to: string, options?: NavigateOptions) => void;
}

const RouterContext = createContext<RouterValue | null>(null);
const ParamsContext = createContext<Readonly<Record<string, string>>>({});

function normalizePath(value: string): string {
  const [withoutFragment = "/"] = value.trim().split("#", 1);
  const [withoutQuery = "/"] = withoutFragment.split("?", 1);
  const rooted = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const compact = rooted.replace(/\/{2,}/g, "/");

  if (compact.length > 1 && compact.endsWith("/")) {
    return compact.slice(0, -1);
  }

  return compact || "/";
}

function readHashPath(): string {
  return normalizePath(window.location.hash.slice(1) || "/");
}

function useRouter(): RouterValue {
  const router = useContext(RouterContext);
  if (!router) {
    throw new Error("NEXUS router components must be rendered inside a router.");
  }
  return router;
}

export function HashRouter({ children }: PropsWithChildren) {
  const [path, setPath] = useState(readHashPath);

  useEffect(() => {
    const syncHash = () => setPath(readHashPath());
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const navigate = useCallback((to: string, options?: NavigateOptions) => {
    const nextPath = normalizePath(to);
    const nextHash = `#${nextPath}`;

    if (options?.replace) {
      const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
      window.history.replaceState(window.history.state, "", nextUrl);
      setPath(nextPath);
      return;
    }

    if (window.location.hash === nextHash) {
      setPath(nextPath);
      return;
    }

    window.location.hash = nextPath;
    setPath(nextPath);
  }, []);

  const value = useMemo<RouterValue>(
    () => ({ mode: "hash", path, navigate }),
    [navigate, path],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

interface MemoryRouterProps extends PropsWithChildren {
  initialEntries?: string[];
  initialIndex?: number;
}

export function MemoryRouter({
  children,
  initialEntries = ["/"],
  initialIndex,
}: MemoryRouterProps) {
  const initialPath = useMemo(() => {
    const lastIndex = Math.max(initialEntries.length - 1, 0);
    const selectedIndex = Math.min(Math.max(initialIndex ?? lastIndex, 0), lastIndex);
    return normalizePath(initialEntries[selectedIndex] ?? "/");
  }, [initialEntries, initialIndex]);
  const [path, setPath] = useState(initialPath);

  const navigate = useCallback((to: string) => {
    setPath(normalizePath(to));
  }, []);

  const value = useMemo<RouterValue>(
    () => ({ mode: "memory", path, navigate }),
    [navigate, path],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export interface RouteProps {
  element: ReactElement | null;
  path: string;
}

export function Route(_props: RouteProps) {
  void _props;
  return null;
}

interface RouteMatch {
  params: Readonly<Record<string, string>>;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function matchRoute(pattern: string, currentPath: string): RouteMatch | null {
  if (pattern === "*") return { params: {} };

  const patternSegments = normalizePath(pattern).split("/").filter(Boolean);
  const pathSegments = normalizePath(currentPath).split("/").filter(Boolean);
  if (patternSegments.length !== pathSegments.length) return null;

  const params: Record<string, string> = {};

  for (let index = 0; index < patternSegments.length; index += 1) {
    const patternSegment = patternSegments[index];
    const pathSegment = pathSegments[index];
    if (!patternSegment || !pathSegment) return null;

    if (patternSegment.startsWith(":")) {
      params[patternSegment.slice(1)] = decodeSegment(pathSegment);
      continue;
    }

    if (patternSegment !== pathSegment) return null;
  }

  return { params };
}

export function Routes({ children }: PropsWithChildren) {
  const { path } = useRouter();
  let fallback: ReactElement | null = null;

  for (const child of Children.toArray(children)) {
    if (!isValidElement<RouteProps>(child) || child.type !== Route) continue;
    if (child.props.path === "*") {
      fallback = child.props.element;
      continue;
    }

    const match = matchRoute(child.props.path, path);
    if (match) {
      return (
        <ParamsContext.Provider value={match.params}>
          {child.props.element}
        </ParamsContext.Provider>
      );
    }
  }

  return <ParamsContext.Provider value={{}}>{fallback}</ParamsContext.Provider>;
}

interface NavigateProps {
  replace?: boolean;
  to: string;
}

export function Navigate({ replace = false, to }: NavigateProps) {
  const { navigate } = useRouter();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  replace?: boolean;
  to: string;
}

export function Link({
  children,
  onClick,
  replace = false,
  target,
  to,
  ...anchorProps
}: LinkProps) {
  const { mode, navigate } = useRouter();
  const destination = normalizePath(to);
  const href = mode === "hash" ? `#${destination}` : destination;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (target && target !== "_self")
    ) {
      return;
    }

    event.preventDefault();
    navigate(destination, { replace });
  };

  return (
    <a {...anchorProps} href={href} target={target} onClick={handleClick}>
      {children}
    </a>
  );
}

interface NavLinkProps extends LinkProps {
  end?: boolean;
}

export function NavLink({
  "aria-current": ariaCurrent,
  className,
  end = false,
  to,
  ...linkProps
}: NavLinkProps) {
  const { path } = useRouter();
  const destination = normalizePath(to);
  const isActive =
    path === destination ||
    (!end && destination !== "/" && path.startsWith(`${destination}/`));
  const resolvedClassName = [className, isActive ? "active" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      {...linkProps}
      aria-current={ariaCurrent ?? (isActive ? "page" : undefined)}
      className={resolvedClassName || undefined}
      to={destination}
    />
  );
}

// Router components and their context hook intentionally share one public module.
// eslint-disable-next-line react-refresh/only-export-components
export function useParams<
  Params extends Record<string, string | undefined> = Record<string, string>,
>(): Readonly<Params> {
  return useContext(ParamsContext) as Readonly<Params>;
}

// Router hooks intentionally share the component module as one small public API.
// eslint-disable-next-line react-refresh/only-export-components
export function useNavigate(): NavigateFunction {
  return useRouter().navigate;
}
