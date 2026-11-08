import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { PageShell } from "../components/site/PageShell";
import { Lines } from "../components/site/primitives";
import { Icon } from "../components/system/Icon";
import { useViewed, WorkCard } from "../components/system/WorkCard";
import { useContentState } from "../lib/content";
import { easeOutExpo } from "../lib/motion";
import { getWork, groupWork, WORK_DOORS } from "../lib/projects";
import type { DoorKey } from "../lib/types";

export function WorkPage() {
  const { content } = useContentState();
  const [params, setParams] = useSearchParams();
  const viewed = useViewed();
  const raw = params.get("d");
  const filter: DoorKey | "all" = raw && (WORK_DOORS as string[]).includes(raw) ? (raw as DoorKey) : "all";

  if (!content) return <PageShell title="Work — Shreyash Ojha">{null}</PageShell>;

  const work = getWork(content);
  // NV-01: a project can also be listed under a second discipline (e.g. the INZEX dashboards under merchandising)
  const inDoor = (w: (typeof work)[number], k: DoorKey) => w.door.key === k || Boolean(w.exhibit.also?.includes(k));
  const shown = filter === "all" ? work : work.filter((w) => inDoor(w, filter));
  const activeDoor = filter === "all" ? null : content.doors.find((d) => d.key === filter);
  const sectionDoors = filter === "all" ? WORK_DOORS : [filter];
  const sections = sectionDoors
    .map((k) => {
      const door = content.doors.find((d) => d.key === k);
      if (!door) return null;
      const own = shown.filter((w) => inDoor(w, k) && (filter !== "all" || w.door.key === k));
      return { door, groups: groupWork(own.filter((w) => w.door.key === k), k).concat(
        own.some((w) => w.door.key !== k) ? [{ key: `${k}-related`, title: "Related from other areas", ids: [], items: own.filter((w) => w.door.key !== k) }] : [],
      ) };
    })
    .filter(Boolean) as { door: (typeof content.doors)[number]; groups: ReturnType<typeof groupWork> }[];
  const tabs: { key: DoorKey | "all"; label: string; count: number }[] = [
    { key: "all", label: "All", count: work.length },
    ...WORK_DOORS.map((k) => ({ key: k, label: content.doors.find((d) => d.key === k)?.title ?? k, count: work.filter((w) => inDoor(w, k)).length })),
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

      {/* Sub-headed sections: discipline (when showing All) → themed group → cards */}
      <nav className="workJump" aria-label="Jump to a section">
        {sections.flatMap((sec) => sec.groups).map((g) => (
          <a key={g.key} href={`#${g.key}`} className="workJump__link" onClick={(e) => { e.preventDefault(); document.getElementById(g.key)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
            {g.title} <span className="workJump__count">{g.items.length}</span>
          </a>
        ))}
      </nav>

      <div key={filter}>
        {sections.map((sec) => (
          <section key={sec.door.key} className="workSection" data-d={sec.door.key} aria-labelledby={filter === "all" ? `ws-${sec.door.key}` : undefined}>
            {filter === "all" ? (
              <h2 className="workSection__title" id={`ws-${sec.door.key}`}>
                <Icon name={sec.door.key} size={18} /> {sec.door.title}
              </h2>
            ) : null}
            {sec.groups.map((g) => (
              <div key={g.key} id={g.key} className="workGroup">
                <h3 className="workGroup__title">
                  {g.title} <span className="workGroup__count">{g.items.length}</span>
                </h3>
                <ul className="workGrid workGrid--grouped">
                  {g.items.map((item, i) => (
                    <motion.li
                      key={item.exhibit.id}
                      className="workGrid__item"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOutExpo, delay: 0.1 + i * 0.06 } }}
                      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    >
                      <WorkCard item={item} eager={i < 3} viewed={viewed.has(item.exhibit.id)} />
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </PageShell>
  );
}
