import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { easeOutExpo } from "../../lib/motion";
import { useContentState } from "../../lib/content";
import { SiteHeader } from "./SiteHeader";
import { Arrow } from "./primitives";

/**
 * Wraps every route: page-transition curtain, document title,
 * and (optionally) the shared header + footer chrome.
 */
export function PageShell(props: {
  title: string;
  curtainLabel?: string;
  chrome?: boolean;
  tone?: "paper" | "ink";
  children: ReactNode;
}) {
  const { title, curtainLabel, chrome = true, tone = "paper", children } = props;
  const { content } = useContentState();

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <motion.div className={`page page--${tone}`} initial="initial" animate="enter" exit="exit">
      <motion.div
        className="curtain"
        aria-hidden="true"
        variants={{
          initial: { scaleY: 1, transformOrigin: "50% 0%" },
          enter: { scaleY: 0, transformOrigin: "50% 0%", transition: { duration: 0.75, ease: easeOutExpo, delay: 0.08 } },
          exit: { scaleY: 1, transformOrigin: "50% 100%", transition: { duration: 0.5, ease: [0.7, 0, 0.84, 0] } },
        }}
      >
        <motion.span
          className="curtain__label"
          variants={{
            initial: { opacity: 1 },
            enter: { opacity: 0, transition: { duration: 0.25 } },
            exit: { opacity: 1, transition: { duration: 0.2, delay: 0.25 } },
          }}
        >
          {curtainLabel ?? title.split(" — ")[0]}
        </motion.span>
      </motion.div>

      {chrome && content ? <SiteHeader name={content.site.name} positioning={content.site.positioning} links={content.site.links} /> : null}

      <main id="main" tabIndex={-1} className="page__main">
        {children}
      </main>

      {chrome && content ? <SiteFooter /> : null}
    </motion.div>
  );
}

export function SiteFooter(props: { tone?: "ink" | "paper" }) {
  const { content } = useContentState();
  if (!content) return null;
  const { site } = content;
  return (
    <footer id="contact" className={`siteFooter siteFooter--${props.tone ?? "ink"}`}>
      <div className="siteFooter__top">
        <p className="label">Contact</p>
        <h2 className="siteFooter__title">
          Let’s <em>talk</em>
          <span className="siteFooter__dot">.</span>
        </h2>
        <p className="siteFooter__lede">{site.valueProp}</p>
      </div>
      <ul className="siteFooter__links">
        {site.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer" className="bigLink">
              <span>{l.label === "CV" ? "Résumé" : l.label}</span>
              <Arrow />
            </a>
          </li>
        ))}
      </ul>
      <div className="siteFooter__bottom">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span className="siteFooter__nav">
          <Link to="/">Index</Link>
          <Link to="/work">Work</Link>
          <Link to="/credentials">Credentials</Link>
          <Link to="/about">About</Link>
          <Link to="/system">Design system</Link>
        </span>
        <button type="button" className="textBtn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to top <Arrow dir="n" />
        </button>
      </div>
    </footer>
  );
}

export function LoadingScreen(props: { error?: string | null }) {
  return (
    <div className="loadingScreen" role="status">
      <span>{props.error ? `Couldn’t load content — ${props.error}` : "Shreyash Ojha"}</span>
    </div>
  );
}
