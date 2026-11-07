import type { Artifact, Content, Door, DoorKey, Exhibit } from "./types";

/** Resolve a site-relative asset path against the Vite base (GitHub Pages sub-path). */
export function asset(path: string) {
  if (!path.startsWith("/")) return path;
  return `${import.meta.env.BASE_URL}${path.slice(1)}`;
}

export const WORK_DOORS: DoorKey[] = ["ops", "merch", "brand"];

export const DOOR_SHORT: Record<DoorKey, string> = {
  ops: "Operations",
  merch: "Merchandising",
  brand: "Brand & Product",
  cred: "Credentials",
};

/**
 * Presentation-only metadata. Every figure here is taken verbatim from the
 * proof / impact text in public/content.json — nothing is invented.
 */
export type ProjectMeta = {
  figure?: string;
  figureNote?: string;
  word?: string; // typographic plate word when no metric/image exists
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  /** snapshots shown in the case study gallery — all cut from the project's own artwork */
  gallery?: { src: string; caption: string; ratio: string }[];
};

const g = (file: string, caption: string, ratio: string) => ({ src: `/assets/web/${file}.webp`, caption, ratio });

export const PROJECT_META: Record<string, ProjectMeta> = {
  "ops-1": {
    figure: "22%",
    figureNote: "less material movement in the pilot",
    image: "/assets/web/agv-assembled.webp",
    imageAlt: "3D reconstruction of the autonomous WIP movement robot",
    gallery: [
      g("agv-assembled", "Assembled — rendered from the 3D model", "740 / 540"),
      g("agv-exploded", "Exploded view — drive, plates, electronics, deck and casing", "750 / 720"),
    ],
  },
  "ops-2": { figure: "25%", figureNote: "output efficiency improvement" },
  "ops-3": { figure: "300", figureNote: "kg / day reduction potential (proposal)" },
  "inzex-dashboards": { word: "Reporting", figureNote: "Ops analytics & backend" },
  "inzex-line-layout": { figure: "48%", figureNote: "material-flow index on the redesigned layout" },
  "inzex-ismart": { word: "Skill", figureNote: "Operator rating study" },
  "mango-intervention": { word: "Mango", figureNote: "Store audit to systems roadmap" },
  "doen-impact": { figure: "25%", figureNote: "organic cotton share in the fibre audit" },
  "nir-sorting": { figure: "72", figureNote: "fabric specimens in the ANOVA" },
  "solid-waste-review": { word: "3R", figureNote: "Waste systems review" },
  "wfx-plm": { figure: "43", figureNote: "planning features audited" },
  "auto-packing": { figure: "20", figureNote: "pieces counted and sealed per box" },
  "tory-burch-digital": { figure: "7", figureNote: "digital intervention areas" },
  "merch-1": { word: "Marketplace", figureNote: "Parsons capstone" },
  "merch-2": { word: "Clienteling", figureNote: "Bloomingdale’s, 59th Street" },
  "brand-1": { figure: "30s", figureNote: "early-bird sellout · 150+ attendees" },
  "brand-3": { figure: "10", figureNote: "UX laws, two platforms" },
  "offwhite-human": { word: "HUMAN", figureNote: "Off-White campaign concepts" },
  "cartier-gtm-redirection": {
    word: "Cartier",
    figureNote: "Rogue · Maybach",
    image: "/assets/web/rogue-3.webp",
    imageAlt: "Cartier Rogue campaign portrait",
    imagePosition: "60% 30%",
    gallery: [
      g("art-keyart-mask", "Key art", "800 / 1095"),
      g("art-bracelet-macro", "Hero product — the Palisade bracelet", "1200 / 778"),
      g("art-models", "Casting board", "760 / 1065"),
      g("art-mood-drape", "Setting & mood", "860 / 1045"),
      g("art-times-square", "Out-of-home — Times Square", "1080 / 722"),
      g("art-bus-shelter", "Out-of-home — bus shelter", "1 / 1"),
      g("art-airport", "Digital activation — airports", "976 / 657"),
      g("art-website", "Digital flagship — Rogue website", "1166 / 1215"),
      g("art-film-maybach", "Cartier × Maybach — film still", "980 / 920"),
      g("art-maybach-boutique", "Cartier × Maybach — mobile boutique", "1037 / 1215"),
    ],
  },
};

export type WorkItem = {
  exhibit: Exhibit;
  door: Door;
  index: number; // 1-based across all work
  meta: ProjectMeta;
};

export function getWork(content: Content): WorkItem[] {
  const items: WorkItem[] = [];
  for (const key of WORK_DOORS) {
    const door = content.doors.find((d) => d.key === key);
    if (!door) continue;
    for (const exhibit of content.exhibits[key] ?? []) {
      items.push({ exhibit, door, index: items.length + 1, meta: PROJECT_META[exhibit.id] ?? {} });
    }
  }
  return items;
}

/** Artifacts that actually go somewhere (drops "#" placeholders). */
export function liveArtifacts(exhibit: Exhibit): Artifact[] {
  return exhibit.artifacts.filter((a) => a.actionId || (a.url && a.url !== "#"));
}

export const ACTION_ROUTES: Record<string, string> = {
  cartier_maybach_route: "/work/cartier-gtm-redirection/maybach",
  cartier_rogue_route: "/work/cartier-gtm-redirection/rogue",
};

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function sentence(s: string) {
  const t = s.trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

export function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}
