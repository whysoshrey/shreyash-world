import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";
import { easeOutExpo } from "../../lib/motion";
import { Icon } from "./Icon";

/**
 * Disclosure — progressive reveal. Detail stays folded until a reader asks for it.
 * States: closed · hover · open · focus-visible.
 */
export function Disclosure(props: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
  variant?: "row" | "inline";
  id?: string;
}) {
  const { summary, children, defaultOpen = false, className = "", variant = "row", id } = props;
  const [inner, setInner] = useState(defaultOpen);
  const open = props.open ?? inner;
  const panelId = useId();

  const toggle = () => {
    const next = !open;
    setInner(next);
    props.onToggle?.(next);
  };

  return (
    <div id={id} className={`disclosure disclosure--${variant}${open ? " is-open" : ""} ${className}`}>
      <button type="button" className="disclosure__trigger" aria-expanded={open} aria-controls={panelId} onClick={toggle}>
        <span className="disclosure__summary">{summary}</span>
        <span className="disclosure__icon" aria-hidden="true">
          <Icon name="plus" size={18} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            className="disclosure__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.35, ease: easeOutExpo } }}
          >
            <div className="disclosure__body">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
