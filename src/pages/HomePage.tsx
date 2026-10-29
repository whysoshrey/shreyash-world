import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { scrollToContact } from "../components/site/SiteHeader";
import { WorkList } from "../components/site/WorkList";
import { Arrow, CountUp, Lines, Reveal } from "../components/site/primitives";
import { Button } from "../components/system/Button";
import { Desk } from "../components/system/Desk";
import { Lead } from "../components/system/Lead";
import { Icon } from "../components/system/Icon";
import { Bridge, ChapterRail } from "../components/system/Flow";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";
import { asset, getWork, WORK_DOORS } from "../lib/projects";
import type { Content, DoorKey } from "../lib/types";

export const DISCIPLINES = [
  "Fashion management",
  "Retail strategy",
  "Product development",
  "AI & technology",
  "Research",
  "Creative direction",
];

/** Results, each lifted verbatim from a project's proof line, written as sentences rather than a stat row. */
const EVIDENCE = [
  { value: "22%", text: "less material movement in a factory pilot", where: "Autonomous WIP robot · Shahi Exports", id: "ops-1" },
  { value: "25%", text: "better output efficiency with an IoT needle time-tracker", where: "Inzex Textiles", id: "ops-2" },
  { value: "300", unit: " kg", text: "of hard waste eliminated every day across 168 looms", where: "Welspun India", id: "ops-3" },
  { value: "30", unit: " s", text: "to sell out the early-bird release, with 150+ attendees", where: "Genesis 2.2", id: "brand-1" },
];

/** The three disciplines, presented as the three swatches of the palette. */
const SWATCH: Record<Exclude<DoorKey, "cred">, { name: string; code: string }> = {
  ops: { name: "Blue", code: "P 105-8 C" },
  merch: { name: "Red", code: "P 48-8 C" },
  brand: { name: "Cream", code: "P 938 C" },
};

export function HomePage() {
  const { content } = useContentState();
  return (
    <PageShell title="Shreyash Ojha — Fashion Operations & Applied AI" curtainLabel="Index" tone="cover">
      {content ? <Home content={content} /> : null}
    </PageShell>
  );
}

