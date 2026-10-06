import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Subfolder the site is served from, e.g. "/web/" on GitHub Pages; set by the deploy workflow.
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        prijzen: new URL("./prijzen/index.html", import.meta.url).pathname,
        "over-mij": new URL("./over-mij/index.html", import.meta.url).pathname,
        werkwijze: new URL("./werkwijze/index.html", import.meta.url).pathname,
        privacy: new URL("./privacy/index.html", import.meta.url).pathname,
        toepassingen: new URL("./toepassingen/index.html", import.meta.url).pathname,
        privacyverklaring: new URL("./privacyverklaring/index.html", import.meta.url).pathname,
        contact: new URL("./contact/index.html", import.meta.url).pathname,
        voorwaarden: new URL("./voorwaarden/index.html", import.meta.url).pathname,
      },
    },
  },
});
