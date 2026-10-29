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
};

export const PROJECT_META: Record<string, ProjectMeta> = {
  "ops-1": { figure: "22%", figureNote: "reduction in aggregate WIP movement" },
  "ops-2": { figure: "25%", figureNote: "output efficiency improvement" },
  "ops-3": { figure: "300", figureNote: "kg / day of hard waste eliminated" },
  "inzex-dashboards": { word: "Reporting", figureNote: "Ops analytics & backend" },
  "merch-1": { word: "Marketplace", figureNote: "Parsons capstone" },
  "merch-2": { word: "Clienteling", figureNote: "Bloomingdale’s, 59th Street" },
  "brand-1": { figure: "30s", figureNote: "early-bird sellout · 150+ attendees" },
  "brand-3": { figure: "12", figureNote: "parameters benchmarked" },
  "offwhite-human": { word: "HUMAN", figureNote: "Off-White campaign concepts" },
  "cartier-gtm-redirection": {
    word: "Cartier",
    figureNote: "Rogue · Maybach",
    image: "/assets/web/rogue-3.webp",
    imageAlt: "Cartier Rogue campaign portrait",
    imagePosition: "60% 30%",
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
  cartier_maybach_route: "/cartier-maybach",
  cartier_rogue_route: "/cartier-rogue",
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
