import { motion } from "motion/react";
import Icon from "../components/Icon.jsx";
import { ease, reveal, stagger, inView, SectionHead } from "../shared.jsx";

const PRIVACY = [
  { icon: "eu", title: "Alleen in de EU", body: "Hosting, opslag en back-ups staan uitsluitend in datacenters binnen de Europese Unie. Je data verlaat de EU niet." },
  { icon: "shield", title: "AVG en UAVG", body: "Ingericht volgens de Europese AVG en de Nederlandse Uitvoeringswet AVG, met de richtlijnen van de Autoriteit Persoonsgegevens als uitgangspunt." },
  { icon: "file", title: "Verwerkersovereenkomst", body: "Bij elke opdracht sluiten we een verwerkersovereenkomst. Zwart op wit wat er met je gegevens gebeurt." },
  { icon: "lock", title: "Veilige opslag", body: "Versleuteld opgeslagen, alleen de gegevens die echt nodig zijn, met vaste bewaartermijnen." },
  { icon: "eye", title: "Datalekprotocol", body: "Gaat er iets mis, dan weet je het direct en helpen we je binnen de wettelijke termijn met de melding." },
  { icon: "server", title: "Datacenters in de EU", body: "Je workflows draaien in datacenters binnen de EU, op dit moment in Frankfurt (Duitsland)." },
];

const PRACTICE = [
  { q: "Waar staat mijn data precies?", a: "Je n8n-omgeving, de gegevens die je workflows verwerken en alle back-ups staan op servers in datacenters binnen de EU." },
  { q: "Wie kan erbij?", a: "Alleen jij en ik. Elke koppeling krijgt alleen de rechten die nodig zijn, en van elke run is terug te zien wat er gebeurde." },
  { q: "Hoe lang worden gegevens bewaard?", a: "Niet langer dan nodig. Per workflow spreken we een bewaartermijn af; daarna worden gegevens automatisch verwijderd." },
  { q: "En als ik software van buiten de EU gebruik?", a: "Gebruik je zelf bijvoorbeeld Gmail of HubSpot, dan bespreken we vooraf welke gegevens daarheen gaan en houden we dat zo beperkt mogelijk." },
];

// The twelve gold stars of the European flag, drawn as a large ring behind the hero.
const STAR = "M0 -1 L0.2245 -0.309 L0.951 -0.309 L0.3633 0.118 L0.5878 0.809 L0 0.382 L-0.5878 0.809 L-0.3633 0.118 L-0.951 -0.309 L-0.2245 -0.309 Z";
const ring = (r) => Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6 - Math.PI / 2;
  return [Math.cos(a) * r, Math.sin(a) * r];
});

function EuStars() {
  return (
    <svg className="eu-stars" viewBox="-150 -150 300 300" aria-hidden="true">
      <g className="eu-stars-ring">
        {ring(100).map(([x, y], i) => <path key={i} d={STAR} transform={`translate(${x} ${y}) scale(16)`} />)}
      </g>
    </svg>
  );
}

function Intro() {
  return (
    <section className="section page-hero" id="top">
      <motion.div className="eu-hero" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 }}>
        <EuStars />
        <div className="eu-hero-copy">
          <h1>Jouw data blijft in de EU.</h1>
          <p>
            Hosting, dataopslag en de manier waarop ik met persoonsgegevens omga, zijn volledig in lijn met de
            Europese privacywetgeving (AVG). Je data wordt alleen binnen de EU gehost. Daar hoef jij niet over na te denken.
          </p>
          <ul className="privacy-badges" aria-label="Kort samengevat">
            <li>AVG-proof</li><li>UAVG</li><li>Verwerkersovereenkomst</li><li>Hosting in de EU</li>
          </ul>
        </div>
      </motion.div>
      <motion.ul className="privacy-list privacy-list--wide" initial="hidden" animate="show" variants={stagger(0.06, 0.4)}>
        {PRIVACY.map((x) => (
          <motion.li key={x.title} variants={reveal}>
            <span className="uc-icon"><Icon name={x.icon} size={18} /></span>
            <div><h3>{x.title}</h3><p>{x.body}</p></div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function Practice() {
  return (
    <section className="section">
      <SectionHead eyebrow="In de praktijk" title="Wat betekent dit voor jou?" />
      <motion.div className="faq" initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.07)}>
        {PRACTICE.map((f) => (
          <motion.details key={f.q} variants={reveal}>
            <summary>{f.q}<Icon name="down" size={18} /></summary>
            <p>{f.a}</p>
          </motion.details>
        ))}
      </motion.div>
    </section>
  );
}

function Cta() {
  return (
    <section className="section">
      <motion.div className="cta-panel cta-panel--simple" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={inView} transition={{ duration: 0.8, ease }}>
        <div>
          <p className="eyebrow"><span className="dot" /> Vragen?</p>
          <h2>Wil je precies weten wat er met jouw data gebeurt?</h2>
          <p className="sub">In de kennismaking lopen we het samen door, voor jouw situatie.</p>
        </div>
        <a href="/contact/" className="btn">Plan een kennismaking <Icon name="arrow" size={18} /></a>
      </motion.div>
    </section>
  );
}

export default function Privacy() {
  return (
    <>
      <Intro />
      <Practice />
      <Cta />
    </>
  );
}
