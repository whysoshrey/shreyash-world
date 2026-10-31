import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { Arrow, Lines, Reveal } from "../components/site/primitives";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";

const BASE = import.meta.env.BASE_URL;

/* ---------- the journey: dates from the latest résumé ---------- */
type Kind = "edu" | "role" | "ny";
type Ev = { at: number; kind: Kind; side: "up" | "down"; lane: 0 | 1; title: string; note: string; to?: string };
const START = 2020;
const END = 2027;
const NOW = 2026 + 9.5 / 12;
/** Recent years carry more events, so the axis gives them more room: a piecewise scale, years marked as they fall. */
const STOPS: [number, number][] = [
  [2020, 0],
  [2022, 22],
  [2024, 42],
  [2025, 66],
  [2026, 88],
  [2027, 100],
];
const pct = (t: number) => {
  for (let i = 1; i < STOPS.length; i++) {
    const [y0, p0] = STOPS[i - 1];
    const [y1, p1] = STOPS[i];
    if (t <= y1) return p0 + ((t - y0) / (y1 - y0)) * (p1 - p0);
  }
  return 100;
};
void START;
void END;

const EVENTS: Ev[] = [
  { at: 2020.6, kind: "edu", side: "down", lane: 0, title: "NIFT Delhi", note: "B.F.Tech begins · 2020" },
  { at: 2022.42, kind: "role", side: "up", lane: 0, title: "Welspun India", note: "manufacturing intern · Jun '22", to: "/work/ops-3" },
  { at: 2022.5, kind: "role", side: "down", lane: 0, title: "INZEX Textiles", note: "IE / data & IoT intern · Jun–Jul '22", to: "/work/ops-2" },
  { at: 2024.0, kind: "role", side: "up", lane: 0, title: "Shahi Exports", note: "Industry 4.0 fellow · Jan–Jul '24", to: "/work/ops-1" },
  { at: 2024.66, kind: "edu", side: "down", lane: 0, title: "Parsons, New York", note: "MPS Fashion Management · Fall '24" },
  { at: 2025.1, kind: "ny", side: "up", lane: 1, title: "A Space, In Between", note: "fashion management intern · Feb–May '25" },
  { at: 2025.45, kind: "edu", side: "down", lane: 1, title: "Nava Collective", note: "capstone, featured by Parsons · '25", to: "/work/merch-1" },
  { at: 2025.67, kind: "ny", side: "up", lane: 0, title: "Handshake AI", note: "research fellow, fashion & retail · Sep '25" },
  { at: 2025.79, kind: "ny", side: "down", lane: 0, title: "Bloomingdale's", note: "59th Street · Oct '25–Jan '26", to: "/work/merch-2" },
];

const PIVOTS = [
  { at: 2024.62, title: "Pivot 1 · 2024", note: "making → selling · Delhi → New York" },
  { at: 2025.66, title: "Pivot 2 · 2025", note: "judging clothes → judging models" },
];

