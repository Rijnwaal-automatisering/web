import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Icon from "./Icon.jsx";
import { url } from "../router.jsx";
import { CHATBOT } from "../site.config.js";
import { localAnswer, SUGGESTIONS } from "./chatbotAnswers.js";

// Floating chat button plus chat window. It is rendered by the app shell, outside the page
// transition, so it stays open while you switch pages. The conversation is also kept in
// sessionStorage, so it survives a full reload or a deep link until the browser tab is closed.
const KEY = "waalsprong-chat";

const load = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; }
};
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

async function ask(question, sessionId) {
  if (!CHATBOT.webhookUrl) {
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
    return localAnswer(question);
  }
  const res = await fetch(CHATBOT.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "sendMessage", sessionId, chatInput: question }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (Array.isArray(data) ? data[0] : data)?.output ?? localAnswer(question);
}

// Renders [text](/path/) as an in-site link and https:// URLs as external links; the rest stays plain text.
function Rich({ text }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|https?:\/\/\S+)/g);
  return parts.map((p, i) => {
    const md = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (md) {
      const external = /^https?:/.test(md[2]);
      return external
        ? <a key={i} href={md[2]} target="_blank" rel="noopener noreferrer">{md[1]}</a>
        : <a key={i} href={url(md[2])}>{md[1]}</a>;
    }
    if (/^https?:\/\//.test(p)) return <a key={i} href={p} target="_blank" rel="noopener noreferrer">{p}</a>;
    return p;
  });
}

export default function ChatBot() {
  const [saved] = useState(load);
  const [open, setOpen] = useState(saved?.open ?? false);
  const [messages, setMessages] = useState(saved?.messages ?? [{ from: "bot", text: CHATBOT.greeting }]);
  const [sessionId] = useState(saved?.sessionId ?? newId);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ open, messages, sessionId })); } catch { /* opslag niet beschikbaar */ }
  }, [open, messages, sessionId]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text) => {
    const question = text.trim();
    if (!question || busy) return;
    setDraft("");
    setMessages((m) => [...m, { from: "user", text: question }]);
    setBusy(true);
    let answer;
    try {
      answer = await ask(question, sessionId);
    } catch {
      answer = "Er ging iets mis bij het versturen. Probeer het later opnieuw of gebruik de [contactpagina](/contact/).";
    }
    setMessages((m) => [...m, { from: "bot", text: answer }]);
    setBusy(false);
  };

  const showSuggestions = messages.length === 1 && !busy;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            id="chatbot-window" className="chat" role="dialog" aria-label={CHATBOT.title}
            initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="chat-head">
              <span className="chat-avatar"><Icon name="bot" size={20} /></span>
              <span className="chat-title">
                <b>{CHATBOT.title}</b>
                <small><span className="chat-online" /> Online</small>
              </span>
              <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Chat sluiten">
                <Icon name="close" size={18} />
              </button>
            </header>
            <ol className="chat-list" ref={listRef} aria-live="polite">
              {messages.map((m, i) => (
                <li key={i} className={`chat-msg chat-msg--${m.from}`}>
                  {m.from === "bot" && <span className="chat-msg-avatar" aria-hidden="true"><Icon name="bot" size={14} /></span>}
                  <p><Rich text={m.text} /></p>
                </li>
              ))}
              {busy && (
                <li className="chat-msg chat-msg--bot">
                  <span className="chat-msg-avatar" aria-hidden="true"><Icon name="bot" size={14} /></span>
                  <p className="chat-typing" aria-label="Aan het typen"><span /><span /><span /></p>
                </li>
              )}
            </ol>
            {showSuggestions && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => send(s)}>{s}</button>)}
              </div>
            )}
            <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
              <input
                ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder="Typ je vraag…" aria-label="Je vraag" maxLength={500} autoComplete="off"
              />
              <button type="submit" disabled={!draft.trim() || busy} aria-label="Versturen">
                <Icon name="arrow" size={18} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <motion.button
        ref={buttonRef} type="button" className="chat-fab"
        aria-expanded={open} aria-controls="chatbot-window" aria-label={open ? "Chat sluiten" : CHATBOT.buttonLabel}
        onClick={() => setOpen((o) => !o)}
        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", visualDuration: 0.5, bounce: 0.35, delay: saved ? 0 : 1.2 }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
      >
        <Icon name={open ? "close" : "bot"} size={24} />
        <span className="chat-fab-label">{CHATBOT.buttonLabel}</span>
      </motion.button>
    </>
  );
}
