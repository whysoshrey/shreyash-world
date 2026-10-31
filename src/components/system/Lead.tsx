import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { asset } from "../../lib/projects";
import { ROGUE_PATH } from "../../lib/nav";

/**
 * The first screen, built like the reference cover lying on a desk:
 * a red sheet underneath, the blue cover on top, and prints from the work laid over its edge.
 * Each layer sits at its own depth, so scroll and pointer move them by different amounts.
 */
type Print = {
  key: string;
  to: string;
  caption: string;
  depth: number; // 0 = paper, 1 = closest to the reader
  rotate: number;
  img?: string;
  alt?: string;
  figure?: string;
  note?: string;
};

const PRINTS: Print[] = [
  { key: "rogue", to: ROGUE_PATH, caption: "Cartier Rogue, campaign concept", depth: 0.9, rotate: 4, img: "/assets/web/art-keyart-mask.webp", alt: "Cartier Rogue key art: a model in a jewelled mask holding a raw crystal" },
  { key: "agv", to: "/work/ops-1", caption: "Autonomous WIP robot, Shahi Exports", depth: 0.55, rotate: -5, img: "/assets/web/agv-assembled.webp", alt: "Render of the autonomous WIP-movement robot" },
  { key: "waste", to: "/work/ops-3", caption: "Welspun India", depth: 0.75, rotate: -2.5, figure: "300 kg", note: "of hard waste eliminated every day" },
  { key: "maybach", to: "/work/cartier-gtm-redirection/maybach", caption: "Cartier × Maybach concept, film still", depth: 0.4, rotate: 3, img: "/assets/web/art-film-maybach.webp", alt: "Film still of the Cartier × Maybach car at night" },
];

function useLayer(depth: number, scroll: MotionValue<number>, px: MotionValue<number>, py: MotionValue<number>, still: boolean) {
  const y = useTransform(scroll, [0, 1], [0, still ? 0 : -160 * depth]);
  const x = useTransform(px, (v) => (still ? 0 : v * 18 * depth));
  const yp = useTransform(py, (v) => (still ? 0 : v * 12 * depth));
  const ty = useTransform([y, yp] as MotionValue<number>[], ([a, b]: number[]) => a + b);
  return { x, y: ty };
}

export function Lead(props: { tag: string; name: ReactNode; value: string; actions: ReactNode; foot: string; status?: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);
  const still = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });

  const sheet = useLayer(0.15, scrollYProgress, px, py, still);
  const cover = useLayer(0.3, scrollYProgress, px, py, still);

  const onMove = (e: React.PointerEvent) => {
    if (still || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <section
      ref={ref}
      className="lead"
      aria-labelledby="hero-name"
      onPointerMove={onMove}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      <motion.div className="lead__sheet" aria-hidden="true" style={{ x: sheet.x, y: sheet.y }}
        initial={still ? false : { opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 2.2, transition: { delay: 0.35, duration: 0.7, ease: [0.23, 1, 0.32, 1] } }} />

      <motion.div className="lead__cover" style={{ x: cover.x, y: cover.y }}>
        <p className="lead__tag">{props.tag}</p>
        <h1 id="hero-name" className="lead__name">{props.name}</h1>
        <p className="lead__value">{props.value}</p>
        <div className="lead__actions">{props.actions}</div>
        {props.status ? <div className="lead__status">{props.status}</div> : null}
      </motion.div>

      <ul className="lead__prints" aria-label="From the work">
        {PRINTS.map((p, i) => (
          <LeadPrint key={p.key} p={p} i={i} scroll={scrollYProgress} px={px} py={py} still={still} />
        ))}
      </ul>

      <p className="lead__foot">{props.foot}</p>
    </section>
  );
}

function LeadPrint(props: { p: Print; i: number; scroll: MotionValue<number>; px: MotionValue<number>; py: MotionValue<number>; still: boolean }) {
  const { p, i, scroll, px, py, still } = props;
  const layer = useLayer(p.depth, scroll, px, py, still);
  return (
    <motion.li className={`leadPrint leadPrint--${p.key}`} style={{ x: layer.x, y: layer.y, zIndex: Math.round(p.depth * 10) + 2 }}>
      <motion.div
        className="leadPrint__body"
        initial={still ? false : { opacity: 0, y: 40, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: p.rotate, transition: { delay: 0.55 + i * 0.08, duration: 0.7, ease: [0.23, 1, 0.32, 1] } }}
      >
        <Link to={p.to} className="leadPrint__link">
          {p.img ? (
            <img src={asset(p.img)} alt={p.alt ?? ""} loading="eager" decoding="async" />
          ) : (
            <span className="leadPrint__plate">
              <strong>{p.figure}</strong>
              <span>{p.note}</span>
            </span>
          )}
          <span className="leadPrint__cap">{p.caption}</span>
        </Link>
      </motion.div>
    </motion.li>
  );
}
