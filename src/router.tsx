import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import type {
  AnchorHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
} from "react";

export type Location = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
};

export type NavigationType = "POP" | "PUSH" | "REPLACE";

export type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

export type NavigateFunction = (
  to: string | number,
  options?: NavigateOptions,
) => void;

type RouterContextValue = {
  location: Location;
  navigationType: NavigationType;
  navigate: NavigateFunction;
};

type HistoryState = { usr?: unknown; key?: unknown; idx?: unknown } | null;

const RouterContext = createContext<RouterContextValue | null>(null);
const ParamsContext = createContext<Record<string, string>>({});

function createKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

function readLocation(): Location {
  const { pathname, search, hash } = window.location;
  const historyState = window.history.state as HistoryState;
  return {
    pathname,
    search,
    hash,
    state: historyState?.usr ?? null,
    key: typeof historyState?.key === "string" ? historyState.key : "default",
  };
}

function useRouter(): RouterContextValue {
  const router = useContext(RouterContext);
  if (!router) throw new Error("Router hooks must be used inside a router");
  return router;
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState(() => {
    const historyState = window.history.state as HistoryState;
    if (typeof historyState?.idx !== "number") {
      window.history.replaceState({ ...historyState, idx: 0 }, "");
    }
    return {
      location: readLocation(),
      navigationType: "POP" as NavigationType,
    };
  });

  useLayoutEffect(() => {
    const onPopState = (): void => {
      setSnapshot({ location: readLocation(), navigationType: "POP" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo<RouterContextValue>(() => {
    const navigate: NavigateFunction = (to, options = {}) => {
      if (typeof to === "number") {
        window.history.go(to);
        return;
      }
      const currentIndex = (window.history.state as HistoryState)?.idx;
      const index = typeof currentIndex === "number" ? currentIndex : 0;
      const historyState = {
        usr: options.state ?? null,
        key: createKey(),
        idx: options.replace ? index : index + 1,
      };
      if (options.replace) {
        window.history.replaceState(historyState, "", to);
      } else {
        window.history.pushState(historyState, "", to);
      }
      setSnapshot({
        location: readLocation(),
        navigationType: options.replace ? "REPLACE" : "PUSH",
      });
    };
    return { ...snapshot, navigate };
  }, [snapshot]);

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function StaticRouter({
  location,
  children,
}: {
  location: string;
  children: ReactNode;
}) {
  const value = useMemo<RouterContextValue>(() => {
    const url = new URL(location, "http://localhost");
    return {
      location: {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        state: null,
        key: "default",
      },
      navigationType: "POP",
      navigate: () => undefined,
    };
  }, [location]);
  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function useLocation(): Location {
  return useRouter().location;
}

export function useNavigationType(): NavigationType {
  return useRouter().navigationType;
}

export function useNavigate(): NavigateFunction {
  return useRouter().navigate;
}

export function useParams(): Record<string, string | undefined> {
  return useContext(ParamsContext);
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function matchPath(
  pattern: string,
  pathname: string,
): Record<string, string> | null {
  if (pattern === "*") return {};
  const patternSegments = pattern.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);
  const params: Record<string, string> = {};

  for (let index = 0; index < patternSegments.length; index++) {
    const patternSegment = patternSegments[index];
    if (patternSegment === "*") {
      params["*"] = pathSegments.slice(index).map(decodeSegment).join("/");
      return params;
    }
    const pathSegment = pathSegments[index];
    if (pathSegment === undefined) return null;
    if (patternSegment.startsWith(":")) {
      params[patternSegment.slice(1)] = decodeSegment(pathSegment);
    } else if (patternSegment.toLowerCase() !== pathSegment.toLowerCase()) {
      return null;
    }
  }

  return pathSegments.length === patternSegments.length ? params : null;
}

type RouteProps = { path: string; element: ReactNode };

export function Route(_props: RouteProps): null {
  return null;
}

export function Routes({
  location,
  children,
}: {
  location?: Location;
  children: ReactNode;
}) {
  const currentLocation = useLocation();
  const { pathname } = location ?? currentLocation;
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue;
    const { path, element } = (child as ReactElement<RouteProps>).props;
    const params = matchPath(path, pathname);
    if (params) {
      return (
        <ParamsContext.Provider value={params}>
          {element}
        </ParamsContext.Provider>
      );
    }
  }
  return null;
}

export function Navigate({
  to,
  replace,
  state,
}: {
  to: string;
  replace?: boolean;
  state?: unknown;
}): null {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace, state });
  }, []);
  return null;
}

export type LinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  to: string;
  replace?: boolean;
  state?: unknown;
};

export function Link({
  to,
  replace,
  state,
  onClick,
  target,
  ...rest
}: LinkProps) {
  const navigate = useNavigate();
  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>): void => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      (target && target !== "_self") ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(to, { replace, state });
  };
  return <a href={to} target={target} onClick={handleClick} {...rest} />;
}
