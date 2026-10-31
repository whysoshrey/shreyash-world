# 03 · Critical evaluation (Phase 4)

Baseline: commit `65e1bfe`.

**Evidence labels**
- **[O]** observed in `02-inspection.md` or in page text captured with Playwright
- **[R] / [JD]** research in `01-research.md`
- **[S]** simulated reviewer reaction from the composite personas P1–P6 (not real people)
- **[Rec]** recommendation

**Scoring.** Every evaluation scores 5 explicit criteria at 0, 1 or 2 points, giving a total out of 10. The same criteria are reused in Phase 7.

---

## 1 · First impressions
**Assessment.** On first load you see a confident, premium identity: name, discipline, tagline and two CTAs within 0.6 s locally. What you don't see is *what job he wants, where, and how to reach him*.

**Recruiter perspective [S].**
- P1: "Striking. Operations *and* AI *and* Cartier? Which role is this?"
- P6 notices the Cartier imagery first, before the factory results.

**Evidence [O].**
- The fold (1440 and 390) shows "Fashion Operations & Applied AI", the name, the tagline and View work / Résumé.
- The collage shows Cartier × Maybach, Cartier Rogue, the WIP robot and the 300 kg card.
- Not shown: location, target roles, availability, email.
- Mobile LCP is 5.5 s.

**Strengths.** Distinctive and polished. The name is legible at every width. One quantified proof (300 kg) is above the fold.

**Weaknesses.**
- The discipline is shown, but not the role sought.
- The two largest images are concept work, labelled only "film still" and "key art".
- No location or availability.

**Severity:** High.

| Criterion | Pts |
|---|---|
| Name and discipline above the fold | 2 |
| Role(s) sought stated | 1 |
| Strongest *verified* proof dominates the fold | 1 |
| Contact route, location and availability above the fold | 1 (Résumé only) |
| Renders fast on mobile (LCP ≤ 2.5 s = 2, ≤ 4 s = 1) | 0 |
| **Score** | **5/10** |

**Recommended [Rec].**
- Add a one-line role statement plus location and availability under the tagline (user-stated: based in India; open to India, Europe, Japan, remote).
- Lead the collage with the verified factory results; label the Cartier work "Concept".
- Fix LCP (see 11).

**Expected impact.** P1 and P6 can tell role fit in under 10 s; fewer misreads of the Cartier work as client work.

## 2 · Visual aesthetics
**Assessment.** A coherent, editorial system: Instrument Serif and Inter Tight, a blue/red/cream palette, paper textures. It feels premium and fashion-literate.

**Recruiter perspective [S].** P2: "This person has taste." The palette is a differentiator for P1 too. P3 and P4 are neutral.

**Evidence [O].**
- One type pairing and tokenised colours across 18 routes.
- Every axe violation is colour contrast (cream on red, 4.14:1).
- Image density varies: Cartier has 14 images; INZEX and merch-1 have 1 each.

**Strengths.** Strong identity; restraint; consistent tokens.

**Weaknesses.**
- Cream-on-red text fails AA at small sizes.
- Uneven imagery makes some projects look thin.

**Severity:** Medium.

| Criterion | Pts |
|---|---|
| Coherent system | 2 |
| Typographic quality | 2 |
| Imagery quality and consistency | 1 |
| Premium restraint | 2 |
| Distinctiveness without hurting legibility | 1 |
| **Score** | **8/10** |

**Recommended.**
- Darken the red used behind small cream text, or raise small-text weight and size, so text reaches ≥ 4.5:1.
- Give thin projects one strong artefact image each, from existing sources only.

**Expected impact.** AA compliance; projects look evenly weighted.

## 3 · Layout and hierarchy
**Assessment.** Pages have a clear primary element, and the dossier template is consistent. Long pages put the recruiter summary below the glance and situation sections.

**Recruiter perspective [S].** P6 wants problem, role and result in five lines. Today he has to read the "At a glance" table and then three sections.

**Evidence [O].**
- The ops-1 mobile fold shows title, client, 22% and the claim; role and dates come after the section nav.
- Words: About 850, ops-1 752, Credentials 691.
- The Cartier overview uses a different template (Brief / Approach / Impact) with no glance block.

