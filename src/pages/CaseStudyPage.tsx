import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ChapterPager } from "../components/site/Wayfinder";
import { PageShell } from "../components/site/PageShell";
import { Arrow, Lines, ProjectPlate, Reveal } from "../components/site/primitives";
import { Button } from "../components/system/Button";
import { Carousel } from "../components/system/Carousel";
import { Disclosure } from "../components/system/Disclosure";
import { Icon, type IconName } from "../components/system/Icon";
import { SectionNav } from "../components/system/SectionNav";
import { markViewed, useViewed, WorkCard } from "../components/system/WorkCard";
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
      <CaseStudy key={item.exhibit.id} item={item} work={work} total={work.length} prev={prev} next={next} />
    </PageShell>
  );
}

type Sec = { id: string; label: string; title: string; body: ReactNode; wide?: boolean };

function CaseStudy(props: { item: WorkItem; work: WorkItem[]; total: number; prev: WorkItem; next: WorkItem }) {
  const { item, work, total, prev, next } = props;
  const { exhibit, door, meta } = item;
  const d = door.key;
  const artifacts = liveArtifacts(exhibit);
  const isRetail = exhibit.id === "merch-2";
  const isCartier = exhibit.id === "cartier-gtm-redirection";
  const viewed = useViewed();

  useEffect(() => markViewed(exhibit.id), [exhibit.id]);

  /* ---------- build sections (the "rooms" of this project) ---------- */
  const sections: Sec[] = [];

  if (isRetail) {
    sections.push(...retailSections());
  } else if (exhibit.problem.trim()) {
    sections.push({ id: "brief", label: "Brief", title: "The brief", body: <Brief text={sentence(exhibit.problem)} /> });
  }

  if (!isRetail && exhibit.approach.some((a) => a.trim()))
    sections.push({
      id: "approach",
      label: "Approach",
      title: "Approach",
      body: (
        <ol className="steps">
          {exhibit.approach.map((a, i) => (
            <li key={i}>
              <span>{sentence(a)}</span>
            </li>
          ))}
        </ol>
      ),
    });

  if (meta.gallery?.length)
    sections.push({
      id: "gallery",
      label: "Gallery",
      title: "From the work",
      wide: true,
      body: <Gallery shots={meta.gallery} />,
    });

  if (!isRetail && exhibit.impact.some((a) => a.trim()))
    sections.push({
      id: "impact",
      label: "Impact",
      title: "Impact",
      body: (
        <ul className="impactTiles">
          {exhibit.impact.map((a, i) => (
            <ImpactTile key={i} text={sentence(a)} index={i} />
          ))}
        </ul>
      ),
    });

  if (isCartier) sections.push({ id: "worlds", label: "Two worlds", title: "Two worlds", body: <CartierWorlds />, wide: true });

  if (artifacts.length && !isCartier)
    sections.push({
      id: "artifacts",
      label: "Artifacts",
      title: "Artifacts",
      wide: true,
      body: (
        <Carousel label={`${artifacts.length} artifact${artifacts.length > 1 ? "s" : ""}`} itemClassName="carousel__item--artifact">
          {artifacts.map((a) => (
            <ArtifactCard key={a.label} artifact={a} />
          ))}
        </Carousel>
      ),
    });

  const related = [...work.filter((w) => w.door.key === d && w !== item), ...work.filter((w) => w.door.key !== d)].slice(0, 6);

  return (
    <article className="case" data-d={d}>
      {/* ——— Banner ——— */}
      <header className="case__head">
        <h1 className="case__title">
          <Lines animateNow delay={0.3} lines={[exhibit.title]} />
        </h1>
        <p className="case__lede">{exhibit.context}</p>
      </header>

      <Statement item={item} />

      <div className="case__metaWrap">
      <motion.dl
        className="metaStrip"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } }}
        viewport={{ once: true, margin: "-10% 0px" }}
      >
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
        <div>
          <dt className="label">Artifacts</dt>
          <dd className="metaStrip__artifacts">
            {artifacts.length ? (
              <button type="button" className="btn btn--link" onClick={() => document.getElementById(isCartier ? "worlds" : "artifacts")?.scrollIntoView({ behavior: "smooth" })}>
                {artifacts.length} {isCartier ? "case worlds" : artifacts.length === 1 ? "artifact" : "artifacts"} ↓
              </button>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </motion.dl>
      </div>

      <SectionNav title={exhibit.title} sections={sections.map((s) => ({ id: s.id, label: s.label }))} />

      {sections.map((s) => (
        <section key={s.id} id={s.id} className={`case__section${s.wide ? " case__section--wide" : ""}`} aria-labelledby={`h-${s.id}`}>
          <Reveal className="case__sectionHead">
            <h2 id={`h-${s.id}`} className="case__sectionTitle">{s.title}</h2>
          </Reveal>
          <Reveal className="case__sectionBody" delay={0.08}>
            {s.body}
          </Reveal>
        </section>
      ))}

      <ChapterPager />

      {/* ——— More work ——— */}
      <section className="case__related" aria-label="More work">
        <Carousel heading label="More work" itemClassName="carousel__item--card">
          {related.map((w) => (
            <WorkCard key={w.exhibit.id} item={w} compact viewed={viewed.has(w.exhibit.id)} />
          ))}
        </Carousel>
      </section>

      <nav className="case__next" aria-label="Previous and next project">
        <Link to={`/work/${prev.exhibit.id}`} className="case__prev">
          <span className="label">
            <Arrow dir="w" /> Previous
          </span>
          <span className="case__prevTitle">{prev.exhibit.title}</span>
        </Link>
        <Link to={`/work/${next.exhibit.id}`} className="case__nextLink" data-d={next.door.key}>
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

/* ---------- Statement band: layered banner (plate = back layer, paper card = top layer) ---------- */
function Statement({ item }: { item: WorkItem }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <section className="statement" ref={ref} aria-label="Key result">
      <motion.div
        className="statement__back"
        initial={{ clipPath: "inset(10% 5% 10% 5%)", opacity: 0 }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1, transition: { delay: 0.45, duration: 1.4, ease: easeOutExpo } }}
      >
        <motion.div style={{ y }} className="statement__plate">
          <ProjectPlate meta={item.meta.gallery && item.meta.figure ? { ...item.meta, image: undefined } : item.meta} door={item.door.key} label={DOOR_SHORT[item.door.key]} index={item.index} eager large />
        </motion.div>
      </motion.div>
      <motion.blockquote className="statement__card" style={{ y: cardY }}>
        <p>{item.exhibit.proof}</p>
      </motion.blockquote>
    </section>
  );
}

