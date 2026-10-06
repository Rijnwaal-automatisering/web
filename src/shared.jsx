import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./components/Icon.jsx";
import { useRoute, routeOf, url } from "./router.jsx";
import { openCookieSettings } from "./components/CookieConsent.jsx";

export const BRAND = "Waalsprong Automatisering";
export const KVK = "12345678"; // voorbeeldnummer
export const CONTACT_EMAIL = "info@waalsprongautomatisering.nl";
export const WHATSAPP_NUMBER = "31612345678"; // 06 12345678 in internationaal formaat, zonder + of 0
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hoi Niels, ik heb een vraag over automatisering.")}`;
export const LINKEDIN_URL = "https://www.linkedin.com/in/voorbeeld-profiel"; // fictief: vervang door je echte profiel

export const ease = [0.22, 1, 0.36, 1];

export const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
export const inView = { once: true, margin: "-80px" };

export const euro = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

// Links with a hash point into the homepage; the others are pages of their own.
const LINKS = [
  { href: url("/toepassingen/"), label: "Toepassingen" },
  { href: url("/werkwijze/"), label: "Werkwijze" },
  { href: url("/privacy/"), label: "Privacy" },
  { href: url("/over-mij/"), label: "Over mij" },
  { href: url("/prijzen/"), label: "Prijzen" },
  { href: url("/contact/"), label: "Contact" },
];
const isCurrent = (href, path) => !href.includes("#") && routeOf(href) === routeOf(path);

// A river that splits in two around an island, like the Waal and the Spiegelwaal at Nijmegen.
export function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#2563eb" /><stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-bg)" />
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <path d="M4 17h7c4 0 5.5-7.5 11-7.5h6" strokeWidth="2.6" />
        <path d="M11 17c4 0 5.5 6.5 11 6.5h6" strokeWidth="2.6" />
        <path d="M17.5 16.5c1.6-1.2 3.4-1.6 5.5-1.6M17.5 17.6c1.6 1 3.4 1.4 5.5 1.4" strokeWidth="1.2" opacity="0.55" />
      </g>
      <circle cx="11" cy="17" r="2.3" fill="#fff" />
    </svg>
  );
}

export function Logo() {
  return (
    <a href={url("/")} className="logo" aria-label={`${BRAND}, naar de homepage`}>
      <LogoMark />
      <span>Waalsprong <em>Automatisering</em></span>
    </a>
  );
}

export function Nav() {
  const { path } = useRoute();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <motion.header
      className={`nav ${solid || open ? "nav--solid" : ""}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease, delay: 0.1 }}
    >
      <Logo />
      <nav aria-label="Hoofdmenu" className="nav-links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} aria-current={isCurrent(l.href, path) ? "page" : undefined}>{l.label}</a>
        ))}
      </nav>
      <div className="nav-actions">
        <a href={url("/contact/")} className="btn btn--small">Plan een gesprek</a>
        <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu"
          aria-label={open ? "Menu sluiten" : "Menu openen"} onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? "close" : "menu"} size={20} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu" className="mobile-menu" aria-label="Mobiel menu"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease }}
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                aria-current={isCurrent(l.href, path) ? "page" : undefined}>{l.label}</a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function SectionHead({ eyebrow, title, body, center }) {
  return (
    <motion.div
      className={`section-head ${center ? "section-head--center" : ""}`}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(0.1)}
    >
      <motion.p className="eyebrow" variants={reveal}><span className="dot" /> {eyebrow}</motion.p>
      <motion.h2 variants={reveal}>{title}</motion.h2>
      {body && <motion.p className="sub" variants={reveal}>{body}</motion.p>}
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <Logo />
      <div className="footer-meta">
        <p>© {new Date().getFullYear()} {BRAND}. Procesautomatisering met n8n, gehost in de EU.</p>
        <p>KvK {KVK}</p>
      </div>
      <nav className="footer-links" aria-label="Juridisch">
        <a href={url("/voorwaarden/")}>Concept-overeenkomst</a>
        <a href={url("/privacyverklaring/")}>Privacyverklaring</a>
        <button type="button" onClick={openCookieSettings}>Cookie-instellingen</button>
        <a href="#top">Terug naar boven ↑</a>
      </nav>
    </footer>
  );
}
