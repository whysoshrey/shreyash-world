# 04 · Synthesis, issue register and roadmap (Phase 5)

## Research summary
- **Recruiters screen fast, then verify.** First screens are very short and title-led [R1]. Many reviewers open a portfolio only to confirm or reject a CV [R7]. So the site must (a) state role fit at a glance and (b) survive a cross-check against the CV.
- **Structure.** Summary first, with depth available [R2, R4]. Role and contribution stated explicitly [R3]. Content audited: no broken links [R3].
- **What the JDs ask for.**
  - Merchandising and buying: Excel, dashboards, sales-to-action.
  - Operations consulting: floor IE and measured results.
  - AI evaluation: prior rubric-based evaluation.
  - Brand: campaign, KPI and channel literacy.
- **Location and eligibility.** Evidence is mixed. State location, regions and remote availability; leave visa detail out [R8].

## Comprehensive audit, baseline scores
Criteria are defined in `03-audit.md`. Weights follow the Recruiter Evaluation Matrix (01 §1.3): items rated H for most personas weigh most.

| # | Evaluation | Weight | Score | Weighted |
|---|---|---|---|---|
| 1 | First impressions | 10 | 5 | 0.50 |
| 2 | Visual aesthetics | 3 | 8 | 0.24 |
| 3 | Layout and hierarchy | 4 | 7 | 0.28 |
| 4 | Navigation and IA | 8 | 6 | 0.48 |
| 5 | UX and interaction | 3 | 8 | 0.24 |
| 6 | Content and storytelling | 8 | 6 | 0.48 |
| 7 | Projects and evidence | 12 | 6.9 | 0.83 |
| 8 | Recruiter relevance | 10 | 5 | 0.50 |
| 9 | Positioning and credibility | 12 | 5 | 0.60 |
| 10 | Conversion | 12 | 5 | 0.60 |
| 11 | Responsive, a11y, performance | 6 | 6 | 0.36 |
| 12 | Competitive benchmark | 2 | 6 | 0.12 |
| 13 | Simulated journeys | 10 | 6.0 | 0.60 |
| | **Weighted baseline** | **100** | | **5.83 / 10** |
| 14 | Overall strategic effectiveness (unweighted summary) | — | 4 | — |

## Cross-domain findings (root causes)
- **RC1 · Organised around the maker, not the reviewer.**
  - Domain filters, not job families.
  - Discipline stated, but not the role sought.
  - AI evidence buried in About; Cartier imagery leads.
  - Drives evaluations 1, 4, 6, 8, 13 and 14.
- **RC2 · No single source of truth for facts.**
  - The linked CV, the legacy `content.json` exhibit copy (vague outcomes, "12 Parameters") and the newer dossiers disagree.
  - Drives evaluations 7, 9 and 13.
- **RC3 · Conversion basics missing.**
  - No email, no availability line, no contact prompt after the evidence.
  - Drives evaluations 1, 10 and 14.
- **RC4 · The decorative layer has costs.**
  - Cream-on-red contrast.
  - A 450 ms curtain.
  - three.js preloaded globally.
  - About 28 desk tab stops.
  - Drives evaluations 2, 5 and 11.

## Prioritised issue register
**Severity scale:** C = critical, H = high, M = medium, L = low.

**Complexity scale:** S = small, M = medium, L = large.

**Status values:**
- **Fix** — I can do it from verified repo or source facts.
- **User** — needs the user's input.
- **Verify** — needs a source check before any change.

