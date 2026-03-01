import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
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

function RouteBackground() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const transitionState = location.state as RouteTransitionState | null;
  const fromPostReturnFlag =
    typeof window !== "undefined" &&
    window.sessionStorage.getItem(POST_RETURN_FLAG_KEY) === "1";
  const shouldAnimateHomeBackgroundFade =
    isHome && (transitionState?.fromPost === true || fromPostReturnFlag);

  return (
    <>
      <div className="route-background-base" />
      <div
        className={`route-background-image${
          shouldAnimateHomeBackgroundFade
            ? " route-background-image-post-return"
            : ""
        }`}
        style={{
          opacity: isHome ? 1 : 0,
        }}
      />
    </>
  );
}

function AppShell() {
  const location = useLocation();

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
