import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { easeOutExpo } from "../../lib/motion";
import { asset, type ProjectMeta } from "../../lib/projects";
import type { DoorKey } from "../../lib/types";

/** Fades + lifts its children into view once. */
export function Reveal(props: { children: ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" | "article" }) {
  const { children, className, delay = 0, as = "div" } = props;
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease: easeOutExpo, delay }}
    >
      {children}
    </Tag>
  );
}

const lineVariants: Variants = {
  hidden: { y: "105%" },
  show: (c: { i: number; d: number }) => ({ y: "0%", transition: { duration: 1.1, ease: easeOutExpo, delay: c.d + c.i * 0.08 } }),
};

/**
 * Masked line-by-line reveal for display type. Each entry in `lines`
 * is rendered on its own masked row. Pass `animateNow` for above-the-fold use.
 */
export function Lines(props: { lines: ReactNode[]; className?: string; lineClassName?: string[]; animateNow?: boolean; delay?: number }) {
  const { lines, className, lineClassName = [], animateNow = false, delay = 0 } = props;
  return (
    <motion.span
      className={`lines ${className ?? ""}`}
      initial="hidden"
      {...(animateNow ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
    >
      {lines.map((line, i) => (
        <span className={`lines__mask ${lineClassName[i] ?? ""}`} key={i}>
          <motion.span className="lines__inner" variants={lineVariants} custom={{ i, d: delay }}>
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Animated count-up for numeric strings like "22%", "300", "30s", "150+". */
export function CountUp(props: { value: string; className?: string }) {
  const { value, className } = props;
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const target = match ? parseInt(match[2], 10) : 0;
  const [n, setN] = useState(match && !reduce ? 0 : target);

  useEffect(() => {
    if (!match || !inView || reduce) {
      setN(target);
      return;
    }
    const controls = animate(0, target, { duration: 1.6, ease: easeOutExpo, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target, reduce]);

  if (!match) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">
        {match[1]}
        {n}
        {match[3]}
      </span>
    </span>
  );
}

/**
 * Visual "plate" for a project: image when one exists, otherwise an
 * editorial typographic card built from the project's own key figure.
 */
export function ProjectPlate(props: {
  meta: ProjectMeta;
  door: DoorKey;
  label: string;
  index: number;
  className?: string;
  eager?: boolean;
  large?: boolean;
}) {
  const { meta, door, label, index, className = "", eager = false, large = false } = props;
  const tone = meta.image ? "image" : door;
  return (
    <div className={`plate plate--${tone}${large ? " plate--large" : ""} ${className}`}>
      {meta.image ? (
        <img
          src={asset(meta.image)}
          alt={meta.imageAlt ?? ""}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          style={meta.imagePosition ? { objectPosition: meta.imagePosition } : undefined}
        />
      ) : (
        <div className="plate__type" aria-hidden="true">
          {meta.figure ? <span className="plate__figure">{meta.figure}</span> : <span className="plate__word">{meta.word}</span>}
        </div>
      )}
      <div className="plate__chrome" aria-hidden="true">
        <span>{label}</span>
        <span>№ {String(index).padStart(2, "0")}</span>
      </div>
      {meta.image && meta.figure ? (
        <div className="plate__chip" aria-hidden="true">
          <strong>{meta.figure}</strong> {meta.figureNote}
        </div>
      ) : null}
      {meta.figureNote && !meta.image ? (
        <div className="plate__note" aria-hidden="true">
          {meta.figureNote}
        </div>
      ) : null}
    </div>
  );
}

export function Arrow(props: { dir?: "ne" | "n" | "e" | "s" | "w"; className?: string }) {
  const { dir = "ne", className } = props;
  const rot = { ne: -45, n: -90, e: 0, s: 90, w: 180 }[dir];
  return (
    <svg className={`arrow ${className ?? ""}`} viewBox="0 0 24 24" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M3 12h17M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