**Strengths.** Metric-first heroes; section nav; no overflow at any width.

**Weaknesses.**
- No problem → role → result summary block.
- The Cartier overview breaks the template.
- About and Credentials are long.

**Severity:** Medium.

| Criterion | Pts |
|---|---|
| Clear primary element per page | 2 |
| Summary before depth | 1 |
| Appropriate density and length | 1 |
| Consistent templates | 1 |
| Mobile hierarchy | 2 |
| **Score** | **7/10** |

**Recommended.**
- Add a five-line "In brief" block at the top of each case: problem / my role / what I did / result / status.
- Give the Cartier overview a glance block.

**Expected impact.** Each case is readable in 30 s (research R2 and R4).

## 4 · Navigation and information architecture
**Assessment.** Wayfinding is strong: Back, breadcrumbs, chapters and filters. But the information architecture follows the candidate's taxonomy (ops / merch / brand), not the reviewer's job families.

**Recruiter perspective [S].**
- P5 can't find an "AI" path.
- P3 never finds the INZEX dashboards: they are filed under Operational Systems, not Merchandising.
- P1 clicks "Contact" and gets no email.

**Evidence [O].**
- Navigation: Work / Credentials / About / Contact. Contact scrolls to the footer (Résumé, LinkedIn, GitHub).
- 4 domain filters; INZEX sits under `ops`.
- `/system` is reachable by URL.
- 2 dead source links.

**Strengths.** Shallow navigation; Back and breadcrumbs; filter state kept in the URL; working 404 page.

**Weaknesses.**
- No paths by role.
- AI evidence lives only inside About.
- Contact is a dead end.

**Severity:** High.

| Criterion | Pts |
|---|---|
| Shallow, clear top level | 2 |
| Wayfinding | 2 |
| Role-based paths | 0 |
| Contact reachable and useful | 1 |
| No dead ends or broken links | 1 |
| **Score** | **6/10** |

**Recommended.**
- Add a "Looking for…" strip of role paths (Operations & industry 4.0 / Merchandising & analytics / AI evaluation / Brand) linking to the filtered work or anchors.
- Also tag INZEX for merchandising.
- Make Contact show the email.

**Expected impact.** Each persona reaches relevant proof in 1–2 clicks.

## 5 · UX and interaction
**Assessment.** Interactions work and are accessible. The only friction is the route curtain and the desk's many tab stops.

**Recruiter perspective [S].** Mostly invisible to reviewers, which is good. Keyboard users and fast clickers feel the 450 ms curtain on every navigation.

**Evidence [O].**
- The menu, filters, lightboxes (focus in and out), video, chapters and Back pass at 390–1440 px.
- 82 hover rules.
- The curtain covers more than 50% of the viewport for about 450 ms.
- The home page has about 28 desk tab stops.

**Strengths.** Reliable; correct dialog behaviour; reduced motion respected.

**Weaknesses.** The curtain delays content; the tab-stop load.

**Severity:** Low–Medium.

| Criterion | Pts |
|---|---|
| All interactions work | 2 |
| Keyboard efficiency | 1 |
| Hover and feedback | 2 |
| Motion never holds content back | 1 |
| Dialog accessibility | 2 |
| **Score** | **8/10** |

**Recommended.**
- Shorten the curtain to ≤ 250 ms or make it a non-blocking fade.
- Make the desk a single tab stop with roving or arrow-key focus, or reduce it to linked figures.

**Expected impact.** Faster perceived navigation; WCAG 2.4.1 / 2.1.1 comfort.

## 6 · Content and storytelling
**Assessment.** The through-line is good: "I work where those three meet, and I measure what changes." Curation and claim discipline are uneven.

**Recruiter perspective [S].**
- P6: the factory work tells the story; Cartier distracts.
- P3: "improved clienteling consistency" is not evidence.

**Evidence [O].**
- Some outcome lines carry no measure:
  - "improved clienteling consistency" (merch-2)
  - "Clearer strategic direction for GTM execution" (Cartier)
  - "documented in the linked folder" (INZEX, Off-White)
- ops-1 to ops-3 have "Limits" sections; merch-1, merch-2, brand-1, Off-White and Cartier don't.

