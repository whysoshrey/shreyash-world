import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { Lines } from "../components/site/primitives";
import { Icon } from "../components/system/Icon";
import { useViewed, WorkCard } from "../components/system/WorkCard";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";
import { getWork, WORK_DOORS } from "../lib/projects";
import type { DoorKey } from "../lib/types";

export function WorkPage() {
  const { content } = useContentState();
  const [params, setParams] = useSearchParams();
  const viewed = useViewed();
  const raw = params.get("d");
  const filter: DoorKey | "all" = raw && (WORK_DOORS as string[]).includes(raw) ? (raw as DoorKey) : "all";

  if (!content) return <PageShell title="Work — Shreyash Ojha">{null}</PageShell>;

  const work = getWork(content);
  const shown = filter === "all" ? work : work.filter((w) => w.door.key === filter);
  const activeDoor = filter === "all" ? null : content.doors.find((d) => d.key === filter);
  const tabs: { key: DoorKey | "all"; label: string; count: number }[] = [
    { key: "all", label: "All", count: work.length },
    ...WORK_DOORS.map((k) => ({ key: k, label: content.doors.find((d) => d.key === k)?.title ?? k, count: content.exhibits[k].length })),
  ];

  return (
    <PageShell title="Work — Shreyash Ojha" curtainLabel="Work">
      <section className="pageHead">
        <h1 className="pageHead__title">
          <Lines animateNow delay={0.3} lines={["Selected work"]} />
        </h1>
        <motion.p
          className="pageHead__lede"
          key={filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo, delay: 0.2 } }}
        >
          {activeDoor ? activeDoor.thesis : "Operational systems, merchandising execution, and brand & product experiences — one practice, measured in outcomes."}
        </motion.p>
      </section>

      <div className="filters" role="toolbar" aria-label="Filter projects by discipline">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`filter${filter === t.key ? " is-active" : ""}`}
            data-d={t.key}
            aria-pressed={filter === t.key}
            onClick={() => setParams(t.key === "all" ? {} : { d: t.key }, { replace: true })}
          >
            <span className="filter__pill" aria-hidden="true" />
            {t.key !== "all" ? <Icon name={t.key} size={15} className="filter__icon" /> : null}
            <span className="filter__label">{t.label}</span>
            <span className="filter__count">{t.count}</span>
          </button>
        ))}
      </div>

      <ul className="workGrid" key={filter}>
          {shown.map((item, i) => (
            <motion.li
              key={item.exhibit.id}
              className="workGrid__item"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOutExpo, delay: 0.1 + i * 0.06 } }}
            >
              <WorkCard item={item} eager={i < 3} viewed={viewed.has(item.exhibit.id)} />
            </motion.li>
          ))}
      </ul>
    </PageShell>
  );
}
