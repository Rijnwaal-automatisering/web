import { useState } from "react";
import { motion } from "motion/react";
import Icon from "../components/Icon.jsx";
import { ease, CONTACT_EMAIL, WHATSAPP_URL } from "../shared.jsx";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true); // voorbeeld: koppel dit later aan een n8n-webhook
  };
  return (
    <section id="top" className="section page-hero">
      <motion.div
        className="cta-panel"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
      >
        <div>
          <p className="eyebrow"><span className="dot" /> Laten we praten</p>
          <h1>Ontdek welk werk jij als eerste kunt automatiseren.</h1>
          <p className="sub">Plan een gratis kennismaking van 30 minuten. Je krijgt een lijstje met kansen en een eerste prijsindicatie, of je nu met mij verder gaat of niet.</p>
          <div className="contact-direct">
            <span className="uc-icon"><Icon name="mail" size={20} /></span>
            <span>
              <small>Liever direct mailen?</small>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </span>
          </div>
          <a className="btn btn--whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={20} /> Stuur een WhatsApp-bericht
          </a>
        </div>
        {sent ? (
          <motion.div className="form-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} role="status">
            <span className="card-icon"><Icon name="check" size={22} /></span>
            <h3>Bedankt, ik neem contact met je op.</h3>
            <p>Je ontvangt binnen één werkdag een reactie.</p>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} className="form">
            <label>Naam<input name="name" required autoComplete="name" placeholder="Jan Jansen" /></label>
            <label>Zakelijk e-mailadres<input name="email" type="email" required autoComplete="email" placeholder="jan@bedrijf.nl" /></label>
            <fieldset className="topics">
              <legend>Waar kan ik mee helpen?</legend>
              <div className="topic-list">
                {["Chatbot", "Formulieren", "Bedrijfsprocessen", "Beveiliging", "Weet ik nog niet"].map((t) => (
                  <label className="topic" key={t}><input type="checkbox" name="topic" value={t} /><span>{t}</span></label>
                ))}
              </div>
            </fieldset>
            <label>Wat wil je automatiseren?<textarea name="msg" rows="3" placeholder="Bijvoorbeeld: aanvragen via ons websiteformulier automatisch beantwoorden" /></label>
            <button className="btn" type="submit">Plan mijn kennismaking <Icon name="arrow" size={18} /></button>
          </form>
        )}
      </motion.div>
    </section>
  );
}

