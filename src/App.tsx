import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import Home from "./pages/Home.tsx";
import NavMenu from "./components/NavMenu.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";
import Post from "./pages/Post.tsx";
import type { RouteTransitionState } from "./utils/types";
import {
  getLastPathname,
  isBlogPostPath,
  setLastPathname,
} from "./utils/routeTransitions";

const MOBILE_BREAKPOINT_QUERY = "(max-width: 860px)";
const PAGE_X_PADDING_DESKTOP = "1.125rem";
const PAGE_X_PADDING_MOBILE = "0.625rem";

function getHomeBackgroundCandidates() {
  if (typeof window === "undefined") return ["/static/landing-1280.avif"];

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
    return ["/static/landing-1280.avif", "/static/landing-1280.webp"];
  }

  if (viewportWidth >= 2200) {
    return [
      "/static/landing-1920.avif",
      "/static/landing-1920.webp",
      "/static/landing-1280.avif",
      "/static/landing-1280.webp",
      "/static/landing.webp",
    ];
  }

  if (viewportWidth >= 1600) {
    return [
      "/static/landing-1920.avif",
      "/static/landing-1920.webp",
      "/static/landing-1280.avif",
      "/static/landing-1280.webp",
      "/static/landing.webp",
    ];
  }

  return [
    "/static/landing-1280.avif",
    "/static/landing-1280.webp",
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
  for (const candidate of candidates) {
    if (await preloadDecodedImage(candidate)) return candidate;
  }
  return null;
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

function RouteBackground({ isMobileViewport }: { isMobileViewport: boolean }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [homeBackgroundSrc, setHomeBackgroundSrc] = useState<string | null>(
    null,
  );
  const [isHomeBackgroundReady, setIsHomeBackgroundReady] = useState(false);
  const transitionState = location.state as RouteTransitionState | null;
  const lastPathname = getLastPathname();
  const shouldShowHomeBackground = isHome && isHomeBackgroundReady;
  const shouldAnimateHomeBackgroundFade =
    shouldShowHomeBackground &&
    (transitionState?.fromPost === true ||
      (lastPathname ? isBlogPostPath(lastPathname) : false));
  const backgroundTransition = shouldAnimateHomeBackgroundFade
    ? "opacity 512ms ease"
    : isHomeBackgroundReady
      ? "opacity 220ms ease"
      : "none";

  useEffect(() => {
    let cancelled = false;

    preloadFirstAvailableImage(getHomeBackgroundCandidates()).then((src) => {
      if (cancelled) return;
      setHomeBackgroundSrc(src);
      setIsHomeBackgroundReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          backgroundColor: "#5a6c99",
        }}
      />
      <div
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
          willChange: "opacity",
          transition: backgroundTransition,
          opacity: shouldShowHomeBackground ? 1 : 0,
          backgroundImage: isHomeBackgroundReady
            ? homeBackgroundSrc
              ? `url("${homeBackgroundSrc}")`
              : undefined
            : "none",
        }}
      />
    </>
  );
}

function AppShell() {
  const location = useLocation();
  const isMobileViewport = useIsMobileViewport();

  useLayoutEffect(() => {
    setLastPathname(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <RouteBackground isMobileViewport={isMobileViewport} />
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
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
        </Routes>
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
