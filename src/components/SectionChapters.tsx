import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChapterVisualPanel, type ChapterMetric, type ChapterTone } from "./chapters/ChapterVisualPanel";
import type { Content, DoorKey } from "../lib/types";

type ChapterSpec = {
  key: DoorKey;
  label: string;
  title: string;
  body: string;
  cta: string;
  tone: ChapterTone;
  microTagline: string;
  supportLines: string[];
  detailRow: Array<{ label: string; value: string }>;
  highlights: string[];
  metrics?: ChapterMetric[];
};

function buildChapters(content: Content): ChapterSpec[] {
  const totalExhibits = Object.values(content.exhibits).reduce((sum, entries) => sum + entries.length, 0);

  return [
    {
      key: "ops",
      label: "Chapter 01",
      title: "Operational Systems",
      body: "I design operational systems for fashion teams that need clarity at scale — from factory-floor signals to decision-ready workflows. The focus is simple: make complexity measurable, and make execution easier to trust.",
      cta: "Open Operational Systems",
      tone: "ops",
      microTagline: "Instrumentation for dependable execution",
      supportLines: [
        "Operational design starts with signal quality and ends with managerial confidence.",
        "Every layer is built to reduce noise, expose bottlenecks, and keep teams aligned under pressure.",
      ],
      detailRow: [
        { label: "Focus", value: "Factory-floor observability" },
        { label: "Methods", value: "KPI architecture + workflow mapping" },
        { label: "Outcomes", value: "Lower variance and clearer decisions" },
      ],
      highlights: ["Cycle-time intelligence", "Exception escalation", "Decision-ready reporting"],
    },
    {
      key: "merch",
      label: "Chapter 02",
      title: "Merchandising Execution",
      body: "Merchandising is not just taste — it is timing, visibility, and control. This work translates data into retail decisions through dashboards, reporting frameworks, and execution tools built for speed and accountability.",
      cta: "Open Merchandising Execution",
      tone: "merch",
      microTagline: "Cadence, visibility, and commercial precision",
      supportLines: [
        "Planning rhythms are designed for teams that need quick reads on movement, gaps, and response windows.",
        "The objective is disciplined execution across channels without slowing creative or trading instincts.",
      ],
      detailRow: [
        { label: "Focus", value: "Retail decision cadence" },
        { label: "Methods", value: "Dashboard logic + reporting frameworks" },
        { label: "Outcomes", value: "Faster retail actionability" },
      ],
      highlights: ["Trend signal layers", "Assortment visibility", "Category control loops"],
    },
    {
      key: "brand",
      label: "Chapter 03",
      title: "Brand & Product Experiences",
      body: "I develop brand experiences where strategy, storytelling, and interface thinking move together. From campaign concepts to immersive activations, the aim is to build narratives that feel luxurious, original, and commercially sharp.",
      cta: "Open Brand & Product Experiences",
      tone: "brand",
      microTagline: "Editorial storytelling built for conversion",
      supportLines: [
        "Visual language, interaction, and narrative flow are composed as one experience system.",
        "The result is atmosphere with commercial discipline, not aesthetics detached from outcomes.",
      ],
      detailRow: [
        { label: "Focus", value: "Campaign and product narratives" },
        { label: "Methods", value: "Experience mapping + interface choreography" },
        { label: "Outcomes", value: "Memorable and conversion-aware storytelling" },
      ],
      highlights: ["Immersive concepting", "Luxury interaction language", "Narrative retail touchpoints"],
    },
    {
      key: "cred",
      label: "Chapter 04",
      title: "Credentials",
      body: "My foundation combines fashion technology, management training, and applied project work across manufacturing, merchandising, and brand strategy. This section brings together the academic grounding, industry context, and proof behind the practice.",
      cta: "Open Credentials",
      tone: "cred",
      microTagline: "Context, rigor, and applied credibility",
      supportLines: [
        "The trajectory links technical understanding with execution leadership across fashion operations.",
        "It is built on applied projects, institutional grounding, and cross-functional delivery discipline.",
      ],
      detailRow: [
        { label: "Focus", value: "Applied fashion operations" },
        { label: "Methods", value: "Academic rigor + field execution" },
        { label: "Outcomes", value: "Credible strategic delivery" },
      ],
      highlights: ["Manufacturing context", "Merchandising fluency", "Brand strategy grounding"],
      metrics: [
        { label: "Case Files", value: totalExhibits },
        { label: "Core Chapters", value: content.doors.length },
        { label: "Credential Exhibits", value: content.exhibits.cred.length },
      ],
    },
  ];
}

