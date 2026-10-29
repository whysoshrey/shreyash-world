# shreyash-world

Portfolio of Shreyash Ojha — Vite + React + TypeScript + Framer Motion, deployed to GitHub Pages via Actions.

## Local run
```bash
npm install
npm run dev        # development
npm run build      # type-check + production build
npm run preview    # serve the build at /shreyash-world/
```

## Structure
- `public/content.json` — all copy, projects, credentials and links (edit this to update the site)
- `src/lib/projects.ts` — presentation metadata per project (key figure / plate word / image). Figures are taken from `content.json`.
- `src/pages/` — Home, Work (filterable gallery), Case study (`/work/:id`), Credentials, About, Cartier Rogue, Cartier × Maybach
- `src/components/site/` — header, footer + page-transition shell, work index, shared primitives
- `src/styles/site.css` — design tokens and all site styles (campaign pages also use `cartier-*.css`)
- `public/assets/web/` — optimised WebP derivatives of the campaign imagery

## Routes (HashRouter)
`#/` · `#/work` (`?d=ops|merch|brand`) · `#/work/:id` · `#/credentials` · `#/about` · `#/cartier-rogue` · `#/cartier-maybach`

## Type
Instrument Serif and Inter Tight, self-hosted via Fontsource (SIL Open Font License 1.1).

## Deploy
Settings → Pages → Source: GitHub Actions. Push to `main` → auto deploy.
