import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Props = {
  open: boolean;
  text?: string;
};

export function MaybachLoader({ open, text = "ENTERING CARTIER × MAYBACH" }: Props) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="maybachLoader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="maybachLoader__center">
            <div className="maybachLoader__rings" aria-hidden="true">
              <motion.span
                className="maybachLoader__ring"
                animate={{ scale: [0.88, 1.12], opacity: [0.2, 0] }}
                transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity }}
              />
              <motion.span
                className="maybachLoader__ring"
                animate={{ scale: [0.86, 1.16], opacity: [0.16, 0] }}
                transition={{ duration: 2.6, ease: "easeOut", repeat: Infinity, delay: 0.7 }}
              />
            </div>

            <motion.div
              className="maybachLoader__logo"
              animate={{ scale: [1, 1.05, 1], opacity: [0.82, 1, 0.82] }}
              transition={{ duration: 1.65, ease: "easeInOut", repeat: Infinity }}
            >
              {!logoFailed ? (
                <img src="/branding/maybach-logo.png" alt="Maybach" onError={() => setLogoFailed(true)} />
              ) : (
                <span className="maybachLoader__fallback">MAYBACH</span>
              )}
            </motion.div>

            <div className="maybachLoader__text">{text}</div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