| ID | Page | Issue | Evidence | Recruiter impact | Sev | Solution | Cx | Status |
|---|---|---|---|---|---|---|---|---|
| CV-01 | Global | Linked CV contradicts the site: CGPA, titles, dates and places, US phone | 02 O2 | Reject trigger for P6 and P1 | C | User supplies the current CV; then update `site.links` | S | **User** |
| CT-01 | Global | No email anywhere | 02 O1 | P1 drops off; no direct contact | C | Email in header Contact, footer, case ends. Address must come from a verified source (CV or user) | S | Verify |
| RO-01 | Home | Role sought, location, regions and availability not stated | 02 O4 | P1 and P6 can't judge fit | H | Status line under the tagline: user-stated "Based in India · open to roles in India, Europe, Japan and remote" | S | Fix |
| CA-01 | Home, Cartier | Concept work not labelled as concept on home or overview; vague impact; no role or dates | 03 §7, page text | Overclaim risk on the most visible project | H | "Concept" labels (the Rogue page already says "speculative"); replace the impact line with deliverables; role and dates once supplied | S | Fix + **User** (role and dates) |
| SR-01 | Credentials | 2 dead or wrong source links (NIFT PDF 404; node/1098 unrelated) | 02 O3 | Fails verification | H | Find working official pages; otherwise unlink and keep the citation text | S | Verify |
| OC-01 | merch-2, Cartier, INZEX, Off-White, brand-3 cards | Outcome lines without measures ("improved clienteling consistency"…) | 03 §6 | Weak evidence for P3 and P6 | H | Replace with factual scope lines taken from the dossiers; no new numbers | S | Fix |
| B3-01 | brand-3 | Title "12 Parameters" vs page "Ten UX laws"; 63-character title | 03 §7 | Inconsistency | M | Check against the Drive report, then align the title | S | Verify |
| AI-01 | Home, About | AI evaluation evidence exists only in About bullets | 03 §8 | P5 can't shortlist | H | A visible "AI evaluation" block from existing About facts, without naming the partner lab | M | Fix |
| NV-01 | Home, Work | No role-based paths; INZEX not reachable from the merch filter | 03 §4 | P3 and P5 miss evidence | H | "Looking for…" role-path strip; tag INZEX for merch as well | M | Fix |
| SM-01 | Case studies | No problem → role → result summary; status not uniform | 03 §3, §6 | 30-second read impossible | H | "In brief" block + evidence-status label per case, from dossier fields | M | Fix |
| PF-01 | Global | three.js, r3f and drei modulepreloaded everywhere (178 KB gzip) | 02 O6 | Slow on phones | H | Fix chunking so the entry doesn't import from `drei` | S | Fix |
| A11-01 | Global | Cream-on-red and small red text below AA (73 nodes) | 02 O8 | A11y; legibility | M | Darker red token for text-bearing fills; small-text adjustments | S | Fix |
| A11-02 | Header | Brand link aria-label ≠ visible text | 02 O9 | A11y | L | Label begins with the visible text | S | Fix |
| CV-02 | Case ends | No contact prompt after the evidence | 03 §10 | Lost momentum | M | End-of-case contact line (email + CV) | S | Fix (after CT-01) |
| MO-01 | Global | Route curtain ~450 ms | 02 O11 | Perceived slowness | M | ≤ 250 ms, non-blocking | S | Fix |
| KB-01 | Home | ~28 desk tab stops | 02 O10 | Keyboard friction | L | Remove decorative duplicates from the tab order | S | Fix |
| PF-02 | Global | Content gated on the `content.json` fetch; render-blocking CSS | 02 O7 | LCP | M | Preload `content.json` | S | Fix |
| SY-01 | /system | Internal page public; code text contrast 1.04 | 02 O12 | Low (not linked) | L | Fix contrast; `noindex` | S | Fix |
| LN-01 | About, Credentials | 690–850 words | 02 O12 | Skim fatigue | L | Defer; summary blocks address scanning | M | Deferred |
| IM-01 | INZEX, merch-1, brand-3 | 1–2 images | 03 §7 | Projects look thin | L | Needs real artefacts from the user's Drive | M | **User** |

## Roadmap
**P0 · credibility and conversion** (can be done now)
- CT-01 (after verifying the address)
- RO-01
- CA-01 (labels)
- SR-01
- OC-01
- B3-01
- CV-01 is flagged to the user and blocked on their CV.

**P1 · relevance and performance**
- SM-01
- AI-01
- NV-01
- PF-01
- A11-01, A11-02
- CV-02 (depends on CT-01)
- PF-02

**P2 · polish**
- MO-01
- KB-01
- SY-01
- Deferred: LN-01, IM-01

**Dependencies**
- CV-02 needs CT-01.
- NV-01 links to anchors created by AI-01 and SM-01.
- CV-01, IM-01 and the Cartier role and dates are blocked on the user.

## Hard-gate checklist (before Phase 6)
- [x] Research and framework: `01-research.md`
- [x] Live inspection, no edits: `02-inspection.md`
- [x] 14 evaluations with explicit criteria: `03-audit.md`
- [x] Synthesis, register, scorecard and roadmap: this file
- [x] Site source unchanged since baseline `65e1bfe` (only `docs/` is untracked)