**Strengths.** Honest "Limits" sections; sourced numbers; a clear authorial voice.

**Weaknesses.**
- Vague outcomes.
- Flagships are not singled out.
- Evidence status (measured / reported / concept) is not uniform.

**Severity:** High.

| Criterion | Pts |
|---|---|
| Clear through-line | 2 |
| Curation (flagships first) | 1 |
| Concision | 1 |
| Specific claims | 1 |
| Evidence status explicit everywhere | 1 |
| **Score** | **6/10** |

**Recommended.**
- Mark 3–4 flagships (ops-1, ops-3, ops-2, Genesis).
- Add an evidence-status label to every case (Measured / Reported / Coursework / Concept).
- Rewrite vague outcomes into factual descriptions of the work, without inventing numbers.

**Expected impact.** Survives a "verify or reject" visit (R7).

## 7 · Projects and evidence (each project)
Criteria, each scored 0–2:
- **R** individual role clear
- **O** outcome specific and sourced
- **A** artefacts (images, video, documents)
- **S** summary-first
- **H** honest status and limits

Facts are [O] from page text.

| Project | R | O | A | S | H | /10 | Key note |
|---|---|---|---|---|---|---|---|
| ops-1 WIP robot | 2 | 2 | 2 | 1 | 2 | **9** | Co-authorship stated; floor-team measurement; video, 3D, sources, limits. Flagship. |
| ops-3 Welspun waste | 2 | 2 | 2 | 1 | 2 | **9** | 300 kg/day; implementation by the floor team stated. Flagship. |
| ops-2 IoT tracker | 2 | 2 | 1 | 1 | 2 | **8** | "Part of a 25% output gain": honest attribution. Only 2 images. |
| brand-1 Genesis 2.2 | 2 | 2 | 2 | 1 | 1 | **8** | Real execution (30 s sellout, 150+). No limits; the date is vague. |
| Off-White HUMAN | 2 | 1 | 2 | 1 | 2 | **8** | Clearly labelled speculative. The outcome is "cited by instructor". |
| INZEX dashboards | 2 | 0 | 1 | 1 | 2 | **6** | No outcome; 1 image. Filed under ops, though merch reviewers need it most. |
| merch-1 Nava | 2 | 1 | 1 | 1 | 1 | **6** | 80-person survey and ANOVA; no result; 1 image; no limits. |
| brand-3 UX benchmark | 2 | 1 | 1 | 1 | 1 | **6** | Title says "12 Parameters" but the page says "Ten UX laws" (inconsistent). 63-character title. |
| merch-2 Bloomingdale's | 2 | 0 | 1 | 1 | 1 | **5** | Clear role and dates; no measurable outcome; no sources. |
| Cartier GTM | 0 | 0 | 2 | 1 | 1 | **4** | The overview has no role or dates. "Speculative" is stated only in the Rogue chapter. Vague impact. The site's most prominent imagery. |
| **Mean** | | | | | | **6.9** | |

**Assessment.** Operations evidence is excellent. Merchandising and Cartier evidence is thin.

**Recruiter perspective [S].** P4 shortlists on ops-1 and ops-3. P2 and P3 find their categories weakest.

**Severity:** High (Cartier and merch-2); Medium (the others).

**Recommended.**
- Cartier: add a glance block and a "Concept" label, using the Rogue page's own word "speculative". Replace the impact line with what was delivered.
  - **User input needed:** role, dates and context (course or self-initiated). The repo does not document them, and I haven't verified them.
- brand-3: fix the 12/10 mismatch, using the source documents to decide.
- merch-2 and INZEX: add a status line and replace vague outcomes with the scope of work.
- Add "In brief" to all.

**Expected impact.** Raises the floor; removes the credibility risk on the most-viewed project.

**Score: 6.9/10**

## 8 · Recruiter-specific relevance
**Assessment.** The site serves P4 (operations) well and P2 partly. It under-serves P3 (merchandising analytics), P5 (AI evaluation) and P1 (eligibility).

**Recruiter perspective [S].**
- P5: "Applied AI in the title, but where's the evaluation work?" The 35+ taxonomies and 96% consistency are only in About bullets.
- P1 can't see the regions he's open to.

