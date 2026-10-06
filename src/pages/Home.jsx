import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import Icon from "../components/Icon.jsx";
import { BRAND, ease, reveal, stagger, inView, SectionHead } from "../shared.jsx";
import { url } from "../router.jsx";

const GUARDS = [
  { icon: "key", title: "Toegangsbeheer", body: "Alleen de juiste mensen en systemen komen bij jouw data, met minimale rechten." },
  { icon: "lock", title: "Versleuteling", body: "Gegevens en inloggegevens zijn versleuteld, onderweg en in opslag." },
  { icon: "eu", title: "Hosting in de EU", body: "Je workflows en data staan altijd op beveiligde servers binnen de EU." },
  { icon: "eye", title: "Logging en audittrail", body: "Van elke run is terug te zien wat er gebeurde. Handig bij vragen of een controle." },
  { icon: "shield", title: "AVG-proof ontwerp", body: "Dataminimalisatie, verwerkersovereenkomst en bewaartermijnen vanaf het ontwerp." },
  { icon: "refresh", title: "Back-ups en herstel", body: "Dagelijkse back-ups en meldingen bij fouten, zodat niets ongemerkt stilvalt." },
];

const C = { trigger: "var(--coral)", ai: "var(--accent)", logic: "var(--amber)", app: "var(--cyan)", data: "var(--green)" };

const FLOWS = [
  {
    id: "factuur", label: "Inkoopfacturen", file: "inkoopfacturen.workflow",
    title: "Een inkoopfactuur, geboekt voordat je koffie op is.",
    body: "Een leverancier mailt een factuur. De pdf wordt uitgelezen, gecontroleerd, in je boekhouding gezet en netjes gearchiveerd.",
    steps: [
      { icon: "mail", title: "Factuur gemaild", app: "Outlook", t: 0.2, type: "trigger" },
      { icon: "spark", title: "AI leest de pdf", app: "AI-model", t: 2.4, type: "ai" },
      { icon: "branch", title: "Bedrag en btw kloppen", app: "Controle", t: 0, type: "logic" },
      { icon: "euro", title: "Geboekt", app: "Moneybird", t: 0.7, type: "app" },
      { icon: "file", title: "Pdf gearchiveerd", app: "SharePoint", t: 0.5, type: "data" },
    ],
  },
  {
    id: "whatsapp", label: "Klantvraag 's avonds", file: "whatsapp-klantvraag.workflow",
    title: "Een klantvraag om 23:00, binnen 10 seconden beantwoord.",
    body: "Een klant stuurt een WhatsApp-bericht na sluitingstijd. De assistent zoekt het antwoord in jouw eigen documenten. Twijfelt hij, dan ligt de vraag ’s ochtends voor je klaar.",
    steps: [
      { icon: "chat", title: "WhatsApp-bericht", app: "WhatsApp Business", t: 0.2, type: "trigger" },
      { icon: "spark", title: "Zoekt in je documenten", app: "AI-model", t: 3.1, type: "ai" },
      { icon: "branch", title: "Zeker van antwoord? Ja", app: "Voorwaarde", t: 0, type: "logic" },
      { icon: "chat", title: "Antwoord verstuurd", app: "WhatsApp Business", t: 0.6, type: "app" },
      { icon: "db", title: "Gesprek opgeslagen", app: "CRM", t: 0.4, type: "data" },
    ],
  },
  {
    id: "webshop", label: "Webshop-bestelling", file: "webshop-bestelling.workflow",
    title: "Een bestelling, van betaling tot track & trace zonder handwerk.",
    body: "Een klant rekent af in je webshop. Voorraad, factuur, verzendlabel en de mail naar de klant regelen zich vanzelf.",
    steps: [
      { icon: "cart", title: "Bestelling betaald", app: "WooCommerce", t: 0.1, type: "trigger" },
      { icon: "db", title: "Voorraad bijgewerkt", app: "Voorraadlijst", t: 0.4, type: "data" },
      { icon: "euro", title: "Factuur gemaakt", app: "Moneybird", t: 0.8, type: "app" },
      { icon: "box", title: "Verzendlabel klaar", app: "Sendcloud", t: 1.1, type: "app" },
      { icon: "mail", title: "Track & trace verstuurd", app: "E-mail", t: 0.3, type: "app" },
    ],
  },
  {
    id: "offerte", label: "Offerte-akkoord", file: "offerte-akkoord.workflow",
    title: "Een getekende offerte, binnen een minuut gefactureerd en ingepland.",
    body: "Je klant zet een handtekening onder de offerte. De aanbetaling wordt gefactureerd, het project aangemaakt en de startafspraak gepland.",
    steps: [
      { icon: "check", title: "Offerte getekend", app: "Digitaal tekenen", t: 0.2, type: "trigger" },
      { icon: "euro", title: "Aanbetaling gefactureerd", app: "Moneybird", t: 0.9, type: "app" },
      { icon: "form", title: "Project aangemaakt", app: "Trello", t: 0.5, type: "app" },
      { icon: "calendar", title: "Startafspraak gepland", app: "Google Agenda", t: 0.6, type: "app" },
      { icon: "spark", title: "Welkomstmail op maat", app: "AI-model", t: 1.9, type: "ai" },
    ],
  },
  {
    id: "lead", label: "Lead-opvolging", file: "lead-opvolging.workflow",
    title: "Een nieuwe lead, afgehandeld in minder dan 5 seconden.",
    body: "Iemand vult je contactformulier in. Nog voordat je je telefoon pakt, is de aanvraag beoordeeld, staat het contact in je CRM en heb je een seintje.",
    steps: [
      { icon: "bolt", title: "Formulier ingediend", app: "Webhook", t: 0.1, type: "trigger" },
      { icon: "spark", title: "AI beoordeelt lead", app: "AI-model", t: 1.8, type: "ai" },
      { icon: "branch", title: "Geschikt? Ja", app: "Voorwaarde", t: 0, type: "logic" },
      { icon: "db", title: "Contact aangemaakt", app: "HubSpot", t: 0.6, type: "app" },
      { icon: "chat", title: "Jij krijgt een seintje", app: "Slack", t: 0.4, type: "app" },
    ],
  },
];

