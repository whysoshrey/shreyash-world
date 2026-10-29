import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { easeOutExpo } from "../../lib/motion";
import { asset, DOOR_SHORT, type WorkItem } from "../../lib/projects";
import type { DoorKey } from "../../lib/types";
import { ProjectPlate } from "../site/primitives";
import { Icon } from "./Icon";

/**
 * Desk — the lobby. Real work "thrown" on a table as prints: each card is tilted,
 * sits at its own depth (parallax), and on hover/focus straightens, lifts to the top
 * layer and reveals its caption. Click opens the project.
 * Desktop: hand-placed composition. Touch / narrow: a swipeable strip of the same cards.
 */
type DeskCard = {
  key: string;
  to: string;
  state?: unknown;
  title: string;
  kicker: string;
  door: DoorKey;
  /** layout: left/top in % of the desk, width in % of desk width, rotation in deg, depth 0–1 */
  x: number;
  y: number;
  w: number;
  r: number;
  z: number;
  image?: string;
  imageAlt?: string;
  ratio?: string; // CSS aspect-ratio for image prints
  fit?: "cover" | "contain";
  pos?: string;
  item?: WorkItem;
};

function buildCards(work: WorkItem[]): DeskCard[] {
  const by = (id: string) => work.find((w) => w.exhibit.id === id);
  const plate = (id: string, x: number, y: number, w: number, r: number, z: number): DeskCard | null => {
    const item = by(id);
    if (!item) return null;
    return { key: id, to: `/work/${id}`, title: item.exhibit.title, kicker: item.exhibit.context, door: item.door.key, x, y, w, r, z, item };
  };
  const img = (c: Omit<DeskCard, "door"> & { door?: DoorKey }): DeskCard => ({ door: "brand", ...c });

  const cards: (DeskCard | null)[] = [
    img({ key: "rogue-a", to: "/cartier-rogue", title: "Cartier Rogue", kicker: "Campaign world", image: "/assets/web/rogue-0.webp", imageAlt: "Cartier Rogue campaign still", ratio: "16 / 10", x: 1, y: 7, w: 23, r: -6, z: 0.5 }),
    plate("ops-1", 26.5, 1, 12.5, 4, 0.9),
    img({ key: "bloom", to: "/work/merch-2", title: "Retail clienteling", kicker: "Customer note, Bloomingdale’s", door: "merch", image: "/assets/web/bloomingdales-feedback.webp", imageAlt: "Customer feedback note from Bloomingdale’s", ratio: "2.17 / 1", fit: "contain", x: 41, y: 9, w: 19, r: -3, z: 0.3 }),
    img({ key: "maybach", to: "/cartier-maybach", state: { fromMaybachLoader: true }, title: "Cartier × Maybach", kicker: "3D activation concept", image: "/assets/web/maybach-poster.webp", imageAlt: "3D render of the Cartier × Maybach vehicle", ratio: "1.45 / 1", x: 62, y: 2, w: 21, r: 5, z: 0.7 }),
    plate("ops-3", 86, 6, 12, -5, 0.4),
    plate("brand-1", 3, 47, 11.5, 7, 0.8),
    img({ key: "gtm", to: "/work/cartier-gtm-redirection", title: "Cartier GTM Redirection", kicker: "Brand & Product Experiences", image: "/assets/web/rogue-3.webp", imageAlt: "Cartier Rogue portrait", ratio: "4 / 5", pos: "62% 30%", x: 17, y: 43, w: 13, r: -4, z: 0.6 }),
    img({ key: "lookbook", to: "/cartier-rogue", title: "Rogue lookbook", kicker: "Campaign cover", image: "/assets/web/old-11-50-16.webp", imageAlt: "Cartier Rogue lookbook cover", ratio: "690 / 898", x: 33, y: 47, w: 11, r: 3, z: 0.2 }),
    plate("merch-1", 46.5, 41, 12.5, -7, 0.9),
    img({ key: "ooh", to: "/cartier-rogue", title: "Rogue out-of-home", kicker: "OOH street placement", image: "/assets/web/old-11-51-11.webp", imageAlt: "Cartier Rogue out-of-home placement at night", ratio: "1476 / 984", x: 61, y: 45, w: 19, r: 4, z: 0.5 }),
    plate("ops-2", 83, 48, 12, -3, 0.7),
    plate("inzex-dashboards", 7, 75, 11.5, 5, 0.3),
    plate("brand-3", 24, 78, 11, -4, 0.6),
    plate("offwhite-human", 40, 75, 11.5, 6, 0.8),
    img({ key: "rogue-b", to: "/cartier-rogue", title: "Rogue framework", kicker: "Campaign still", image: "/assets/web/rogue-5.webp", imageAlt: "Cartier Rogue campaign still", ratio: "16 / 10", x: 56, y: 77, w: 18, r: -5, z: 0.4 }),
  ];
  return cards.filter(Boolean) as DeskCard[];
}

