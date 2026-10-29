import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { scrollToContact } from "../components/site/SiteHeader";
import { WorkList } from "../components/site/WorkList";
import { Arrow, CountUp, Lines, Reveal } from "../components/site/primitives";
import { Button } from "../components/system/Button";
import { Desk } from "../components/system/Desk";
import { Icon } from "../components/system/Icon";
import { Bridge, ChapterRail } from "../components/system/Flow";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";
import { asset, getWork, pad, WORK_DOORS } from "../lib/projects";
import type { Content } from "../lib/types";

export const DISCIPLINES = [
  "Fashion management",
  "Retail strategy",
  "Product development",
  "AI & technology",
  "Research",
  "Creative direction",
];

/** Headline numbers, each lifted verbatim from a project's proof line. */
const EVIDENCE = [
  { value: "22%", label: "Less aggregate WIP movement", id: "ops-1" },
  { value: "25%", label: "Output efficiency improvement", id: "ops-2" },
  { value: "300", unit: "kg/day", label: "Hard waste eliminated", id: "ops-3" },
  { value: "30", unit: "sec", label: "Early-bird sellout, 150+ attendees", id: "brand-1" },
];

export function HomePage() {
  const { content } = useContentState();
  return (
    <PageShell title="Shreyash Ojha — Fashion Operations & Applied AI" curtainLabel="Index">
      {content ? <Home content={content} /> : null}
    </PageShell>
  );
}

