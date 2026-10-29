import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Arrow } from "../site/primitives";

/**
 * Flow devices — they make a long page read as one continuous walk.
 *
 * ChapterRail: a quiet index fixed to the right edge. It appears once you leave the hero,
 * marks the chapter you are in, fills a hairline as you progress, and jumps on click.
 */
export function ChapterRail({ chapters }: { chapters: [string, string][] }) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const els = chapters.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [chapters]);

  if (!visible) return null;
  return (
    <nav className="chapterRail is-visible" aria-label="Page chapters">
      <span className="chapterRail__track" aria-hidden="true">
        <motion.span className="chapterRail__fill" style={{ scaleY: scrollYProgress }} />
      </span>
      <ol>
        {chapters.map(([id, label]) => (
          <li key={id}>
            <button
              type="button"
              className={`chapterRail__item${active === id ? " is-active" : ""}`}
              aria-current={active === id ? "true" : undefined}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <span className="chapterRail__label">
                {label}
              </span>
              <span className="chapterRail__dot" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Bridge — a one-line hand-off to the next chapter, so sections lead into each other. */
export function Bridge({ to, label }: { to: string; label: string }) {
  return (
    <div className="bridge">
      <span className="bridge__line" aria-hidden="true" />
      <button type="button" className="bridge__btn" onClick={() => document.getElementById(to)?.scrollIntoView({ behavior: "smooth", block: "start" })}>
        <span className="bridge__label">{label}</span>
        <Arrow dir="s" />
      </button>
    </div>
  );
}
