# Waalsprong Automatisering

Website for Waalsprong Automatisering, a one-person n8n automation business for small companies. Vite + React, three.js (3D workflow graph and avatar placeholder) and Motion (UI animation).

```bash
npm install
npm run dev     # http://localhost:5173  (plus one URL per page in src/pages)
npm run build
```

- `src/App.jsx` – app shell (nav, footer, page transition); `src/router.jsx` – tiny client-side router, so switching pages never does a full reload
- `src/pages/` – Home (`/`), Pricing (`/prijzen/`), About (`/over-mij/`), Process (`/werkwijze/`, with the winding step route), Privacy (`/privacy/`), Applications (`/toepassingen/`), PrivacyPolicy (`/privacyverklaring/`), Contact (`/contact/`) and Agreement (`/voorwaarden/`, draft contract)
- `index.html` plus `<page>/index.html` – one HTML entry per page so deep links work on any static host (all load `src/main.jsx`)
- `src/shared.jsx` – logo, nav, footer, KvK number and shared animation helpers
- `src/components/FlowScene.jsx` – the 3D node graph behind the hero
- `src/components/AvatarScene.jsx` – 3D placeholder for the "Over mij" photo; swap it for an `<img>` once the photo exists
- `RiverSplit` in `src/pages/Home.jsx` – illustrated placeholder for the Waalsprong photo; swap it for an `<img>` once you have a photo you may use
- `src/components/CookieConsent.jsx` – cookie pop-up; the choice is stored in localStorage, use `hasAnalyticsConsent()` before loading analytics
- `src/styles.css` – design tokens and layout

All copy, prices, testimonials, the KvK number and the privacy policy are placeholder content. The contact form is a stub; point `onSubmit` at an n8n webhook.

## Deployment

Every push to `main` builds the site and publishes `dist/` to GitHub Pages via `.github/workflows/deploy.yml` (Node version from `.nvmrc`). In the repo settings, set **Pages → Source** to **GitHub Actions**. `dist/` is build output and is not committed. The workflow builds with the Pages base path (`/web/` on `rijnwaal-automatisering.github.io/web/`, `/` on a custom domain), so internal links and image paths go through `url()` from `src/router.jsx`.
