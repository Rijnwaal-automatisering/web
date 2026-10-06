import { motion } from "motion/react";
import { BRAND, KVK, CONTACT_EMAIL, ease } from "../shared.jsx";
import { openCookieSettings } from "../components/CookieConsent.jsx";

// Voorbeeldtekst: laat deze privacyverklaring nakijken voordat de site live gaat.
const UPDATED = "2 oktober 2026";

const SECTIONS = [
  {
    id: "wie", title: "Wie ben ik?",
    body: [
      `${BRAND} is een eenmanszaak, ingeschreven bij de Kamer van Koophandel onder nummer ${KVK}. Ik ben verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze privacyverklaring.`,
      `Vragen over privacy? Mail naar ${CONTACT_EMAIL}.`,
    ],
  },
  {
    id: "gegevens", title: "Welke gegevens verwerk ik?",
    list: [
      "Contactformulier: je naam, zakelijk e-mailadres, de onderwerpen die je aanvinkt en je bericht.",
      "Klanten: contact- en factuurgegevens, en de afspraken die we maken.",
      "Workflows: gegevens die jouw automatiseringen verwerken. Daarvoor ben jij verantwoordelijk en ben ik verwerker; dat leggen we vast in een verwerkersovereenkomst.",
      "Websitebezoek: technische gegevens zoals je IP-adres en browsertype, die nodig zijn om de site te tonen.",
    ],
  },
  {
    id: "doelen", title: "Waarvoor en op welke grondslag?",
    list: [
      "Je aanvraag beantwoorden en een kennismaking plannen (op jouw verzoek, voorafgaand aan een overeenkomst).",
      "Het uitvoeren van een opdracht en het versturen van facturen (uitvoering van de overeenkomst).",
      "Het voldoen aan de fiscale bewaarplicht (wettelijke verplichting).",
      "Het verbeteren van de website met analytische cookies, alleen als je daar toestemming voor geeft (toestemming).",
    ],
  },
  {
    id: "bewaren", title: "Hoe lang bewaar ik je gegevens?",
    list: [
      "Contactaanvragen zonder vervolg: maximaal 12 maanden.",
      "Facturen en administratie: 7 jaar, vanwege de wettelijke bewaarplicht.",
      "Workflowgegevens: volgens de bewaartermijn die we per workflow afspreken in de verwerkersovereenkomst.",
    ],
  },
  {
    id: "delen", title: "Met wie deel ik gegevens?",
    body: [
      "Ik verkoop je gegevens nooit. Ik deel ze alleen met partijen die nodig zijn om mijn diensten te leveren, zoals mijn hostingpartij en mijn boekhoudsoftware. Met hen heb ik verwerkersovereenkomsten gesloten.",
      "Alle hosting en dataopslag vindt plaats binnen de Europese Unie. Ik geef geen persoonsgegevens door naar landen buiten de EU, tenzij jij zelf kiest voor een koppeling met software buiten de EU. Dat bespreken we dan vooraf.",
    ],
  },
  {
    id: "cookies", title: "Cookies",
    body: [
      "Deze site gebruikt functionele opslag om je cookievoorkeur te onthouden. Analytische cookies worden alleen geplaatst als je daar toestemming voor geeft. Je kunt je keuze op elk moment aanpassen.",
    ],
    cookieButton: true,
  },
  {
    id: "beveiliging", title: "Beveiliging",
    body: [
      "Ik neem passende maatregelen om je gegevens te beschermen, waaronder versleuteling, toegangsbeheer met minimale rechten, logging en dagelijkse back-ups. Bij een datalek handel ik volgens de wettelijke meldplicht.",
    ],
  },
  {
    id: "rechten", title: "Jouw rechten",
    body: [
      `Je hebt het recht om je gegevens in te zien, te laten corrigeren of verwijderen, de verwerking te laten beperken, bezwaar te maken en je gegevens over te laten dragen. Een gegeven toestemming kun je altijd intrekken. Stuur je verzoek naar ${CONTACT_EMAIL}; ik reageer binnen een maand.`,
      "Ben je niet tevreden over hoe ik met je gegevens omga? Dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.",
    ],
  },
  {
    id: "wijzigingen", title: "Wijzigingen",
    body: [`Deze privacyverklaring kan worden aangepast. De meest recente versie staat altijd op deze pagina. Laatst bijgewerkt: ${UPDATED}.`],
  },
];

export default function PrivacyPolicy() {
  return (
    <section className="section page-hero legal" id="top">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.1 }}>
        <p className="eyebrow"><span className="dot" /> Privacyverklaring</p>
        <h1>Privacyverklaring</h1>
        <p className="sub">Hoe {BRAND} omgaat met jouw persoonsgegevens. Laatst bijgewerkt: {UPDATED}.</p>
        <nav className="legal-toc" aria-label="Inhoud">
          {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}
        </nav>
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="legal-section">
            <h2>{s.title}</h2>
            {s.body?.map((p) => <p key={p}>{p}</p>)}
            {s.list && <ul>{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
            {s.cookieButton && (
              <button type="button" className="btn btn--small btn--ghost" onClick={openCookieSettings}>Cookie-instellingen aanpassen</button>
            )}
          </section>
        ))}
      </motion.div>
    </section>
  );
}
