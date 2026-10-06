import { motion } from "motion/react";
import AvatarScene from "../components/AvatarScene.jsx";
import Icon from "../components/Icon.jsx";
import { useState } from "react";
import { BRAND, LINKEDIN_URL, ease, reveal, stagger, inView, SectionHead } from "../shared.jsx";
import { url } from "../router.jsx";

// Zet de officiële logobestanden in public/logos/ (rabobank.svg, alliander.svg). Tot die er zijn, staat de naam er.
const EMPLOYERS = [
  { name: "Rabobank", logo: url("/logos/rabobank.svg"), sector: "Financiële sector" },
  { name: "Alliander", logo: url("/logos/alliander.svg"), sector: "Energiesector" },
];

function EmployerLogo({ name, logo }) {
  const [failed, setFailed] = useState(false);
  return failed
    ? <span className="employer-name">{name}</span>
    : <img src={logo} alt={name} onError={() => setFailed(true)} />;
}

const VALUES = [
  { icon: "check", title: "Zorgvuldig", body: "In de financiële wereld moet elke berekening kloppen en elke stap controleerbaar zijn. Zo bouw ik ook jouw workflows: getest met echte data en volledig gedocumenteerd." },
  { icon: "refresh", title: "Betrouwbaar", body: "In de energiesector moeten datastromen dag en nacht doorlopen. Ik bouw workflows die blijven draaien, met monitoring en een melding zodra er iets misgaat." },
  { icon: "chat", title: "Begrijpelijk", body: "Geen vakjargon. Je krijgt een helder schema van wat er gebeurt, een vaste prijs en iemand die je gewoon kunt bellen." },
];

function Intro() {
  return (
    <section className="section page-hero" id="top">
      <div className="about">
        <motion.figure
          className="about-photo"
          initial={{ opacity: 0, y: 32, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
        >
          {/* Vervang AvatarScene door <img src={url("/niels.jpg")} alt="..."> zodra de foto er is. */}
          <AvatarScene />
          <figcaption>Niels ten H</figcaption>
        </motion.figure>
        <motion.div className="about-copy" initial="hidden" animate="show" variants={stagger(0.1, 0.2)}>
          <motion.p className="eyebrow" variants={reveal}><span className="dot" /> Over mij</motion.p>
          <motion.h1 variants={reveal}>Je praat direct met degene die het bouwt.</motion.h1>
          <motion.p className="sub" variants={reveal}>
            Hoi, ik ben Niels. {BRAND} is mijn eenmanszaak. Ik ben een ervaren ontwikkelaar met meer dan
            tien jaar programmeerervaring in de financiële sector en de energiesector, onder meer bij Rabobank en Alliander.
          </motion.p>
          <motion.p className="sub" variants={reveal}>
            Die ervaring zet ik nu in voor het MKB. Ik help ondernemers om het herhaalwerk uit hun week te halen,
            zonder dat ze er een IT-afdeling voor nodig hebben.
          </motion.p>
          <motion.div className="employers" variants={reveal}>
            <p className="employers-label">Eerder werkzaam bij</p>
            <ul>
              {EMPLOYERS.map((e) => (
                <li key={e.name}>
                  <span className="employer-logo"><EmployerLogo name={e.name} logo={e.logo} /></span>
                  <small>{e.sector}</small>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.a variants={reveal} className="btn btn--ghost btn--small linkedin" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <Icon name="linkedin" size={18} /> Bekijk mijn LinkedIn-profiel
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function Values() {
  return (
    <section className="section">
      <SectionHead eyebrow="Hoe ik werk" title="Wat je van mij kunt verwachten." />
      <motion.ul className="values" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.08)}>
        {VALUES.map((v) => (
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
          <p className="eyebrow"><span className="dot" /> Kennismaken</p>
          <h2>Zullen we een keer bellen?</h2>
          <p className="sub">In 30 minuten kijken we samen welk werk jij als eerste kunt automatiseren. Gratis en zonder verplichtingen.</p>
        </div>
        <a href={url("/contact/")} className="btn">Plan een kennismaking <Icon name="arrow" size={18} /></a>
      </motion.div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <Intro />
      <Values />
      <Cta />
    </>
  );
}
