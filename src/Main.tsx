import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { loadPostBySlug } from "./posts";
import {
  readHeadingsFromElement,
  seedPostHeadings,
} from "./utils/postHeadings";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/copy-tex.mjs";
import "./index.css";

const rootElement = document.getElementById("root") as HTMLElement;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
const postSlugMatch = currentPath.match(/^\/gallery\/([^/]+)$/);
const postSlug = postSlugMatch
  ? decodeURIComponent(postSlugMatch[1] ?? "")
  : null;

function renderApp(): void {
  if (
    rootElement.hasChildNodes() &&
    rootElement.dataset.prerenderedPath === currentPath
  ) {
    const contentEl = rootElement.querySelector(".post-content");
    if (postSlug && contentEl) {
      seedPostHeadings(postSlug, readHeadingsFromElement(contentEl));
    }
    hydrateRoot(rootElement, app);
    window.setTimeout(() => {
      delete rootElement.dataset.prerendered;
    }, 5000);
  } else {
    delete rootElement.dataset.prerendered;
    createRoot(rootElement).render(app);
  }
}

if (postSlug) {
  void loadPostBySlug(postSlug).finally(renderApp);
} else {
  renderApp();
}
