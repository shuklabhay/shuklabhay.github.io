import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home.tsx";
import NavMenu from "./components/NavMenu.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";
import Post from "./pages/Post.tsx";
import { buildRootViewTransitionStyles } from "./animations";
import type { RouteTransitionState } from "./utils/types";

const TOP_LEVEL_VIEW_TRANSITION_MS = 128;
const TOP_LEVEL_VIEW_TRANSITION_EASING = "linear";
const POST_RETURN_FLAG_KEY = "route-from-post-return";

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

function RouteBackground() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [homeBackgroundSrc, setHomeBackgroundSrc] = useState<string | null>(
    null,
  );
  const [isHomeBackgroundReady, setIsHomeBackgroundReady] = useState(false);
  const transitionState = location.state as RouteTransitionState | null;
  const fromPostReturnFlag =
    typeof window !== "undefined" &&
    window.sessionStorage.getItem(POST_RETURN_FLAG_KEY) === "1";
  const shouldShowHomeBackground = isHome && isHomeBackgroundReady;
  const shouldAnimateHomeBackgroundFade =
    shouldShowHomeBackground &&
    (transitionState?.fromPost === true || fromPostReturnFlag);

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
      <div className="route-background-base" />
      <div
        className={`route-background-image${
          isHomeBackgroundReady && homeBackgroundSrc
            ? " route-background-image-ready"
            : ""
        }${
          shouldAnimateHomeBackgroundFade
            ? " route-background-image-post-return"
            : ""
        }`}
        style={{
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

  useEffect(() => {
    const isHome = location.pathname === "/";
    document.documentElement.classList.toggle("route-home", isHome);
    document.body.classList.toggle("route-home", isHome);
  }, [location.pathname]);

  useEffect(() => {
    const styleId = "app-top-level-view-transition-style";
    const styleEl =
      document.getElementById(styleId) ??
      Object.assign(document.createElement("style"), { id: styleId });

    styleEl.textContent = buildRootViewTransitionStyles(
      TOP_LEVEL_VIEW_TRANSITION_MS,
      TOP_LEVEL_VIEW_TRANSITION_EASING,
    );

    if (!styleEl.parentNode) {
      document.head.appendChild(styleEl);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isPostRoute =
      location.pathname.startsWith("/blog/") && location.pathname !== "/blog";
    if (isPostRoute) return;

    const clearId = window.setTimeout(() => {
      window.sessionStorage.removeItem(POST_RETURN_FLAG_KEY);
    }, 0);

    return () => window.clearTimeout(clearId);
  }, [location.pathname]);

  return (
    <>
      <RouteBackground />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
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
