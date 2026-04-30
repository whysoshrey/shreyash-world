import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MaybachLoader } from "../components/MaybachLoader";
import { ScrollParallaxLayer } from "../components/ScrollParallaxLayer";
import { MaybachColorControls } from "../components/maybach/MaybachColorControls";
import "../styles/cartier-maybach.css";

const DEFAULT_BODY = "#0A0A0A";
const DEFAULT_ACCENT = "#C8A35A";
const MAYBACH_GLB_URL = `${import.meta.env.BASE_URL}models/maybach.glb`;
const LOW_DATA_EFFECTIVE_TYPES = new Set(["slow-2g", "2g", "3g"]);

const MaybachViewer = lazy(() =>
  import("../components/maybach/MaybachViewer").then((module) => ({ default: module.MaybachViewer })),
);

type ConnectionInfo = {
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
  effectiveType?: string;
  saveData?: boolean;
};

const sectionReveal = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: [0.2, 0.65, 0.2, 1] },
  },
};

const staggerGrid = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export function CartierMaybachPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const modelStageRef = useRef<HTMLDivElement | null>(null);
  const [bodyColor, setBodyColor] = useState(DEFAULT_BODY);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT);
  const [heroLightOn, setHeroLightOn] = useState(true);
  const [showEntryLoader, setShowEntryLoader] = useState(Boolean((location.state as { fromMaybachLoader?: boolean } | null)?.fromMaybachLoader));
  const [showDragHint, setShowDragHint] = useState(false);
  const [dragHintText, setDragHintText] = useState("Click and Drag");
  const [modelAvailability, setModelAvailability] = useState<"idle" | "checking" | "ready" | "missing">("idle");
  const [shouldAutoloadModel, setShouldAutoloadModel] = useState(false);
  const [shouldLoadModel, setShouldLoadModel] = useState(false);
  const [useCompactViewer, setUseCompactViewer] = useState(false);
  const [viewerModeReady, setViewerModeReady] = useState(false);

  useEffect(() => {
    if (!showEntryLoader) return;
    const t = window.setTimeout(() => setShowEntryLoader(false), 300);
    return () => window.clearTimeout(t);
  }, [showEntryLoader]);

  useEffect(() => {
    document.body.classList.add("cmRoute");
    return () => {
      document.body.classList.remove("cmRoute");
    };
  }, []);

  useEffect(() => {
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const compactQuery = window.matchMedia("(max-width: 920px)");
    const connection = (navigator as Navigator & { connection?: ConnectionInfo }).connection;

    const updateViewerMode = () => {
      const coarsePointer = coarseQuery.matches || navigator.maxTouchPoints > 0;
      const compactViewer = coarsePointer || compactQuery.matches;
      const constrainedNetwork = Boolean(connection?.saveData) || LOW_DATA_EFFECTIVE_TYPES.has(connection?.effectiveType ?? "");

      setDragHintText(coarsePointer ? "Drag to Rotate" : "Click and Drag");
      setUseCompactViewer(compactViewer);
      setShouldAutoloadModel(!compactViewer && !constrainedNetwork);
      setViewerModeReady(true);
    };

    updateViewerMode();

    coarseQuery.addEventListener("change", updateViewerMode);
    compactQuery.addEventListener("change", updateViewerMode);
    connection?.addEventListener?.("change", updateViewerMode);

    return () => {
      coarseQuery.removeEventListener("change", updateViewerMode);
      compactQuery.removeEventListener("change", updateViewerMode);
      connection?.removeEventListener?.("change", updateViewerMode);
    };
  }, []);

  useEffect(() => {
    if (!shouldAutoloadModel || shouldLoadModel) return;
    const stage = modelStageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setShouldLoadModel(true);
        observer.disconnect();
      },
      { rootMargin: "220px 0px" },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, [shouldAutoloadModel, shouldLoadModel]);

  useEffect(() => {
    if (!shouldLoadModel) return;
    let canceled = false;

    const checkModel = async () => {
      setModelAvailability("checking");
      try {
        const res = await fetch(MAYBACH_GLB_URL, { method: "HEAD" });
        if (canceled) return;
        setModelAvailability(res.ok ? "ready" : "missing");
      } catch {
        if (!canceled) setModelAvailability("missing");
      }
    };

    checkModel();
    return () => {
      canceled = true;
    };
  }, [shouldLoadModel]);

  useEffect(() => {
    if (modelAvailability !== "ready") return;
    setShowDragHint(true);
    const t = window.setTimeout(() => setShowDragHint(false), 5000);
    return () => window.clearTimeout(t);
  }, [modelAvailability]);

  return (
    <div className="cmPage">
      <header className="cmHeader">
        <div>Cartier × Maybach</div>
        <nav>
          <button
            type="button"
            onClick={() =>
              navigate("/", {
                state: { returnTo: "cartier_gtm_redirection" },
              })
            }
          >
            Back to Cartier GTM
          </button>
          <a href="#overview">Overview</a>
          <a href="#model">Model</a>
          <a href="#film">Film</a>
          <a href="#activation">Activation</a>
          <a href="#operations">Operations</a>
          <a href="#impact">Impact</a>
          <Link to="/">Back to Portfolio</Link>
        </nav>
      </header>

      <motion.section
        id="overview"
        className="cmHero"
        initial="hidden"
        animate="show"
        variants={sectionReveal}
      >
        <ScrollParallaxLayer className="cmHeroContent cmScrollFloat" distance={22} scaleDelta={0.012}>
          <h1>Cartier × Maybach</h1>
          <p className="cmSubtitle">A mobile luxury gallery concept for high-net-worth urban audiences</p>
          <p>
            The concept extends Cartier Rogue into a moving luxury stage: bespoke Maybach vehicles transformed into mobile Cartier galleries,
            merging ultra-luxury automotive design with high-jewelry storytelling in city environments.
          </p>
          <p>
            From luxury districts and private events to art fairs and nightlife corridors, the activation creates a premium encounter format that
            keeps Cartier visible where affluent audiences already gather, while maintaining high editorial control across each city drop.
          </p>
          <div className="cmMeta">
            <span>Format: Luxury Pop-Up Activation</span>
            <span>Brand Direction: Cartier (Campaign Extension)</span>
            <span>Mobility Platform: Maybach</span>
            <span>Focus: Experience + Storytelling + Conversion</span>
          </div>
          <div className="cmHeroActions">
            <a className="cmHeroLink" href="#model">Jump to 3D Model</a>
            <a className="cmHeroLink cmHeroLink--secondary" href="#activation">See Activation Plan</a>
          </div>
        </ScrollParallaxLayer>
        <ScrollParallaxLayer className="cmChips cmScrollFloat" distance={28} scaleDelta={0.014}>
          <span>Immersive</span>
          <span>Mobile</span>
          <span>High-touch</span>
          <span>Luxury CRM</span>
        </ScrollParallaxLayer>
      </motion.section>

      <motion.section
        id="model"
        className="cmModelSection"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="cmToolbarWrap" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.35 }}>
          <MaybachColorControls
            bodyColor={bodyColor}
            accentColor={accentColor}
            heroLightOn={heroLightOn}
            onBodyColor={setBodyColor}
            onAccentColor={setAccentColor}
            onToggleHeroLight={() => setHeroLightOn((v) => !v)}
            onReset={() => {
              setBodyColor(DEFAULT_BODY);
              setAccentColor(DEFAULT_ACCENT);
              setHeroLightOn(true);
            }}
          />
        </motion.div>

        <ScrollParallaxLayer className="cmModelStageWrap cmScrollFloat" distance={18} scaleDelta={0.01}>
          <div ref={modelStageRef} className={`cmModelStage${useCompactViewer ? " is-compact" : ""}${!shouldLoadModel ? " is-idle" : ""}`}>
            {shouldLoadModel ? (
              modelAvailability === "ready" ? (
                <Suspense
                  fallback={
                    <div className="cmModelFallback">
                      Preparing Maybach viewer…
                    </div>
                  }
                >
                  <MaybachViewer
                    bodyColor={bodyColor}
                    accentColor={accentColor}
                    heroLightOn={heroLightOn}
                    compactMode={useCompactViewer}
                  />
                </Suspense>
              ) : (
                <div className={`cmModelFallback${modelAvailability === "missing" ? " is-error" : ""}`}>
                  {modelAvailability === "missing"
                    ? "Maybach model missing. Ensure public/models/maybach.glb exists."
                    : "Preparing Maybach…"}
                </div>
              )
            ) : viewerModeReady && !shouldAutoloadModel ? (
              <div className="cmModelFallback cmModelFallback--interactive">
                <p className="cmModelFallbackKicker">Interactive Preview</p>
                <h3>Load the 3D Maybach when you&apos;re ready.</h3>
                <p>
                  On phones and data-aware connections, the live model stays on demand so the rest of the page remains fast and
                  easy to scroll.
                </p>
                <button type="button" className="cmModelCta" onClick={() => setShouldLoadModel(true)}>
                  Load 3D Model
                </button>
              </div>
            ) : (
              <div className="cmModelFallback">
                Preparing Maybach…
              </div>
            )}
            {modelAvailability === "ready" && showDragHint ? (
              <motion.div className="cmDragHint" initial={{ opacity: 0 }} animate={{ opacity: [0.42, 0.95, 0.42], scale: [1, 1.03, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                {dragHintText}
              </motion.div>
            ) : null}
          </div>
        </ScrollParallaxLayer>
        <motion.div
          className="cmModelIntro"
          variants={staggerGrid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p className="cmLead" variants={sectionReveal}>
            The live model is the fastest way to understand the concept: Cartier finish studies, night-light behavior,
            and the premium stance of the vehicle can be evaluated without leaving the story.
          </motion.p>
          <motion.p className="cmLead" variants={sectionReveal}>
            On smaller screens and constrained connections, the viewer stays on demand so the page remains quick to
            browse before you opt into the heavier interaction.
          </motion.p>
        </motion.div>
      </motion.section>

      <motion.section
        id="film"
        className="cmFilmSection"
        aria-labelledby="campaign-film-title"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 id="campaign-film-title">Campaign Film</h2>
        <p className="cmFilmSubtitle">A cinematic preview of the mobile luxury gallery activation across city-night touchpoints.</p>
        <p className="cmFilmLead">This film communicates the mood, movement, and urban staging logic behind the Cartier x Maybach concept.</p>
        <ScrollParallaxLayer className="cmScrollFloat" distance={16} scaleDelta={0.012}>
          <div className="cmFilmFrame">
            <iframe
              title="Cartier x Maybach Campaign Film"
              src="https://www.youtube-nocookie.com/embed/6uw1hpW63Cg"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </ScrollParallaxLayer>
        <a className="cmFilmLink" href="https://youtu.be/6uw1hpW63Cg?si=UbntEOAya-QT-DJv" target="_blank" rel="noreferrer noopener">
          Watch on YouTube
        </a>
      </motion.section>

      <motion.section
        className="cmSection"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.16 }}
      >
        <h2>Concept Overview</h2>
        <p className="cmLead">
          Cartier Rogue is translated from image-making into a controlled urban encounter format: a Maybach becomes a
          moving Cartier stage rather than a passive vehicle wrap or one-off stunt.
        </p>
        <motion.div className="cmGrid" variants={staggerGrid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }}>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Strategic Idea</h3>
            <p>
              A fleet-based luxury pop-up that converts mobility into brand theatre, turning each stop into a Cartier encounter rather than a passive display.
            </p>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Audience Fit</h3>
            <p>
              The format is built for high-net-worth and culturally influential audiences who respond to private,
              discoverable experiences over traditional mass-format retail impressions.
            </p>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Why Maybach × Cartier</h3>
            <p>
              Both brands operate at the intersection of craft, prestige, and emotional status signaling. The partnership creates immediate category adjacency without diluting either identity.
            </p>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Experience Language</h3>
            <p>
              Cinematic settings, curated displays within Maybach interiors, and editorial lighting cues reinforce luxury, rebellion, and emotional resonance consistent with the Cartier Rogue direction.
            </p>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Campaign Role</h3>
            <p>
              This activation extends campaign visibility from image to lived experience: premium attention capture, qualified relationship intake, and conversion handoff into clienteling.
            </p>
          </motion.article>
        </motion.div>
      </motion.section>

      <motion.section
        id="activation"
        className="cmSection"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.16 }}
      >
        <h2>Activation Blueprint</h2>
        <p className="cmLead">
          The experience is designed as a premium arrival-and-discovery sequence with clear CRM capture, strong visual
          theatre, and enough portability to travel across luxury districts, events, and invitation-only circuits.
        </p>
        <motion.div className="cmGrid" variants={staggerGrid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }}>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Guest Journey</h3>
            <ul>
              <li>Arrival via strong exterior visual hook and chauffeur-led reveal</li>
              <li>Guided discovery inside curated Cartier collection moments</li>
              <li>Product storytelling mapped to style, occasion, and identity cues</li>
              <li>VIP consult and appointment capture for private follow-up</li>
              <li>Conversion pathway into post-event clienteling and concierge outreach</li>
            </ul>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Experience System</h3>
            <ul>
              <li>Bespoke vehicle exterior transformation for campaign consistency</li>
              <li>Hero display zones and high-photogenic editorial moments</li>
              <li>Street-light inspired lighting strategy for premium night visibility</li>
              <li>Brand ambassadors trained for narrative and product context</li>
              <li>QR, RSVP, CRM capture, and social treasure-hunt tie-ins</li>
              <li>Deployable across luxury districts, VIP events, art fairs, and fashion-week satellites</li>
            </ul>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Digital Companion Layer</h3>
            <ul>
              <li>Location-driven social clues and treasure-hunt reveal cadence</li>
              <li>RSVP and QR touchpoints for intent capture and follow-up routing</li>
              <li>Editorial content moments designed for premium social amplification</li>
            </ul>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Why This Format Works</h3>
            <p>
              A mobile luxury gallery creates controlled exclusivity, adaptable city deployment, and stronger memory
              value than static retail-only touchpoints while feeding direct relationship workflows.
            </p>
          </motion.article>
        </motion.div>
      </motion.section>

      <motion.section
        id="operations"
        className="cmSection"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.16 }}
      >
        <h2>Operations &amp; Relationship Flow</h2>
        <motion.div className="cmGrid" variants={staggerGrid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }}>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Execution Model</h3>
            <p>
              Run as a modular city circuit with pre-cleared permits, timed stop windows, and a daily route playbook. Each stop uses a concise setup protocol to preserve consistency and reduce downtime.
            </p>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Staffing &amp; Security</h3>
            <p>
              Concierge lead, product specialist, crowd-flow support, and security team operate in fixed roles. Inventory handling uses controlled display rotation, locked storage, and custody logs.
            </p>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>CRM Workflow</h3>
            <p>
              Each interaction captures intent level, product interest, and follow-up preference. Leads are tagged by city and event context, then routed into boutique/client advisor follow-through.
            </p>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Partnership Layer</h3>
            <p>
              High-fit deployment partners include luxury hotels, private members’ clubs, art fairs, premium retail districts, and invitation-only previews to maintain audience quality.
            </p>
          </motion.article>
        </motion.div>
      </motion.section>

      <motion.section
        id="impact"
        className="cmSection"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.16 }}
      >
        <h2>Impact &amp; Brand Value</h2>
        <motion.div className="cmGrid" variants={staggerGrid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }}>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Expected Outcomes</h3>
            <ul>
              <li>Higher memorability through moving brand theatre, not static display</li>
              <li>Deeper HNW engagement through intimate, high-touch interactions</li>
              <li>Social amplification via location reveals and visual exclusivity</li>
              <li>Appointment and consultation pipeline for boutique conversion</li>
              <li>Clear top-of-funnel to clienteling handoff structure</li>
              <li>Portable deployment model for multi-city luxury activations</li>
            </ul>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Strategic Positioning</h3>
            <p>
              The concept positions Cartier Rogue as more than product communication: an emblem of modern elegance and fearless self-expression brought into live urban culture touchpoints.
            </p>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Program Potential</h3>
            <p>
              The model supports repeatable launches across luxury districts, airports, art events, and invitation circuits, with each deployment tuned to audience density and campaign objective.
            </p>
          </motion.article>
          <motion.article className="cmCard" variants={sectionReveal}>
            <h3>Brand Outcome</h3>
            <p>
              The end state is a luxury activation system that feels cinematic in public, private in experience, and measurable in follow-through.
            </p>
          </motion.article>
        </motion.div>
      </motion.section>

      <footer className="cmFooter">
        <Link to="/">Back to Portfolio</Link>
        <Link to="/" state={{ returnTo: "cartier_gtm_redirection" }}>Return to Cartier Exhibit</Link>
      </footer>

      <MaybachLoader open={showEntryLoader} text="ENTERING CARTIER × MAYBACH" />
    </div>
  );
}
