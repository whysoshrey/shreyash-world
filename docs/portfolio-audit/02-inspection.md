# 02 · Live-site inspection (Phase 3)

The baseline is commit `65e1bfe`, served by `vite preview`. It is identical to the published live view (v7). Nothing was changed during this phase.
Every item below is an **[O] observed fact** from a tool run unless it is marked otherwise.

## Method
- **Playwright inspection** (`audit-tools/inspect.cjs`): 18 routes × 1440×900, 1024×768, 768×1024 and 390×844. Records time to h1, fold screenshots, images, anchors, headings, overflow, word counts, text under 13px and mailto links.
- **Accessibility:** axe-core 4.14 on desktop and mobile for every route.
- **Performance:** Lighthouse 12 mobile (simulated throttling) on Home, ops-1 and About.
- **Keyboard:** Tab order, skip link and focus ring (`keys.cjs`).
- **Interactions:** 41 + 17 existing checks (`interact.cjs`, `navflow.cjs`), plus `interact-mid.cjs` at 600, 900 and 1180 px. Covers the menu, filters, lightboxes, chapters, video, Back and hover.
- **External links:** HTTP status of every outbound link.

## Inventory
| Route | Purpose | Key interactions |
|---|---|---|
| `/` | Lead (name, discipline, tagline, View work / Résumé), Desk card collage, evidence, Cartier feature, recognition, About teaser, footer contact | Desk cards (~28 tab stops), CTAs |
| `/work` | Grid of 12 projects, 4 domain filters | Filter syncs `?d=` |
| `/work/:id` | Dossier: hero metric, section nav, situation/process/pictures/results, sources, next project | Section nav, gallery lightbox, video (ops-1) |
| `/work/cartier-gtm-redirection` (+ `/rogue`, `/maybach`) | Campaign with 3 chapters | Chapter tabs, pager, 3D viewer (not tested) |
| `/credentials` | Recognition, endorsements, Christina Lee letter, endorser profiles | Source links |
| `/about` | Portrait, journey timeline, roles, education, toolkit | — |
| `/system` | Design-system page (internal) | — |
| `*` | 404 page "Not here" | Back home |

## Results

### Works
- **No horizontal overflow** on any route at any of the 7 widths tested.
- **First h1 visible** in 180–620 ms locally.
- **Mobile menu** at 600 and 900 px: opens, sets `aria-expanded=true`, and Escape closes it. From 1180 px the inline nav shows.
- **Filters** sync the URL at every width.
- **Lightboxes** on merch-2, brand-1, ops-1, ops-2 and ops-3 open a `role=dialog`, move focus to Close, close on Escape, and return focus to the trigger. Tested at 390, 900 and 1440 px.
- **ops-1 video** (`preload=none`) plays when started, reaching readyState 4.
- **Cartier chapters** route correctly, and Back returns to the previous chapter.
- **Keyboard:** the skip link is the first tab stop and moves focus to main. The focus ring is visible (2px). Tab order is logical.
- **Hover:** 82 `:hover` rules, gated to `(hover:hover) and (pointer:fine)`. They act on child elements; for example the card title colour changes and the plate rises 4px.
- **Reduced motion:** the curtain clears in about 200 ms.
- **Drive links:** all 16 return 200.
- **Images:** no broken images; the lazy carousel images were confirmed to return 200.
- **Console:** errors come only from inside the third-party YouTube iframe.

### Issues observed
| # | Finding | Evidence |
|---|---|---|
| O1 | **No email address anywhere.** Header "Contact" scrolls to the footer, which offers only Résumé, LinkedIn and GitHub. | 0 `mailto:` across 18 routes; `content.json site.links` |
| O2 | **Linked CV conflicts with the site.** | See the table below |
| O3 | **Two Credentials source links are dead or wrong.** The NIFT diploma PDF returns 404; `nift.ac.in/node/1098` now shows an unrelated tender page. | curl status and page content |
| O4 | **First screen** states the discipline and a tagline. It does not state location, availability, target roles or a contact route other than the Résumé. | Fold screenshots (d, m) |
| O5 | **Case-study first screen** shows the title, client, metric and claim. Role, dates, team and the candidate's own contribution are below the fold. | `m_work_ops-1-fold.jpg` |
| O6 | **Home preloads three.js on every page.** `three-core` (691 KB raw / 178 KB gzip), `r3f` and `drei` are modulepreloaded. The entry chunk statically imports a helper (`_`) that Rollup placed in the `drei` manual chunk. | `dist/index.html`, entry imports |
| O7 | **Lighthouse mobile** (simulated): see the table below. LCP element on Home is `p.lead__value`. Render-blocking CSS costs ~600 ms. Content waits on the client fetch of `content.json`. | LH JSON |
| O8 | **axe colour-contrast:** 73 nodes over 21 runs (the only violation type). Some may be captured mid-reveal. See the list below. | axe JSON |
| O9 | **Brand link** aria-label differs from its visible "S·O" text (label-in-name). | Lighthouse a11y |
| O10 | **Home desk has ~28 card tab stops** before the rest of the page. | `keys.cjs` |
| O11 | **Route-change curtain** covers more than 50% of the viewport for about 450 ms on each navigation. | frame sampling |
| O12 | **Length:** About 850 words, Credentials 691, ops-1 752. `/system` has 40 nodes under 13px and is reachable by URL. | inspect report |
| O13 | **No video or lightbox** on merch-1, merch-3, brand-2, brand-3 or ops-4. brand-3 has few pictures. | interaction run |

**O2 detail: linked CV vs site**

| Item | Linked CV | Site and latest résumé |
|---|---|---|
| NIFT CGPA | 8.4 | 8.5 |
| A Space, In Between | Mar–Jun 2025, New York | Feb–May 2025, Tokyo / remote |
| Bloomingdale's title | Brand Representative | Seasonal Sales Associate |
| Bloomingdale's start | Sept 2025 | Oct 2025 |
| Handshake title | AI Data Trainer | Research Fellow |
| Phone | US number | — |

**O7 detail: Lighthouse mobile**

| Page | Perf | A11y | FCP | LCP | CLS | Weight |
|---|---|---|---|---|---|---|
| Home | 72 | 100 | 3.6 s | 5.5 s | 0 | 1,557 KiB |
| ops-1 | 77 | 96 | 3.8 s | 4.1 s | — | 536 KiB |
| About | 74 | 96 | 3.9 s | 4.8 s | — | 622 KiB |

**O8 detail: contrast failures**
- **Main cause:** cream #faf0b5 on red #ca4340 is 4.14:1 at small sizes. Affects tags, `.plate__note` (3.64), merch plate word (3.78) and the mediaCard CTA.
- **Red text on paper** at 13–16px is 4.34:1.
- **`/system`:** code text on cream is 1.04:1.

## Not verifiable here (limitations)
- **Bot-blocked links:** LinkedIn (999), GitHub (403), ResearchGate (403), New School / Parsons pages (429) and YouTube (429). Status unknown, not assumed working.
- **Cartier Maybach 3D viewer:** the `.glb` was aborted in the tests, so it was not exercised.
- **Real devices:** no Safari/iOS or real-device testing; Chromium only.
- **Lighthouse:** run against the local preview, not GitHub Pages; CDN behaviour may differ.