const seconds = new Intl.NumberFormat("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const SERVICES = ["chatbots?", "formulierafhandeling?", "slimme workflows?", "AI-assistenten?", "koppelingen?", "offerteprocessen?", "rapportages?"];

// Types a word, pauses, deletes it and moves on to the next one.
function Typewriter({ words }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const word = words[i];
    let t;
    if (!deleting && n === word.length) t = setTimeout(() => setDeleting(true), 1900);
    else if (deleting && n === 0) t = setTimeout(() => { setDeleting(false); setI((x) => (x + 1) % words.length); }, 250);
    else t = setTimeout(() => setN((x) => x + (deleting ? -1 : 1)), deleting ? 35 : 75);
    return () => clearTimeout(t);
  }, [n, deleting, i, reduce, words]);
  const text = reduce ? words[0] : words[i].slice(0, n);
  return (
    <span className="typewriter" aria-hidden="true">
      {/* zero-width space keeps the line box (and its baseline) identical when the word is empty */}
      <span className="grad">{text || "\u200b"}</span>
      <span className="caret" />
    </span>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <motion.h1 initial="hidden" animate="show" variants={stagger(0.08, 0.3)}>
          <span className="sr-only">Op zoek naar {SERVICES.map((w) => w.slice(0, -1)).join(", ")}?</span>
          <span aria-hidden="true">
            {["Op", "zoek", "naar"].map((w) => (
              <span className="word-mask" key={w}>
                <motion.span variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.8, ease } } }}>
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </span>
          <motion.span className="typed-line" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.4 } } }}>
            <Typewriter words={SERVICES} />
          </motion.span>
        </motion.h1>
        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.9 }}
        >
          {BRAND} lost IT-problemen op voor zzp’ers en kleine ondernemingen.
          Volledig ontzorgd en op maat, tegen een scherpe prijs.
        </motion.p>
        <motion.div
          className="cta-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1.05 }}
        >
          <a href={url("/contact/")} className="btn">
            Gratis kennismaking <Icon name="arrow" size={18} />
          </a>
          <a href={url("/prijzen/")} className="btn btn--ghost">Bekijk de prijzen</a>
        </motion.div>
        <motion.ul
          className="hero-meta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1.3 }}
        >
          <li>100% gehost in de EU</li>
          <li>Vanaf € 40 per maand, inclusief btw</li>
          <li>Direct contact met de bouwer</li>
        </motion.ul>
      </div>
      <motion.a
        href="#demo"
        className="scroll-hint"
        aria-label="Scroll naar de volgende sectie"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <Icon name="down" size={20} />
        </motion.span>
      </motion.a>
    </section>
  );
}

