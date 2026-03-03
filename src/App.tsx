import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import {
  Suspense,
  lazy,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import NavMenu from "./components/NavMenu.tsx";
import Home from "./pages/Home.tsx";
import { setLastPathname } from "./utils/routeTransitions";

const MOBILE_BREAKPOINT_QUERY = "(max-width: 860px)";
const PAGE_X_PADDING_DESKTOP = "1.125rem";
const PAGE_X_PADDING_MOBILE = "0.625rem";
const HOME_BACKGROUND_IMMEDIATE_SRC = "/static/landing-1280.webp";
const SITE_TITLE = "Abhay Shukla";
const SITE_TITLE_SEPARATOR = " · ";
const About = lazy(() => import("./pages/About.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const Post = lazy(() => import("./pages/Post.tsx"));

function normalizePathname(pathname: string) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function decodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function humanizeRouteSegment(segment: string) {
  return decodeSegment(segment).replace(/[-_]+/g, " ").trim();
}

function capitalizeWords(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getRouteDocumentTitle(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === "/") {
    return SITE_TITLE;
  }

  if (normalizedPathname === "/about") {
    return `${SITE_TITLE}${SITE_TITLE_SEPARATOR}About`;
  }

  if (normalizedPathname === "/blog") {
    return `${SITE_TITLE}${SITE_TITLE_SEPARATOR}Blog`;
  }

  if (normalizedPathname.startsWith("/blog/")) {
    const slug = normalizedPathname.slice("/blog/".length).split("/")[0] ?? "";
    const postTitle = capitalizeWords(humanizeRouteSegment(slug));
    if (!postTitle) {
      return `${SITE_TITLE}${SITE_TITLE_SEPARATOR}Blog`;
    }
    return `${SITE_TITLE}${SITE_TITLE_SEPARATOR}${postTitle}`;
  }

  const sectionLabel = normalizedPathname
    .split("/")
    .filter(Boolean)
    .map(humanizeRouteSegment)
    .filter(Boolean)
    .join(SITE_TITLE_SEPARATOR);

  if (!sectionLabel) {
    return SITE_TITLE;
  }

  return `${SITE_TITLE}${SITE_TITLE_SEPARATOR}${sectionLabel}`;
}

function getHomeBackgroundCandidates() {
  if (typeof window === "undefined") return [HOME_BACKGROUND_IMMEDIATE_SRC];

  const viewportWidth = Math.max(
    window.innerWidth,
    document.documentElement?.clientWidth ?? 0,
  );
  const prefersReducedData =
    window.matchMedia?.("(prefers-reduced-data: reduce)").matches ?? false;
  const isMobileViewport =
    window.matchMedia?.("(max-width: 860px)").matches ?? false;
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
    return [HOME_BACKGROUND_IMMEDIATE_SRC, "/static/landing-1280.avif"];
  }

  if (viewportWidth >= 2200) {
    return [
      "/static/landing-1920.avif",
      "/static/landing-1920.webp",
      HOME_BACKGROUND_IMMEDIATE_SRC,
      "/static/landing-1280.avif",
      "/static/landing.webp",
    ];
  }

  if (viewportWidth >= 1600) {
    return [
      "/static/landing-1920.avif",
      "/static/landing-1920.webp",
      HOME_BACKGROUND_IMMEDIATE_SRC,
      "/static/landing-1280.avif",
      "/static/landing.webp",
    ];
  }

  return [
    HOME_BACKGROUND_IMMEDIATE_SRC,
    "/static/landing-1280.avif",
    "/static/landing-1920.avif",
    "/static/landing-1920.webp",
    "/static/landing.webp",
  ];
}

function preloadDecodedImage(src: string) {
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

async function preloadFirstAvailableImage(candidates: string[]) {
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

function useIsMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
    };

    setIsMobileViewport(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  return isMobileViewport;
}

function RouteBackground({
  isMobileViewport,
  prefersReducedMotion,
}: {
  isMobileViewport: boolean;
  prefersReducedMotion: boolean;
}) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [homeBackgroundSrc, setHomeBackgroundSrc] = useState(
    () => HOME_BACKGROUND_IMMEDIATE_SRC,
  );
  const decodedHomeBackgroundSrcSetRef = useRef(new Set<string>());
  const queuedHomeBackgroundSrcRef = useRef<string | null>(null);
  const isHomeRef = useRef(isHome);
  isHomeRef.current = isHome;
  const shouldShowHomeBackground = isHome;
  const backgroundVeilTransition = shouldShowHomeBackground
    ? prefersReducedMotion
      ? "none"
      : "none"
    : "none";
  const backgroundVeilOpacity = shouldShowHomeBackground ? 0 : 1;

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
    if (!isHome && queuedHomeBackgroundSrcRef.current) {
      const queuedSrc = queuedHomeBackgroundSrcRef.current;
      queuedHomeBackgroundSrcRef.current = null;
      setHomeBackgroundSrc((current) =>
        current === queuedSrc ? current : queuedSrc,
      );
    }
  }, [isHome]);

  useEffect(() => {
    let cancelled = false;
    const candidates = getHomeBackgroundCandidates();

    preloadFirstAvailableImage(candidates).then((src) => {
      if (cancelled) return;
      if (!src) return;
      if (isHomeRef.current) {
        queuedHomeBackgroundSrcRef.current = src;
        return;
      }
      setHomeBackgroundSrc((current) => (current === src ? current : src));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div
        className="route-background-image"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: isMobileViewport ? "70% center" : "center",
          backgroundColor: "#52668b",
          opacity: shouldShowHomeBackground ? 1 : 0,
          backgroundImage: `url("${homeBackgroundSrc}")`,
        }}
      />
      <div
        className="route-background-base"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          pointerEvents: "none",
          backgroundColor: "#52668b",
          willChange: "opacity",
          transition: backgroundVeilTransition,
          opacity: backgroundVeilOpacity,
        }}
      />
    </>
  );
}

function AppShell() {
  const location = useLocation();
  const isMobileViewport = useIsMobileViewport();
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

  useEffect(() => {
    document.title = getRouteDocumentTitle(location.pathname);
  }, [location.pathname]);

  useLayoutEffect(() => {
    const isHome = location.pathname === "/";
    document.documentElement.classList.toggle("route-home", isHome);
    document.body.classList.toggle("route-home", isHome);
    setLastPathname(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <RouteBackground
        isMobileViewport={isMobileViewport}
        prefersReducedMotion={prefersReducedMotion}
      />
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          paddingInline: isMobileViewport
            ? PAGE_X_PADDING_MOBILE
            : PAGE_X_PADDING_DESKTOP,
          position: "relative",
          zIndex: 1,
        }}
      >
        <NavMenu />
        <Suspense fallback={null}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Post />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell />
    </BrowserRouter>
  );
}
