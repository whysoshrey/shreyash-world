import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { Arrow, Lines, Reveal } from "../components/site/primitives";
import { Button } from "../components/system/Button";
import { Icon } from "../components/system/Icon";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";
import { liveArtifacts, pad } from "../lib/projects";
import type { Exhibit } from "../lib/types";

const ENDORSEMENT_IDS = ["cred-2", "cred-3"];

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
        <span className="label">{content.doors.find((d) => d.key === "cred")?.thesis}</span>
        <h1 className="pageHead__title">
          <Lines animateNow delay={0.3} lines={["Creden", <em key="c">tials</em>]} lineClassName={["", "pageHead__indent"]} />
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
      </section>

      <CredGroup title="Endorsements" num="01" items={endorsements} open={open} setOpen={setOpen} />
      <CredGroup title="Awards & recognition" num="02" items={awards} open={open} setOpen={setOpen} />
    </PageShell>
  );
}

function CredGroup(props: { title: string; num: string; items: Exhibit[]; open: string | null; setOpen: (id: string | null) => void }) {
  const { title, num, items, open, setOpen } = props;
  return (
    <section className="credGroup" aria-labelledby={`cg-${num}`}>
      <Reveal className="credGroup__head">
        <span className="label">({num})</span>
        <h2 id={`cg-${num}`} className="credGroup__title">{title}</h2>
        <span className="label">{pad(items.length)} items</span>
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
                  <span className="credItem__num">
                    <Icon name="cred" size={16} /> {pad(i + 1)}
                  </span>
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
