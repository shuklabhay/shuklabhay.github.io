const LAST_PATHNAME_KEY = "route-last-pathname";

export function isBlogPostPath(pathname: string) {
  return pathname.startsWith("/blog/") && pathname !== "/blog";
}

export function getLastPathname() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(LAST_PATHNAME_KEY);
}

export function setLastPathname(pathname: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(LAST_PATHNAME_KEY, pathname);
}
