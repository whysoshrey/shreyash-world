import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

export default function App() {
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [view, setView] = useState<View>("landing");
  const [activeDoor, setActiveDoor] = useState<DoorKey>("ops");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeExhibitId, setActiveExhibitId] = useState<string | null>(null);
  const [wallpaperEnabled, setWallpaperEnabled] = useState(true);
  const [isMaybachLoading, setIsMaybachLoading] = useState(false);
  const [isRogueLoading, setIsRogueLoading] = useState(false);
  const maybachTimerRef = useRef<number | null>(null);
  const rogueTimerRef = useRef<number | null>(null);

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
    setView("hall");
  };

  const goLanding = () => {
    setModalOpen(false);
    setView("landing");
  };

  const handleArtifactAction = (artifact: Artifact) => {
    if (artifact.actionId === "cartier_maybach_route") {
      if (isMaybachLoading || isRogueLoading) return;
      setModalOpen(false);
      setIsMaybachLoading(true);
      maybachTimerRef.current = window.setTimeout(() => {
        navigate("/cartier-maybach", { state: { fromMaybachLoader: true } });
        setIsMaybachLoading(false);
        maybachTimerRef.current = null;
      }, 950);
      return;
    }

    if (artifact.actionId === "cartier_rogue_route") {
      if (isMaybachLoading || isRogueLoading) return;
      setModalOpen(false);
      setIsRogueLoading(true);
      rogueTimerRef.current = window.setTimeout(() => {
        navigate("/cartier-rogue", { state: { fromRogueTransition: true } });
        setIsRogueLoading(false);
        rogueTimerRef.current = null;
      }, 840);
    }
  };

  useEffect(() => {
    return () => {
      if (maybachTimerRef.current !== null) window.clearTimeout(maybachTimerRef.current);
      if (rogueTimerRef.current !== null) window.clearTimeout(rogueTimerRef.current);
    };
  }, []);

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
          positioning={content.site.positioning}
          links={content.site.links}
          onNavHome={() => (view === "section" ? goHall() : goLanding())}
          showBack={showBack}
          wallpaperEnabled={wallpaperEnabled}
          onToggleWallpaper={() => setWallpaperEnabled((v) => !v)}
        />

        <main className="stage">
          <AnimatePresence mode="wait">
            {view === "landing" ? (
              <div className="panel">
                <motion.div key="landing" className="landing" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                  <h1 className="name">{content.site.name}</h1>
                  <p className="value">B.F.Tech, NIFT Delhi | MPS FM, Parsons School of Design, TNS.</p>
                  <motion.button type="button" className="enter" onClick={() => setView("hall")} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.25, ease }}>
                    {content.site.cta}
                  </motion.button>
                </motion.div>
              </div>
            ) : null}

            {view === "hall" ? (
              <div className="panel panel--hall">
                <motion.div key="hall" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                  <DoorHall content={content} onOpenDoor={openDoor} />
                </motion.div>
              </div>
            ) : null}

            {view === "section" ? (
              <div className={`panel panel--content panel--${view}`}>
                <motion.div
                  className={`contentShell contentShell--${view}${activeDoor === "merch" && content.exhibits.merch.length <= 2 ? " contentShell--compact" : ""}`}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                  transition={{ layout: { duration: 0.32, ease } }}
                >
                  <div className="glassBackdrop" aria-hidden="true" />

                  <div className="contentShellInner">
                    <AnimatePresence mode="wait">
                      {view === "section" ? (
                        <motion.div key="section-content" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                          <SectionGallery content={content} doorKey={activeDoor} onOpenExhibit={openExhibit} />
                          <div style={{ padding: "0 18px 22px", display: "flex", justifyContent: "space-between", gap: 10 }}>
                            <button className="navBtn" type="button" onClick={goHall}>
                              Back
                            </button>
                            <button className="navBtn" type="button" onClick={() => setView("landing")}>
                              Landing
                            </button>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.div>
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
