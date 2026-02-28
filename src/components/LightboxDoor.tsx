import { motion } from "framer-motion";
import { ease } from "../lib/motion";
import type { Door } from "../lib/types";

export function LightboxDoor(props: { door: Door; count: number; onOpen: () => void }) {
  const { door, count, onOpen } = props;

  return (
    <motion.button
      type="button"
      className="card"
      onClick={onOpen}
      whileHover={{ y: -2, transition: { duration: 0.25, ease } }}
      whileTap={{ scale: 0.99 }}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div className="cardTitle" style={{ fontSize: 24 }}>
        {door.title}
      </div>
      <div className="cardContext">{door.thesis}</div>
      <div className="cardProof" style={{ marginTop: 14 }}>
        {count} exhibits
      </div>
    </motion.button>
  );
}
