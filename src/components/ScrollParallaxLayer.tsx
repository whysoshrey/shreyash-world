import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function ScrollParallaxLayer(props: {
  children: ReactNode;
  className?: string;
  distance?: number;
  scaleDelta?: number;
}) {
  const { children, className, distance = 32, scaleDelta = 0.018 } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [0, 0, 0] : [distance, 0, -distance],
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1 - scaleDelta, 1, 1 + scaleDelta * 0.45],
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        scale,
        willChange: prefersReducedMotion ? undefined : "transform",
      }}
    >
      {children}
    </motion.div>
  );
}
