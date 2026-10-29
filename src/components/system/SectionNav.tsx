import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * SectionNav — second navigation layer inside a case study (the "room plan").
 * Sticky under the site header; scroll-spy marks the active section; a hairline
 * progress bar in the discipline tone shows how far through the page you are.
 */
export function SectionNav(props: { sections: { id: string; label: string }[]; title: string }) {
  const { sections, title } = props;
  const [active, setActive] = useState(sections[0]?.id);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav className="sectionNav" aria-label={`${title} — sections`}>
      <span className="sectionNav__title">{title}</span>
      <ol className="sectionNav__list">
        {sections.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`sectionNav__link${active === s.id ? " is-active" : ""}`}
              aria-current={active === s.id ? "true" : undefined}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              {s.label}
            </button>
          </li>
        ))}
      </ol>
      <motion.span className="sectionNav__progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </nav>
  );
}