function Home({ content }: { content: Content }) {
  const { site } = content;
  const work = getWork(content);
  const [first, last] = site.name.split(" ");
  const awards = content.exhibits.cred.filter((c) => c.id !== "cred-1");
  const cv = site.links.find((l) => l.label === "CV");

  return (
    <>
      <ChapterRail
        chapters={[
          ["desk", "The desk"],
          ["evidence", "In numbers"],
          ["work", "Index"],
          ["cartier", "Cartier"],
          ["practice", "Practice"],
          ["recognition", "Recognition"],
          ["about-teaser", "About"],
          ["contact", "Contact"],
        ]}
      />
      {/* ——— Hero: who, what, proof — then straight into the work ——— */}
      <section className="hero" aria-labelledby="hero-name">
        <motion.div className="hero__meta" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.8 } }}>
          <span className="label">Portfolio — selected work</span>
          <span className="label hero__metaEnd">NIFT Delhi · Parsons, New York</span>
        </motion.div>

        <div className="hero__grid">
          <div className="hero__id">
            <h1 id="hero-name" className="hero__name">
              <Lines animateNow delay={0.3} lines={[<>{first} <em>{last}</em></>]} />
            </h1>
            <motion.p
              className="hero__role"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.9, ease: easeOutExpo } }}
            >
              {site.positioning}
            </motion.p>
          </div>
          <motion.p
            className="hero__value"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.85, duration: 1, ease: easeOutExpo } }}
          >
            {site.valueProp}
          </motion.p>
        </div>

        <motion.div
          className="hero__foot"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.05, duration: 1, ease: easeOutExpo } }}
        >
          <ul className="hero__disciplines" aria-label="Disciplines">
            {DISCIPLINES.map((d, i) => (
              <li key={d}>
                <span className="hero__dnum">{pad(i + 1)}</span>
                {d}
              </li>
            ))}
          </ul>
          <div className="hero__ctas">
            <Button variant="primary" icon={<Arrow dir="s" />} onClick={() => document.getElementById("desk")?.scrollIntoView({ behavior: "smooth" })}>
              View the work
            </Button>
            {cv ? (
              <Button variant="secondary" href={cv.href} icon={<Arrow />}>
                Résumé
              </Button>
            ) : null}
          </div>
        </motion.div>
      </section>

      {/* ——— The desk ——— */}
      <section id="desk" className="deskSection" aria-labelledby="desk-title">
        <header className="deskSection__head">
          <span className="label">(00) The desk</span>
          <h2 id="desk-title" className="deskSection__title">
            Pick up <em>a project</em>
          </h2>
          <p className="deskSection__lede">Prints from the archive — factory floor, sales floor and campaign, side by side.</p>
          <p className="deskSection__hint label"><span className="onFine">Hover to lift · click to open</span><span className="onCoarse">Swipe · tap to open</span></p>
        </header>
        <Desk work={work} />
        <Bridge to="evidence" label="What it added up to" />
      </section>

      {/* ——— Evidence ——— */}
      <section id="evidence" className="evidenceWrap" aria-labelledby="ev-title">
      <header className="sectionHead sectionHead--tight">
        <span className="label">(01) In numbers</span>
        <h2 id="ev-title" className="sectionHead__title">
          <Lines lines={["Measured,", <em key="m">not claimed</em>]} />
        </h2>
        <p className="sectionHead__aside">Each figure links to the project it came from.</p>
      </header>
      <div className="evidence">
        {EVIDENCE.map((e, i) => (
          <Reveal key={e.id} className="evidence__item" delay={i * 0.08}>
            <Link to={`/work/${e.id}`} className="evidence__link">
              <span className="evidence__value">
                <CountUp value={e.value} />
                {e.unit ? <span className="evidence__unit">{e.unit}</span> : null}
              </span>
              <span className="evidence__label">{e.label}</span>
            </Link>
          </Reveal>
        ))}
      </div>
      <Bridge to="work" label="The full index" />
      </section>

      {/* ——— Selected work ——— */}
      <section id="work" className="section" aria-labelledby="work-title">
        <header className="sectionHead">
          <span className="label">(02) Index</span>
          <h2 id="work-title" className="sectionHead__title">
            <Lines lines={["Selected", <em key="w">work</em>]} />
          </h2>
          <p className="sectionHead__aside">
            {work.length} projects across {content.doors.filter((d) => WORK_DOORS.includes(d.key)).map((d) => d.title.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " and $1")}.
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

      {/* ——— Campaign feature ——— */}
      <section id="cartier" className="feature" aria-labelledby="feature-title">
        <header className="feature__head">
          <span className="label">(03) Brand &amp; product experiences</span>
          <h2 id="feature-title" className="feature__title">
            <Lines lines={["Cartier,", <em key="r">re-authored</em>]} />
          </h2>
          <Reveal>
            <p className="feature__lede">
              A go-to-market redirection told through two worlds — an editorial campaign platform and a mobile luxury
              gallery staged in a Maybach.
            </p>
          </Reveal>
        </header>
        <div className="feature__grid">
          <Reveal className="feature__card feature__card--tall">
            <Link to="/cartier-rogue" className="mediaCard">
              <span className="mediaCard__img">
                <img src={asset("/assets/web/art-mood-drape.webp")} alt="Cartier Rogue setting and mood artwork" loading="lazy" />
              </span>
              <span className="mediaCard__meta">
                <span className="label">Campaign · Editorial / OOH / Digital</span>
                <span className="mediaCard__title">Cartier Rogue</span>
                <span className="mediaCard__cta">Enter the campaign <Arrow /></span>
              </span>
            </Link>
          </Reveal>
          <Reveal className="feature__card" delay={0.12}>
            <Link to="/cartier-maybach" state={{ fromMaybachLoader: true }} className="mediaCard">
              <span className="mediaCard__img">
                <img src={asset("/assets/web/maybach-poster.webp")} alt="Render of the Cartier × Maybach vehicle from the 3D model" loading="lazy" />
              </span>
              <span className="mediaCard__meta">
                <span className="label">Activation · Interactive 3D</span>
                <span className="mediaCard__title">Cartier × Maybach</span>
                <span className="mediaCard__cta">Explore the vehicle <Arrow /></span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——— Practice ——— */}
      <section id="practice" className="section practice" aria-labelledby="practice-title">
        <header className="sectionHead">
          <span className="label">(04) Practice</span>
          <h2 id="practice-title" className="sectionHead__title">
            <Lines lines={["Three ways", <em key="p">of working</em>]} />
          </h2>
        </header>
        <ol className="practice__grid">
          {content.doors
            .filter((d) => WORK_DOORS.includes(d.key))
            .map((door, i) => (
              <Reveal as="li" key={door.key} delay={i * 0.1} className="practice__item">
                <Link to={`/work?d=${door.key}`} className="practice__link" data-d={door.key}>
                  <span className="practice__top">
                    <span className="practice__num">{pad(i + 1)}</span>
                    <Icon name={door.key === "cred" ? "cred" : door.key} size={28} />
                  </span>
                  <span className="practice__title">{door.title}</span>
                  <span className="practice__thesis">{door.thesis}</span>
                  <span className="practice__count">
                    {content.exhibits[door.key].length} projects <Arrow dir="e" />
                  </span>
                </Link>
              </Reveal>
            ))}
        </ol>
      </section>

      {/* ——— Recognition ——— */}
      <section id="recognition" className="section recognition" aria-labelledby="rec-title">
        <header className="sectionHead">
          <span className="label">(05) Recognition</span>
          <h2 id="rec-title" className="sectionHead__title">
            <Lines lines={["Awards &", <em key="e">endorsements</em>]} />
          </h2>
          <Reveal className="sectionHead__aside">
            <Link to="/credentials" className="uLink">
              All credentials &amp; letters <Arrow dir="e" />
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

      {/* ——— About teaser ——— */}
      <section id="about-teaser" className="section aboutTeaser" aria-labelledby="about-title">
        <span className="label">(06) About</span>
        <h2 id="about-title" className="aboutTeaser__text">
          <Reveal>
            Trained in fashion technology at NIFT Delhi and fashion management at Parsons, I work where the{" "}
            <em>factory floor</em>, the <em>sales floor</em> and the <em>campaign</em> meet — and measure what changes.
          </Reveal>
        </h2>
        <Reveal className="aboutTeaser__ctas">
          <Button to="/about" icon={<Arrow dir="e" />}>
            More about me
          </Button>
          <Button variant="ghost" onClick={scrollToContact}>
            Get in touch
          </Button>
        </Reveal>
      </section>

    </>
  );
}
