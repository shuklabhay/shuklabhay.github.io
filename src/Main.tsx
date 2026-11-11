import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { loadPostBySlug } from "./posts";
import "./index.css";

const rootElement = document.getElementById("root") as HTMLElement;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

function renderApp(): void {
  if (
    rootElement.hasChildNodes() &&
    rootElement.dataset.prerenderedPath === currentPath
  ) {
    hydrateRoot(rootElement, app);
    window.setTimeout(() => {
      delete rootElement.dataset.prerendered;
    }, 5000);
  } else {
    delete rootElement.dataset.prerendered;
    createRoot(rootElement).render(app);
  }
}

const postSlugMatch = currentPath.match(/^\/gallery\/([^/]+)$/);
if (postSlugMatch) {
  void loadPostBySlug(decodeURIComponent(postSlugMatch[1] ?? "")).finally(
    renderApp,
  );
} else {
  renderApp();
}
