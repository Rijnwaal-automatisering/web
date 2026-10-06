import { motion } from "motion/react";
import Icon from "../components/Icon.jsx";
import { ease, reveal, stagger, inView, euro, SectionHead } from "../shared.jsx";
import { url } from "../router.jsx";

// Bedragen zijn inclusief btw.
const N8N_PRICING = "https://n8n.io/pricing/";

const PLANS = [
  {
    id: "groei", name: "Groei", featured: true, monthly: 40, setup: 400,
    for: "Voor zzp’ers en kleine ondernemingen die willen starten met automatiseren",
    features: [
      "n8n Starter-abonnement inbegrepen",
      "Eenmalige inrichting van je n8n-omgeving en automatiseringen",
      "Support en onderhoud",
      "Gehost in de EU",
      "Maandelijks opzegbaar",
    ],
  },
  {
    id: "maatwerk", name: "Maatwerk",
    for: "Voor bedrijven met meer of complexere processen",
    features: [
      "Minimaal een n8n Starter-abonnement inbegrepen",
      "Automatiseringen volledig op maat",
      "Koppelingen met je eigen software en API’s",
      "Support en onderhoud afgestemd op jouw bedrijf",
      "Prijs vooraf vastgelegd in het plan van aanpak",
    ],
  },
];

const EXAMPLES = [
  { title: "Contactformulier naar je CRM", body: "Elke aanvraag gecontroleerd in je CRM, met een nette bevestigingsmail.", days: "3 werkdagen", plan: "Groei", flow: ["Formulier", "Controle", "CRM", "Bevestiging"] },
  { title: "Weekoverzicht in je inbox", body: "Elke maandag omzet, nieuwe aanvragen en openstaande facturen op een rij.", days: "2 werkdagen", plan: "Groei", flow: ["Elke maandag", "Cijfers ophalen", "E-mail"] },
  { title: "Webshop-orders naar je boekhouding", body: "Betaalde bestellingen automatisch gefactureerd en geboekt.", days: "1 week", plan: "Groei", flow: ["Bestelling", "Factuur", "Boekhouding"] },
  { title: "Lead-opvolging met AI", body: "Aanvragen beoordeeld door AI, in je CRM gezet en direct beantwoord.", days: "1 week", plan: "Groei", flow: ["Formulier", "AI-beoordeling", "CRM", "Seintje"] },
  { title: "Inkoopfacturen automatisch boeken", body: "Facturen uit je mailbox uitgelezen, gecontroleerd en geboekt.", days: "1 à 2 weken", plan: "Maatwerk", flow: ["Mailbox", "AI leest pdf", "Controle", "Boeken"] },
  { title: "Klantenservice-chatbot", body: "Een assistent op je website of WhatsApp, getraind op je eigen documenten.", days: "2 weken", plan: "Maatwerk", flow: ["Vraag", "Zoeken in documenten", "Antwoord of overdracht"] },
];

const INCLUDED = [
  { icon: "eu", title: "Hosting in de EU", body: "Je data blijft binnen de EU." },
  { icon: "file", title: "Documentatie", body: "Je weet precies wat elke workflow doet." },
  { icon: "key", title: "Jij bent eigenaar", body: "Je workflows zijn van jou, ook als je stopt." },
  { icon: "shield", title: "Beveiliging", body: "Versleuteling, logging en back-ups." },
];

const FAQ = [
  { q: "Wat zit er in het n8n Starter-abonnement?", a: "Alle functionaliteit van het Starter-abonnement van n8n, zoals beschreven op de prijspagina van n8n. Bij het Maatwerkpakket kan een groter n8n-abonnement nodig zijn; dat spreken we vooraf af." },
  { q: "Kan de maandprijs veranderen?", a: "Ja. Verhoogt n8n de prijs van het abonnement, dan wordt die verhoging doorberekend. Ook kan de prijs jaarlijks worden aangepast aan de inflatie. Je hoort dit altijd vooraf." },
  { q: "Zijn er nog andere kosten?", a: "Licenties van je eigen software, zoals Moneybird, Shopify of HubSpot, betaal je zelf. Bij Maatwerk staan alle kosten vooraf in het plan van aanpak." },
  { q: "Wat gebeurt er als ik wil stoppen?", a: "Het Groeipakket is maandelijks opzegbaar. Je krijgt al je workflows als export mee, zodat je ze zelf of bij een ander kunt laten draaien." },
];

