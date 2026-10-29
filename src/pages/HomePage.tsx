import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { scrollToContact } from "../components/site/SiteHeader";
import { WorkList } from "../components/site/WorkList";
import { Arrow, CountUp, Lines, Reveal } from "../components/site/primitives";
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
      {/* ——— Hero ——— */}
      <section className="hero" aria-labelledby="hero-name">
        <motion.div
          className="hero__meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.8 } }}
        >
          <span className="label">Portfolio — Selected work</span>
          <span className="label">{site.positioning}</span>
          <span className="label hero__metaEnd">NIFT Delhi · Parsons, New York</span>
        </motion.div>

        <h1 id="hero-name" className="hero__name">
          <Lines animateNow delay={0.35} lines={[first, <em key="l">{last}</em>]} lineClassName={["hero__first", "hero__last"]} />
        </h1>

        <div className="hero__grid">
          <motion.p
            className="hero__value"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.85, duration: 1, ease: easeOutExpo } }}
          >
            {site.valueProp}
          </motion.p>

          <motion.div
            className="hero__side"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1, duration: 1, ease: easeOutExpo } }}
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
              <a className="btn btn--solid" href="#work" onClick={(e) => { e.preventDefault(); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }}>
                View selected work <Arrow dir="s" />
              </a>
              {cv ? (
                <a className="btn" href={cv.href} target="_blank" rel="noreferrer">
                  Résumé <Arrow />
                </a>
              ) : null}
            </div>
          </motion.div>

          <motion.figure
            className="hero__feature"
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)", transition: { delay: 0.6, duration: 1.3, ease: easeOutExpo } }}
          >
            <Link to="/cartier-rogue" className="hero__featureLink" aria-label="Featured: Cartier Rogue campaign">
              <img src={asset("/assets/web/rogue-3.webp")} alt="Cartier Rogue campaign portrait" fetchPriority="high" />
            </Link>
            <figcaption>
              <span className="label">Featured</span>
              <Link to="/cartier-rogue" className="uLink">Cartier Rogue — campaign world</Link>
            </figcaption>
          </motion.figure>
        </div>

        <p className="hero__edu label">B.F.Tech, NIFT Delhi&nbsp;&nbsp;/&nbsp;&nbsp;MPS Fashion Management, Parsons School of Design, The New School</p>
      </section>

      {/* ——— Evidence ——— */}
      <section className="evidence" aria-label="Results at a glance">
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
      </section>

      {/* ——— Selected work ——— */}
      <section id="work" className="section" aria-labelledby="work-title">
        <header className="sectionHead">
          <span className="label">(01) Index</span>
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
          <Link to="/work" className="btn">
            Browse all work as a gallery <Arrow dir="e" />
          </Link>
        </Reveal>
      </section>

      {/* ——— Campaign feature ——— */}
      <section className="feature" aria-labelledby="feature-title">
        <header className="feature__head">
          <span className="label">(02) Brand &amp; product experiences</span>
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
                <img src={asset("/assets/web/rogue-0.webp")} alt="Cartier Rogue campaign language image" loading="lazy" />
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
                <img src={asset("/assets/web/maybach-poster.webp")} alt="3D render of the Cartier × Maybach vehicle" loading="lazy" />
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
      <section className="section practice" aria-labelledby="practice-title">
        <header className="sectionHead">
          <span className="label">(03) Practice</span>
          <h2 id="practice-title" className="sectionHead__title">
            <Lines lines={["Three ways", <em key="p">of working</em>]} />
          </h2>
        </header>
        <ol className="practice__grid">
          {content.doors
            .filter((d) => WORK_DOORS.includes(d.key))
            .map((door, i) => (
              <Reveal as="li" key={door.key} delay={i * 0.1} className="practice__item">
                <Link to={`/work?d=${door.key}`} className="practice__link">
                  <span className="practice__num">{pad(i + 1)}</span>
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
      <section className="section recognition" aria-labelledby="rec-title">
        <header className="sectionHead">
          <span className="label">(04) Recognition</span>
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
      <section className="section aboutTeaser" aria-labelledby="about-title">
        <span className="label">(05) About</span>
        <h2 id="about-title" className="aboutTeaser__text">
          <Reveal>
            Trained in fashion technology at NIFT Delhi and fashion management at Parsons, I work where the{" "}
            <em>factory floor</em>, the <em>sales floor</em> and the <em>campaign</em> meet — and measure what changes.
          </Reveal>
        </h2>
        <Reveal className="aboutTeaser__ctas">
          <Link to="/about" className="btn">
            More about me <Arrow dir="e" />
          </Link>
          <button type="button" className="btn btn--ghost" onClick={scrollToContact}>
            Get in touch
          </button>
        </Reveal>
      </section>

    </>
  );
}
