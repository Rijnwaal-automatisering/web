import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "../components/Icon.jsx";
import { ease, reveal, stagger, inView, SectionHead } from "../shared.jsx";

const TAILORED = [
  { icon: "users", title: "Jouw processen als startpunt", body: "Ik begin bij hoe jij werkt, niet bij een standaardpakket. De automatisering past zich aan jouw bedrijf aan, niet andersom." },
  { icon: "refresh", title: "Rond je bestaande software", body: "Ik koppel de tools die je al gebruikt. Geen nieuwe systemen die je team eerst moet leren." },
  { icon: "spark", title: "Precies wat nodig is", body: "Geen overbodige toeters en bellen. Je betaalt voor wat jou tijd bespaart, en we bouwen verder als dat zinvol is." },
];

const EXPLORER = [
  {
    id: "chatbots", icon: "chat", label: "Chatbots",
    title: "Een chatbot die klanten écht verder helpt",
    problem: "Je beantwoordt elke dag dezelfde vragen en berichten buiten kantooruren blijven liggen.",
    solution: "Ik bouw een assistent voor je website, WhatsApp of Slack, getraind op jouw eigen documenten. Bij twijfel draagt hij over aan jou of een collega.",
    ideas: [
      "Klantenservice die veelgestelde vragen direct beantwoordt",
      "Afspraken automatisch inplannen",
      "Productadvies en offerte-aanvragen via chat",
      "Interne vraagbaak voor je medewerkers",
      "Leads kwalificeren en aan jou doorgeven",
      "Orderstatus opvragen via WhatsApp",
    ],
    flow: ["Vraag binnen", "AI zoekt antwoord", "Antwoord of overdracht"],
  },
  {
    id: "formulieren", icon: "form", label: "Formulieren",
    title: "Formulieren die zichzelf afhandelen",
    problem: "Aanvragen komen binnen per mail of formulier en iemand typt ze over, zoekt de juiste persoon en stuurt een bevestiging.",
    solution: "Elke inzending wordt gecontroleerd, aangevuld, naar de juiste plek gestuurd en direct beantwoord. Zonder dat er iemand aan te pas komt.",
    ideas: [
      "Contact- en offerteformulieren direct in je CRM",
      "Intakeformulieren voor nieuwe klanten of patiënten",
      "Sollicitaties automatisch verwerken",
      "Storingsmeldingen naar de juiste monteur",
      "Bevestigingsmail met alle gegevens op maat",
      "Spam en dubbele aanvragen automatisch filteren",
    ],
    flow: ["Formulier ingediend", "Controle + aanvulling", "CRM + bevestiging"],
  },
  {
    id: "processen", icon: "refresh", label: "Bedrijfsprocessen",
    title: "Routinewerk dat vanzelf doorloopt",
    problem: "Je tools praten niet met elkaar, dus kopieer je gegevens, zet je taken klaar en houd je lijstjes bij.",
    solution: "Ik koppel je bestaande software met n8n en laat de routinestappen automatisch lopen, met AI waar lezen of beslissen nodig is.",
    ideas: [
      "Offerte versturen en na akkoord factureren",
      "Facturen en bijlagen uitlezen en juist boeken",
      "Orders, voorraad en boekhouding synchroniseren",
      "Onboarding van nieuwe klanten",
      "Wekelijkse overzichten in je inbox",
      "Herinneringen voor openstaande betalingen",
    ],
    flow: ["Trigger in je tool", "Stappen + AI", "Resultaat in je systemen"],
  },
  {
    id: "veiligheid", icon: "shield", label: "Beveiliging",
    title: "Alle beveiliging al ingebouwd",
    problem: "Automatiseren betekent dat systemen en data aan elkaar gekoppeld worden. Dat mag nooit een risico of AVG-probleem opleveren.",
    solution: "Ik richt elke workflow veilig in: minimale toegangsrechten, versleuteling, hosting in de EU, logging en back-ups.",
    ideas: [
      "Toegangsbeheer met minimale rechten per koppeling",
      "Versleutelde opslag van inloggegevens en data",
      "Altijd gehost in de EU, desgewenst op een eigen server",
      "Audittrail: van elke run is terug te zien wat er gebeurde",
      "AVG-proof ontwerp met bewaartermijnen",
      "Menselijke goedkeuring bij gevoelige stappen",
    ],
    flow: ["Veilige koppeling", "Controle + logging", "Back-up + alarm"],
  },
];


