import { hydrate, render } from "preact";
import App from "./App.tsx";
import { loadPostPage } from "./pages/postPage";
import {
  adoptInlinedMathStyles,
  getPostBySlug,
  loadMathStyles,
  registerPostHtml,
} from "./posts";
import {
  readHeadingsFromElement,
  seedPostHeadings,
} from "./utils/postHeadings";
import "./index.css";

const rootElement = document.getElementById("root") as HTMLElement;

const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
const postSlugMatch = currentPath.match(/^\/gallery\/([^/]+)$/);
const postSlug = postSlugMatch
  ? decodeURIComponent(postSlugMatch[1] ?? "")
  : null;

function start(): void {
  if (
    rootElement.hasChildNodes() &&
    rootElement.dataset.prerenderedPath === currentPath
  ) {
    const contentEl = rootElement.querySelector(".post-content");
    if (postSlug && contentEl) {
      registerPostHtml(postSlug, contentEl.innerHTML);
      seedPostHeadings(postSlug, readHeadingsFromElement(contentEl));
      if (getPostBySlug(postSlug)?.hasMath) {
        if (document.querySelector("style[data-math-styles]")) {
          adoptInlinedMathStyles();
        } else {
          void loadMathStyles();
        }
      }
    }
    hydrate(<App />, rootElement);
    window.setTimeout(() => {
      delete rootElement.dataset.prerendered;
    }, 5000);
  } else {
    delete rootElement.dataset.prerendered;
    rootElement.textContent = "";
    render(<App />, rootElement);
  }
}

if (postSlug) {
  loadPostPage().then(start, start);
} else {
  start();
}
