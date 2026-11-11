import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import NavMenu from "./components/NavMenu.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import Post from "./pages/Post.tsx";
import { getPostBySlug } from "./posts";
import { useMobileHeaderAutoHide } from "./utils/useMobileHeaderAutoHide";
import {
  animateHistoryNavigations,
  isBlogPostPath,
  restoresScrollOnReturn,
} from "./utils/routeTransitions";
import { MOBILE_QUERY } from "./utils/breakpoints";
import {
  currentHistoryIndex,
  recallScroll,
  rememberPathAt,
  setCurrentKey,
} from "./utils/navigationMemory";

const HOME_BACKGROUND_IMMEDIATE_SRC = "/static/landing-1280.webp";
const SITE_TITLE = "Abhay Shukla";
const SITE_TITLE_SEPARATOR = " · ";
const useIsomorphicLayoutEffect: typeof useEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function normalizePathname(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function getRouteDocumentTitle(pathname: string): string {
  const exactPathname = normalizePathname(pathname);
  const normalizedPathname = exactPathname.toLowerCase();

  if (normalizedPathname === "/") {
    return SITE_TITLE;
  }

  if (normalizedPathname === "/about") {
    return `${SITE_TITLE}${SITE_TITLE_SEPARATOR}About`;
  }

  if (normalizedPathname === "/gallery") {
    return `${SITE_TITLE}${SITE_TITLE_SEPARATOR}Gallery`;
  }

  if (/^\/gallery\/[^/]+$/.test(normalizedPathname)) {
    const slug = exactPathname.slice("/gallery/".length).split("/")[0] ?? "";
    const post = getPostBySlug(decodeSegment(slug));
    if (post) {
      return `${SITE_TITLE}${SITE_TITLE_SEPARATOR}${post.title}`;
    }
  }

  return `${SITE_TITLE}${SITE_TITLE_SEPARATOR}Page not found`;
}

function isHomeVisualRoute(pathname: string): boolean {
  return pathname === "/";
}

function getHomeBackgroundCandidates(): string[] {
  if (typeof window === "undefined") return [HOME_BACKGROUND_IMMEDIATE_SRC];

  const prefersReducedData =
    window.matchMedia?.("(prefers-reduced-data: reduce)").matches ?? false;
  const isMobileViewport = window.matchMedia?.(MOBILE_QUERY).matches ?? false;
  const isCoarsePointer =
    window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const networkConnection = (
    navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        downlink?: number;
      };
    }
  ).connection;
  const shouldPreferSmallerAsset =
    prefersReducedData ||
    networkConnection?.saveData === true ||
    (networkConnection?.downlink ?? Infinity) <= 1.5 ||
    isMobileViewport ||
    isCoarsePointer;

  if (shouldPreferSmallerAsset) {
    return [HOME_BACKGROUND_IMMEDIATE_SRC];
  }

  return ["/static/landing-1920.webp"];
}

function preloadDecodedImage(src: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const image = new Image();
    let settled = false;

    const finish = (success: boolean) => {
      if (settled) return;
      settled = true;
      image.onload = null;
      image.onerror = null;
      resolve(success);
    };

    image.onload = () => {
      if (typeof image.decode !== "function") {
        finish(true);
        return;
      }
      image.decode().then(
        () => finish(true),
        () => finish(true),
      );
    };
    image.onerror = () => finish(false);
    image.src = src;

    if (image.complete) {
      if (image.naturalWidth > 0) {
        if (typeof image.decode !== "function") {
          finish(true);
        } else {
          image.decode().then(
            () => finish(true),
            () => finish(true),
          );
        }
      } else {
        finish(false);
      }
    }
  });
}

async function preloadFirstAvailableImage(
  candidates: string[],
): Promise<string | null> {
  if (candidates.length === 0) return null;

  return new Promise<string | null>((resolve) => {
    let settled = false;
    let pending = candidates.length;

    const finish = (src: string | null) => {
      if (settled) return;
      settled = true;
      resolve(src);
    };

    for (const candidate of candidates) {
      preloadDecodedImage(candidate).then((success) => {
        pending -= 1;

        if (success) {
          finish(candidate);
          return;
        }

        if (pending === 0) finish(null);
      });
    }
  });
}

function LegacyBlogRedirect(): JSX.Element {
  const location = useLocation();
  const pathname = location.pathname.replace(/^\/blog(?=\/|$)/, "/gallery");
  return (
    <Navigate
      replace
      to={`${pathname}${location.search}${location.hash}`}
      state={location.state}
    />
  );
}

function RouteBackground(): null {
  const location = useLocation();
  const isHome = isHomeVisualRoute(location.pathname);
  const [homeBackgroundSrc, setHomeBackgroundSrc] = useState(
    () => HOME_BACKGROUND_IMMEDIATE_SRC,
  );
  const decodedHomeBackgroundSrcSetRef = useRef(new Set<string>());

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(
      "--home-background-image",
      `url("${homeBackgroundSrc}")`,
    );
  }, [homeBackgroundSrc]);

  useEffect(() => {
    const src = homeBackgroundSrc;

    if (decodedHomeBackgroundSrcSetRef.current.has(src)) {
      return;
    }

    preloadDecodedImage(src).then((success) => {
      if (success) {
        decodedHomeBackgroundSrcSetRef.current.add(src);
      }
    });
  }, [homeBackgroundSrc]);

  useEffect(() => {
    if (isHome) return;

    let cancelled = false;
    const candidates = getHomeBackgroundCandidates().filter(
      (candidate: string) => candidate !== HOME_BACKGROUND_IMMEDIATE_SRC,
    );

    preloadFirstAvailableImage(candidates).then((src) => {
      if (cancelled) return;
      if (!src) return;
      setHomeBackgroundSrc((current) => (current === src ? current : src));
    });

    return () => {
      cancelled = true;
    };
  }, [isHome]);

  return null;
}

export function AppShell(): JSX.Element {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isHome = isHomeVisualRoute(location.pathname);
  useMobileHeaderAutoHide(!isHome);

  useEffect(() => {
    document.title = getRouteDocumentTitle(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    return animateHistoryNavigations();
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      if (event.detail === 0) return;
      const target = event.target as Element | null;
      const control = target?.closest?.("a, button");
      if (
        control instanceof HTMLElement &&
        control === document.activeElement
      ) {
        control.blur();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useIsomorphicLayoutEffect(() => {
    setCurrentKey(location.key);
    const index = currentHistoryIndex();
    if (index !== null) rememberPathAt(index, location.pathname);
    if (location.hash) return;
    const shouldRestore =
      navigationType === "POP" && restoresScrollOnReturn(location.pathname);
    window.scrollTo(0, shouldRestore ? recallScroll(location.key) : 0);
  }, [location.key]);

  useIsomorphicLayoutEffect(() => {
    const isHome = isHomeVisualRoute(location.pathname);
    document.documentElement.classList.toggle("route-home", isHome);
    document.body.classList.toggle("route-home", isHome);
    document.documentElement.classList.toggle(
      "route-post",
      isBlogPostPath(normalizePathname(location.pathname)),
    );
  }, [location.pathname]);

  return (
    <>
      <RouteBackground />
      <div className="safari-tint" aria-hidden />
      <div className="route-sky" aria-hidden />
      <NavMenu />
      <div className={isHome ? "app-shell app-shell-home" : "app-shell"}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Blog />} />
          <Route path="/gallery/:slug" element={<Post />} />
          <Route path="/blog/*" element={<LegacyBlogRedirect />} />
          <Route
            path="/contact"
            element={<Navigate replace to="/about#contact" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell />
    </BrowserRouter>
  );
}
