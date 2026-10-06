// Built-in answers for the chatbot when no webhook is configured in src/site.config.js.
// Links use [text](/path/) and open inside the site without closing the chat.
const ANSWERS = [
  {
    keywords: ["prijs", "prijzen", "kost", "kosten", "tarief", "betalen", "abonnement", "euro", "€", "price"],
    answer: "Het Groei-pakket kost € 40 per maand, met eenmalig € 400 voor de opzet. Voor grotere trajecten maak ik een offerte op maat. Alles staat op de pagina [Prijzen](/prijzen/).",
  },
  {
    keywords: ["contact", "bellen", "afspraak", "kennismaking", "gesprek", "mail", "email", "e-mail", "plan"],
    answer: "Plan een gratis kennismaking van 30 minuten via de [contactpagina](/contact/), of mail naar info@rijnwaalautomatisering.nl.",
  },
  {
    keywords: ["privacy", "avg", "gdpr", "hosting", "data", "gegevens", "veilig", "beveiliging", "eu"],
    answer: "Alles draait op servers in de EU en jouw gegevens blijven van jou. Lees meer op [Privacy en hosting](/privacy/) of in de [privacyverklaring](/privacyverklaring/).",
  },
  {
    keywords: ["werkwijze", "hoe werkt", "stappen", "proces", "traject", "hoe lang", "doorlooptijd"],
    answer: "We beginnen met een kennismaking, daarna maak ik een voorstel, bouw ik de automatisering en zorg ik voor onderhoud. De stappen staan op [Werkwijze](/werkwijze/).",
  },
  {
    keywords: ["chatbot", "factuur", "facturen", "formulier", "offerte", "rapport", "automatiseren", "voorbeeld", "toepassing", "kan je", "kun je"],
    answer: "Denk aan chatbots, formulierafhandeling, facturen verwerken, offertes en rapportages. Bekijk de voorbeelden op [Toepassingen](/toepassingen/).",
  },
  {
    keywords: ["n8n", "wie", "over", "niels", "ervaring"],
    answer: "Ik bouw automatiseringen met n8n voor zzp'ers en kleine bedrijven. Meer over mij lees je op [Over mij](/over-mij/).",
  },
  {
    keywords: ["hoi", "hallo", "hey", "goedemorgen", "goedemiddag", "hi", "hello"],
    answer: "Hoi! Waar kan ik je mee helpen? Je kunt bijvoorbeeld vragen naar de prijzen of naar wat je kunt automatiseren.",
  },
  {
    keywords: ["bedankt", "dank", "thanks", "top"],
    answer: "Graag gedaan! Laat het weten als je nog iets wilt vragen.",
  },
];

const FALLBACK = "Daar heb ik niet direct een antwoord op. Stel je vraag via de [contactpagina](/contact/), dan krijg je binnen één werkdag een reactie.";

export const SUGGESTIONS = ["Wat kost het?", "Wat kun je automatiseren?", "Waar staan mijn gegevens?"];

// A keyword matches a whole word, so "eu" does not match "euro". Keywords of four letters or
// more also match the start of a word, so "prijs" matches "prijsopgave".
const matches = (q, words, k) =>
  k.includes(" ") ? q.includes(k) : words.some((w) => w === k || (k.length >= 4 && w.startsWith(k)));

export function localAnswer(question) {
  const q = question.toLowerCase();
  const words = q.split(/[^\p{L}\p{N}€-]+/u).filter(Boolean);
  let best = null, bestScore = 0;
  for (const a of ANSWERS) {
    const score = a.keywords.filter((k) => matches(q, words, k)).length;
    if (score > bestScore) { best = a; bestScore = score; }
  }
  return best ? best.answer : FALLBACK;
}