function Explorer() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const item = EXPLORER[active];
  const onKey = (e) => {
    const n = EXPLORER.length;
    let next = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (active + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (active - 1 + n) % n;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };
  return (
    <section id="inspiratie" className="section">
      <SectionHead
        eyebrow="Ter inspiratie"
        title="Kies een toepassing en zie wat ik voor je bouw."
        body="Dit zijn vier onderwerpen waar kleine bedrijven me vaak voor inschakelen. Zie het als inspiratie: wat ik voor jou bouw, stem ik af op jouw bedrijf."
      />
      <motion.div className="explorer" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={inView} transition={{ duration: 0.7, ease }}>
        <div className="tabs" role="tablist" aria-label="Toepassingen" onKeyDown={onKey}>
          {EXPLORER.map((t, i) => (
            <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={active === i} aria-controls={`panel-${t.id}`}
              tabIndex={active === i ? 0 : -1} ref={(el) => (refs.current[i] = el)} className="tab" onClick={() => setActive(i)}>
              {active === i && <motion.span layoutId="tab-bg" className="tab-bg" transition={{ type: "spring", visualDuration: 0.4, bounce: 0.15 }} />}
              <span className="uc-icon"><Icon name={t.icon} size={18} /></span>
              {t.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id} className="panel" role="tabpanel" id={`panel-${item.id}`} aria-labelledby={`tab-${item.id}`}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease }}
          >
            <h3>{item.title}</h3>
            <div className="panel-cols">
              <div><h4>Het probleem</h4><p>{item.problem}</p></div>
              <div><h4>Wat ik bouw</h4><p>{item.solution}</p></div>
            </div>
            <div>
              <h5>Voorbeelden voor jouw bedrijf</h5>
              <ul className="ideas">
                {item.ideas.map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}
              </ul>
            </div>
            <div className="panel-foot">
              <div className="mini-flow" aria-label="Voorbeeld van de workflow">
                {item.flow.map((f, i) => (
                  <span key={f}>{f}{i < item.flow.length - 1 && <i aria-hidden="true">  →</i>}</span>
                ))}
              </div>
              <a href="/contact/" className="btn btn--small">Bespreek dit voor jouw bedrijf <Icon name="arrow" size={16} /></a>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

const USECASES = [
  { icon: "chat", title: "Klantenservice-chatbot", body: "Beantwoordt veelgestelde vragen en maakt een ticket aan als het complexer wordt.", save: "Website · WhatsApp" },
  { icon: "form", title: "Aanvraagformulieren", body: "Nieuwe aanvraag? Binnen seconden gecontroleerd, in je CRM en beantwoord.", save: "Typeform · Tally · Jotform" },
  { icon: "euro", title: "Offertes en facturen", body: "Offerte genereren, versturen en na akkoord automatisch factureren en opvolgen.", save: "Moneybird · Exact · e-Boekhouden" },
  { icon: "users", title: "Lead-opvolging", body: "Elke lead krijgt direct een persoonlijke reactie en jij een seintje.", save: "HubSpot · Pipedrive" },
  { icon: "file", title: "Documenten en inbox", body: "Facturen en bijlagen uitlezen, benoemen en netjes opslaan op de juiste plek.", save: "Outlook · Gmail · Drive" },
  { icon: "cart", title: "Orders en voorraad", body: "Webshop, voorraad en boekhouding blijven automatisch met elkaar in sync.", save: "Shopify · WooCommerce" },
  { icon: "calendar", title: "Afspraken", body: "Klanten plannen zelf in, krijgen een herinnering en jij een compleet overzicht.", save: "Calendly · Google Agenda" },
  { icon: "chart", title: "Overzichten", body: "Elke maandag een overzicht van omzet, aanvragen en openstaande taken in je inbox.", save: "Sheets · e-mail" },
];

function UseCases() {
  return (
    <section id="usecases" className="section">
      <SectionHead
        eyebrow="Meer toepassingen"
        title="Nog meer ideeën voor jouw bedrijf"
        body="Een greep uit wat ik voor kleine bedrijven automatiseer. Staat jouw taak er niet bij? Dan kijken we samen of het kan."
      />
      <motion.ul className="usecases" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.06)}>
        {USECASES.map((u) => (
          <motion.li key={u.title} className="uc" variants={reveal} whileHover={{ y: -4 }}
            transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}>
            <span className="uc-icon"><Icon name={u.icon} size={20} /></span>
            <h3>{u.title}</h3>
            <p>{u.body}</p>
            <span className="tag">{u.save}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function Intro() {
  return (
    <section className="section page-hero" id="top">
      <motion.div className="section-head section-head--center" initial="hidden" animate="show" variants={stagger(0.1, 0.2)}>
        <motion.p className="eyebrow" variants={reveal}><span className="dot" /> Toepassingen</motion.p>
        <motion.h1 variants={reveal}>Geen standaardoplossing, maar <span className="grad">maatwerk voor jouw bedrijf.</span></motion.h1>
        <motion.p className="sub" variants={reveal}>
          Ik ben gespecialiseerd in automatiseringen die op maat gemaakt zijn voor de klant. Elk bedrijf werkt anders,
          dus elke oplossing ook. Op deze pagina vind je wat inspiratie om je op weg te helpen.
        </motion.p>
      </motion.div>
      <motion.ul className="values" initial="hidden" animate="show" variants={stagger(0.08, 0.5)}>
        {TAILORED.map((v) => (
          <motion.li key={v.title} className="uc uc--feature" variants={reveal}>
            <span className="card-icon"><Icon name={v.icon} size={22} /></span>
            <h3>{v.title}</h3>
            <p>{v.body}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function Cta() {
  return (
    <section className="section">
      <motion.div className="cta-panel cta-panel--simple" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={inView} transition={{ duration: 0.8, ease }}>
        <div>
          <p className="eyebrow"><span className="dot" /> Maatwerk</p>
          <h2>Staat jouw idee er niet tussen?</h2>
          <p className="sub">Juist dan. Vertel me hoe jouw werkweek eruitziet, dan bedenken we samen wat er te automatiseren valt.</p>
        </div>
        <a href="/contact/" className="btn">Plan een kennismaking <Icon name="arrow" size={18} /></a>
      </motion.div>
    </section>
  );
}

export default function Applications() {
  return (
    <>
      <Intro />
      <Explorer />
      <UseCases />
      <Cta />
    </>
  );
}
