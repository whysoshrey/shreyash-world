import { useEffect, useRef } from "react";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export function LiveWallpaper(props: { inverted?: boolean; enabled?: boolean }) {
  const { inverted = false, enabled = true } = props;
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!enabled) {
      v.pause();
      return;
    }
  
    const edge = 0.02;
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
  }, [enabled]);

  return (
    <video
      ref={ref}
      className={`bgVideo${inverted ? " bgVideo--inverted" : ""}${enabled ? "" : " bgVideo--hidden"}`}
      src="./wallpaper-pingpong.mp4"
      muted
      playsInline
      preload="auto"
    />
  );
}
