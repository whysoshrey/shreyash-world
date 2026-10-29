import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Content } from "./types";

export async function loadContent(): Promise<Content> {
  const url = `${import.meta.env.BASE_URL}content.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load content.json: ${res.status}`);
  return (await res.json()) as Content;
}

type State = { content: Content | null; error: string | null };
const ContentContext = createContext<State>({ content: null, error: null });

export function ContentProvider(props: { children: ReactNode }) {
  const [state, setState] = useState<State>({ content: null, error: null });

  useEffect(() => {
    loadContent()
      .then((content) => setState({ content, error: null }))
      .catch((e: unknown) => setState({ content: null, error: e instanceof Error ? e.message : String(e) }));
  }, []);

  return <ContentContext.Provider value={state}>{props.children}</ContentContext.Provider>;
}

export function useContentState() {
  return useContext(ContentContext);
}
