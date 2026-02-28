import { motion } from "framer-motion";
import type { Exhibit } from "../lib/types";
import { ease } from "../lib/motion";

export function ExhibitCard(props: { exhibit: Exhibit; onOpen: () => void; layoutId: string }) {
  const { exhibit, onOpen, layoutId } = props;

  return (
    <motion.button
      type="button"
      className="card"
      onClick={onOpen}
      whileHover={{ y: -2, transition: { duration: 0.25, ease } }}
      whileTap={{ scale: 0.99 }}
      layoutId={layoutId}
    >
      <div className="cardTitle">{exhibit.title}</div>
      <div className="cardContext">{exhibit.context}</div>
      <div className="cardProof">{exhibit.proof}</div>
    </motion.button>
  );
}