function CardFace({ c }: { c: DeskCard }) {
  if (c.item) {
    return <ProjectPlate meta={c.item.meta} door={c.door} label={DOOR_SHORT[c.door]} index={c.item.index} />;
  }
  return (
    <span className={`deskCard__img${c.fit === "contain" ? " is-contain" : ""}`} style={{ aspectRatio: c.ratio }}>
      <img src={asset(c.image!)} alt={c.imageAlt ?? ""} loading="lazy" decoding="async" style={c.pos ? { objectPosition: c.pos } : undefined} />
    </span>
  );
}

function DeskItem({ c, i, progress, active, setActive }: { c: DeskCard; i: number; progress: MotionValue<number>; active: string | null; setActive: (k: string | null) => void }) {
  const y = useTransform(progress, [0, 1], [60 * c.z, -60 * c.z]);
  const isActive = active === c.key;
  return (
    <motion.li
      className={`deskCard${isActive ? " is-active" : ""}${active && !isActive ? " is-dim" : ""}`}
      data-d={c.door}
      style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, y, zIndex: isActive ? 50 : 1 + Math.round(c.z * 10), ["--unrotate" as string]: `${-c.r}deg` }}
      initial={{ opacity: 0, rotate: c.r * 2.4, scale: 1.15, x: (c.x - 45) * 2 }}
      whileInView={{ opacity: 1, rotate: c.r, scale: 1, x: 0, transition: { duration: 1.1, ease: easeOutExpo, delay: 0.05 * i } }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
    >
      <Link
        to={c.to}
        state={c.state}
        className="deskCard__link"
        onPointerEnter={() => setActive(c.key)}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive(c.key)}
        onBlur={() => setActive(null)}
        aria-label={`${c.title} — ${c.kicker}`}
      >
        <span className="deskCard__print">
          <CardFace c={c} />
        </span>
        <span className="deskCard__caption" aria-hidden="true">
          <Icon name={c.door === "cred" ? "cred" : c.door} size={14} />
          <span className="deskCard__title">{c.title}</span>
          <span className="deskCard__kicker">{c.kicker}</span>
        </span>
      </Link>
    </motion.li>
  );
}

export function Desk({ work }: { work: WorkItem[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const cards = buildCards(work);
  const [active, setActive] = useState<string | null>(null);
  const [wide, setWide] = useState(true);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const u = () => setWide(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);

  if (!wide) {
    return (
      <div className="deskStrip" aria-label="Project cards">
        <ul className="deskStrip__track">
          {cards.map((c, i) => (
            <li key={c.key} className="deskStrip__item" data-d={c.door} style={{ rotate: reduce ? "0deg" : `${i % 2 ? 2.5 : -2.5}deg` }}>
              <Link to={c.to} state={c.state} className="deskCard__link">
                <span className="deskCard__print">
                  <CardFace c={c} />
                </span>
                <span className="deskStrip__caption">
                  <span className="deskCard__title">{c.title}</span>
                  <span className="deskCard__kicker">{c.kicker}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={ref} className="desk">
      <ul className="desk__surface">
        {cards.map((c, i) => (
          <DeskItem key={c.key} c={c} i={i} progress={scrollYProgress} active={active} setActive={setActive} />
        ))}
      </ul>
      <div className="desk__legend" aria-hidden="true">
        <span><i data-d="ops" /> Operations</span>
        <span><i data-d="merch" /> Merchandising</span>
        <span><i data-d="brand" /> Brand &amp; Product</span>
      </div>
    </div>
  );
}

