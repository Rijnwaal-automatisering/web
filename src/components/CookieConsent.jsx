import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./Icon.jsx";
import { url } from "../router.jsx";

// Stores the visitor's cookie choice in localStorage. The site itself only uses this functional
// preference; check hasAnalyticsConsent() before adding analytics or other non-essential cookies.
const KEY = "waalsprong-cookie-consent";
const OPEN_EVENT = "cookie-settings:open";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};
export const hasAnalyticsConsent = () => read()?.choice === "accepted";
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));

export default function CookieConsent() {
  const [open, setOpen] = useState(() => !read());
  const firstButton = useRef(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);
  useEffect(() => {
    if (open) firstButton.current?.focus({ preventScroll: true });
  }, [open]);

  const choose = (choice) => {
    try { localStorage.setItem(KEY, JSON.stringify({ choice, date: new Date().toISOString() })); } catch { /* opslag niet beschikbaar */ }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cookie" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-body"
          initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", visualDuration: 0.4, bounce: 0.15 }}
        >
          <div className="cookie-head">
            <span className="uc-icon" aria-hidden="true"><Icon name="cookie" size={20} /></span>
            <h2 id="cookie-title">Cookies</h2>
          </div>
          <p id="cookie-body">
            Deze site gebruikt alleen functionele cookies die nodig zijn om goed te werken. Met jouw toestemming
            gebruik ik ook analytische cookies om de site te verbeteren. Je keuze kun je altijd aanpassen.{" "}
            <a href={url("/privacyverklaring/")}>Lees de privacyverklaring</a>.
          </p>
          <div className="cookie-actions">
            <button ref={firstButton} type="button" className="btn btn--small" onClick={() => choose("accepted")}>Cookies accepteren</button>
            <button type="button" className="btn btn--small btn--ghost" onClick={() => choose("declined")}>Alleen noodzakelijk</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
