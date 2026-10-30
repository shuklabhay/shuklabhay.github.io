import { useLocation } from "react-router-dom";
import TransitionLink from "./TransitionLink";

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
  const activePath = pathname === "/contact" ? "/" : pathname;

  return (
    <nav className="side-nav" aria-label="Main">
      {MENU_ITEMS.map(({ label, path }) => {
        const isActive = activePath === path;
        return (
          <TransitionLink
            key={label}
            to={path}
            aria-current={isActive ? "page" : undefined}
            className={`side-nav-link${isActive ? " is-active" : ""}`}
          >
            <span className="side-nav-label">{label}</span>
          </TransitionLink>
        );
      })}
    </nav>
  );
}
