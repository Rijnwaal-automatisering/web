import { motion } from "motion/react";
import Icon from "../components/Icon.jsx";
import { BRAND, KVK, CONTACT_EMAIL, ease } from "../shared.jsx";

// CONCEPT: deze tekst is een startpunt, geen juridisch advies. Laat hem nakijken door een jurist
// voordat je hem met klanten gebruikt.
const VERSION = "Concept, versie 2 oktober 2026";

const ARTICLES = [
  {
    title: "Partijen en definities",
    items: [
      `Opdrachtnemer: ${BRAND}, eenmanszaak, ingeschreven bij de Kamer van Koophandel onder nummer ${KVK}, bereikbaar via ${CONTACT_EMAIL}.`,
      "Opdrachtgever: de zzp’er, onderneming of organisatie die Opdrachtnemer een opdracht geeft. Opdrachtgever handelt in de uitoefening van een beroep of bedrijf.",
      "Plan van aanpak: het door beide partijen ondertekende document waarin de te bouwen automatiseringen, de planning, de prijs en de kaders van de opdracht staan.",
      "Oplevering: het moment waarop Opdrachtnemer meldt dat de automatiseringen uit het Plan van aanpak klaar zijn voor gebruik.",
      "n8n: het automatiseringsplatform van n8n GmbH waarop de automatiseringen draaien.",
      "Diensten van derden: alle software en diensten die niet door Opdrachtnemer worden geleverd, waaronder n8n, hosting, e-mail, boekhoud- en CRM-software en AI-modellen.",
    ],
  },
  {
    title: "Toepasselijkheid",
    items: [
      "Deze voorwaarden gelden voor alle offertes, plannen van aanpak en overeenkomsten tussen Opdrachtnemer en Opdrachtgever.",
      "Afwijkingen gelden alleen als ze schriftelijk zijn vastgelegd in het Plan van aanpak. Bij tegenstrijdigheid gaat het Plan van aanpak voor.",
      "Algemene voorwaarden van Opdrachtgever zijn niet van toepassing.",
    ],
  },
  {
    title: "Totstandkoming van de opdracht",
    items: [
      "Na een kennismakingsgesprek stelt Opdrachtnemer een Plan van aanpak op. De opdracht komt tot stand zodra beide partijen dit hebben ondertekend.",
      "Een offerte of Plan van aanpak is 30 dagen geldig, tenzij daarin anders staat.",
    ],
  },
  {
    title: "Uitvoering en garantie op de oplevering",
    items: [
      "Opdrachtnemer voert de opdracht zorgvuldig en vakkundig uit.",
      "Opdrachtnemer garandeert dat de automatiseringen bij Oplevering werken zoals beschreven in het Plan van aanpak, binnen de daarin afgesproken kaders.",
      "Gebreken in het werk van Opdrachtnemer die binnen 30 dagen na Oplevering worden gemeld, herstelt Opdrachtnemer kosteloos.",
      "Deze garantie geldt niet voor problemen die worden veroorzaakt door Diensten van derden, door wijzigingen die Opdrachtgever of derden aanbrengen, of door gebruik dat afwijkt van het Plan van aanpak.",
      "Na de Oplevering heeft Opdrachtnemer voor de werking en beschikbaarheid van de automatiseringen een inspanningsverplichting en geen resultaatsverplichting.",
      "Genoemde termijnen en opleverdata zijn streefdata, tenzij in het Plan van aanpak uitdrukkelijk een fatale termijn is afgesproken.",
    ],
  },
  {
    title: "Medewerking van Opdrachtgever",
    items: [
      "Opdrachtgever zorgt tijdig voor alle informatie, toegang, accounts en testgegevens die nodig zijn om de opdracht uit te voeren.",
      "Opdrachtgever is verantwoordelijk voor de juistheid van de aangeleverde gegevens en voor het gebruik van de automatiseringen binnen het eigen bedrijf.",
      "Ontstaat vertraging of extra werk doordat Opdrachtgever niet, niet tijdig of niet volledig meewerkt, dan mag Opdrachtnemer de planning aanpassen en het extra werk in rekening brengen.",
    ],
  },
  {
    title: "Oplevering en acceptatie",
    items: [
      "Na Oplevering heeft Opdrachtgever 10 werkdagen om de automatiseringen te testen en eventuele gebreken schriftelijk te melden.",
      "Meldt Opdrachtgever binnen die termijn geen gebreken, of neemt Opdrachtgever de automatiseringen in productie, dan geldt de opdracht als geaccepteerd.",
      "Kleine gebreken die het gebruik niet wezenlijk belemmeren, staan acceptatie niet in de weg. Opdrachtnemer herstelt ze binnen een redelijke termijn.",
    ],
  },
  {
    title: "n8n en Diensten van derden",
    items: [
      "De automatiseringen draaien op n8n. De n8n-licentie wordt afgesloten op naam van Opdrachtgever, en Opdrachtgever gaat akkoord met de voorwaarden van n8n. Afhankelijk van het pakket zijn de licentiekosten verwerkt in de maandprijs.",
      "Opdrachtnemer heeft geen invloed op de beschikbaarheid, werking, beveiliging, functionaliteit of prijzen van n8n en andere Diensten van derden.",
      "Opdrachtnemer is niet aansprakelijk voor storingen, onderbrekingen, dataverlies, wijzigingen of het beëindigen van diensten door n8n of andere Diensten van derden, en ook niet voor de gevolgen daarvan voor de automatiseringen.",
      "Wijzigt een Dienst van derden zodanig dat een automatisering moet worden aangepast, dan helpt Opdrachtnemer daarbij. Valt dat buiten de afgesproken support, dan geldt het als meerwerk.",
    ],
  },
  {
    title: "Support en onderhoud",
    items: [
      "Bij een maandpakket bewaakt Opdrachtnemer de automatiseringen, voert Opdrachtnemer noodzakelijke updates uit en helpt Opdrachtnemer bij storingen, zoals beschreven in het pakket of het Plan van aanpak.",
      "Opdrachtnemer reageert op meldingen binnen de reactietermijn uit het pakket of Plan van aanpak, op werkdagen tijdens kantooruren, tenzij anders afgesproken.",
      "Nieuwe automatiseringen of uitbreidingen vallen niet onder support en onderhoud. Daarvoor maken partijen aparte afspraken.",
    ],
  },
  {
    title: "Prijzen en betaling",
    items: [
      "Alle prijzen zijn in euro’s en inclusief btw, tenzij anders vermeld.",
      "Eenmalige kosten worden gefactureerd bij de start van de opdracht, tenzij het Plan van aanpak een andere verdeling noemt. Maandbedragen worden maandelijks vooraf gefactureerd.",
      "Facturen moeten binnen 14 dagen na factuurdatum worden betaald. Bij te late betaling is Opdrachtgever na een herinnering de wettelijke handelsrente en redelijke incassokosten verschuldigd.",
      "Opdrachtnemer mag het werk opschorten zolang een opeisbare factuur niet is betaald.",
    ],
  },
  {
    title: "Prijswijzigingen",
    items: [
      "Verhoogt n8n of een andere Dienst van derden die in de prijs is inbegrepen haar tarieven, dan mag Opdrachtnemer die verhoging doorberekenen.",
      "Opdrachtnemer mag de maandprijs eenmaal per jaar aanpassen aan de inflatie, op basis van de consumentenprijsindex (CPI) van het CBS.",
      "Opdrachtnemer kondigt een prijswijziging ten minste 30 dagen van tevoren aan. Gaat Opdrachtgever niet akkoord, dan mag Opdrachtgever de overeenkomst opzeggen tegen de datum waarop de wijziging ingaat.",
    ],
  },
  {
    title: "Meerwerk",
    items: [
      "Werk dat niet in het Plan van aanpak staat, is meerwerk. Opdrachtnemer begint daar pas aan na akkoord van Opdrachtgever op de prijs.",
    ],
  },
  {
    title: "Aansprakelijkheid",
    items: [
      "Opdrachtnemer is alleen aansprakelijk voor directe schade die het gevolg is van een toerekenbare tekortkoming in de uitvoering van de opdracht.",
      "De aansprakelijkheid is per gebeurtenis en in totaal beperkt tot het bedrag dat Opdrachtgever in de zes maanden voorafgaand aan de schadeveroorzakende gebeurtenis voor de opdracht heeft betaald.",
      "Opdrachtnemer is nooit aansprakelijk voor indirecte schade, waaronder gevolgschade, gederfde winst, gemiste besparingen, bedrijfsstagnatie en verlies of beschadiging van gegevens.",
      "Opdrachtgever is zelf verantwoordelijk voor het controleren van de uitkomsten van de automatiseringen, zoals boekingen, berichten aan klanten en antwoorden van AI-modellen, voordat daar belangrijke beslissingen op worden genomen.",
      "Een aanspraak op schadevergoeding vervalt als Opdrachtgever de schade niet binnen 30 dagen na ontdekking schriftelijk meldt, en in elk geval een jaar na de gebeurtenis.",
      "De beperkingen in dit artikel gelden niet bij opzet of bewuste roekeloosheid van Opdrachtnemer.",
    ],
  },
  {
    title: "Overmacht",
    items: [
      "Opdrachtnemer is niet gehouden tot nakoming bij overmacht. Daaronder valt ook: storingen bij n8n, hosting- of internetproviders en andere Diensten van derden, cyberaanvallen, stroomuitval en ziekte van Opdrachtnemer.",
      "Duurt de overmacht langer dan 60 dagen, dan mogen beide partijen de overeenkomst schriftelijk ontbinden, zonder schadevergoeding.",
    ],
  },
  {
    title: "Intellectueel eigendom",
    items: [
      "Na volledige betaling krijgt Opdrachtgever het eigendom van de voor Opdrachtgever gebouwde workflows en mag Opdrachtgever die vrij gebruiken en aanpassen.",
      "Opdrachtnemer mag algemene kennis, werkwijzen en herbruikbare bouwstenen die Opdrachtnemer bij de opdracht gebruikt of ontwikkelt, blijven gebruiken voor andere opdrachten, zonder vertrouwelijke gegevens van Opdrachtgever.",
    ],
  },
  {
    title: "Geheimhouding en persoonsgegevens",
    items: [
      "Partijen houden vertrouwelijke informatie van elkaar geheim, ook na het einde van de overeenkomst.",
      "Verwerkt Opdrachtnemer persoonsgegevens voor Opdrachtgever, dan sluiten partijen een verwerkersovereenkomst volgens de AVG. Opdrachtgever blijft verwerkingsverantwoordelijke.",
    ],
  },
  {
    title: "Duur en beëindiging",
    items: [
      "Een maandpakket loopt voor onbepaalde tijd en is door beide partijen maandelijks opzegbaar met een opzegtermijn van één maand, tenzij het Plan van aanpak anders bepaalt.",
      "Bij beëindiging levert Opdrachtnemer de workflows als export aan, zodat Opdrachtgever ze zelf of bij een ander kan laten draaien. Al betaalde bedragen worden niet terugbetaald.",
      "Beide partijen mogen de overeenkomst direct ontbinden als de ander failliet gaat of surseance van betaling krijgt.",
    ],
  },
  {
    title: "Toepasselijk recht en geschillen",
    items: [
      "Op deze voorwaarden en alle overeenkomsten is Nederlands recht van toepassing.",
      "Partijen proberen een geschil eerst samen op te lossen. Lukt dat niet, dan is de rechtbank Gelderland bevoegd.",
      "Opdrachtnemer mag deze voorwaarden wijzigen. Wijzigingen gelden voor lopende overeenkomsten vanaf 30 dagen na aankondiging.",
    ],
  },
];

export default function Agreement() {
  return (
    <section className="section page-hero legal" id="top">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.1 }}>
        <p className="eyebrow"><span className="dot" /> {VERSION}</p>
        <h1>Concept-overeenkomst en algemene voorwaarden</h1>
        <p className="sub">
          De werkafspraken tussen {BRAND} en jou als opdrachtgever. Samen met het Plan van aanpak vormen ze de
          overeenkomst. Heb je vragen over een artikel? Mail gerust naar {CONTACT_EMAIL}.
        </p>
        <div className="legal-actions">
          <button type="button" className="btn btn--small btn--ghost" onClick={() => window.print()}>
            <Icon name="file" size={16} /> Afdrukken of opslaan als pdf
          </button>
        </div>
        <ol className="articles">
          {ARTICLES.map((a, i) => (
            <li key={a.title} id={`artikel-${i + 1}`} className="legal-section">
              <h2><span className="article-n">Artikel {i + 1}</span> {a.title}</h2>
              <ol className="clauses">
                {a.items.map((t, k) => <li key={k}><span className="clause-n">{i + 1}.{k + 1}</span><span>{t}</span></li>)}
              </ol>
            </li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
