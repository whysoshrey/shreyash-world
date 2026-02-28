import type { Content } from "./types";

export async function loadContent(): Promise<Content> {
  const url = `${import.meta.env.BASE_URL}content.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load content.json: ${res.status}`);
  return (await res.json()) as Content;
}