**Evidence [O] / [JD].**
- JDs ask for Excel and dashboards (LVMH, H&M), prior rubric-based evaluation (Mercor, Weekday), and floor IE (Coats, STITCH).
- The site has no AI case or section and no regions or availability.

**Strengths.** Strong IE / industry 4.0 match; the dashboards exist.

**Weaknesses.**
- The AI evidence is buried.
- No merchandising analytics story.
- No eligibility or location.

**Severity:** High.

| Criterion | Pts |
|---|---|
| JD vocabulary reflected | 1 |
| Ops / IE evidence (P4) | 2 |
| Merchandising analytics evidence (P3) | 1 |
| AI evaluation evidence (P5) | 1 |
| Location, regions, availability (P1) | 0 |
| **Score** | **5/10** |

**Recommended.**
- Add an AI evaluation section from the existing About facts, without naming the lab (Handshake guidance).
- Add the role paths (see 4).
- Add a location and availability line.

**Expected impact.** P5 and P1 can shortlist.

## 9 · Positioning and credibility
**Assessment.** Third-party validation is strong. Credibility is undermined by a linked CV that contradicts the site, two dead sources, and concept work that could be read as client work.

**Recruiter perspective [S].** P6 opens the CV and sees "CGPA 8.4" (site: 8.5) and different job titles. That matches the reject trigger "a claim that doesn't add up".

**Evidence [O].**
- CV mismatches: CGPA, two titles, two date and place pairs, a US phone.
- NIFT source PDF returns 404; node/1098 points to unrelated content.
- Home captions read "Cartier × Maybach, film still" with no "concept" label.

**Strengths.** Letters, awards, the Parsons feature, Drive sources (16/16 working).

**Weaknesses.** CV inconsistency (Critical); dead sources; ambiguous Cartier status.

**Severity:** Critical.

| Criterion | Pts |
|---|---|
| Positioning statement supported by evidence | 1 |
| CV consistent with the site | 0 |
| Third-party validation | 2 |
| Sources resolve | 1 |
| No implied overclaim | 1 |
| **Score** | **5/10** |

**Recommended.**
- **User input needed:** replace the linked CV with the current one. I cannot generate it.
- Fix or replace the two source links with working pages, if they exist.
- Add "Concept" labels.

**Expected impact.** Removes the main reject trigger.

## 10 · Conversion
**Assessment.** A reviewer who is convinced has no direct way to write.

**Recruiter perspective [S].** P1: "No email. I'll move on, or look on LinkedIn."

**Evidence [O].**
- 0 `mailto:` links.
- Résumé is one click from the header, hero and footer.
- LinkedIn is in the footer.
- Case studies end with "More work", not a contact prompt.

**Strengths.** The CV and LinkedIn are easy to reach.

**Weaknesses.** No email; no availability or next-step line.

**Severity:** Critical.

| Criterion | Pts |
|---|---|
| Email / direct contact | 0 |
| CV in one click | 2 |
| LinkedIn | 2 |
| Contact prompt after evidence | 1 |
| Availability / next step stated | 0 |
| **Score** | **5/10** |

