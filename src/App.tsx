import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home.tsx";
import NavMenu from "./components/NavMenu.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";
import Post from "./pages/Post.tsx";
import { allPosts } from "./posts";
import { buildRootViewTransitionStyles } from "./animations";

const imagesToPreload = [
  "/static/icons/bmir.jpeg",
  "/static/icons/cosmos.jpeg",
  "/static/icons/frc604.jpeg",
  "/static/icons/basa.jpeg",
  "/static/icons/nexus.jpeg",
];

const TOP_LEVEL_VIEW_TRANSITION_MS = 360;
const TOP_LEVEL_VIEW_TRANSITION_EASING = "ease";

function RouteBackground() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [backgroundTransitionEnabled, setBackgroundTransitionEnabled] =
    useState(false);

  useEffect(() => {
    const postCoversToPreload = allPosts
      .map((post) => post.cover)
      .filter((cover): cover is string => Boolean(cover));

    [...imagesToPreload, ...postCoversToPreload].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    document.body.dataset.route = isHome ? "home" : "surface";
    document.documentElement.dataset.route = isHome ? "home" : "surface";
    return () => {
      delete document.body.dataset.route;
      delete document.documentElement.dataset.route;
    };
  }, [isHome]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setBackgroundTransitionEnabled(true);
    });
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="route-background-base" />
      <div
        className="route-background-image"
        style={{
          opacity: isHome ? 1 : 0,
          transition: backgroundTransitionEnabled ? undefined : "none",
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
