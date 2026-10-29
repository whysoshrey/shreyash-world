import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DOOR_SHORT, type WorkItem } from "../../lib/projects";
import { Arrow, ProjectPlate } from "../site/primitives";
import { Icon } from "./Icon";

/* ---- visited ("post-click") state, kept per browser session ---- */
const KEY = "so-viewed";
export function markViewed(id: string) {
  try {
    const s = new Set<string>(JSON.parse(sessionStorage.getItem(KEY) ?? "[]"));
    s.add(id);
    sessionStorage.setItem(KEY, JSON.stringify([...s]));
  } catch {
    /* storage unavailable — the state is a nicety only */
  }
}
export function useViewed() {
  const [set, setSet] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      setSet(new Set(JSON.parse(sessionStorage.getItem(KEY) ?? "[]")));
    } catch {
      /* ignore */
    }
  }, []);
  return set;
}

/**
 * WorkCard — the project card. One component, used in the Work gallery,
 * related-work carousels and the design-system page.
 * States: default · hover (plate zooms, title shifts, arrow lifts) · pressed · focus-visible · viewed (dot).
 */
export function WorkCard(props: { item: WorkItem; eager?: boolean; viewed?: boolean; compact?: boolean; className?: string }) {
  const { item, eager, viewed, compact, className = "" } = props;
  const d = item.door.key;
  return (
    <Link to={`/work/${item.exhibit.id}`} className={`workCard${compact ? " workCard--compact" : ""} ${className}`} data-d={d}>
      <ProjectPlate meta={item.meta} door={d} label={DOOR_SHORT[d]} index={item.index} eager={eager} />
      <span className="workCard__meta">
        <span className="workCard__body">
          <span className="workCard__title">{item.exhibit.title}</span>
          <span className="workCard__ctx">
            <Icon name={d === "cred" ? "cred" : d} size={14} />
            {item.exhibit.context}
          </span>
          {!compact ? <span className="workCard__proof">{item.exhibit.proof}</span> : null}
        </span>
        <span className="workCard__end">
          <Arrow className="workCard__arrow" />
          {viewed ? (
            <span className="viewedDot" title="Viewed this session">
              <span className="srOnly">Viewed</span>
            </span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}