/* ---------- the work: reverse chronological, with what was actually done ---------- */
type Role = { when: string; org: string; role: string; place: string; lines: string[]; links?: { to: string; label: string }[]; anchor?: string; kind?: string };
const ROLES: Role[] = [
  {
    when: "Sep 2025 – present",
    org: "Handshake AI",
    role: "Research Fellow, Fashion & Retail",
    anchor: "ai-evaluation",
    kind: "AI evaluation",
    place: "Remote",
    lines: [
      "Write fashion-retail prompts and evaluate and revise frontier-model output across 35+ taxonomies: garment attributes, product-page copy, size and fit, claims, merchandising logic.",
      "Turn reviewer feedback into labels, rubrics and issue logs; built repeatable human-in-the-loop QA workflows. Also evaluate generated business documents: decks, documents and spreadsheets.",
      "Review consistency raised to 96%; repeat classification errors down 22%.",
    ],
  },
  {
    when: "Oct 2025 – Jan 2026",
    org: "Bloomingdale's, 59th Street",
    role: "Seasonal Sales Associate, Men's Designer & Sportswear",
    place: "New York",
    lines: [
      "$3K–3.5K average and $7K–8K peak-day sales across 12+ designer brands, through needs discovery, fit and size substitution and cross-category selling.",
      "Built 6–7 repeat clients; logged availability, fit, colour and promotion response as demand signals.",
    ],
    links: [{ to: "/work/merch-2", label: "Clienteling case" }],
  },
  {
    when: "Feb – May 2025",
    org: "A Space, In Between",
    role: "Fashion Management Intern",
    place: "Tokyo / remote",
    lines: [
      "Competitor research and product storytelling for wholesale and digital merchandising.",
      "Turned findings into requirements for a plus-size platform; wireframed a 24-screen onboarding and body-data journey in Figma, cutting onboarding steps by 25%, with 18 UX and content recommendations.",
    ],
  },
  {
    when: "Jan – Jul 2024",
    org: "Shahi Exports",
    role: "Industry 4.0 Research Fellow",
    place: "NIFT Delhi, Shahi Chair",
    lines: [
      "Built and piloted an autonomous robot to move cut bundles from cutting to sewing: wiring, RFID routing logic, IoT integration and deployment.",
      "Pilot: 22% less material movement, 18% shorter transfer cycles, 92% route reliability; 12-month ROI case presented to management, production and engineering.",
    ],
    links: [{ to: "/work/ops-1", label: "WIP robot case" }],
  },
  {
    when: "Jun – Jul 2022",
    org: "INZEX Textiles",
    role: "IE / Data & IoT Intern",
    place: "Sewing floor and Myntra fulfilment",
    lines: [
      "Four projects: Myntra fulfilment analysis, sales and inventory dashboards, WIP visibility, and a ₹400 IoT needle-runtime tracker.",
      "Tracking contributed to a 25% output gain reported by the floor team.",
    ],
    links: [
      { to: "/work/ops-2", label: "Tracker case" },
      { to: "/work/inzex-dashboards", label: "Dashboards case" },
    ],
  },
  {
    when: "Jun 2022",
    org: "Welspun India",
    role: "Manufacturing Intern",
    place: "Terry towel unit, Vapi",
    lines: [
      "Costed waste across five units and found weaving behind 79% of it; proposed tuck-in edges for 168 dobby looms.",
      "After implementation, about 300 kg a day of unrecyclable hard waste removed.",
    ],
    links: [{ to: "/work/ops-3", label: "Waste case" }],
  },
];

const EDUCATION = [
  { school: "Parsons School of Design, The New School", when: "2024 – 2025", degree: "MPS Fashion Management", note: "GPA 3.88 / 4.00 · MANGO Scholarship · capstone featured on the Parsons student-work site" },
  { school: "National Institute of Fashion Technology, Delhi", when: "2020 – 2024", degree: "B.F.Tech, Apparel Production", note: "GPA 8.5 / 10 · Best Graduation, Most Innovative and Most Commercially Viable Project · Shahi Industry 4.0 fellowship" },
];

const TOOLKIT: [string, string[]][] = [
  ["Operations & analysis", ["Apparel operations and industrial engineering", "Process mapping and requirements", "Inventory and assortment analysis", "KPI reporting, ANOVA", "Excel, Power BI, Google Data Studio"]],
  ["Build", ["Python, SQL, SQLite, FastAPI", "TypeScript, JavaScript", "Arduino, ESP8266/ESP32, RFID, sensors", "Google Apps Script"]],
  ["AI & creative", ["RLHF evaluation, rubrics, output validation", "ChatGPT, Claude, Cursor, Copilot, n8n", "Figma; reference-guided Midjourney, Firefly, Stable Diffusion", "Video editing and music production"]],
];

