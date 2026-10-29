import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { Arrow, Lines, ProjectPlate, Reveal } from "../components/site/primitives";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";
import { ACTION_ROUTES, asset, DOOR_SHORT, getWork, isExternal, liveArtifacts, pad, sentence, type WorkItem } from "../lib/projects";
import type { Artifact } from "../lib/types";

export function CaseStudyPage() {
  const { id } = useParams();
  const { content } = useContentState();
  if (!content) return <PageShell title="Shreyash Ojha">{null}</PageShell>;

  const work = getWork(content);
  const idx = work.findIndex((w) => w.exhibit.id === id);
  if (idx === -1) return <NotFoundBody />;
  const item = work[idx];
  const next = work[(idx + 1) % work.length];
  const prev = work[(idx - 1 + work.length) % work.length];

  return (
    <PageShell title={`${item.exhibit.title} — Shreyash Ojha`} curtainLabel={item.exhibit.title}>
      <CaseStudy key={item.exhibit.id} item={item} total={work.length} prev={prev} next={next} />
    </PageShell>
  );
}

function CaseStudy(props: { item: WorkItem; total: number; prev: WorkItem; next: WorkItem }) {
  const { item, total, prev, next } = props;
  const { exhibit, door, meta } = item;
  const artifacts = liveArtifacts(exhibit);
  const isRetail = exhibit.id === "merch-2";
  const isCartier = exhibit.id === "cartier-gtm-redirection";
  const plateRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: plateRef, offset: ["start end", "end start"] });
  const plateY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const sections: { key: string; title: string; body: React.ReactNode }[] = [];
  if (!isRetail && exhibit.problem.trim()) sections.push({ key: "problem", title: "Problem", body: <p className="prose">{sentence(exhibit.problem)}</p> });
  if (!isRetail && exhibit.approach.some((a) => a.trim()))
    sections.push({
      key: "approach",
      title: "Approach",
      body: (
        <ol className="steps">
          {exhibit.approach.map((a, i) => (
            <li key={i}>
              <span className="steps__n">{pad(i + 1)}</span>
              <span>{sentence(a)}</span>
            </li>
          ))}
        </ol>
      ),
    });
  if (!isRetail && exhibit.impact.some((a) => a.trim()))
    sections.push({
      key: "impact",
      title: "Impact",
      body: (
        <ul className="impactList">
          {exhibit.impact.map((a, i) => (
            <li key={i}>{sentence(a)}</li>
          ))}
        </ul>
      ),
    });

  return (
    <article className="case">
      <header className="case__head">
        <div className="case__crumbs label">
          <Link to="/work" className="uLink">Work</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/work?d=${door.key}`} className="uLink">{door.title}</Link>
          <span className="case__count">
            {pad(item.index)} — {pad(total)}
          </span>
        </div>
        <h1 className="case__title">
          <Lines animateNow delay={0.3} lines={[exhibit.title]} />
        </h1>
        <motion.div
          className="case__intro"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 1, ease: easeOutExpo } }}
        >
          <p className="case__lede">{exhibit.proof}</p>
          <dl className="case__facts">
            <div>
              <dt className="label">Context</dt>
              <dd>{exhibit.context}</dd>
            </div>
            <div>
              <dt className="label">Discipline</dt>
              <dd>{door.title}</dd>
            </div>
            {exhibit.skills ? (
              <div>
                <dt className="label">Skills</dt>
                <dd>{sentence(exhibit.skills)}</dd>
              </div>
            ) : null}
          </dl>
        </motion.div>
      </header>

      <motion.div
        ref={plateRef}
        className="case__plate"
        initial={{ clipPath: "inset(12% 6% 12% 6%)", opacity: 0 }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1, transition: { delay: 0.5, duration: 1.4, ease: easeOutExpo } }}
      >
        <motion.div style={{ y: plateY }} className="case__plateInner">
          <ProjectPlate meta={meta} door={door.key} label={DOOR_SHORT[door.key]} index={item.index} eager large />
        </motion.div>
      </motion.div>

      {isRetail ? <RetailVignette /> : null}

      {sections.map((s, i) => (
        <section key={s.key} className="case__section" aria-labelledby={`s-${s.key}`}>
          <Reveal className="case__sectionHead">
            <span className="case__sectionNum">{pad(i + 1)}</span>
            <h2 id={`s-${s.key}`} className="case__sectionTitle">{s.title}</h2>
          </Reveal>
          <Reveal className="case__sectionBody" delay={0.08}>
            {s.body}
          </Reveal>
        </section>
      ))}

      {isCartier ? <CartierWorlds num={sections.length + 1} /> : null}

      {artifacts.length && !isCartier ? (
        <section className="case__section" aria-labelledby="s-artifacts">
          <Reveal className="case__sectionHead">
            <span className="case__sectionNum">{pad(sections.length + 1)}</span>
            <h2 id="s-artifacts" className="case__sectionTitle">Artifacts</h2>
          </Reveal>
          <Reveal className="case__sectionBody" delay={0.08}>
            <ul className="artifactList">
              {artifacts.map((a) => (
                <li key={a.label}>
                  <ArtifactLink artifact={a} />
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      ) : null}

      <nav className="case__next" aria-label="More projects">
        <Link to={`/work/${prev.exhibit.id}`} className="case__prev">
          <span className="label">
            <Arrow dir="w" /> Previous
          </span>
          <span className="case__prevTitle">{prev.exhibit.title}</span>
        </Link>
        <Link to={`/work/${next.exhibit.id}`} className="case__nextLink">
          <span className="label">
            Next project <Arrow dir="e" />
          </span>
          <span className="case__nextTitle">{next.exhibit.title}</span>
          <span className="case__nextCtx">{next.exhibit.context}</span>
        </Link>
      </nav>
    </article>
  );
}

function ArtifactLink({ artifact }: { artifact: Artifact }) {
  const cls = `artifactLink${artifact.variant === "hero" ? " artifactLink--hero" : ""}`;
  const inner = (
    <>
      <span className="artifactLink__label">{artifact.label}</span>
      <span className="artifactLink__kind label">
        {artifact.actionId ? "Case world" : artifact.url.includes("drive.google.com/drive") ? "Folder" : artifact.url.endsWith(".html") ? "Interactive" : isExternal(artifact.url) ? "Document" : "Image"}
      </span>
      <Arrow className="artifactLink__arrow" dir={artifact.actionId ? "e" : "ne"} />
    </>
  );
  if (artifact.actionId && ACTION_ROUTES[artifact.actionId]) {
    return (
      <Link className={cls} to={ACTION_ROUTES[artifact.actionId]} state={artifact.actionId === "cartier_maybach_route" ? { fromMaybachLoader: true } : undefined}>
        {inner}
      </Link>
    );
  }
  return (
    <a className={cls} href={asset(artifact.url)} target="_blank" rel="noreferrer">
      {inner}
    </a>
  );
}

function CartierWorlds({ num }: { num: number }) {
  return (
    <section className="case__section case__section--wide" aria-labelledby="s-worlds">
      <Reveal className="case__sectionHead">
        <span className="case__sectionNum">{pad(num)}</span>
        <h2 id="s-worlds" className="case__sectionTitle">Two worlds</h2>
      </Reveal>
      <div className="worlds">
        <Reveal>
          <Link to="/cartier-rogue" className="mediaCard">
            <span className="mediaCard__img">
              <img src={asset("/assets/web/rogue-0.webp")} alt="Cartier Rogue campaign language image" loading="lazy" />
            </span>
            <span className="mediaCard__meta">
              <span className="label">Campaign platform</span>
              <span className="mediaCard__title">Cartier Rogue</span>
              <span className="mediaCard__cta">Enter <Arrow dir="e" /></span>
            </span>
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <Link to="/cartier-maybach" state={{ fromMaybachLoader: true }} className="mediaCard">
            <span className="mediaCard__img">
              <img src={asset("/assets/web/maybach-poster.webp")} alt="3D render of the Cartier × Maybach vehicle" loading="lazy" />
            </span>
            <span className="mediaCard__meta">
              <span className="label">Mobile luxury gallery</span>
              <span className="mediaCard__title">Cartier × Maybach</span>
              <span className="mediaCard__cta">Enter <Arrow dir="e" /></span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

const RETAIL_STRENGTHS = ["Clienteling", "Fit Resolution", "Service Recovery", "Luxury Floor Execution", "Cross-Sell Support", "Customer Trust"];

function RetailVignette() {
  const [zoom, setZoom] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openRef = useRef<HTMLButtonElement | null>(null);
  const src = asset("/assets/web/bloomingdales-feedback.webp");

  useEffect(() => {
    if (!zoom) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = openRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [zoom]);

  return (
    <>
      <section className="case__section" aria-labelledby="s-context">
        <Reveal className="case__sectionHead">
          <span className="case__sectionNum">01</span>
          <h2 id="s-context" className="case__sectionTitle">Context</h2>
        </Reveal>
        <Reveal className="case__sectionBody" delay={0.08}>
          <p className="prose">
            I worked in frontline menswear retail where execution quality directly shaped trust, conversion, and repeat intent. This
            experience sharpened my ability to resolve fit issues, guide product decisions, and deliver calm, high-standard service in a
            fast-moving luxury floor environment.
          </p>
        </Reveal>
      </section>

      <section className="case__section" aria-labelledby="s-floor">
        <Reveal className="case__sectionHead">
          <span className="case__sectionNum">02</span>
          <h2 id="s-floor" className="case__sectionTitle">What I brought to the floor</h2>
        </Reveal>
        <Reveal className="case__sectionBody retail" delay={0.08}>
          <ol className="steps">
            {["Clienteling and fit-resolution support", "Product guidance and styling-oriented selling", "Service recovery and customer reassurance", "Cross-sell support without breaking trust"].map(
              (t, i) => (
                <li key={t}>
                  <span className="steps__n">{pad(i + 1)}</span>
                  <span>{t}</span>
                </li>
              ),
            )}
          </ol>
          <div>
            <p className="label">Retail strengths</p>
            <ul className="tags">
              {RETAIL_STRENGTHS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="label" style={{ marginTop: 28 }}>Category exposure</p>
            <p className="prose prose--small">Menswear tailoring, outerwear, footwear, accessories, and fragrance.</p>
          </div>
        </Reveal>
      </section>

      <section className="case__section" aria-labelledby="s-proof">
        <Reveal className="case__sectionHead">
          <span className="case__sectionNum">03</span>
          <h2 id="s-proof" className="case__sectionTitle">Proof</h2>
        </Reveal>
        <Reveal className="case__sectionBody" delay={0.08}>
          <figure className="proofFig">
            <button ref={openRef} type="button" className="proofFig__btn" onClick={() => setZoom(true)} aria-label="Open customer feedback image in larger view">
              <img src={src} alt="Customer feedback screenshot from Bloomingdale’s Men’s floor support" loading="lazy" />
              <span className="proofFig__zoom label">Enlarge +</span>
            </button>
            <figcaption>
              <span>Customer feedback received during Bloomingdale’s Men’s floor support (attached image).</span>
              <span className="proofFig__line">The note reflects service clarity, follow-through, and customer trust.</span>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      <AnimatePresence>
        {zoom ? (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged customer feedback image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && setZoom(false)}
          >
            <motion.img
              src={src}
              alt="Customer feedback screenshot from Bloomingdale’s Men’s floor support, enlarged"
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } }}
              exit={{ scale: 0.96, opacity: 0 }}
            />
            <button ref={closeRef} type="button" className="lightbox__close" onClick={() => setZoom(false)}>
              Close ×
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function NotFoundBody() {
  return (
    <PageShell title="Not found — Shreyash Ojha" curtainLabel="404">
      <section className="pageHead pageHead--center">
        <span className="label">Error 404</span>
        <h1 className="pageHead__title">
          <Lines animateNow lines={[<em key="n">Not here.</em>]} />
        </h1>
        <p className="pageHead__lede">That page doesn’t exist — it may have moved in the redesign.</p>
        <Link to="/" className="btn btn--solid">
          Back to the index <Arrow dir="e" />
        </Link>
      </section>
    </PageShell>
  );
}
