import { useEffect } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from "motion/react";
import FlowScene from "./components/FlowScene.jsx";
import { Nav, Footer, ease, BRAND } from "./shared.jsx";
import { Router, useRoute, routeOf, useScrollOnEnter } from "./router.jsx";
import Home from "./pages/Home.jsx";
import Pricing from "./pages/Pricing.jsx";
import About from "./pages/About.jsx";
import Process from "./pages/Process.jsx";
import Privacy from "./pages/Privacy.jsx";
import Applications from "./pages/Applications.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Contact from "./pages/Contact.jsx";
import Agreement from "./pages/Agreement.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import ChatBot from "./components/ChatBot.jsx";
import { FLOATING_BUTTON } from "./site.config.js";

const PAGES = {
  home: { Component: Home, title: `${BRAND} — Automatisering voor het MKB` },
  prijzen: { Component: Pricing, title: `Prijzen — ${BRAND}` },
  "over-mij": { Component: About, title: `Over mij — ${BRAND}` },
  werkwijze: { Component: Process, title: `Werkwijze — ${BRAND}` },
  privacy: { Component: Privacy, title: `Privacy en hosting — ${BRAND}` },
  toepassingen: { Component: Applications, title: `Toepassingen — ${BRAND}` },
  privacyverklaring: { Component: PrivacyPolicy, title: `Privacyverklaring — ${BRAND}` },
  contact: { Component: Contact, title: `Contact — ${BRAND}` },
  voorwaarden: { Component: Agreement, title: `Concept-overeenkomst — ${BRAND}` },
};

function Page({ name, hash }) {
  const { Component, title } = PAGES[name];
  useScrollOnEnter(hash);
  useEffect(() => { document.title = title; }, [title]);
  return <Component />;
}

function Shell() {
  const { path, hash } = useRoute();
  const name = routeOf(path) ?? "home";
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="backdrop" aria-hidden="true" />
      {name === "home" && <FlowScene />}
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={name}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease }}
        >
          <Page name={name} hash={hash} />
        </motion.main>
      </AnimatePresence>
      <Footer />
      {FLOATING_BUTTON === "whatsapp" && <WhatsAppButton />}
      {FLOATING_BUTTON === "chatbot" && <ChatBot />}
      <CookieConsent />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <Shell />
      </Router>
    </MotionConfig>
  );
}
