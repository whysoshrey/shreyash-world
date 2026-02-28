import { useEffect, useRef, useState } from "react";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export function LiveWallpaper(props: { inverted?: boolean; enabled?: boolean }) {
  const { inverted = false, enabled = true } = props;
  const ref = useRef<HTMLVideoElement | null>(null);
  const scrubZoneRef = useRef<HTMLDivElement | null>(null);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [isLandingActive, setIsLandingActive] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setIsCoarsePointer(media.matches || navigator.maxTouchPoints > 0);
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !isCoarsePointer) {
      setIsLandingActive(false);
      return;
    }
    const update = () => {
      setIsLandingActive(Boolean(document.querySelector(".landing")));
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { subtree: true, childList: true });
    return () => {
      observer.disconnect();
    };
  }, [enabled, isCoarsePointer]);

  useEffect(() => {
    if (!enabled || !isCoarsePointer || !isLandingActive) {
      setShowMobileHint(false);
      return;
    }
    setShowMobileHint(true);
    const t = window.setTimeout(() => setShowMobileHint(false), 4000);
    return () => window.clearTimeout(t);
  }, [enabled, isCoarsePointer, isLandingActive]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!enabled) {
      v.pause();
      return;
    }
  
    const edge = 0.02;

    if (isCoarsePointer) {
      const zone = scrubZoneRef.current;
      if (!zone) return;
      let scrubbing = false;
      let startX = 0;
      let startY = 0;
      let startTime = edge;

      const playSlow = () => {
        v.playbackRate = 0.72;
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };

      const ready = () => {
        if (!v.duration || Number.isNaN(v.duration)) return;
        v.loop = true;
        v.currentTime = clamp(v.currentTime || edge, edge, Math.max(edge, v.duration - edge));
        playSlow();
      };

      const onPointerDown = (e: PointerEvent) => {
        if (!enabled || !isLandingActive) return;
        if (!v.duration || Number.isNaN(v.duration)) return;

        scrubbing = true;
        startX = e.clientX;
        startY = e.clientY;
        startTime = v.currentTime || edge;
        v.pause();
        zone.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!scrubbing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dy) > Math.abs(dx) * 1.2) {
          scrubbing = false;
          if (zone.hasPointerCapture(e.pointerId)) {
            zone.releasePointerCapture(e.pointerId);
          }
          playSlow();
          return;
        }

        e.preventDefault();
        const dur = v.duration;
        if (!dur || Number.isNaN(dur)) return;
        const span = Math.max(0, dur - 2 * edge);
        const delta = (dx / Math.max(1, window.innerWidth)) * span;
        v.currentTime = clamp(startTime + delta, edge, dur - edge);
      };

      const onPointerEnd = (e: PointerEvent) => {
        if (!scrubbing) return;
        scrubbing = false;
        if (zone.hasPointerCapture(e.pointerId)) {
          zone.releasePointerCapture(e.pointerId);
        }
        playSlow();
      };

      v.addEventListener("loadedmetadata", ready);
      if (v.readyState >= 1) ready();

      zone.addEventListener("pointerdown", onPointerDown);
      zone.addEventListener("pointermove", onPointerMove, { passive: false });
      zone.addEventListener("pointerup", onPointerEnd);
      zone.addEventListener("pointercancel", onPointerEnd);

      return () => {
        zone.removeEventListener("pointerdown", onPointerDown);
        zone.removeEventListener("pointermove", onPointerMove);
        zone.removeEventListener("pointerup", onPointerEnd);
        zone.removeEventListener("pointercancel", onPointerEnd);
        v.removeEventListener("loadedmetadata", ready);
      };
    }

    let raf = 0;
    let target = edge;
    let current = edge;
    const smooth = 0.14; // higher = snappier, lower = more cinematic

    const ready = () => {
      v.pause();
      current = edge;
      target = edge;
      v.currentTime = edge;
    };

    const setFromX = (clientX: number) => {
      const w = Math.max(1, window.innerWidth);
      const ratio = Math.max(0, Math.min(1, clientX / w)); // 0..1
      const dur = v.duration;
      if (!dur || Number.isNaN(dur)) return;

      const span = Math.max(0, dur - 2 * edge);
      target = edge + ratio * span;
    };

    const onMove = (e: MouseEvent) => setFromX(e.clientX);

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) setFromX(e.touches[0].clientX);
    };

    const tick = () => {
      if (!v.duration || Number.isNaN(v.duration)) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!v.paused) v.pause();

      // Smoothly approach target time (prevents jitter)
      current += (target - current) * smooth;
      v.currentTime = current;

      raf = requestAnimationFrame(tick);
    };

    v.addEventListener("loadedmetadata", ready);
    if (v.readyState >= 1) ready();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      v.removeEventListener("loadedmetadata", ready);
    };
  }, [enabled, isCoarsePointer, isLandingActive]);

  return (
    <>
      <video
        ref={ref}
        className={`bgVideo${inverted ? " bgVideo--inverted" : ""}${enabled ? "" : " bgVideo--hidden"}`}
        src="./wallpaper-pingpong.mp4"
        muted
        playsInline
        preload="auto"
      />
      {isCoarsePointer && enabled ? <div ref={scrubZoneRef} className="scrubZone" aria-hidden="true" /> : null}
      {showMobileHint ? <div className="mobileScrubHint">Hold + drag to scrub</div> : null}
    </>
  );
}
