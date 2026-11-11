import { useLocation } from "react-router-dom";
import TransitionLink from "./TransitionLink";
import { isBlogPostPath } from "../utils/routeTransitions";
import {
  getGallerySpot,
  isGallerySectionPath,
} from "../utils/navigationMemory";

const MENU_ITEMS = [
  { label: "home", path: "/" },
  { label: "about", path: "/about" },
  { label: "gallery", path: "/gallery" },
];

function normalizePathname(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

export default function NavMenu(): JSX.Element {
  const location = useLocation();
  const pathname = normalizePathname(location.pathname);
  const gallerySpot = isGallerySectionPath(pathname) ? null : getGallerySpot();

  return (
    <nav className="side-nav" aria-label="Main">
      {MENU_ITEMS.map(({ label, path }) => {
        const isCurrentPage = pathname === path;
        const isActive =
          isCurrentPage || (path === "/gallery" && isBlogPostPath(pathname));
        const spot = path === "/gallery" ? gallerySpot : null;
        const needsDoubleClick =
          path === "/gallery" && isBlogPostPath(pathname);
        return (
          <TransitionLink
            key={label}
            to={spot?.pathname ?? path}
            state={
              spot
                ? {
                    ...(spot.state as object | null),
                    restoreScroll: spot.scroll,
                  }
                : undefined
            }
            aria-current={
              isCurrentPage ? "page" : isActive ? "location" : undefined
            }
            className={`side-nav-link${isActive ? " is-active" : ""}`}
            onClick={
              needsDoubleClick
                ? (event) => {
                    if (event.detail === 1) event.preventDefault();
                  }
                : undefined
            }
          >
            <span className="side-nav-label" data-label={label}>
              {label}
            </span>
          </TransitionLink>
        );
      })}
      <div id="side-nav-contents" />
    </nav>
  );
}
