import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home.tsx";
import NavMenu from "./components/NavMenu.tsx";
import About, { DataProvider } from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";

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

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#5a6c99",
          zIndex: -2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url(/static/landing.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: isHome ? 1 : 0,
          transition: "opacity 400ms ease",
          zIndex: -1,
          pointerEvents: "none",
          imageRendering: "auto",
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
      <DataProvider>
        <RouteBackground />
        <div className="container">
          <NavMenu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </div>
      </DataProvider>
    </BrowserRouter>
  );
}