function ChapterSection(props: {
  chapter: ChapterSpec;
  content: Content;
  onOpenDoor: (key: DoorKey) => void;
  onGoLanding: () => void;
  onSetActive: (key: DoorKey) => void;
  onRegisterRef: (key: DoorKey, el: HTMLElement | null) => void;
}) {
  const { chapter, content, onOpenDoor, onGoLanding, onSetActive, onRegisterRef } = props;
  const door = content.doors.find((d) => d.key === chapter.key);
  const count = content.exhibits[chapter.key].length;

  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { amount: 0.55 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const visualY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const visualScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.97]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0.58, 0.84, 1, 0.84, 0.58]);

  const setSectionNode = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      onRegisterRef(chapter.key, node);
    },
    [chapter.key, onRegisterRef],
  );

  useEffect(() => {
    if (isInView) onSetActive(chapter.key);
  }, [chapter.key, isInView, onSetActive]);

  return (
    <motion.article
      ref={setSectionNode}
      className={`chapterHero chapterHero--${chapter.tone}`}
      data-active={isInView ? "true" : "false"}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.25, once: false }}
      transition={{ duration: 0.6, ease: [0.2, 0.65, 0.2, 1] }}
    >
      <div className="chapterAmbient" aria-hidden="true" />
      <div className="chapterHeroGrid">
        <motion.div
          className="chapterContentCol"
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.76, y: 14 }}
          transition={{ duration: 0.45, ease: [0.2, 0.65, 0.2, 1] }}
        >
          <div className="chapterKicker">
            <span>{chapter.label}</span>
            <span>{count} Exhibits</span>
          </div>
          <h2 className="chapterTitle">{chapter.title}</h2>
          <div className="chapterTaglineRow">
            <p className="chapterMicroTag">{chapter.microTagline}</p>
            {door?.thesis ? <p className="chapterThesis">{door.thesis}</p> : null}
          </div>
          <p className="chapterText">{chapter.body}</p>
          <div className="chapterSupportLines" aria-label="Supporting Summary">
            {chapter.supportLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="chapterDetailRow" aria-label="Chapter Details">
            {chapter.detailRow.map((detail) => (
              <div key={detail.label} className="chapterDetailItem">
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </div>
            ))}
          </div>

          <div className="chapterCtaRow">
            <button type="button" className="chapterCta" onClick={() => onOpenDoor(chapter.key)}>
              {chapter.cta}
            </button>
            <button type="button" className="chapterCta chapterCta--ghost" onClick={onGoLanding}>
              Back to Landing
            </button>
          </div>
        </motion.div>

        <motion.div
          className={`chapterVisualCol ${isInView ? "is-active" : ""}`}
          style={
            reduceMotion
              ? undefined
              : {
                  y: visualY,
                  scale: visualScale,
                  opacity: visualOpacity,
                }
          }
        >
          <ChapterVisualPanel tone={chapter.tone} isActive={isInView} metrics={chapter.metrics} />
        </motion.div>
      </div>

      <div className="chapterLowerStrip" aria-label="Chapter Highlights">
        {chapter.highlights.map((item) => (
          <div key={item} className="chapterLowerStripItem">
            {item}
          </div>
        ))}
      </div>
    </motion.article>
  );
}

export function SectionChapters(props: { content: Content; onOpenDoor: (key: DoorKey) => void; onGoLanding: () => void }) {
  const { content, onOpenDoor, onGoLanding } = props;
  const reduceMotion = useReducedMotion();
  const chapters = useMemo(() => buildChapters(content), [content]);
  const [activeKey, setActiveKey] = useState<DoorKey>(chapters[0].key);
  const sectionRefs = useRef<Record<DoorKey, HTMLElement | null>>({
    ops: null,
    merch: null,
    brand: null,
    cred: null,
  });

  const onRegisterRef = useCallback((key: DoorKey, el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  }, []);

  const scrollToChapter = (key: DoorKey) => {
    sectionRefs.current[key]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section className="chapterStackWrap" aria-label="Portfolio Chapters">
      <aside className="chapterProgress" aria-label="Chapter Navigation">
        {chapters.map((chapter) => (
          <button
            key={chapter.key}
            type="button"
            className={`chapterProgressItem ${activeKey === chapter.key ? "is-active" : ""}`}
            onClick={() => scrollToChapter(chapter.key)}
            aria-label={`Jump to ${chapter.title}`}
          >
            <span>{chapter.label.replace("Chapter ", "")}</span>
            <small>{chapter.title}</small>
          </button>
        ))}
      </aside>

      <div className="chapterStack">
        {chapters.map((chapter) => (
          <ChapterSection
            key={chapter.key}
            chapter={chapter}
            content={content}
            onOpenDoor={onOpenDoor}
            onGoLanding={onGoLanding}
            onSetActive={setActiveKey}
            onRegisterRef={onRegisterRef}
          />
        ))}
      </div>
    </section>
  );
}
