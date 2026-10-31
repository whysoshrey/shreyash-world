/**
 * Google Drive material shown inside the site instead of sending visitors to Drive.
 *
 * - Files open in Drive's embedded previewer (/preview), framed by our own viewer.
 * - Folders can't be browsed in place without sending clicks to Drive, so their contents
 *   are listed here (taken from each folder's public listing, 31 Oct 2026).
 * - Videos are served from the site itself, where the player can hide its download option.
 */

export type DriveItem = { id: string; title: string };
export type DriveTarget =
  | { kind: "file"; id: string; title: string }
  | { kind: "folder"; id: string; title: string };

export const DRIVE_FOLDERS: Record<string, { title: string; items: DriveItem[] }> = {
  "1SZzDFrsrTxFyBJGu6FtnUU6okATvaoGv": {
    title: "WIP robot — R&D files",
    items: [
      { id: "1cWLt55gFnziJ50tH_0GH9FJ-ZZaMy0_Q", title: "ACME project document (PDF)" },
      { id: "1g2SJ9PERWcMiYbP320URLqCAoZK-Lbdg", title: "Finished prototype (video)" },
      { id: "1QU_vI47lLPdXV8sfeGPbfxwZ-jTlaZ04", title: "Presentation at Bharat Tex 2025 (video)" },
    ],
  },
  "1FyCvnSjlEt29aOEAv7ySClw-y66rjbSL": {
    title: "Off-White HUMAN — campaign files",
    items: [
      { id: "1sahgsFNj7Uz61WrZ5NZ9uEhfSlehCspi", title: "Marketing ideation (PDF)" },
      { id: "1qeuG42bR0bGFToN6VT95l4p0emV3a3Zo", title: "Proposal (PDF)" },
      { id: "1NuMhGr0D0iHdqYSo64nq0a2NYmIGM7Ge", title: "Redirection (PDF)" },
      { id: "1RVknhGbxYdqcV2KgGNrGZuEVygy8cCT6", title: "Paid vs. earned media and KPIs (PDF)" },
    ],
  },
};

/** Drive videos with a copy hosted on the site (same footage, web-encoded). */
export const LOCAL_VIDEO: Record<string, { src: string; poster: string }> = {
  "1g2SJ9PERWcMiYbP320URLqCAoZK-Lbdg": { src: "/assets/web/acme-prototype.mp4", poster: "/assets/web/acme-prototype-poster.webp" },
  "1QU_vI47lLPdXV8sfeGPbfxwZ-jTlaZ04": { src: "/assets/web/bharat-tex.mp4", poster: "/assets/web/bharat-tex-poster.webp" },
};

/** Recognise a Google Drive file or folder link. Anything else returns null and behaves normally. */
export function parseDrive(href: string, title: string): DriveTarget | null {
  let u: URL;
  try {
    u = new URL(href, window.location.href);
  } catch {
    return null;
  }
  if (u.hostname !== "drive.google.com" && u.hostname !== "docs.google.com") return null;
  const folder = u.pathname.match(/\/folders\/([A-Za-z0-9_-]+)/);
  if (folder) return { kind: "folder", id: folder[1], title: DRIVE_FOLDERS[folder[1]]?.title ?? title };
  const file = u.pathname.match(/\/(?:file|document|presentation|spreadsheets)\/d\/([A-Za-z0-9_-]+)/);
  const id = file?.[1] ?? u.searchParams.get("id");
  if (!id) return null;
  return { kind: "file", id, title };
}

export function previewUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`;
}
