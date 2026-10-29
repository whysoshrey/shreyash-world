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

  const R = "/work/cartier-gtm-redirection/rogue";
  const M = "/work/cartier-gtm-redirection/maybach";
  const art = (key: string, to: string, title: string, kicker: string, file: string, ratio: string, x: number, y: number, w: number, r: number, z: number, door: DoorKey = "brand", extra: Partial<DeskCard> = {}): DeskCard =>
    img({ key, to, title, kicker, door, image: `/assets/web/${file}.webp`, imageAlt: `${title} — ${kicker}`, ratio, x, y, w, r, z, ...extra });

  // Desk is a 100 × 84 field. Four loose rows, every card a real piece of work.
  const cards: (DeskCard | null)[] = [
    // row A
    art("film-rogue", R, "Cartier Rogue", "Campaign film still", "art-film-rogue", "920 / 905", 0.5, 3, 14.5, -6, 0.5),
    plate("ops-1", 15.5, 0.5, 10.5, 5, 0.9),
    art("agv", "/work/ops-1", "Autonomous WIP robot", "3D reconstruction", "agv-assembled", "740 / 540", 27, 5, 15, -3, 0.6, "ops"),
    art("mask", R, "Cartier Rogue", "Key art", "art-keyart-mask", "800 / 1095", 43.5, 0, 11, 4, 0.8),
    art("film-maybach", M, "Cartier × Maybach", "Campaign film still", "art-film-maybach", "980 / 920", 55.5, 4, 13.5, -4, 0.4, "brand", { state: { fromMaybachLoader: true } }),
    plate("ops-3", 70, 1, 10.5, 6, 0.7),
    art("tower", R, "Rogue out-of-home", "Building billboard", "art-billboard-tower", "670 / 1007", 82.5, 3, 10, -3, 0.3),
    // row B
    art("bloom", "/work/merch-2", "Retail clienteling", "Customer note, Bloomingdale’s", "bloomingdales-feedback", "2.17 / 1", 0, 34, 16.5, 3, 0.4, "merch", { fit: "contain" }),
    plate("brand-1", 17, 33, 10, -5, 0.8),
    art("bracelet", R, "Palisade bracelet", "Hero product", "art-bracelet-macro", "1200 / 778", 28.5, 31, 16, 2, 0.5),
    plate("merch-1", 45.5, 27, 10.5, -6, 0.9),
    art("times", R, "Rogue out-of-home", "Times Square", "art-times-square", "1080 / 722", 57, 30, 15.5, 4, 0.6),
    plate("ops-2", 73.5, 28, 10.5, -3, 0.7),
    art("boutique", M, "Cartier × Maybach", "Mobile boutique", "art-maybach-boutique", "1037 / 1215", 85.5, 26, 12.5, 5, 0.4, "brand", { state: { fromMaybachLoader: true } }),
    // row C
    art("models", R, "Cartier Rogue", "Casting board", "art-models", "760 / 1065", 1.5, 55, 11, -4, 0.6),
    plate("inzex-dashboards", 14, 57, 10.5, 5, 0.3),
    art("website", R, "Rogue website", "Digital flagship", "art-website", "1166 / 1215", 25.5, 54, 13.5, -2, 0.7),
    art("gtm", "/work/cartier-gtm-redirection", "Cartier GTM Redirection", "Brand & Product Experiences", "rogue-3", "4 / 5", 40.5, 57, 11, 6, 0.5, "brand", { pos: "62% 30%" }),
    plate("brand-3", 52.5, 54, 10, -5, 0.8),
    art("shelter", R, "Rogue out-of-home", "Bus shelter", "art-bus-shelter", "1 / 1", 63.5, 57, 12.5, 3, 0.4),
    art("agv-x", "/work/ops-1", "Autonomous WIP robot", "Exploded view", "agv-exploded", "750 / 720", 77, 54, 12.5, -4, 0.6, "ops"),
    art("garden", R, "Rogue airports", "Digital totem", "art-airport-garden", "579 / 865", 90, 56, 9.5, 4, 0.8),
    // row D
    plate("offwhite-human", 9.5, 81, 10.5, 4, 0.5),
    art("chandelier", R, "Cartier Rogue", "Setting & mood", "art-mood-chandelier", "860 / 550", 19, 82, 15.5, -3, 0.7),
    art("billboard", R, "Rogue billboard", "Campaign banner", "art-billboard", "1200 / 401", 36, 85, 22, 2, 0.4),
    art("leopard", R, "Cartier Rogue", "Key art", "art-keyart-leopard", "620 / 915", 60, 79, 9.5, -5, 0.8),
    art("street", R, "Cartier Rogue", "Street casting", "rogue-0", "16 / 10", 71, 82, 15, 3, 0.5),
    art("lookbook", R, "Rogue lookbook", "Campaign cover", "old-11-50-16", "690 / 898", 88.5, 79, 9.5, -4, 0.3),
  ];
  // Loosen the rows: compress vertically and jitter each card so the prints overlap like a real table.
  const JITTER = [0, 4, -3, 5, -2, 3, -4, 2, -5, 4, -1, 5, -3, 2, 3, -4, 1, -2, 5, -3, 2, -5, 4, -1, 3, -2, 1, 4];
  return (cards.filter(Boolean) as DeskCard[]).map((c, i) => ({
    ...c,
    y: Math.max(0, c.y * 0.74 + JITTER[i % JITTER.length]),
    x: c.x + (i % 3 === 0 ? 0.8 : i % 3 === 1 ? -0.6 : 0),
  }));
}

function CardFace({ c }: { c: DeskCard }) {
  if (c.item) {
    return <ProjectPlate meta={{ ...c.item.meta, image: undefined }} door={c.door} label={DOOR_SHORT[c.door]} index={c.item.index} />;
  }
  return (
    <span className={`deskCard__img${c.fit === "contain" ? " is-contain" : ""}`} style={{ aspectRatio: c.ratio }}>
      <img src={asset(c.image!)} alt={c.imageAlt ?? ""} decoding="async" style={c.pos ? { objectPosition: c.pos } : undefined} />
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
      style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, y, zIndex: isActive ? 50 : (c.item ? 20 : 1) + Math.round(c.z * 10), ["--unrotate" as string]: `${-c.r}deg` }}
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
          <span className="deskCard__sub">{c.kicker}</span>
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
          {cards.slice(0, 12).map((c, i) => (
            <li key={c.key} className="deskStrip__item" data-d={c.door} style={{ rotate: reduce ? "0deg" : `${i % 2 ? 2.5 : -2.5}deg` }}>
              <Link to={c.to} state={c.state} className="deskCard__link">
                <span className="deskCard__print">
                  <CardFace c={c} />
                </span>
                <span className="deskStrip__caption">
                  <span className="deskCard__title">{c.title}</span>
                  <span className="deskCard__sub">{c.kicker}</span>
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

