import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Arrow } from "../site/primitives";

/**
 * Carousel — horizontal, scroll-snapped track. Native scrolling (touch, trackpad,
 * shift-wheel), drag-to-scroll with a mouse, prev/next buttons that disable at the ends,
 * and a position counter. Used for artifacts, related work and the system page.
 */
export function Carousel(props: { label: string; children: ReactNode[]; className?: string; itemClassName?: string; tone?: "paper" | "ink" }) {
  const { label, children, className = "", itemClassName = "", tone = "paper" } = props;
  const track = useRef<HTMLUListElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [pos, setPos] = useState(1);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.getBoundingClientRect().width : el.clientWidth;
    setPos(Math.min(children.length, Math.round(el.scrollLeft / Math.max(step, 1)) + 1));
  }, [children.length]);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={`carousel carousel--${tone} ${className}`} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="carousel__bar">
        <span className="label carousel__label">{label}</span>
        <span className="carousel__count label" aria-hidden="true">
          {String(pos).padStart(2, "0")} / {String(children.length).padStart(2, "0")}
        </span>
        <div className="carousel__controls">
          <button type="button" className="carousel__btn" onClick={() => page(-1)} disabled={atStart} aria-label={`Previous — ${label}`}>
            <Arrow dir="w" />
          </button>
          <button type="button" className="carousel__btn" onClick={() => page(1)} disabled={atEnd} aria-label={`Next — ${label}`}>
            <Arrow dir="e" />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        className="carousel__track"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") page(1);
          if (e.key === "ArrowLeft") page(-1);
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !track.current) return;
          drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !track.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) {
            d.moved = true;
            track.current.classList.add("is-dragging");
          }
          track.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          track.current?.classList.remove("is-dragging");
          window.setTimeout(() => (drag.current = null), 0);
        }}
        onPointerLeave={() => {
          track.current?.classList.remove("is-dragging");
          drag.current = null;
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {children.map((child, i) => (
          <li key={i} className={`carousel__item ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}
