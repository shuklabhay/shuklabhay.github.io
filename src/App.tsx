import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home.tsx";
import NavMenu from "./components/NavMenu.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";
import Post from "./pages/Post.tsx";

const imagesToPreload = [
  "/static/icons/bmir.jpeg",
  "/static/icons/cosmos.jpeg",
  "/static/icons/frc604.jpeg",
  "/static/icons/basa.jpeg",
  "/static/icons/nexus.jpeg",
];

function RouteBackground() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    document.body.dataset.route = isHome ? "home" : "surface";
    return () => {
      delete document.body.dataset.route;
    };
  }, [isHome]);

  return (
    <>
      <div className="route-background-base" />
      <div
        className="route-background-image"
        style={{
          opacity: isHome ? 1 : 0,
        }}
      />
    </>
  );
}

function PostBackLink() {
  const location = useLocation();
  const isPostRoute =
    location.pathname.startsWith("/blog/") && location.pathname !== "/blog";

  if (!isPostRoute) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 11,
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "1rem",
        paddingBottom: "4px",
        pointerEvents: "none",
      }}
    >
      <Link
        to="/blog"
        state={{ fromPost: true }}
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "1.25rem",
          position: "relative",
          display: "inline-block",
          lineHeight: 1.1,
          paddingBottom: "0.45rem",
          marginBottom: "-0.45rem",
          pointerEvents: "auto",
        }}
      >
        ← back
      </Link>
    </div>
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
      <RouteBackground />
      <div className="container" style={{ position: "relative" }}>
        <NavMenu />
        <PostBackLink />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