export function AboutPage() {
  const { content } = useContentState();
  const still = Boolean(useReducedMotion());
  const location = useLocation();
  const hashId = location.hash.replace("#", "");
  // AI-01: deep links such as /about#ai-evaluation land on the entry once the page has rendered
  useEffect(() => {
    if (!hashId || !content) return;
    const t = window.setTimeout(() => document.getElementById(hashId)?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" }), 500);
    return () => window.clearTimeout(t);
  }, [hashId, content, still]);
  if (!content) return <PageShell title="About — Shreyash Ojha">{null}</PageShell>;

  return (
    <PageShell title="About — Shreyash Ojha" curtainLabel="About">
      {/* ——— Intro with portrait ——— */}
      <section className="aboutIntro" aria-labelledby="about-title">
        <div className="aboutIntro__text">
          <h1 id="about-title" className="aboutIntro__title">
            <Lines animateNow delay={0.3} lines={["I fix how fashion", "gets made and sold"]} />
          </h1>
          <motion.p
            className="aboutIntro__lede"
            initial={still ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6, ease: easeOutExpo } }}
          >
            I trained in apparel production at NIFT Delhi and in fashion management at Parsons. In between, I've built a robot and
            a sensor for sewing floors, cut waste on a weaving floor, sold designer menswear on 59th Street, and now teach AI models
            fashion judgement.
          </motion.p>
          <p className="aboutIntro__status">
            <span>Fashion operations · retail analytics · applied AI</span>
            <span>Open to roles · relocation welcome</span>
          </p>
        </div>
        <motion.figure
          className="portrait"
          initial={still ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.7, ease: easeOutExpo } }}
        >
          <span className="portrait__sheet" aria-hidden="true" />
          <img src={`${BASE}assets/web/portrait.webp`} alt="Portrait of Shreyash Ojha in a black jacket and shirt" width={960} height={1200} />
          <figcaption>Shreyash Ojha</figcaption>
        </motion.figure>
      </section>

      {/* ——— The journey ——— */}
      <section className="journey" aria-labelledby="journey-title">
        <h2 id="journey-title" className="journey__title">
          Six years, one move repeated
        </h2>
        <p className="journey__lede">Find the operating problem, build the fix, measure it, and explain it in business terms. First on factory floors, then on the sales floor, now in AI.</p>
        <ul className="journey__key" aria-label="Key">
          <li><span className="jm jm--edu" /> Education</li>
          <li><span className="jm jm--role" /> Factory & industry roles</li>
          <li><span className="jm jm--ny" /> New York era</li>
          <li><span className="jm jm--pivot" /> Pivot</li>
        </ul>

        <div className="track" role="img" aria-label="Timeline from 2020 to now, described in the list that follows">
          <div className="track__axis" />
          <div className="track__future" style={{ left: `${pct(NOW)}%` }} />
          {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
            <span key={y} className="track__tick" style={{ left: `${pct(y)}%` }}>
              {y}
            </span>
          ))}
          {PIVOTS.map((p) => (
            <div key={p.title} className="track__pivot" style={{ left: `${pct(p.at)}%` }}>
              <span className="track__pivotTag">
                <strong>{p.title}</strong>
                <span>{p.note}</span>
              </span>
            </div>
          ))}
          {EVENTS.map((e) => (
            <div key={e.title} className={`track__ev track__ev--${e.side} track__ev--l${e.lane}`} style={{ left: `${pct(e.at)}%` }}>
              <span className={`jm jm--${e.kind}`} />
              <span className="track__stem" />
              <span className="track__label">
                <span className="track__name">{e.title}</span>
                <span className="track__note">{e.note}</span>
              </span>
            </div>
          ))}
          <div className="track__now" style={{ left: `${pct(NOW)}%` }}>
            <span className="jm jm--next" />
            <span className="track__nowLabel">Now</span>
          </div>
        </div>

        {/* the same journey as a list: read by screen readers, shown on phones */}
        <ol className="journeyList">
          {[...EVENTS.map((e) => ({ at: e.at, kind: e.kind as string, title: e.title, note: e.note, to: e.to })), ...PIVOTS.map((p) => ({ at: p.at - 0.001, kind: "pivot", title: p.title, note: p.note, to: undefined }))]
            .sort((a, b) => a.at - b.at)
            .map((e) => (
              <li key={e.title} className={`journeyList__item journeyList__item--${e.kind}`}>
                <span className={`jm jm--${e.kind}`} aria-hidden="true" />
                <span className="journeyList__name">{e.to ? <Link to={e.to}>{e.title}</Link> : e.title}</span>
                <span className="journeyList__note">{e.note}</span>
              </li>
            ))}
        </ol>

        <p className="journey__close">
          <strong>The two pivots are the arc.</strong> 2024: from how clothes are made to how they are sold, and from Delhi to New York.
          2025: from judging garments on a sales floor to evaluating how AI models describe and judge them.
        </p>
      </section>

      {/* ——— The work ——— */}
      <section className="roles" aria-labelledby="roles-title">
        <header className="roles__head">
          <h2 id="roles-title" className="roles__title">The work</h2>
          <p className="roles__lede">Where I've worked, what I did there, and where each piece lives on this site.</p>
        </header>
        <ol className="roles__list">
          {ROLES.map((r, i) => (
            <Reveal as="li" key={r.org} delay={Math.min(i, 3) * 0.04} className="role">
              {r.anchor ? <span id={r.anchor} className="anchorTarget" aria-hidden="true" /> : null}
              <p className="role__when">{r.when}</p>
              <div className="role__main">
                {r.kind ? <p className="role__kind">{r.kind}</p> : null}
                <h3 className="role__org">{r.org}</h3>
                <p className="role__role">
                  {r.role} · {r.place}
                </p>
                <ul className="role__lines">
                  {r.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                {r.links ? (
                  <p className="role__links">
                    {r.links.map((l) => (
                      <Link key={l.to} to={l.to} className="role__link">
                        {l.label} <Arrow dir="e" />
                      </Link>
                    ))}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ——— Education ——— */}
      <section className="roles roles--edu" aria-labelledby="edu-title">
        <header className="roles__head">
          <h2 id="edu-title" className="roles__title">Education</h2>
        </header>
        <ol className="roles__list">
          {EDUCATION.map((e) => (
            <Reveal as="li" key={e.school} className="role">
              <p className="role__when">{e.when}</p>
              <div className="role__main">
                <h3 className="role__org">{e.degree}</h3>
                <p className="role__role">{e.school}</p>
                <p className="role__note">{e.note}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ——— Pictures from the three floors ——— */}
      <section className="aboutPics" aria-label="From the work">
        <ul className="about__trio">
          {[
            { src: "assets/web/acme-build.webp", alt: "The WIP-movement robot's wiring and drive train from above", cap: "Factory floor. The WIP robot, Shahi Exports.", to: "/work/ops-1" },
            { src: "assets/web/bloomingdales-feedback.webp", alt: "Customer feedback email from Bloomingdale's 59th Street", cap: "Sales floor. Customer feedback, Bloomingdale's.", to: "/work/merch-2" },
            { src: "assets/web/iot-test.webp", alt: "The IoT tracker being tested on a sewing machine", cap: "Sewing line. The ₹400 tracker on test.", to: "/work/ops-2" },
            { src: "assets/web/art-keyart-mask.webp", alt: "Key art from the Cartier go-to-market redirection", cap: "Campaign. Cartier Rogue key art.", to: "/work/cartier-gtm-redirection/rogue" },
          ].map((t, i) => (
            <Reveal as="li" key={t.src} delay={i * 0.05} className={`about__shot about__shot--${i}`}>
              <Link to={t.to} className="about__shotLink">
                <figure>
                  <img src={BASE + t.src} alt={t.alt} loading="lazy" />
                  <figcaption>{t.cap}</figcaption>
                </figure>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ——— Toolkit ——— */}
      <section className="roles toolkit" aria-labelledby="tools-title">
        <header className="roles__head">
          <h2 id="tools-title" className="roles__title">What I work with</h2>
        </header>
        <div className="toolkit__cols">
          {TOOLKIT.map(([t, items]) => (
            <div key={t}>
              <h3 className="toolkit__h">{t}</h3>
              <ul className="toolkit__list">
                {items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="toolkit__lang">English, fluent · Hindi, native · French, foundational</p>
      </section>
    </PageShell>
  );
}