/* ---------- Gallery: filmstrip of snapshots cut from the artwork, with a lightbox ---------- */
type Shot = { src: string; caption: string; ratio: string };
function Gallery({ shots }: { shots: Shot[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open === null) return;
    lastFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % shots.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + shots.length) % shots.length));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastFocus.current?.focus();
    };
  }, [open, shots.length]);

  return (
    <>
      <Carousel label={`${shots.length} snapshots`} itemClassName="carousel__item--shot">
        {shots.map((s, i) => (
          <button key={s.src} type="button" className="shot" onClick={() => setOpen(i)} aria-label={`Enlarge: ${s.caption}`}>
            <span className="shot__img" style={{ aspectRatio: s.ratio }}>
              <img src={asset(s.src)} alt={s.caption} loading="lazy" decoding="async" />
            </span>
            <span className="shot__cap">
              {s.caption}
            </span>
          </button>
        ))}
      </Carousel>
      <AnimatePresence>
        {open !== null ? (
          <motion.div
            className="lightbox lightbox--gallery"
            role="dialog"
            aria-modal="true"
            aria-label={shots[open].caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && setOpen(null)}
          >
            <motion.figure key={open} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } }}>
              <img src={asset(shots[open].src)} alt={shots[open].caption} />
              <figcaption>
                {shots[open].caption} <span className="lightbox__count">{open + 1} of {shots.length}</span>
              </figcaption>
            </motion.figure>
            <div className="lightbox__nav">
              <button type="button" className="carousel__btn" onClick={() => setOpen((open - 1 + shots.length) % shots.length)} aria-label="Previous image">
                <Arrow dir="w" />
              </button>
              <button type="button" className="carousel__btn" onClick={() => setOpen((open + 1) % shots.length)} aria-label="Next image">
                <Arrow dir="e" />
              </button>
            </div>
            <button ref={closeRef} type="button" className="lightbox__close" onClick={() => setOpen(null)}>
              Close ×
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/* ---------- Brief: long text folds behind a Disclosure ---------- */
function Brief({ text }: { text: string }) {
  if (text.length < 260) return <p className="prose">{text}</p>;
  const re = /[.:;]\s/g;
  re.lastIndex = 110;
  const m = re.exec(text);
  const cut = m ? m.index : -1;
  if (cut < 0 || cut > 320) return <p className="prose">{text}</p>;
  const lead = text.slice(0, cut + 1);
  const rest = sentence(text.slice(cut + 2));
  return (
    <>
      <p className="prose">{lead}</p>
      <Disclosure variant="inline" summary="Read the full brief">
        <p className="prose prose--small">{rest}</p>
      </Disclosure>
    </>
  );
}

