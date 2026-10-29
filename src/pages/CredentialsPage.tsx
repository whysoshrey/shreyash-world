import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { Arrow, Lines, Reveal } from "../components/site/primitives";
import { Button } from "../components/system/Button";
import { Icon } from "../components/system/Icon";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";
import { liveArtifacts } from "../lib/projects";
import type { Exhibit } from "../lib/types";

const ENDORSEMENT_IDS = ["cred-2", "cred-3"];
const BASE = import.meta.env.BASE_URL;
const THUMBS: Record<string, { src: string; alt: string }> = {
  "cred-2": { src: "assets/web/lor-bawa.webp", alt: "First page of Prof. Pritika Bawa's recommendation letter" },
  "cred-3": { src: "assets/web/lor-panghal.webp", alt: "First page of Dr. Deepak Panghal's recommendation letter" },
  "cred-7": { src: "assets/web/cert-best-grad.webp", alt: "NIFT Certificate of Merit, Best Graduation Project" },
  "cred-4": { src: "assets/web/cert-commercial.webp", alt: "NIFT Certificate of Merit, Most Commercially Viable Project" },
  "cred-6": { src: "assets/web/cert-innovative.webp", alt: "NIFT Certificate of Merit, Most Innovative Project" },
};

export function CredentialsPage() {
  const { content } = useContentState();
  const location = useLocation();
  const hashId = location.hash.replace("#", "");
  const [open, setOpen] = useState<string | null>(hashId || null);

  useEffect(() => {
    if (!hashId || !content) return;
    setOpen(hashId);
    const t = window.setTimeout(() => document.getElementById(hashId)?.scrollIntoView({ behavior: "smooth", block: "center" }), 900);
    return () => window.clearTimeout(t);
  }, [hashId, content]);

  if (!content) return <PageShell title="Credentials — Shreyash Ojha">{null}</PageShell>;
  const creds = content.exhibits.cred;
  const resume = creds.find((c) => c.id === "cred-1");
  const endorsements = creds.filter((c) => ENDORSEMENT_IDS.includes(c.id));
  const awards = creds.filter((c) => c.id !== "cred-1" && !ENDORSEMENT_IDS.includes(c.id));

  return (
    <PageShell title="Credentials — Shreyash Ojha" curtainLabel="Credentials">
      <section className="pageHead">
        <h1 className="pageHead__title">
          <Lines animateNow delay={0.3} lines={["Credentials"]} />
        </h1>
        <motion.div
          className="credResume"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.9, ease: easeOutExpo } }}
        >
          <p className="pageHead__lede">Faculty letters from NIFT Delhi, academic awards, and recognition from Parsons School of Design.</p>
          {resume ? (
            <Button variant="primary" href={liveArtifacts(resume)[0]?.url ?? "#"} icon={<Arrow />}>
              Open résumé ({resume.context})
            </Button>
          ) : null}
        </motion.div>
        <ul className="credWall">
          {["cred-7", "cred-2", "cred-4", "cred-3", "cred-6"].map((id, i) => {
            const t = THUMBS[id];
            const c = creds.find((x) => x.id === id);
            if (!t || !c) return null;
            return (
              <Reveal as="li" key={id} delay={0.4 + i * 0.05} className={`credWall__item credWall__item--${i}`}>
                <a
                  href={`#${id}`}
                  className="credWall__link"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(id);
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  <img src={BASE + t.src} alt={t.alt} loading="eager" />
                  <span className="credWall__cap">{c.title}</span>
                </a>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <CredGroup title="Endorsements" num="e" items={endorsements} open={open} setOpen={setOpen} />
      <CredGroup title="Awards and recognition" num="a" items={awards} open={open} setOpen={setOpen} />
    </PageShell>
  );
}

function CredGroup(props: { title: string; num: string; items: Exhibit[]; open: string | null; setOpen: (id: string | null) => void }) {
  const { title, num, items, open, setOpen } = props;
  return (
    <section className="credGroup" aria-labelledby={`cg-${num}`}>
      <Reveal className="credGroup__head">
        <h2 id={`cg-${num}`} className="credGroup__title">{title}</h2>
      </Reveal>
      <ul className="credList">
        {items.map((c, i) => {
          const isOpen = open === c.id;
          const link = liveArtifacts(c)[0];
          return (
            <Reveal as="li" key={c.id} delay={Math.min(i, 4) * 0.05} className={`credItem${isOpen ? " is-open" : ""}`}>
              <div id={c.id} className="credItem__row">
                <button
                  type="button"
                  className="credItem__toggle"
                  aria-expanded={isOpen}
                  aria-controls={`${c.id}-panel`}
                  onClick={() => setOpen(isOpen ? null : c.id)}
                >
                  {THUMBS[c.id] ? (
                    <span className="credItem__thumb"><img src={BASE + THUMBS[c.id].src} alt="" loading="lazy" /></span>
                  ) : (
                    <span className="credItem__num"><Icon name="cred" size={18} /></span>
                  )}
                  <span className="credItem__title">{c.title}</span>
                  <span className="credItem__ctx">{c.context}</span>
                  <span className="credItem__plus" aria-hidden="true"><Icon name="plus" size={18} /></span>
                </button>
                {link ? (
                  <a className="credItem__link" href={link.url} target="_blank" rel="noreferrer">
                    {link.label} <Arrow />
                  </a>
                ) : null}
              </div>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={`${c.id}-panel`}
                    className="credItem__panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.35, ease: easeOutExpo } }}
                  >
                    <div className="credItem__panelInner">
                      <p className="credItem__proof">{c.proof}</p>
                      <div className="credItem__detail">
                        {c.problem ? <p>{c.problem}</p> : null}
                        {c.approach.length ? (
                          <ul>
                            {c.approach.map((a, k) =>
                              a.trim().endsWith(":") ? (
                                <li key={k} className="label">{a}</li>
                              ) : (
                                <li key={k}>{a}</li>
                              ),
                            )}
                          </ul>
                        ) : null}
                        {c.impact.map((a, k) => (
                          <p key={k} className="credItem__impact">{a}</p>
                        ))}
                        {c.skills ? <p className="label credItem__skills">{c.skills}</p> : null}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