// Illustrated top view of the Rhine splitting into the Waal and the Pannerdensch Kanaal at the
// Pannerdensche Kop. Placeholder until the photo is in.
const RIVER_IN = "M-20 236 C60 236 120 233 175 233";
const RIVER_WAAL = "C260 237 330 296 420 300 C500 304 560 306 640 306";
const RIVER_KANAAL = "C240 214 300 142 390 134 C480 126 560 122 640 122";

function RiverSplit() {
  const reduce = useReducedMotion();
  const routes = [`${RIVER_IN} ${RIVER_WAAL}`, `${RIVER_IN} ${RIVER_KANAAL}`];
  return (
    <svg className="river" viewBox="0 0 600 420" role="img" aria-label="Kaartje: de Rijn splitst zich bij de Pannerdensche Kop in de Waal en het Pannerdensch Kanaal.">
      <defs>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#e3f0dc" /><stop offset="1" stopColor="#d6e8cf" />
        </linearGradient>
      </defs>
      <rect width="600" height="420" fill="url(#land)" />
      <g fill="#cfe3c5" opacity="0.8">
        <rect x="30" y="40" width="120" height="80" rx="10" />
        <rect x="430" y="24" width="140" height="64" rx="10" />
        <rect x="60" y="320" width="150" height="70" rx="10" />
        <rect x="400" y="352" width="170" height="48" rx="10" />
      </g>
      <g fill="none" strokeLinecap="round">
        <path d={RIVER_IN} stroke="#7dbbe6" strokeWidth="56" />
        <path d={`M175 233 ${RIVER_WAAL}`} stroke="#7dbbe6" strokeWidth="48" />
        <path d={`M175 233 ${RIVER_KANAAL}`} stroke="#7dbbe6" strokeWidth="30" />
        <g stroke="#a9d6f5" strokeWidth="3" strokeDasharray="18 22" opacity="0.9">
          <path d={routes[0]} /><path d={routes[1]} />
        </g>
      </g>
      {!reduce && routes.map((d, r) =>
        [0, 1, 2].map((k) => (
          <circle key={`${r}-${k}`} r="4.5" fill="#fff" opacity="0.95">
            <animateMotion dur="7s" repeatCount="indefinite" begin={`${k * 2.3 + r * 1.1}s`} path={d} />
          </circle>
        )),
      )}
      <g fill="#1e3a5f" fontFamily="Space Grotesk, system-ui, sans-serif" fontWeight="600">
        <text x="40" y="196" fontSize="17">Rijn</text>
        <text x="500" y="272" fontSize="17">Waal</text>
        <text x="380" y="176" fontSize="15">Pannerdensch Kanaal</text>
        <text x="100" y="292" fontSize="13" opacity="0.75">Pannerdensche Kop</text>
      </g>
    </svg>
  );
}