function Plans() {
  return (
    <section className="section page-hero" id="top">
      <motion.div className="section-head section-head--center" initial="hidden" animate="show" variants={stagger(0.1, 0.2)}>
        <motion.h1 variants={reveal}>Eerlijke prijzen, gemaakt voor <span className="grad">kleine bedrijven.</span></motion.h1>
        <motion.p className="sub" variants={reveal}>
          Ik werk voor zzp’ers en kleine bedrijven. Daarom zijn er twee overzichtelijke pakketten, allebei maandelijks en inclusief btw. Geen uurtje-factuurtje, geen verrassingen.
        </motion.p>
      </motion.div>

      <motion.ul className="plans plans--two" initial="hidden" animate="show" variants={stagger(0.1, 0.5)}>
        {PLANS.map((p) => (
          <motion.li key={p.id} className={`plan ${p.featured ? "plan--featured" : ""}`} variants={reveal}>
            {p.featured && <span className="plan-badge">Meest gekozen</span>}
            <h2>Pakket {p.name}</h2>
            <p className="plan-for">{p.for}</p>
            {p.monthly ? (
              <>
                <p className="plan-price"><b>{euro.format(p.monthly)}</b><small> / maand</small></p>
                <p className="plan-setup">+ {euro.format(p.setup)} eenmalig</p>
                <p className="plan-note">Inclusief btw, maandelijks opzegbaar</p>
              </>
            ) : (
              <>
                <p className="plan-price"><b>Op maat</b></p>
                <p className="plan-setup">Geen vaste maand- of eenmalige prijs</p>
                <p className="plan-note">Je krijgt vooraf een prijs die past bij jouw situatie</p>
              </>
            )}
            <ul className="ticks">
              {p.features.map((f) => <li key={f}><Icon name="check" size={16} />{f}</li>)}
            </ul>
            <a href={url("/contact/")} className={`btn ${p.featured ? "" : "btn--ghost"}`}>Plan een kennismaking</a>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function Breakdown() {
  return (
    <section className="section section--tight">
      <motion.div className="breakdown" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={inView} transition={{ duration: 0.7, ease }}>
        <div>
          <p className="eyebrow"><span className="dot" /> Hoe is de maandprijs opgebouwd?</p>
          <h2>Een n8n-licentie plus support en onderhoud.</h2>
          <p className="sub">
            Beide pakketten bevatten in elk geval een n8n Starter-abonnement. Je krijgt dus alle functionaliteit die
            n8n bij dat abonnement aanbiedt. De maandprijs bestaat deels uit de n8n-licentiekosten en deels uit
            support en onderhoud.
          </p>
          <a className="text-link" href={N8N_PRICING} target="_blank" rel="noopener noreferrer">
            Bekijk wat het n8n Starter-abonnement bevat <Icon name="arrow" size={16} />
          </a>
        </div>
        <ul className="breakdown-parts">
          <li><span className="uc-icon"><Icon name="key" size={18} /></span><span><b>n8n-licentie</b><small>Het Starter-abonnement van n8n</small></span></li>
          <li><span className="uc-icon"><Icon name="refresh" size={18} /></span><span><b>Support en onderhoud</b><small>Monitoring, updates en hulp als er iets misgaat</small></span></li>
          <li><span className="uc-icon"><Icon name="chart" size={18} /></span><span><b>Prijsaanpassingen</b><small>Prijsstijgingen van n8n en inflatie kunnen worden doorberekend</small></span></li>
        </ul>
      </motion.div>
    </section>
  );
}

function Examples() {
  return (
    <section className="section" id="voorbeelden">
      <SectionHead
        eyebrow="Voorbeelden"
        title="Welk pakket past bij jouw automatisering?"
        body="Een paar veelgevraagde workflows en het pakket waar ze bij horen. Twijfel je? In de kennismaking kijken we samen wat het beste past."
      />
      <motion.ul className="examples" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.06)}>
        {EXAMPLES.map((x) => (
          <motion.li key={x.title} className="example" variants={reveal}>
            <div className="example-top">
              <h3>{x.title}</h3>
              <span className={`example-plan ${x.plan === "Groei" ? "example-plan--groei" : ""}`}>{x.plan}</span>
            </div>
            <p>{x.body}</p>
            <div className="mini-flow" aria-label="Stappen van de workflow">
              {x.flow.map((f, i) => (
                <span key={f}>{f}{i < x.flow.length - 1 && <i aria-hidden="true">  →</i>}</span>
              ))}
            </div>
            <div className="example-meta">
              <span><Icon name="clock" size={16} /> Klaar in {x.days}</span>
              <span><Icon name="check" size={16} /> Pakket {x.plan}</span>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function Included() {
  return (
    <section className="section section--tight">
      <motion.ul className="included" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.07)}>
        {INCLUDED.map((x) => (
          <motion.li key={x.title} variants={reveal}>
            <span className="uc-icon"><Icon name={x.icon} size={20} /></span>
            <span><b>{x.title}</b><small>{x.body}</small></span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function Faq() {
  return (
    <section className="section" id="vragen">
      <SectionHead eyebrow="Veelgestelde vragen" title="Goed om te weten" />
      <motion.div className="faq" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.07)}>
        {FAQ.map((f) => (
          <motion.details key={f.q} variants={reveal}>
            <summary>{f.q}<Icon name="down" size={18} /></summary>
            <p>{f.a}</p>
          </motion.details>
        ))}
      </motion.div>
      <p className="fine">Alle genoemde bedragen zijn inclusief btw.</p>
    </section>
  );
}

function Cta() {
  return (
    <section className="section">
      <motion.div className="cta-panel cta-panel--simple" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={inView} transition={{ duration: 0.8, ease }}>
        <div>
          <p className="eyebrow"><span className="dot" /> Gratis kennismaking</p>
          <h2>Benieuwd wat het voor jouw bedrijf kost?</h2>
          <p className="sub">In 30 minuten kijken we samen naar je werkweek en welk pakket bij je past, zonder verplichtingen.</p>
        </div>
        <a href={url("/contact/")} className="btn">Plan een kennismaking <Icon name="arrow" size={18} /></a>
      </motion.div>
    </section>
  );
}

export default function Pricing() {
  return (
    <>
      <Plans />
      <Breakdown />
      <Examples />
      <Included />
      <Faq />
      <Cta />
    </>
  );
}
