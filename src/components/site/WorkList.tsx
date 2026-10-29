import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { easeOutExpo } from "../../lib/motion";
import { DOOR_SHORT, type WorkItem } from "../../lib/projects";
import { Arrow, ProjectPlate } from "./primitives";

/**
 * Editorial index of projects. On fine pointers a preview plate trails the
 * cursor; on touch it degrades to a plain, fully tappable list.
 */
export function WorkList(props: { items: WorkItem[] }) {
  const { items } = props;
  const [hovered, setHovered] = useState<WorkItem | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      className="workList"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setHovered(null)}
    >
      <ul className={`workList__rows${hovered ? " has-hover" : ""}`}>
        {items.map((item) => (
          <li key={item.exhibit.id} className={hovered?.exhibit.id === item.exhibit.id ? "is-hovered" : undefined}>
            <Link
              to={`/work/${item.exhibit.id}`}
              className="workRow"
              onPointerEnter={() => setHovered(item)}
              onFocus={() => setHovered(null)}
            >
              <span className="workRow__title">{item.exhibit.title}</span>
              <span className="workRow__context">{item.exhibit.context}</span>
              <span className="workRow__door">{DOOR_SHORT[item.door.key]}</span>
              <span className="workRow__figure">
                {item.meta.figure ?? "—"}
                <Arrow className="workRow__arrow" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {finePointer ? (
        <motion.div className="workPreview" style={{ x: sx, y: sy }} aria-hidden="true">
          <AnimatePresence mode="popLayout">
            {hovered ? (
              <motion.div
                key={hovered.exhibit.id}
                className="workPreview__card"
                initial={{ opacity: 0, scale: 0.86, rotate: -3, clipPath: "inset(12% 12% 12% 12%)" }}
                animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.55, ease: easeOutExpo } }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
              >
                <ProjectPlate meta={hovered.meta} door={hovered.door.key} label={DOOR_SHORT[hovered.door.key]} index={hovered.index} eager />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </div>
  );
}
