import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState, type MouseEvent } from "react";

export type ChapterTone = "ops" | "merch" | "brand" | "cred";

export type ChapterMetric = {
  label: string;
  value: number;
  suffix?: string;
};

type ChapterVisualPanelProps = {
  tone: ChapterTone;
  isActive: boolean;
  metrics?: ChapterMetric[];
};

export function ChapterVisualPanel(props: ChapterVisualPanelProps) {
  const { tone, isActive, metrics = [] } = props;

  if (tone === "ops") return <OperationalVisual isActive={isActive} />;
  if (tone === "merch") return <MerchVisual isActive={isActive} />;
  if (tone === "brand") return <BrandVisual isActive={isActive} />;
  return <CredentialsVisual isActive={isActive} metrics={metrics} />;
}

function OperationalVisual(props: { isActive: boolean }) {
  const { isActive } = props;
  const uid = useId().replace(/:/g, "");
  const opsPathA = `${uid}-ops-path-a`;
  const opsPathB = `${uid}-ops-path-b`;
  const opsPathC = `${uid}-ops-path-c`;

  return (
    <div className={`chapterVisual chapterVisual--ops ${isActive ? "is-active" : ""}`} aria-hidden="true">
      <div className="opsMeasureRows" />
      <svg className="opsNetwork" viewBox="0 0 720 460" preserveAspectRatio="none">
        <path id={opsPathA} className="opsPath" d="M40 360 C130 310, 190 260, 260 250 S390 300, 470 240 S610 140, 680 170" />
        <path id={opsPathB} className="opsPath" d="M40 180 C120 150, 180 110, 260 140 S380 220, 470 190 S610 80, 680 110" />
        <path id={opsPathC} className="opsPath" d="M40 280 C120 250, 180 210, 250 220 S360 270, 450 260 S590 220, 680 260" />

        <g className="opsTravelers">
          <circle className="opsDot" r="4">
            <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
              <mpath href={`#${opsPathA}`} xlinkHref={`#${opsPathA}`} />
            </animateMotion>
          </circle>
          <circle className="opsDot" r="4">
            <animateMotion dur="10.2s" repeatCount="indefinite" begin="-3.2s" rotate="auto">
              <mpath href={`#${opsPathB}`} xlinkHref={`#${opsPathB}`} />
            </animateMotion>
          </circle>
          <circle className="opsDot" r="4">
            <animateMotion dur="8.8s" repeatCount="indefinite" begin="-1.6s" rotate="auto">
              <mpath href={`#${opsPathC}`} xlinkHref={`#${opsPathC}`} />
            </animateMotion>
          </circle>
        </g>
      </svg>
      <div className="opsKpiTiles">
        <span>Cycle Time</span>
        <span>Output</span>
        <span>Variance</span>
        <span>Signal</span>
      </div>
    </div>
  );
}

function MerchVisual(props: { isActive: boolean }) {
  const { isActive } = props;
  const uid = useId().replace(/:/g, "");
  const trendPathId = `${uid}-merch-trend`;
  const bars = [0.26, 0.33, 0.46, 0.4, 0.58, 0.62, 0.69, 0.6, 0.48];
  const trendPath = useMemo(() => {
    const points = bars.map((bar, index) => {
      const x = ((index + 0.5) / bars.length) * 640;
      const y = 186 - bar * 138;
      return { x, y };
    });

    return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  }, [bars]);

  return (
    <div className={`chapterVisual chapterVisual--merch ${isActive ? "is-active" : ""}`} aria-hidden="true">
      <div className="merchChartArea">
        {bars.map((value, index) => (
          <motion.span
            key={index}
            className="merchBar"
            initial={false}
            animate={{ scaleY: isActive ? 1 : 0.55, opacity: isActive ? 0.95 : 0.52 }}
            transition={{ duration: 0.82, delay: index * 0.05, ease: [0.2, 0.65, 0.2, 1] }}
            style={{ ["--bar-height" as string]: `${value * 100}%` }}
          />
        ))}
        <svg className="merchWave" viewBox="0 0 640 210" preserveAspectRatio="none">
          <path id={trendPathId} d={trendPath} />
          <circle className="merchWaveDot" r="4">
            <animateMotion dur="8.2s" repeatCount="indefinite" rotate="auto">
              <mpath href={`#${trendPathId}`} xlinkHref={`#${trendPathId}`} />
            </animateMotion>
          </circle>
        </svg>
      </div>
      <div className="merchChipCloud">
        <span>Sell-through</span>
        <span>Assortment</span>
        <span>Velocity</span>
        <span>Forecast</span>
      </div>
      <div className="merchMatrix" />
    </div>
  );
}

function BrandVisual(props: { isActive: boolean }) {
  const { isActive } = props;
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const updateParallax = (x: number, y: number) => {
    if (!panelRef.current) return;
    panelRef.current.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
    panelRef.current.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
  };

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    const nextX = offsetX * 12;
    const nextY = offsetY * 12;

    if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = window.requestAnimationFrame(() => updateParallax(nextX, nextY));
  };

  const onMouseLeave = () => {
    if (reduceMotion) return;
    if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = window.requestAnimationFrame(() => updateParallax(0, 0));
  };

  useEffect(
    () => () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <div
      ref={panelRef}
      className={`chapterVisual chapterVisual--brand ${isActive ? "is-active" : ""}`}
      aria-hidden="true"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <figure className="brandTile brandTile--one">
        <img loading="lazy" src="/assets/cartier-rogue/01_hero/hero_rogue_face_close_crop.png" alt="" />
      </figure>
      <figure className="brandTile brandTile--two">
        <img loading="lazy" src="/assets/cartier-rogue/02_products/product_bracelet_ultra_detail.png" alt="" />
      </figure>
      <figure className="brandTile brandTile--three">
        <img loading="lazy" src="/assets/cartier-rogue/05_ui/ui_desktop_mockup.png" alt="" />
      </figure>
      <figure className="brandTile brandTile--four">
        <img loading="lazy" src="/assets/cartier-rogue/03_environment/env_red_drape_gold_detail.png" alt="" />
      </figure>
      <div className="brandGuideLines" />
      <div className="brandShimmer" />
    </div>
  );
}

function CredentialsVisual(props: { isActive: boolean; metrics: ChapterMetric[] }) {
  const { isActive, metrics } = props;

  return (
    <div className={`chapterVisual chapterVisual--cred ${isActive ? "is-active" : ""}`} aria-hidden="true">
      <div className="credTimeline">
        {["2019", "2021", "2023", "2025"].map((year, index) => (
          <div className="credNode" key={year} style={{ ["--node-delay" as string]: `${index * 0.22}s` }}>
            <span>{year}</span>
          </div>
        ))}
      </div>

      <div className="credMetrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="credMetricCard">
            <strong>
              <MetricCounter target={metric.value} active={isActive} suffix={metric.suffix} />
            </strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="credBadgeRow">
        <span>NIFT Delhi</span>
        <span>Parsons</span>
        <span>Operations</span>
      </div>
    </div>
  );
}

function MetricCounter(props: { target: number; active: boolean; suffix?: string }) {
  const { target, active, suffix = "" } = props;
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? target : 0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return;
    }

    if (!active || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    let rafId = 0;
    const start = performance.now();
    const duration = 1000;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [active, reduceMotion, target]);

  return (
    <>
      {value}
      {suffix}
    </>
  );
}
