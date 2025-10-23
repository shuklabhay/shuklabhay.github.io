import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.tsx";
import NavMenu from "./components/NavMenu.tsx";
import About from "./pages/About.tsx";
import Blog from "./pages/Blog.tsx";

function RouteBackground() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#6c79a8",
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
          willChange: "opacity",
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}