function RiverStory() {
  return (
    <section id="rijnwaal" className="section">
      <div className="story">
        <motion.figure className="story-visual" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={inView} transition={{ duration: 0.8, ease }}>
          {/* Vervang <RiverSplit /> door <img src={url("/rijnwaal.jpg")} alt="..."> zodra de foto er is. */}
          <RiverSplit />
          <figcaption>De Rijn splitst zich bij de Pannerdensche Kop · foto volgt</figcaption>
        </motion.figure>
        <motion.div className="story-copy" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.1)}>
          <motion.p className="eyebrow" variants={reveal}><span className="dot" /> Waarom Rijnwaal?</motion.p>
          <motion.h2 variants={reveal}>Een rivier die zich splitst. Net als een goede workflow.</motion.h2>
          <motion.p className="sub" variants={reveal}>
            Vlak nadat de Rijn Nederland binnenstroomt, splitst hij zich bij de Pannerdensche Kop in twee stromen.
            Ongeveer twee derde van het water gaat de Waal in, langs Nijmegen richting zee. De rest stroomt via
            het Pannerdensch Kanaal richting Arnhem. Elke stroom krijgt zo zijn eigen route.
          </motion.p>
          <motion.p className="sub" variants={reveal}>
            Precies zo werken de flows die ik bouw. Er komt iets binnen en de workflow kiest zelf de juiste route.
            Elke stroom komt precies waar hij moet zijn.
          </motion.p>
          <motion.div className="branch" variants={reveal} role="img"
            aria-label="Voorbeeld: een nieuwe aanvraag splitst zich. Een bestaande klant gaat naar het klantdossier, een nieuwe klant krijgt een welkomstmail en komt in het CRM.">
            <span className="bnode bnode--in"><Icon name="bolt" size={16} /> Nieuwe aanvraag</span>
            <svg className="branch-lines" viewBox="0 0 60 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 50 C30 50 30 22 60 22" /><path d="M0 50 C30 50 30 78 60 78" />
            </svg>
            <span className="branch-outs">
              <span className="bnode"><Icon name="db" size={16} /> Bestaande klant: dossier bijwerken</span>
              <span className="bnode"><Icon name="mail" size={16} /> Nieuwe klant: welkomstmail en CRM</span>
            </span>
          </motion.div>
          <motion.p className="story-punch" variants={reveal}>Rijn en Waal: vandaar de naam Rijnwaal Automatisering.</motion.p>
        </motion.div>
      </div>
    </section>
  );
}

const HOLD_TICKS = 3; // how long a finished run stays on screen before the next one

