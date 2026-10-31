# 05 · Implementation and before/after report (Phases 6–7)

**Baseline:** `65e1bfe`. **After:** the commit containing this file.

Everything here was checked on the local `vite preview` build with the same tools and criteria as Phases 3–4. Nothing has been deployed or pushed.

## Changes, by issue ID
| ID | Change | Files |
|---|---|---|
| CT-01 | Email `shreyashojha93@gmail.com` (taken from the candidate's own CV) shown on the first screen, in the footer and at the end of every case | `content.json`, `HomePage`, `PageShell`, `CaseStudyPage` |
| RO-01 | First-screen line under the CTAs: "Seeking: Fashion operations · Merchandising & analytics · AI evaluation", then "Based in India · Open to roles in India, Europe, Japan and remote". The location and regions are user-stated; the role list is the audit's recommendation, so please confirm. | `Lead`, `HomePage`, `content.json` |
| CA-01 | Cartier is labelled as concept everywhere it appears: the hero captions, the overview evidence line ("Speculative concept · not client work"), and the proof line. The vague "Impact" tiles became "What it delivered", with the deliverables the Rogue and Maybach pages show. | `Lead`, `content.json`, `CaseStudyPage` |
| SR-01 | Dr. Panghal: the dead `node/1098` link is replaced with two working official NIFT pages (patents list; i-SMART award), both 200. Prof. Bawa: the dead NIFT PDF is removed, and no working official replacement was found. | `endorsers.ts` |
| OC-01 | The vague merch-2 proof is replaced with the figures already published on its case and About pages (6–7 repeat clients, $7K–8K peak-day sales, marked "as reported"). Unrendered legacy impact lines are aligned with the dossiers. | `content.json` |
| B3-01 | brand-3 title is now "E-Com UX Benchmark: Myntra vs. Urbanic (10 UX Laws)", matching the source report (8 pp., "Comparative Heuristic Evaluation Across 10 UX Laws"). Prof. Bawa's letter says "12 parameters"; her paraphrase is left as she wrote it. | `content.json` |
| SM-01 | Every case opens with an In-brief block: My role · When · Evidence status. Status wording comes from each dossier's own "how measured" notes. | `dossiers.ts`, `CaseStudyPage` |
| NV-01 / AI-01 | "Hiring for…" role paths under the hero. Each carries one proof line already on the site. The AI path deep-links to the evaluation fellowship entry on About (`/about#ai-evaluation`), and INZEX is now also listed under Merchandising. The partner lab is not named. | `HomePage`, `WorkPage`, `AboutPage`, `types.ts` |
| CV-02 | A contact band (email + Résumé) before "More work" on every case | `CaseStudyPage` |
| PF-01 | Vite's preload helper moved out of the `drei` chunk, so three.js / r3f / drei are no longer modulepreloaded on every page. Fixed in `vite.config.js`, which Vite loads ahead of `.ts`, and kept in sync in `.ts`. | `vite.config.*` |
| PF-02 | `content.json` is preloaded from the HTML | `index.html` |
| A11-01 | Red token `#ca4340` → `#bd3a37` (cream on red 4.15 → 4.76:1; red on paper 4.35 → 4.99:1); merch plate notes at full opacity | `site.css` |
| A11-02 | Brand link label now contains its visible text | `SiteHeader` |
| SY-01 | Invisible state names on `/system` fixed | `site.css` |
| KB-01 | Desk: one tab stop per destination (28 → 13). Duplicate pictures stay clickable. | `Desk.tsx` |
| MO-01 | Curtain 0.55 s / 0.32 s → 0.26 s / 0.12 s | `PageShell` |
| — | Pre-existing type error that made `tsc -b` (and therefore `npm run build`) fail is fixed; that branch could never run for dossier projects | `CaseStudyPage` |

## Verification (same tools as Phase 3)
| Check | Before | After |
|---|---|---|
| axe (18 routes × desktop + mobile) | 73 contrast nodes | **0** |
| Lighthouse mobile, Home: Perf / A11y | 72 / 100 | **77 / 100** |
| Home FCP / LCP | 3.6 s / 5.5 s | **2.1 s / 3.9 s** |
| Home transfer | 1,557 KiB | **1,313 KiB** |
| ops-1: Perf / A11y / LCP | 77 / 96 / 4.1 s | **92 / 99 / 2.7 s** |
| About: Perf / A11y / LCP | 74 / 96 / 4.8 s | **90 / 100 / 3.1 s** |
| Pages with a `mailto:` link | 0 / 72 runs | **72 / 72** |
| Horizontal overflow (18 routes × 4 widths, plus 600 / 900 / 1180) | 0 | 0 |
| Interaction suites (`interact` 41, `navflow` 17, mid-width, lightbox) | all pass | all pass |
| Fix checks (`fixcheck.cjs`: status above the fold, AI deep link, merch filter, Cartier label, brand-3 title, contact band, NIFT links) | — | 9/9 pass |
| Desk keyboard stops | ~28 | 13 |
| Curtain coverage over 50% on route change | ~450 ms | ~350 ms (still above the 250 ms target) |

## Rescored (same criteria as `03-audit.md`)
| # | Evaluation | Weight | Before | After | What moved |
|---|---|---|---|---|---|
| 1 | First impressions | 10 | 5 | 8 | Role sought + contact + location on the first screen; LCP ≤ 4 s. Cartier still the largest image. |
| 2 | Visual aesthetics | 3 | 8 | 9 | Contrast fixed without changing the look |
| 3 | Layout and hierarchy | 4 | 7 | 8 | In-brief block; Cartier template still differs |
| 4 | Navigation and IA | 8 | 6 | 9 | Role paths (home only), useful Contact, dead links fixed |
| 5 | UX and interaction | 3 | 8 | 9 | Tab stops halved; curtain still ~350 ms |
| 6 | Content and storytelling | 8 | 6 | 8 | Specific claims, status everywhere; no flagship marking yet |
| 7 | Projects and evidence | 12 | 6.9 | 8.4 | ops-1 / ops-3 10; ops-2, Genesis, Off-White 9; merch-1, merch-2, brand-3 8; INZEX 7; Cartier 6 (role and dates unknown) |
| 8 | Recruiter relevance | 10 | 5 | 7 | Location and roles stated; AI evidence surfaced; still no AI or merchandising artefacts |
| 9 | Positioning and credibility | 12 | 5 | 7 | Sources and labels fixed; **CV still inconsistent (0/2)** |
| 10 | Conversion | 12 | 5 | 10 | Email, availability, end-of-case prompt |
| 11 | Responsive, a11y, performance | 6 | 6 | 8 | axe clean; Home Perf 77 / LCP 3.9 s still mid-band |
| 12 | Competitive benchmark | 2 | 6 | 9 | Matches the reference on status line and contact |
| 13 | Journeys (P1–P6) | 10 | 6.0 | 8.8 | P4 10; P1, P2, P3, P5 9; P6 7 (CV mismatch) |
| | **Weighted** | 100 | **5.83** | **8.31** | |
| 14 | Overall (unweighted) | — | 4 | 7 | "Survives a verification visit" stays 0 until the CV is replaced |

With a CV that matches the site, evaluation 9 would score 9 and the journeys 9.5, putting the weighted total at about **8.6**. These figures are computed with the same criteria, not measured.

## Still open
- **CV-01 (user).** The linked Drive CV still says CGPA 8.4, gives a different Bloomingdale's title and start date, a different Handshake title, the A Space, In Between dates and place, and a US phone. Replace the file, or send the current one and I'll update the link.
- **Cartier role, dates and context (user).** I left these blank rather than guessing.
- **Role list in "Seeking" (user to confirm)**, and whether to show email publicly on the site (it is already on the public CV).
- **Prof. Bawa.** "Coordinates continuing-education programmes" no longer has a working official link, because the NIFT PDF is gone. Search snippets of the 2019 and 2025–26 programme documents name her, but both now return 404. ResearchGate is bot-blocked, so it is unverified.
- **Not done (P2 / user assets):**
  - flagship marking
  - shorter About / Credentials
  - more images for thin projects (IM-01)
  - curtain to ≤ 250 ms
  - `image-redundant-alt` on ops-1
  - Home Perf (the remaining cost is mostly images and framer-motion)
- **Corrections to the Phase 3–4 notes:**
  - `/system` is linked from the footer ("Design system"), not only reachable by URL.
  - Of the vague outcome lines in OC-01, only merch-2's proof and Cartier's impact were rendered on pages. The INZEX and Off-White lines were unrendered legacy data, so they didn't affect the baseline score.

---

## Round 2: aligning the site with the October 2026 CV

**Inputs.** The user supplied the current CV (`Shreyash_Ojha.pdf`, created 29 Oct 2026) and answered two questions: the Welspun work was a proposal only, and the site headline should match the CV.

### Changes
| ID | Change | Source |
|---|---|---|
| CV-01 | The CV now lives at `public/Shreyash_Ojha_CV.pdf`. Every Résumé link points to it, replacing the outdated Drive file. It contains a phone number. | User's CV |
| CV-03 | **Welspun reframed as a proposal.** Was "300 kg/day eliminated, measured by the floor team"; now "~300 kg/day reduction potential", across the hero, the case, About and the content data. It is removed from "Measured, not claimed" and replaced there by "96% review consistency" (AI evaluation). | CV ("reduction potential"); the 86-page internship report describes a proposition; user confirmed |
| CV-04 | INZEX internship dates: Jun–Jul 2022 → **Jun–Jul 2023** | CV; INZEX report gives a "2023 to 2024" timeline (the old CV said 2022) |
| CV-05 | Bharat Tex presentation: 2024 → **2025** | Both the old and the new CV. The presentation file is a video with no readable date. |
| CV-06 | Handshake: "Sep 2025 – present" → **Sep 2025 – Sep 2026**; About copy now says "taught AI models" | CV |
| CV-07 | Location: **Mumbai, India · open to global relocation** | CV (replaces the earlier "India, Europe, Japan and remote") |
| PO-01 | Headline / title / meta: "Fashion Operations & Applied AI" → **"Fashion Retail Strategy · Consumer Research · Apparel Value Chain"** | CV headline; user confirmed |
| RO-02 | "Seeking" roles, chosen from current listings (details below): **Retail strategy & consumer insights · Merchandising & planning · Apparel operations**. AI evaluation stays as a role path, not a headline. Role paths go from 4 to 5. | Research below |
| CA-02 | Cartier role: **visual moodboarding, ideation and feasibility checks** | User |
| A11-03 | Chapter-rail targets enlarged to 24px (WCAG 2.5.8). This failure existed at baseline but the Phase 3 scan missed it, because the rail only appears after scrolling. | axe `target-size` |

### Research behind the "Seeking" roles (October 2026)
- **Merchandising and planning, Mumbai.** There are many listings, and their requirements split two ways:
  - Production merchandising (Fynd, KNYA) asks for 3–8 years of factory order management.
  - Retail merchandising (Metro Brands, 1–4 years) asks for Excel, MIS, replenishment and allocation, which matches his INZEX dashboard work.
- **Consumer and fashion insights.** The fit is good for his experience level:
  - Aramya, Consumer Insights Specialist: 1–3 years.
  - GlobalData, Fashion Insights Consultant (London): 1–2+ years, with flexibility for high-potential candidates.
  - Primark, Insight Analyst: 2–4 years.
  - H&M's Commercial Business Analyst role combines merchandising and consumer insight.
- **AI evaluation.** The work exists, but it is mostly contract and often limited to US applicants (OpenTrain, Alignerr). Mercor's consumer and lifestyle network is open worldwide. So it is worth showing as evidence, not as the headline goal.
- **Limitation.** Indeed returned thin results for "strategy" and "insights" titles in Mumbai, so web listings filled the gap. This is a snapshot of current listings, not a market study.

### Verification
- Regression suites: `interact` 41/41, `navflow` 17/17, `fixcheck` 9/9.
- Every Résumé link returns the PDF (200, `application/pdf`).
- axe: 0 violations on home, About, ops-3, Cartier and Credentials, at 1440 and 390 px, after the rail fix.
- No horizontal overflow on any route.
- Hero checked at 1440, 1024 and 390 px; the longer headline no longer runs under the prints.

### Rescored (same criteria)
**Correction.** Round 1 scored evaluation 8 as 7, but its criteria add up to 8. With that fixed, the round-1 total is **8.41**, not 8.31.

| # | Changed in round 2 | Before | After |
|---|---|---|---|
| 7 | Projects: Cartier 4 → 9 (role + status); ops-3 10 → 9 (outcome is a potential) | 8.4 | 8.6 |
| 9 | CV consistent with the site: 0 → 2 | 7 | 9 |
| 13 | P1 and P6 no longer meet a CV contradiction | 8.8 | 9.5 |
| 14 | Survives a verification visit: 0 → 2 | 7 | 9 |
| | **Weighted** | 8.41 | **8.74** |

### Still open
- **LinkedIn handle.** The CV prints `linkedin.com/in/shreyash-ojha`, but the site links `…/shreyash-ojha-3ba93b332`. LinkedIn blocks automated checks, so I couldn't verify which is current. The site link is unchanged.
- **Cartier.** Dates and context (course or self-initiated) are still not stated.
- **Not on the site.** The CV lists two projects the site doesn't have: Trend Spike Radar and the Daydream AI film. No materials were supplied for them.
