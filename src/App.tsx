import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <RouteBackground />
      <div className="container">
        <NavMenu />
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
