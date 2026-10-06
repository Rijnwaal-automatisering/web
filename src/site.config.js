// Site-wide switches. Change a value here, commit and push: the deploy workflow rebuilds the site.

// Which floating button sits in the bottom-right corner: "chatbot", "whatsapp" or "none".
export const FLOATING_BUTTON = "chatbot";

export const CHATBOT = {
  buttonLabel: "Chat with our bot",
  title: "Waalsprong-assistent",
  greeting: "Hoi! Ik ben de assistent van Waalsprong Automatisering. Vraag me iets over prijzen, de werkwijze, privacy of wat je kunt automatiseren.",
  // URL of an n8n "Chat Trigger" webhook (or any endpoint that accepts { action, sessionId, chatInput }
  // and answers with { output }). Leave empty to use the built-in answers in src/components/chatbotAnswers.js.
  webhookUrl: "",
};