function Home({ content }: { content: Content }) {
  const { site } = content;
  const work = getWork(content);
  const awards = content.exhibits.cred.filter((c) => c.id !== "cred-1");
  const cv = site.links.find((l) => l.label === "CV");
  const doors = content.doors.filter((d) => WORK_DOORS.includes(d.key));

  return (
    <>
      <ChapterRail
        chapters={[
          ["desk", "The desk"],
          ["evidence", "Results"],
          ["work", "Index"],
          ["cartier", "Cartier"],
          ["practice", "Practice"],
          ["recognition", "Recognition"],
          ["about-teaser", "About"],
          ["contact", "Contact"],
        ]}
      />

      {/* ——— The lead: the cover laid on the desk, with prints from the work on top ——— */}
      <Lead
        tag={site.positioning}
        name={<Lines animateNow delay={0.25} lines={site.name.split(" ")} />}
        value={site.valueProp}
        actions={
          <>
            <Button variant="cream" icon={<Arrow dir="s" />} onClick={() => document.getElementById("desk")?.scrollIntoView({ behavior: "smooth" })}>
              View the work
            </Button>
            {cv ? (
              <Button variant="onblue" href={cv.href} icon={<Arrow />}>
                Résumé
              </Button>
            ) : null}
          </>
        }
        foot={DISCIPLINES.join(" · ")}
      />

      {/* ——— The desk: every project as a print ——— */}
      <div className="cover">
        <section id="desk" className="deskSection" aria-labelledby="desk-title">
          <header className="deskSection__head">
            <h2 id="desk-title" className="deskSection__title">Pick up a project</h2>
            <p className="deskSection__lede">
              Prints from the archive: factory floor, sales floor and campaign, side by side. Blue-grey cards are operations, red is
              merchandising, cream is brand and product. Hover to lift one, click to open it.
            </p>
          </header>
          <Desk work={work} />
          <p className="cover__tag cover__tag--bl">NIFT Delhi · Parsons, New York</p>
          <Bridge to="evidence" label="What it added up to" />
        </section>
      </div>

      {/* ——— Results, as sentences ——— */}
      <section id="evidence" className="section results" aria-labelledby="ev-title">
        <header className="sectionHead">
          <h2 id="ev-title" className="sectionHead__title">Measured, not claimed</h2>
          <p className="sectionHead__aside">Every figure comes from a project on this site. Follow one to see how it was measured.</p>
        </header>
        <ul className="results__list">
          {EVIDENCE.map((e, i) => (
            <Reveal as="li" key={e.id} delay={i * 0.06}>
              <Link to={`/work/${e.id}`} className="result">
                <span className="result__value">
                  <CountUp value={e.value} />
                  {e.unit ?? ""}
                </span>
                <span className="result__text">{e.text}</span>
                <span className="result__where">
                  {e.where} <Arrow dir="e" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ——— Selected work ——— */}
      <section id="work" className="section" aria-labelledby="work-title">
        <header className="sectionHead">
          <h2 id="work-title" className="sectionHead__title">
            <Lines lines={["Selected work"]} />
          </h2>
          <p className="sectionHead__aside">
            {work.length} projects across {doors.map((d) => d.title.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " and $1")}.
          </p>
        </header>
        <Reveal>
          <WorkList items={work} />
        </Reveal>
        <Reveal className="section__more">
          <Button to="/work" icon={<Arrow dir="e" />}>
            Browse all work as a gallery
          </Button>
        </Reveal>
      </section>

      {/* ——— Campaign feature: the red field ——— */}
      <section id="cartier" className="feature" aria-labelledby="feature-title">
        <header className="feature__head">
          <h2 id="feature-title" className="feature__title">
            <Lines lines={["Cartier, re-authored"]} />
          </h2>
          <Reveal>
            <p className="feature__lede">
              A go-to-market redirection told through two worlds: an editorial campaign platform and a mobile luxury gallery staged in a
              Maybach.
            </p>
          </Reveal>
        </header>
        <div className="feature__grid">
          <Reveal className="feature__card feature__card--tall">
            <Link to="/work/cartier-gtm-redirection/rogue" className="mediaCard">
              <span className="mediaCard__img">
                <img src={asset("/assets/web/art-mood-drape.webp")} alt="Cartier Rogue setting and mood artwork" loading="lazy" />
              </span>
              <span className="mediaCard__meta">
                <span className="mediaCard__title">Cartier Rogue</span>
                <span className="mediaCard__sub">Campaign · editorial, out-of-home, digital</span>
                <span className="mediaCard__cta">Enter the campaign <Arrow /></span>
              </span>
            </Link>
          </Reveal>
          <Reveal className="feature__card" delay={0.08}>
            <Link to="/work/cartier-gtm-redirection/maybach" state={{ fromMaybachLoader: true }} className="mediaCard">
              <span className="mediaCard__img">
                <img src={asset("/assets/web/maybach-poster.webp")} alt="Render of the Cartier × Maybach vehicle from the 3D model" loading="lazy" />
              </span>
              <span className="mediaCard__meta">
                <span className="mediaCard__title">Cartier × Maybach</span>
                <span className="mediaCard__sub">Activation · interactive 3D</span>
                <span className="mediaCard__cta">Explore the vehicle <Arrow /></span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——— Practice: the three swatches ——— */}
      <section id="practice" className="section practice" aria-labelledby="practice-title">
        <header className="sectionHead">
          <h2 id="practice-title" className="sectionHead__title">
            <Lines lines={["Three ways of working"]} />
          </h2>
          <p className="sectionHead__aside">One colour each, carried through every card and case study on the site.</p>
        </header>
        <ul className="swatches">
          {doors.map((door, i) => {
            const k = door.key as Exclude<DoorKey, "cred">;
            return (
              <Reveal as="li" key={door.key} delay={i * 0.08} className="swatches__item">
                <Link to={`/work?d=${door.key}`} className="swatch" data-d={door.key}>
                  <span className="swatch__chip">
                    <Icon name={k} size={36} />
                  </span>
                  <span className="swatch__card">
                    <span className="swatch__brand">{door.title}</span>
                    <span className="swatch__code">
                      {SWATCH[k].name} · {SWATCH[k].code}
                    </span>
                    <span className="swatch__thesis">{door.thesis}</span>
                    <span className="swatch__count">
                      {content.exhibits[door.key].length} projects <Arrow dir="e" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* ——— Recognition ——— */}
      <section id="recognition" className="section recognition" aria-labelledby="rec-title">
        <header className="sectionHead">
          <h2 id="rec-title" className="sectionHead__title">
            <Lines lines={["Awards and endorsements"]} />
          </h2>
          <Reveal className="sectionHead__aside">
            <Link to="/credentials" className="uLink">
              All credentials and letters <Arrow dir="e" />
            </Link>
          </Reveal>
        </header>
        <ul className="recList">
          {awards.map((a, i) => (
            <Reveal as="li" key={a.id} delay={Math.min(i, 4) * 0.05}>
              <Link to={`/credentials#${a.id}`} className="recRow">
                <span className="recRow__title">{a.title}</span>
                <span className="recRow__ctx">{a.context}</span>
                <Arrow dir="e" className="recRow__arrow" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ——— About ——— */}
      <section id="about-teaser" className="section aboutTeaser" aria-labelledby="about-title">
        <div className="aboutTeaser__main">
          <h2 id="about-title" className="sectionHead__title">Factory floor, sales floor, campaign</h2>
          <Reveal>
            <p className="aboutTeaser__text">
              Trained in fashion technology at NIFT Delhi and fashion management at Parsons, I work where those three meet, and I measure
              what changes.
            </p>
          </Reveal>
          <Reveal className="aboutTeaser__ctas">
            <Button to="/about" icon={<Arrow dir="e" />}>
              More about me
            </Button>
            <Button variant="ghost" onClick={scrollToContact}>
              Get in touch
            </Button>
          </Reveal>
        </div>
        <Reveal className="aboutTeaser__facts" delay={0.1}>
          <dl>
            <div>
              <dt>Education</dt>
              <dd>B.F.Tech, NIFT Delhi</dd>
              <dd>MPS Fashion Management, Parsons School of Design</dd>
            </div>
            <div>
              <dt>Recognition</dt>
              <dd>Best Graduation Project, Most Innovative Project and Most Commercially Viable Project at NIFT Delhi</dd>
              <dd>MANGO Scholarship Award, Parsons</dd>
            </div>
            <div>
              <dt>Presented at</dt>
              <dd>Bharat Tex 2024, Ministry of Textiles, Government of India</dd>
            </div>
          </dl>
        </Reveal>
      </section>
    </>
  );
}
