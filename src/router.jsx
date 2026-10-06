import { createContext, useContext, useEffect, useState } from "react";

// Tiny client-side router: same-origin <a> clicks to a known page update the URL with the
// History API and swap only the page content, so there is no full reload.
// Every route also has its own index.html (see vite.config.js), so deep links work on any static host.

export const ROUTES = {
  "/": "home",
  "/prijzen/": "prijzen",
  "/over-mij/": "over-mij",
  "/werkwijze/": "werkwijze",
  "/privacy/": "privacy",
  "/toepassingen/": "toepassingen",
  "/privacyverklaring/": "privacyverklaring",
  "/contact/": "contact",
  "/voorwaarden/": "voorwaarden",
};

// The site can live in a subfolder (e.g. GitHub Pages at /web/). Route paths stay root-relative
// ("/contact/"); url() adds the base for hrefs, and the base is stripped from location.pathname.
const BASE = import.meta.env.BASE_URL;
export const url = (path) => BASE + path.replace(/^\//, "");
const stripBase = (path) => (path.startsWith(BASE) ? `/${path.slice(BASE.length)}` : path);

const normalize = (path) => {
  const p = stripBase(path);
  return p.endsWith("/") ? p : `${p}/`;
};
export const routeOf = (path) => ROUTES[normalize(path)] ?? null;

const RouterContext = createContext({ path: "/", hash: "" });
export const useRoute = () => useContext(RouterContext);

export function Router({ children }) {
  const [loc, setLoc] = useState(() => ({ path: normalize(location.pathname), hash: location.hash }));

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest("a[href]");
      if (!a || a.target || a.hasAttribute("download")) return;
      const target = new URL(a.href);
      if (target.origin !== location.origin || !routeOf(target.pathname)) return;
      const path = normalize(target.pathname);
      // Same page: let the browser handle in-page anchors (smooth scroll via CSS).
      if (path === normalize(location.pathname)) {
        if (target.hash) return;
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      e.preventDefault();
      history.pushState(null, "", url(path) + target.hash);
      setLoc({ path, hash: target.hash });
    };
    const onPop = () => setLoc({ path: normalize(location.pathname), hash: location.hash });
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  return <RouterContext.Provider value={loc}>{children}</RouterContext.Provider>;
}

// Call from a page component on mount: jump to the #hash target, or to the top.
export function useScrollOnEnter(hash) {
  useEffect(() => {
    const el = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [hash]);
}
