import type { Content } from "./types";

/**
 * The site's map. Every page has one place in a single tree:
 *
 *   Index
 *   ├─ Work
 *   │   └─ {discipline}
 *   │       └─ {project}
 *   │           └─ {chapter}        (multi-part projects, e.g. Cartier GTM)
 *   ├─ Credentials
 *   ├─ About
 *   └─ Design system
 *
 * The breadcrumb trail, the Back button's fallback ("up one level"),
 * and the chapter tabs are all read from here, so they can never disagree.
 */

export type Crumb = { to: string; label: string };
export type Chapter = { to: string; label: string; blurb: string };

export const CARTIER_ID = "cartier-gtm-redirection";
export const ROGUE_PATH = `/work/${CARTIER_ID}/rogue`;
export const MAYBACH_PATH = `/work/${CARTIER_ID}/maybach`;

/** Projects told across more than one page. */
export const CHAPTERS: Record<string, Chapter[]> = {
  [CARTIER_ID]: [
    { to: `/work/${CARTIER_ID}`, label: "Overview", blurb: "The go-to-market redirection: brief, approach and the two worlds." },
    { to: ROGUE_PATH, label: "Rogue campaign", blurb: "Campaign language, framework and rollout across editorial, out-of-home and digital." },
    { to: MAYBACH_PATH, label: "Maybach activation", blurb: "A mobile Cartier gallery on a Maybach: the 3D model, the film and the activation plan." },
  ],
};

/** Which multi-part project (if any) a path belongs to, and where in it we are. */
export function chapterOf(pathname: string): { projectId: string; chapters: Chapter[]; index: number } | null {
  for (const [projectId, chapters] of Object.entries(CHAPTERS)) {
    const index = chapters.findIndex((c) => c.to === pathname);
    if (index >= 0) return { projectId, chapters, index };
  }
  return null;
}

const STATIC: Record<string, string> = {
  "/": "Index",
  "/work": "Work",
  "/credentials": "Credentials",
  "/about": "About",
  "/system": "Design system",
};

function findProject(content: Content | null, id: string) {
  if (!content) return null;
  for (const door of content.doors) {
    const ex = content.exhibits[door.key]?.find((e) => e.id === id);
    if (ex) return { exhibit: ex, door };
  }
  return null;
}

/** Short names used for project pages in the trail and on the Back button. */
const SHORT: Record<string, string> = {
  [CARTIER_ID]: "Cartier GTM",
  "brand-3": "E-com UX benchmark",
  "merch-2": "Retail clienteling",
  "merch-1": "Nava Collective",
};

export function projectLabel(content: Content | null, id: string) {
  return SHORT[id] ?? findProject(content, id)?.exhibit.title ?? "Project";
}

/** Full trail from the Index down to the current page (the last crumb is the current page). */
export function trailFor(pathname: string, content: Content | null): Crumb[] {
  const trail: Crumb[] = [{ to: "/", label: "Index" }];
  if (pathname === "/") return trail;
  if (STATIC[pathname]) return [...trail, { to: pathname, label: STATIC[pathname] }];

  const m = pathname.match(/^\/work\/([^/]+)(?:\/([^/]+))?$/);
  if (m) {
    const [, id, sub] = m;
    const found = findProject(content, id);
    trail.push({ to: "/work", label: "Work" });
    if (found) trail.push({ to: `/work?d=${found.door.key}`, label: found.door.title });
    trail.push({ to: `/work/${id}`, label: projectLabel(content, id) });
    if (sub) {
      const ch = chapterOf(pathname);
      trail.push({ to: pathname, label: ch ? ch.chapters[ch.index].label : sub });
    }
    return trail;
  }
  return [...trail, { to: pathname, label: "Not found" }];
}

/** The name a page goes by on someone else's Back button. */
export function pageLabel(pathname: string, content: Content | null): string {
  const t = trailFor(pathname, content);
  const last = t[t.length - 1];
  const ch = chapterOf(pathname);
  if (ch && ch.index > 0) return `${projectLabel(content, ch.projectId)}: ${last.label}`;
  return last.label;
}

/** One level up the tree; skips the discipline level, which is a filtered view of Work. */
export function parentOf(pathname: string, content: Content | null): Crumb | null {
  if (pathname === "/") return null;
  const t = trailFor(pathname, content).slice(0, -1);
  const up = [...t].reverse().find((c) => !c.to.includes("?d="));
  return up ?? { to: "/", label: "Index" };
}

/* ---------- in-app history memory (per tab) ---------- */

const LABELS = "so-nav-labels";
const SCROLL = "so-scroll:";

function readLabels(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(LABELS) ?? "[]");
  } catch {
    return [];
  }
}

export function historyIndex(): number {
  const idx = (window.history.state as { idx?: number } | null)?.idx;
  return typeof idx === "number" ? idx : 0;
}

/** Remember what the page at this history position is called. */
export function rememberLabel(idx: number, label: string, isPush: boolean) {
  try {
    let labels = readLabels();
    if (isPush) labels = labels.slice(0, idx);
    labels[idx] = label;
    sessionStorage.setItem(LABELS, JSON.stringify(labels));
  } catch {
    /* storage can be unavailable; Back falls back to "up one level" */
  }
}

/** The page one step back in this tab's in-app history, if there is one. */
export function previousLabel(): string | null {
  const idx = historyIndex();
  if (idx <= 0) return null;
  return readLabels()[idx - 1] ?? null;
}

export function saveScroll(key: string, y: number) {
  try {
    sessionStorage.setItem(SCROLL + key, String(Math.round(y)));
  } catch {
    /* ignore */
  }
}

export function readScroll(key: string): number | null {
  try {
    const v = sessionStorage.getItem(SCROLL + key);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}
