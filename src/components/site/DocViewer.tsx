import { useCallback, useEffect, useRef, useState } from "react";
import { DRIVE_FOLDERS, LOCAL_VIDEO, parseDrive, previewUrl, type DriveTarget } from "../../lib/driveFiles";
import { asset } from "../../lib/projects";

/**
 * Opens Google Drive links in an in-page viewer instead of sending visitors to Drive.
 * Mounted once; it listens for clicks on any Drive link anywhere on the site.
 *
 * Deterrence, not DRM: Drive's previewer has no download button, its corner "open in Drive"
 * button is framed out of view, folders are listed by the site, and hosted videos hide the download control.
 * Anything shown on screen can still be captured by a determined visitor.
 */
export function DocViewer() {
  const [stack, setStack] = useState<DriveTarget[]>([]);
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const current = stack[stack.length - 1] ?? null;

  const close = useCallback(() => {
    setStack([]);
    returnFocus.current?.focus?.();
  }, []);

  // Intercept clicks (including middle / modified clicks) on Drive links.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button > 1) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const target = parseDrive(a.getAttribute("href") ?? "", (a.getAttribute("aria-label") || a.textContent || "Document").replace(/\s+/g, " ").trim());
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      returnFocus.current = a;
      setStack([target]);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  // While open: lock scroll, Escape closes (or steps back out of a folder), focus the close button.
  useEffect(() => {
    if (!current) return;
    setLoaded(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (stack.length > 1) setStack((s) => s.slice(0, -1));
        else close();
      }
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [current, stack.length, close]);

  if (!current) return null;

  const folder = current.kind === "folder" ? DRIVE_FOLDERS[current.id] : null;
  const video = current.kind === "file" ? LOCAL_VIDEO[current.id] : undefined;

  return (
    <div className="docViewer" role="dialog" aria-modal="true" aria-label={current.title} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="docViewer__panel">
        <header className="docViewer__bar">
          {stack.length > 1 ? (
            <button type="button" className="docViewer__btn" onClick={() => setStack((s) => s.slice(0, -1))}>
              ← Back
            </button>
          ) : null}
          <p className="docViewer__title">{current.title}</p>
          <button ref={closeRef} type="button" className="docViewer__btn docViewer__close" onClick={close} aria-label="Close viewer">
            Close ✕
          </button>
        </header>

        <div className="docViewer__body" onContextMenu={(e) => e.preventDefault()}>
          {folder ? (
            <ul className="docViewer__list">
              {folder.items.map((it) => (
                <li key={it.id}>
                  <button type="button" className="docViewer__item" onClick={() => setStack((s) => [...s, { kind: "file", id: it.id, title: it.title }])}>
                    <span>{it.title}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : video ? (
            <video
              className="docViewer__video"
              src={asset(video.src)}
              poster={asset(video.poster)}
              controls
              autoPlay
              playsInline
              controlsList="nodownload noremoteplayback noplaybackrate"
              disablePictureInPicture
            />
          ) : current.kind === "folder" ? (
            <p className="docViewer__note">This folder isn’t available to preview here.</p>
          ) : (
            <>
              {!loaded ? <p className="docViewer__note">Loading…</p> : null}
              <iframe
                key={current.id}
                className="docViewer__frame"
                title={current.title}
                src={previewUrl(current.id)}
                allow="autoplay; fullscreen"
                referrerPolicy="no-referrer"
                onLoad={() => setLoaded(true)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