function Demo() {
  const [flow, setFlow] = useState(0);
  const [tick, setTick] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef(null);
  const visible = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const f = FLOWS[flow];
  const n = f.steps.length;

  useEffect(() => {
    if (!visible || reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 1100);
    return () => clearInterval(id);
  }, [visible, reduce]);

  // After a finished run: cycle to the next flow, or replay the one the visitor picked.
  useEffect(() => {
    if (tick < n + HOLD_TICKS) return;
    setTick(0);
    if (auto) setFlow((i) => (i + 1) % FLOWS.length);
  }, [tick, n, auto]);

  const pick = (i) => {
    setAuto(false);
    setFlow(i);
    setTick(0);
  };

  const done = reduce ? n : Math.min(tick, n);
  const total = f.steps.reduce((s, x) => s + x.t, 0);

  // When the flow scrolls sideways (mid-size screens), keep the running step in view.
  const flowRef = useRef(null);
  useEffect(() => {
    const ol = flowRef.current;
    if (!ol || ol.scrollWidth <= ol.clientWidth) return;
    const li = ol.children[Math.min(done, n - 1)];
    if (li) ol.scrollTo({ left: li.offsetLeft - 24, behavior: reduce ? "auto" : "smooth" });
  }, [done, n, flow, reduce]);

  return (
    <section id="demo" className="section" ref={ref}>
      <div className="section-head">
        <p className="eyebrow"><span className="dot" /> Zie het draaien</p>
        <div className="stack">
          {FLOWS.map((x, i) => (
            <motion.div key={x.id} aria-hidden={i !== flow} inert={i !== flow ? true : undefined}
              initial={false} animate={{ opacity: i === flow ? 1 : 0, y: i === flow ? 0 : 10 }}
              transition={{ duration: 0.4, ease }}>
              <h2>{x.title}</h2>
              <p className="sub">{x.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flow-picker" role="group" aria-label="Kies een voorbeeld-workflow">
        {FLOWS.map((x, i) => (
          <button key={x.id} type="button" className="flow-chip" aria-pressed={i === flow} onClick={() => pick(i)}>
            {i === flow && <motion.span layoutId="flow-chip-bg" className="flow-chip-bg" transition={{ type: "spring", visualDuration: 0.35, bounce: 0.15 }} />}
            <span>{x.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        className="demo"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.8, ease }}
      >
        <div className="demo-bar" aria-hidden="true">
          <i /><i /><i /><span>{f.file}</span>
          <em className={done >= n ? "ok" : ""}>{done >= n ? `Gelukt in ${seconds.format(total)} s` : "Bezig…"}</em>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol key={f.id} ref={flowRef} className="demo-flow"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease }}>
            {f.steps.map((s, i) => {
              const state = i < done ? "done" : i === done ? "live" : "idle";
              return (
                <li key={s.title} className={`dnode dnode--${state}`} style={{ "--c": C[s.type] }}>
                  <motion.div
                    className="dnode-card"
                    animate={state === "live" ? { scale: 1.04 } : { scale: 1 }}
                    transition={{ type: "spring", visualDuration: 0.4, bounce: 0.3 }}
                  >
                    <span className="dnode-icon"><Icon name={s.icon} size={20} /></span>
                    <span className="dnode-text"><b>{s.title}</b><small>{s.app} · {seconds.format(s.t)} s</small></span>
                    <span className="dnode-check" aria-hidden="true"><Icon name="check" size={14} /></span>
                  </motion.div>
                  {i < n - 1 && (
                    <span className="dnode-wire" aria-hidden="true">
                      <motion.span initial={false} animate={{ scaleX: i < done ? 1 : 0 }} transition={{ duration: 0.5, ease }} />
                    </span>
                  )}
                </li>
              );
            })}
          </motion.ol>
        </AnimatePresence>
        <p className="sr-only" aria-live="polite">{done >= n ? `${f.label}: workflow succesvol afgerond.` : ""}</p>
      </motion.div>
      <p className="fine">Voorbeeldworkflows. De koppelingen passen we aan op de software die jij al gebruikt.</p>
    </section>
  );
}

function Security() {
  return (
    <section id="veiligheid" className="section">
      <div className="security">
        <div className="security-intro">
          <SectionHead
            eyebrow="Veiligheid"
            title="Slim automatiseren, zonder risico."
            body="Zodra processen automatisch lopen, moet de beveiliging kloppen. Daarom bouw ik alle noodzakelijke maatregelen standaard mee."
          />
          <motion.div
            className="shield"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inView}
            transition={{ duration: 0.9, ease }}
          >
            <span className="shield-ring" /><span className="shield-ring shield-ring--2" />
            <Icon name="shield" size={64} />
          </motion.div>
        </div>
        <motion.ul className="guards" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.07)}>
          {GUARDS.map((g) => (
            <motion.li key={g.title} className="guard" variants={reveal}>
              <span className="uc-icon"><Icon name={g.icon} size={20} /></span>
              <div><h3>{g.title}</h3><p>{g.body}</p></div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function AboutTeaser() {
  return (
    <section className="section section--tight">
      <motion.div className="teaser" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={inView} transition={{ duration: 0.7, ease }}>
        <span className="card-icon"><Icon name="user" size={22} /></span>
        <div>
          <h2>Je praat direct met degene die het bouwt.</h2>
          <p className="sub">Ruim tien jaar ontwikkelervaring, onder meer bij Rabobank en Alliander. Nu voor kleine bedrijven.</p>
        </div>
        <a href={url("/over-mij/")} className="btn btn--ghost">Meer over mij <Icon name="arrow" size={18} /></a>
      </motion.div>
    </section>
  );
}

// Software with a ready-made n8n node. Shown as names (not logos) in two drifting rows.
const INTEGRATIONS = [
  ["Gmail", "Microsoft Outlook", "Google Sheets", "Microsoft Excel", "Google Drive", "OneDrive", "Dropbox", "Shopify",
    "WooCommerce", "HubSpot", "Pipedrive", "Salesforce", "Stripe", "Mailchimp", "Typeform", "Jotform", "WordPress", "Webflow"],
  ["Slack", "Microsoft Teams", "WhatsApp Business", "Telegram", "Discord", "Twilio", "Notion", "Trello", "Asana", "Airtable",
    "Jira", "Zendesk", "Google Agenda", "Calendly", "OpenAI", "PostgreSQL", "MySQL"],
];
const N8N_INTEGRATIONS = "https://n8n.io/integrations/";

function Integrations() {
  return (
    <section id="koppelingen" className="section">
      <SectionHead
        eyebrow="Koppelingen"
        title="Het wiel is al uitgevonden. Ik gebruik het."
        body="n8n heeft honderden kant-en-klare koppelingen met bekende software. In plaats van alles zelf te bouwen, gebruik ik die bestaande koppelingen. Dat is sneller, betrouwbaarder en voordeliger. De kans is groot dat het pakket waar jij mee werkt er al tussen staat."
      />
      <div className="marquee" aria-label="Een greep uit de software die n8n ondersteunt">
        {INTEGRATIONS.map((row, r) => (
          <div key={r} className={`marquee-row ${r % 2 ? "marquee-row--reverse" : ""}`}>
            {/* the list is rendered twice so the loop is seamless; the copy is hidden from screen readers */}
            {[0, 1].map((copy) => (
              <ul key={copy} className="marquee-track" aria-hidden={copy === 1 ? true : undefined}>
                {row.map((name) => <li key={name}>{name}</li>)}
              </ul>
            ))}
          </div>
        ))}
      </div>
      <motion.ul className="values integrations-points" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.08)}>
        <motion.li className="uc uc--feature" variants={reveal}>
          <span className="card-icon"><Icon name="refresh" size={22} /></span>
          <h3>Honderden koppelingen</h3>
          <p>Van boekhouding en webshop tot mail, agenda en chat. n8n onderhoudt de koppelingen, dus ze blijven werken als die software verandert.</p>
        </motion.li>
        <motion.li className="uc uc--feature" variants={reveal}>
          <span className="card-icon"><Icon name="bolt" size={22} /></span>
          <h3>Sneller en voordeliger</h3>
          <p>Omdat ik niet elke koppeling opnieuw hoef te bouwen, staat je automatisering sneller en betaal je minder.</p>
        </motion.li>
        <motion.li className="uc uc--feature" variants={reveal}>
          <span className="card-icon"><Icon name="code" size={22} /></span>
          <h3>Staat jouw pakket er niet bij?</h3>
          <p>Heeft je software een API, zoals Moneybird of Exact Online, dan koppel ik die alsnog via n8n.</p>
        </motion.li>
      </motion.ul>
      <p className="fine">
        <a className="text-link" href={N8N_INTEGRATIONS} target="_blank" rel="noopener noreferrer">
          Bekijk alle koppelingen op n8n.io <Icon name="arrow" size={16} />
        </a>
      </p>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Demo />
      <Integrations />
      <RiverStory />
      <Security />
      <AboutTeaser />
    </>
  );
}