**Recommended.**
- Show the email (user's address) in the header Contact, the footer and the end of each case.
- Add an availability line.

**Expected impact.** Shortlisted reviewers can contact him directly.

## 11 · Responsive, accessibility and performance
**Assessment.** Layout and keyboard access are solid. Contrast and mobile performance are below standard.

**Recruiter perspective [S].** A reviewer on a phone (R4) waits about 5.5 s for the main content on a slow connection.

**Evidence [O].**
- No overflow at 7 widths.
- axe: contrast only (73 nodes).
- Lighthouse mobile: Perf 72 / 77 / 74; LCP 5.5 / 4.1 / 4.8 s.
- three.js (178 KB gzip) is preloaded on every page.
- Render-blocking CSS costs about 600 ms; there is a label-in-name mismatch.

**Strengths.** Responsive; keyboard and focus; dialogs; reduced motion.

**Weaknesses.** Contrast; unused JavaScript; content waits on the `content.json` fetch.

**Severity:** High.

| Criterion | Pts |
|---|---|
| No overflow at any width | 2 |
| axe clean (0 = many, 1 = contrast only, 2 = none) | 1 |
| Keyboard and focus | 2 |
| Lighthouse mobile Perf (≥ 90 = 2, 70–89 = 1) | 1 |
| Home LCP (≤ 2.5 s = 2, ≤ 4 s = 1) | 0 |
| **Score** | **6/10** |

**Recommended.**
- Stop the three.js preload: move the helper out of the `drei` chunk or drop the manual chunks for three.
- Fix the contrast tokens.
- Fix the brand link aria-label.
- Optionally inline or preload `content.json`.

**Expected impact.** Lower transfer and LCP; axe clean.

## 12 · Competitive benchmarking
**Assessment.** Compared against the reference site (rishabhsalian.com/about) and the documented norms (R2–R7). The limitation in 01 still applies: there was no peer fashion-operations site to compare with.

**Evidence [R] / [O].** The reference shows a status line with location and availability, dated roles linked to case studies, and a CV download. This site has deeper case evidence and stronger visual craft, but no status line or email.

**Strengths vs. peers.** Case depth with sources and limits; a premium visual identity.

**Weaknesses vs. peers.** First-screen status; contact; curation by role.

**Severity:** Medium.

| Criterion | Pts |
|---|---|
| First-screen clarity vs. peers | 1 |
| Case depth vs. peers | 2 |
| Visual craft vs. peers | 2 |
| Contact and conversion vs. peers | 0 |
| Curation vs. peers | 1 |
| **Score** | **6/10** |

**Recommended.** Adopt the reference's status line and dated-role links; keep this site's depth.

**Expected impact.** Matches peers on basics and exceeds them on evidence.

## 13 · Simulated recruiter journeys [S]
Paths were walked on the baseline. Reactions are simulated from the persona definitions.

Criteria per journey, each scored 0–2: role fit visible · relevant evidence found · contact found · credibility intact · no blocker.

| Persona | Path walked | Outcome [S] | Fit | Evid | Contact | Cred | Block | /10 |
|---|---|---|---|---|---|---|---|---|
| P1 Fashion TA | Home → Credentials → Résumé (Drive) | Maybe: no regions; CV contradicts the site; no email | 1 | 2 | 1 | 1 | 1 | 6 |
| P2 Brand | Work → Brand filter → Cartier → Off-White → Genesis | Maybe: Genesis convinces; Cartier overview vague | 1 | 1 | 1 | 1 | 2 | 6 |
| P3 Merch | Work → Merch filter → Nava → Bloomingdale's | Reject-leaning: no numbers; INZEX not in this filter | 1 | 0 | 1 | 2 | 1 | 5 |
| P4 Ops consulting | Work → Ops → ops-1 → ops-3 → ops-2 | Shortlist: measured, limits stated | 2 | 2 | 1 | 2 | 2 | 9 |
| P5 AI eval | Home ("Applied AI") → Work (no AI case) → About → Handshake bullets | Maybe: facts exist but no artefacts or section | 1 | 1 | 1 | 1 | 1 | 5 |
| P6 Senior head | Home → Cartier (most prominent) → About → CV | Doubt: concept-first impression and CV mismatch | 1 | 2 | 1 | 0 | 1 | 5 |
| **Mean** | | | | | | | | **6.0** |

**Severity:** High. **Score: 6.0/10.**

**Recommended.** These follow from evaluations 1, 4, 8, 9 and 10.

## 14 · Overall strategic effectiveness
**Assessment.** The site is a beautifully made portfolio with best-in-class operations evidence. It is not yet a recruiting instrument: it doesn't say what role he wants, can't be contacted directly, and fails a CV cross-check.

| Criterion | Pts |
|---|---|
| Clear who / what / for which roles | 1 |
| Strongest evidence surfaced first | 1 |
| Survives a verification visit | 0 |
| Frictionless contact | 0 |
| Craft and differentiation | 2 |
| **Score** | **4/10** |

**Severity:** Critical (because of conversion and CV consistency).

**Recommended.** The P0 set in `04-synthesis.md`.

**Expected impact.** Moves P1, P5 and P6 from "maybe/doubt" towards shortlist without changing the identity.
