import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/global.css";
import "./styles/cinematic.css";

import { LiveWallpaper } from "./components/LiveWallpaper";
import { Topbar } from "./components/Topbar";
import { DoorHall } from "./components/DoorHall";
import { SectionGallery } from "./components/SectionGallery";
import { ExhibitModal } from "./components/ExhibitModal";
import { MaybachLoader } from "./components/MaybachLoader";

import { loadContent } from "./lib/content";
import type { Artifact, Content, DoorKey, Exhibit } from "./lib/types";
import { fadeUp, ease } from "./lib/motion";

type View = "landing" | "hall" | "section";

function PortfolioRail(props: {
  content: Content;
  view: View;
  activeDoor: DoorKey;
  activeExhibitId: string | null;
  onGoHome: () => void;
  onGoHall: () => void;
  onOpenDoor: (key: DoorKey) => void;
  onOpenExhibit: (id: string) => void;
  onOpenArtifact: (artifact: Artifact) => void;
}) {
  const { content, view, activeDoor, activeExhibitId, onGoHome, onGoHall, onOpenDoor, onOpenExhibit, onOpenArtifact } = props;
  const activeDoorData = content.doors.find((door) => door.key === activeDoor) ?? content.doors[0];
  const activeExhibitData = activeExhibitId
    ? content.exhibits[activeDoor].find((exhibit) => exhibit.id === activeExhibitId) ?? null
    : null;
  const resolveArtifactUrl = (url: string) => {
    if (!url.startsWith("/")) return url;
    return `${import.meta.env.BASE_URL}${url.slice(1)}`;
  };

  return (
    <aside className="portfolioRail" aria-label="Portfolio index">
      <div className="portfolioRailLabel">Index</div>

      <div className="portfolioRailUtility">
        <button type="button" className="portfolioRailAnchor" onClick={onGoHome}>
          Home
        </button>

        <button type="button" className={`portfolioRailAnchor${view === "hall" ? " is-active" : ""}`} onClick={onGoHall} aria-current={view === "hall" ? "page" : undefined}>
          Sections
        </button>
      </div>

      <div className="portfolioRailSectionList">
        {content.doors.map((door, index) => {
          const isActive = view === "section" && activeDoor === door.key;
          const doorExhibits = content.exhibits[door.key];

          return (
            <div key={door.key} className={`portfolioRailSectionGroup${isActive ? " is-active" : ""}`}>
              <button
                type="button"
                className={`portfolioRailSection${isActive ? " is-active" : ""}`}
                onClick={() => onOpenDoor(door.key)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="portfolioRailSectionBar" aria-hidden="true" />
                <span className="portfolioRailSectionBody">
                  <span className="portfolioRailIndex">{String(index + 1).padStart(2, "0")}</span>
                  <span className="portfolioRailSectionTitle">{door.title}</span>
                </span>
              </button>

              {isActive ? (
                <div className="portfolioRailExhibitList">
                  {doorExhibits.map((exhibit, exhibitIndex) => {
                    const isActiveExhibit = activeExhibitId === exhibit.id;

                    return (
                      <div key={exhibit.id} className={`portfolioRailExhibitGroup${isActiveExhibit ? " is-active" : ""}`}>
                        <button
                          type="button"
                          className={`portfolioRailExhibit${isActiveExhibit ? " is-active" : ""}`}
                          onClick={() => onOpenExhibit(exhibit.id)}
                          aria-current={isActiveExhibit ? "page" : undefined}
                        >
                          <span className="portfolioRailExhibitIndex">{String(exhibitIndex + 1).padStart(2, "0")}</span>
                          <span className="portfolioRailExhibitTitle">{exhibit.title}</span>
                        </button>

                        {isActiveExhibit ? (
                          <div className="portfolioRailArtifactList">
                            {exhibit.artifacts.map((artifact, artifactIndex) => (
                              <button
                                key={`${exhibit.id}-${artifact.label}`}
                                type="button"
                                className={`portfolioRailArtifact${artifact.variant === "hero" ? " is-hero" : ""}`}
                                onClick={() => {
                                  if (artifact.actionId) {
                                    onOpenArtifact(artifact);
                                    return;
                                  }

                                  window.open(resolveArtifactUrl(artifact.url), "_blank", "noopener,noreferrer");
                                }}
                              >
                                <span className="portfolioRailArtifactIndex">{String(artifactIndex + 1).padStart(2, "0")}</span>
                                <span className="portfolioRailArtifactTitle">{artifact.label}</span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="portfolioRailCurrent" aria-live="polite">
        <span className="portfolioRailCurrentLabel">{activeExhibitData ? "Exhibit" : view === "section" ? "Section" : "At"}</span>
        <span className="portfolioRailCurrentValue">{activeExhibitData ? activeExhibitData.title : view === "section" ? activeDoorData.title : "Portfolio Sections"}</span>
      </div>
    </aside>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<Content | null>(null);
  const [view, setView] = useState<View>("landing");
  const [activeDoor, setActiveDoor] = useState<DoorKey>("ops");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeExhibitId, setActiveExhibitId] = useState<string | null>(null);
  const [wallpaperEnabled, setWallpaperEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
    return !(prefersReducedMotion || isCoarsePointer);
  });
  const [isMaybachLoading, setIsMaybachLoading] = useState(false);
  const [isRogueLoading, setIsRogueLoading] = useState(false);
  const maybachTimerRef = useRef<number | null>(null);
  const rogueTimerRef = useRef<number | null>(null);
  const acme3dHref = `${import.meta.env.BASE_URL}projects/acme-agv-3d.html`;

  useEffect(() => {
    loadContent().then(setContent).catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const exhibits = useMemo(() => (content ? content.exhibits[activeDoor] : []), [content, activeDoor]);

  const activeExhibit: Exhibit | null = useMemo(() => {
    if (!content || !activeExhibitId) return null;
    return content.exhibits[activeDoor].find((e) => e.id === activeExhibitId) ?? null;
  }, [content, activeDoor, activeExhibitId]);

  const openDoor = (key: DoorKey) => {
    setModalOpen(false);
    setActiveExhibitId(null);
    setActiveDoor(key);
    setView("section");
  };

  const openExhibit = (id: string) => {
    setActiveExhibitId(id);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const goHall = () => {
    setModalOpen(false);
    setActiveExhibitId(null);
    setView("hall");
  };

  const goLanding = () => {
    setModalOpen(false);
    setActiveExhibitId(null);
    setView("landing");
  };

  const startMaybachTransition = () => {
    if (isMaybachLoading || isRogueLoading) return;
    setModalOpen(false);
    setIsMaybachLoading(true);
    maybachTimerRef.current = window.setTimeout(() => {
      navigate("/cartier-maybach", { state: { fromMaybachLoader: true } });
      setIsMaybachLoading(false);
      maybachTimerRef.current = null;
    }, 950);
  };

  const startRogueTransition = () => {
    if (isMaybachLoading || isRogueLoading) return;
    setModalOpen(false);
    setIsRogueLoading(true);
    rogueTimerRef.current = window.setTimeout(() => {
      navigate("/cartier-rogue", { state: { fromRogueTransition: true } });
      setIsRogueLoading(false);
      rogueTimerRef.current = null;
    }, 840);
  };

  const handleArtifactAction = (artifact: Artifact) => {
    if (artifact.actionId === "cartier_maybach_route") {
      startMaybachTransition();
      return;
    }

    if (artifact.actionId === "cartier_rogue_route") {
      startRogueTransition();
    }
  };

  useEffect(() => {
    return () => {
      if (maybachTimerRef.current !== null) window.clearTimeout(maybachTimerRef.current);
      if (rogueTimerRef.current !== null) window.clearTimeout(rogueTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const state = location.state as { returnTo?: string } | null;
    if (!content || state?.returnTo !== "cartier_gtm_redirection") return;

    setActiveDoor("brand");
    setView("section");
    setActiveExhibitId("cartier-gtm-redirection");
    setModalOpen(true);

    navigate("/", { replace: true, state: null });
  }, [content, location.state, navigate]);

  const prev = () => {
    if (!activeExhibitId || exhibits.length === 0) return;
    const idx = exhibits.findIndex((e) => e.id === activeExhibitId);
    const nextIdx = (idx - 1 + exhibits.length) % exhibits.length;
    setActiveExhibitId(exhibits[nextIdx].id);
  };

  const next = () => {
    if (!activeExhibitId || exhibits.length === 0) return;
    const idx = exhibits.findIndex((e) => e.id === activeExhibitId);
    const nextIdx = (idx + 1) % exhibits.length;
    setActiveExhibitId(exhibits[nextIdx].id);
  };

  if (!content) {
    return (
      <div className="app">
        <LiveWallpaper enabled={wallpaperEnabled} />
        <div className="shell">
          <main className="stage">
            <div className="panel" style={{ padding: 40, textAlign: "center" }}>
              Loading…
            </div>
          </main>
        </div>
      </div>
    );
  }

  const showBack = view === "section";

  return (
    <div className="app">
      <LiveWallpaper enabled={wallpaperEnabled} />

      <div className="shell">
        <Topbar
          siteName={content.site.name}
          positioning={content.site.positioning}
          links={content.site.links}
          onNavHome={goLanding}
          onBack={showBack ? goHall : undefined}
          showBack={showBack}
          wallpaperEnabled={wallpaperEnabled}
          onToggleWallpaper={() => setWallpaperEnabled((v) => !v)}
        />

        <main className="stage">
          <AnimatePresence mode="wait">
            {view === "landing" ? (
              <div className="panel">
                <motion.div key="landing" className="landing" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                  <div className="landingEyebrow">{content.site.positioning}</div>
                  <h1 className="name">{content.site.name}</h1>
                  <p className="landingRole">B.F.Tech, NIFT Delhi | MPS FM, Parsons School of Design, TNS</p>
                  <p className="value">{content.site.valueProp}</p>
                  <p className="landingBody">
                    Selected work across operational systems, merchandising execution, and brand-led product experiences.
                  </p>
                  <div className="landingActions">
                    <motion.button
                      type="button"
                      className="enter"
                      onClick={goHall}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.25, ease }}
                    >
                      Browse Portfolio
                    </motion.button>
                    <motion.button
                      type="button"
                      className="enter enter--secondary"
                      onClick={() => openDoor("brand")}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.25, ease }}
                    >
                      Art Campaigns
                    </motion.button>
                  </div>
                  <div className="landingFeatureBlock">
                    <div className="landingFeatureHeader">
                      <div className="landingFeatureTitle">Start with the strongest entry points.</div>
                    </div>
                    <div id="landingHighlights" className="landingHighlights">
                      <a className="landingHighlightCard" href={acme3dHref} target="_blank" rel="noreferrer">
                        <span className="landingHighlightKicker">Operational Systems</span>
                        <span className="landingHighlightTitle">ACME AGV 3D Reconstruction</span>
                        <span className="landingHighlightMeta">Interactive robot breakdown and inspection view</span>
                      </a>

                      <button className="landingHighlightCard" type="button" onClick={startMaybachTransition}>
                        <span className="landingHighlightKicker">Brand Experience</span>
                        <span className="landingHighlightTitle">Cartier x Maybach</span>
                        <span className="landingHighlightMeta">Luxury mobility concept with 3D vehicle staging</span>
                      </button>

                      <button className="landingHighlightCard" type="button" onClick={startRogueTransition}>
                        <span className="landingHighlightKicker">Brand Campaign</span>
                        <span className="landingHighlightTitle">Cartier Rogue</span>
                        <span className="landingHighlightMeta">Editorial campaign world, rollout logic, and film</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null}

            {view === "hall" ? (
              <div className="panel panel--content panel--portfolio">
                <div className="portfolioViewport">
                  <PortfolioRail
                    content={content}
                    view={view}
                    activeDoor={activeDoor}
                    activeExhibitId={activeExhibitId}
                    onGoHome={goLanding}
                    onGoHall={goHall}
                    onOpenDoor={openDoor}
                    onOpenExhibit={openExhibit}
                    onOpenArtifact={handleArtifactAction}
                  />

                  <motion.div key="hall" className="portfolioShell" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                    <div className="contentShell contentShell--hall">
                      <div className="glassBackdrop" aria-hidden="true" />

                      <div className="contentShellInner">
                        <div className="hallHeader">
                          <div className="hallEyebrow">Portfolio Sections</div>
                          <h2 className="hallTitle">Browse the work by discipline.</h2>
                          <p className="hallSummary">
                            Explore operating systems, merchandising execution, brand experiences, and credentials from one place.
                          </p>
                        </div>
                        <DoorHall content={content} onOpenDoor={openDoor} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : null}

            {view === "section" ? (
              <div className={`panel panel--content panel--portfolio panel--${view}`}>
                <div className="portfolioViewport">
                  <PortfolioRail
                    content={content}
                    view={view}
                    activeDoor={activeDoor}
                    activeExhibitId={activeExhibitId}
                    onGoHome={goLanding}
                    onGoHall={goHall}
                    onOpenDoor={openDoor}
                    onOpenExhibit={openExhibit}
                    onOpenArtifact={handleArtifactAction}
                  />

                  <motion.div
                    className="portfolioShell portfolioShell--section"
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout
                    transition={{ layout: { duration: 0.32, ease } }}
                  >
                    <div className={`contentShell contentShell--${view}${activeDoor === "merch" && content.exhibits.merch.length <= 2 ? " contentShell--compact" : ""}`}>
                      <div className="glassBackdrop" aria-hidden="true" />

                      <div className="contentShellInner">
                        <AnimatePresence mode="wait">
                          {view === "section" ? (
                            <motion.div key="section-content" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                              <SectionGallery content={content} doorKey={activeDoor} onOpenExhibit={openExhibit} onGoHome={goLanding} />
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : null}
          </AnimatePresence>
        </main>

        <ExhibitModal open={modalOpen} exhibit={activeExhibit} onClose={closeModal} onPrev={prev} onNext={next} onArtifactAction={handleArtifactAction} />
      </div>

      <MaybachLoader open={isMaybachLoading} />
      <AnimatePresence>
        {isRogueLoading ? (
          <motion.div
            className="rogueTransition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            <motion.div
              className="rogueTransitionInner"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="rogueTransitionKicker">Entering</div>
              <div className="rogueTransitionTitle">Cartier Rogue</div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
