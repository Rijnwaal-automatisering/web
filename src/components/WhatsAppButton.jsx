import { motion } from "motion/react";
import Icon from "./Icon.jsx";
import { WHATSAPP_URL } from "../shared.jsx";

// Floating button that opens a WhatsApp chat in a new tab.
export default function WhatsAppButton() {
  return (
    <motion.a
      className="whatsapp-fab" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
      aria-label="Stuur een WhatsApp-bericht"
      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", visualDuration: 0.5, bounce: 0.35, delay: 1.2 }}
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
    >
      <Icon name="whatsapp" size={26} />
      <span className="whatsapp-fab-label">WhatsApp</span>
    </motion.a>
  );
}