/* ---------- Impact tile: lifts the number out of the sentence when there is one ---------- */
function ImpactTile({ text, index }: { text: string; index: number }) {
  const m = text.match(/(\d[\d,.]*\s?(?:%|kg\/day|kg|s)?)/);
  return (
    <li className="impactTile">
      {m ? <span className="impactTile__fig">{m[1].trim()}</span> : <Icon name="check" size={28} className="impactTile__icon" />}
      <span className="impactTile__text">{text}</span>
    </li>
  );
}

/* ---------- Artifact card ---------- */
function artifactKind(a: Artifact): { kind: string; icon: IconName } {
  if (a.actionId) return { kind: "Case world", icon: "globe" };
  if (a.url.includes("drive.google.com/drive")) return { kind: "Folder", icon: "folder" };
  if (a.url.endsWith(".html")) return { kind: "Interactive 3D", icon: "cube" };
  if (/\.(jpe?g|png|webp)$/i.test(a.url)) return { kind: "Image", icon: "image" };
  if (isExternal(a.url)) return { kind: "Document", icon: "doc" };
  return { kind: "Link", icon: "doc" };
}

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const { kind, icon } = artifactKind(artifact);
  const cls = `artifactCard${artifact.variant === "hero" ? " artifactCard--hero" : ""}`;
  const inner = (
    <>
      <span className="artifactCard__top">
        <Icon name={icon} size={26} />
        <span className="artifactCard__kind">{kind}</span>
      </span>
      <span className="artifactCard__label">{artifact.label}</span>
      <span className="artifactCard__cta">
        {artifact.actionId ? "Enter" : "Open"} <Arrow dir={artifact.actionId ? "e" : "ne"} />
      </span>
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

function CartierWorlds() {
  return (
    <div className="worlds">
      <Link to="/work/cartier-gtm-redirection/rogue" className="mediaCard">
        <span className="mediaCard__img">
          <img src={asset("/assets/web/rogue-1.webp")} alt="Cartier Rogue campaign still" loading="lazy" />
        </span>
        <span className="mediaCard__meta">
          <span className="label">Campaign platform</span>
          <span className="mediaCard__title">Cartier Rogue</span>
          <span className="mediaCard__cta">Enter <Arrow dir="e" /></span>
        </span>
      </Link>
      <Link to="/work/cartier-gtm-redirection/maybach" state={{ fromMaybachLoader: true }} className="mediaCard">
        <span className="mediaCard__img">
          <img src={asset("/assets/web/maybach-poster.webp")} alt="Render of the Cartier × Maybach vehicle from the 3D model" loading="lazy" />
        </span>
        <span className="mediaCard__meta">
          <span className="label">Mobile luxury gallery</span>
          <span className="mediaCard__title">Cartier × Maybach</span>
          <span className="mediaCard__cta">Enter <Arrow dir="e" /></span>
        </span>
      </Link>
    </div>
  );
}

/* ---------- Retail clienteling: bespoke rooms, content preserved verbatim ---------- */
const RETAIL_STRENGTHS = ["Clienteling", "Fit Resolution", "Service Recovery", "Luxury Floor Execution", "Cross-Sell Support", "Customer Trust"];

function retailSections(): Sec[] {
  return [
    {
      id: "context",
      label: "Context",
      title: "Context",
      body: (
        <p className="prose">
          I worked in frontline menswear retail where execution quality directly shaped trust, conversion, and repeat intent. This experience
          sharpened my ability to resolve fit issues, guide product decisions, and deliver calm, high-standard service in a fast-moving luxury
          floor environment.
        </p>
      ),
    },
    {
      id: "floor",
      label: "On the floor",
      title: "What I brought to the floor",
      body: (
        <div className="retail">
          <ol className="steps">
            {["Clienteling and fit-resolution support", "Product guidance and styling-oriented selling", "Service recovery and customer reassurance", "Cross-sell support without breaking trust"].map(
              (t, i) => (
                <li key={t}>
                      <span>{t}</span>
                </li>
              ),
            )}
          </ol>
          <div>
            <p className="label">Retail strengths</p>
            <ul className="tags">
              {RETAIL_STRENGTHS.map((c) => (
                <li key={c} className="tag">{c}</li>
              ))}
            </ul>
            <p className="label" style={{ marginTop: 28 }}>Category exposure</p>
            <p className="prose prose--small">Menswear tailoring, outerwear, footwear, accessories, and fragrance.</p>
          </div>
        </div>
      ),
    },
    { id: "proof", label: "Proof", title: "Proof", body: <RetailProof /> },
  ];
}

function RetailProof() {
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
        <h1 className="pageHead__title">
          <Lines animateNow lines={["Not here"]} />
        </h1>
        <p className="pageHead__lede">That page doesn’t exist — it may have moved in the redesign.</p>
        <Button to="/" variant="primary" icon={<Arrow dir="e" />}>
          Back to the index
        </Button>
      </section>
    </PageShell>
  );
}
