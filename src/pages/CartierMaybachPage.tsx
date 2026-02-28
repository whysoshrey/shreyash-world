import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { MaybachLoader } from "../components/MaybachLoader";
import { MaybachViewer } from "../components/maybach/MaybachViewer";
import { MaybachColorControls } from "../components/maybach/MaybachColorControls";
import "../styles/cartier-maybach.css";

const DEFAULT_BODY = "#0A0A0A";
const DEFAULT_ACCENT = "#C8A35A";
const MAYBACH_GLB_URL = `${import.meta.env.BASE_URL}models/maybach.glb`;

export function CartierMaybachPage() {
  const location = useLocation();
  const [bodyColor, setBodyColor] = useState(DEFAULT_BODY);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT);
  const [heroLightOn, setHeroLightOn] = useState(true);
  const [showEntryLoader, setShowEntryLoader] = useState(Boolean((location.state as { fromMaybachLoader?: boolean } | null)?.fromMaybachLoader));
  const [showDragHint, setShowDragHint] = useState(true);
  const [dragHintText, setDragHintText] = useState("Click and Drag");
  const [modelAvailability, setModelAvailability] = useState<"checking" | "ready" | "missing">("checking");

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
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) setDragHintText("Drag to Rotate");
    const t = window.setTimeout(() => setShowDragHint(false), 5000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    let canceled = false;

    const checkModel = async () => {
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
  }, []);

  return (
    <div className="cmPage">
      <header className="cmHeader">
        <div>Cartier × Maybach</div>
        <nav>
          <a href="#model">Model</a>
          <a href="#concept">Concept</a>
          <a href="#activation">Activation</a>
          <a href="#impact">Impact</a>
          <Link to="/">Back to Portfolio</Link>
        </nav>
      </header>

      <section className="cmHero">
        <div className="cmHeroContent">
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
        </div>
        <div className="cmChips">
          <span>Immersive</span>
          <span>Mobile</span>
          <span>High-touch</span>
          <span>Luxury CRM</span>
        </div>
      </section>

      <section id="model" className="cmModelSection">
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

        <div className="cmModelStage">
          {modelAvailability === "ready" ? (
            <MaybachViewer bodyColor={bodyColor} accentColor={accentColor} heroLightOn={heroLightOn} />
          ) : (
            <div className={`cmModelFallback${modelAvailability === "missing" ? " is-error" : ""}`}>
              {modelAvailability === "missing"
                ? "Maybach model missing. Ensure public/models/maybach.glb exists."
                : "Loading Maybach…"}
            </div>
          )}
          {modelAvailability === "ready" && showDragHint ? (
            <motion.div className="cmDragHint" initial={{ opacity: 0 }} animate={{ opacity: [0.42, 0.95, 0.42], scale: [1, 1.03, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              {dragHintText}
            </motion.div>
          ) : null}
        </div>
      </section>

      <section className="cmFilmSection" aria-labelledby="campaign-film-title">
        <h2 id="campaign-film-title">Campaign Film</h2>
        <p className="cmFilmSubtitle">A cinematic preview of the mobile luxury gallery activation across city-night touchpoints.</p>
        <p className="cmFilmLead">This film communicates the mood, movement, and urban staging logic behind the Cartier x Maybach concept.</p>
        <div className="cmFilmFrame">
          <iframe
            title="Cartier x Maybach Campaign Film"
            src="https://www.youtube-nocookie.com/embed/6uw1hpW63Cg"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <a className="cmFilmLink" href="https://youtu.be/6uw1hpW63Cg?si=UbntEOAya-QT-DJv" target="_blank" rel="noreferrer noopener">
          Watch on YouTube
        </a>
      </section>

      <section className="cmSection">
        <h2>Strategic Concept</h2>
        <div className="cmGrid">
          <article className="cmCard">
            <h3>Campaign Intent</h3>
            <p>
              Cartier Rogue’s narrative is translated from static communication into a physical urban format. The car becomes a mobile expression of Cartier codes that can enter high-value cultural contexts.
            </p>
          </article>
          <article className="cmCard">
            <h3>Audience Fit</h3>
            <p>
              The concept is built for HNW and culturally influential audiences who respond to private, discoverable experiences over traditional mass-format retail impressions.
            </p>
          </article>
        </div>
      </section>

      <section className="cmSection">
        <h2>Experience Journey</h2>
        <div className="cmGrid">
          <article className="cmCard">
            <h3>On-Site Sequence</h3>
            <ul>
              <li>Exterior hook and controlled arrival sequence establish rarity</li>
              <li>Concierge-led movement into curated viewing and storytelling zones</li>
              <li>Contextualized product narratives tied to identity and occasion</li>
              <li>Private consultation capture and appointment handoff</li>
            </ul>
          </article>
          <article className="cmCard">
            <h3>Digital Companion Layer</h3>
            <ul>
              <li>Location-driven social clues and treasure-hunt reveal cadence</li>
              <li>RSVP and QR touchpoints for intent capture and follow-up routing</li>
              <li>Editorial content moments designed for premium social amplification</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="cmSection">
        <h2>Concept Finishes</h2>
        <p className="cmLead">
          Cartier finish studies are calibrated for campaign mood control across city environments. Body and accent selections can be previewed live for deployment alignment.
        </p>
        <p className="cmLead">
          The toolbar above the vehicle controls signature finishes and key-light behavior in real time, allowing rapid concept calibration without interrupting narrative flow.
        </p>
      </section>

      <section id="concept" className="cmSection">
        <h2>Concept Narrative</h2>
        <div className="cmGrid">
          <article className="cmCard">
            <h3>Strategic Idea</h3>
            <p>
              A fleet-based luxury pop-up that converts mobility into brand theatre, turning each stop into a Cartier encounter rather than a passive display.
            </p>
          </article>
          <article className="cmCard">
            <h3>Why Maybach × Cartier</h3>
            <p>
              Both brands operate at the intersection of craft, prestige, and emotional status signaling. The partnership creates immediate category adjacency without diluting either identity.
            </p>
          </article>
          <article className="cmCard">
            <h3>Experience Language</h3>
            <p>
              Cinematic settings, curated displays within Maybach interiors, and editorial lighting cues reinforce luxury, rebellion, and emotional resonance consistent with the Cartier Rogue direction.
            </p>
          </article>
          <article className="cmCard">
            <h3>Campaign Role</h3>
            <p>
              This activation extends campaign visibility from image to lived experience: premium attention capture, qualified relationship intake, and conversion handoff into clienteling.
            </p>
          </article>
        </div>
      </section>

      <section id="activation" className="cmSection">
        <h2>Pop-Up Activation Blueprint</h2>
        <div className="cmGrid">
          <article className="cmCard">
            <h3>Experience Journey</h3>
            <ul>
              <li>Arrival via strong exterior visual hook and chauffeur-led reveal</li>
              <li>Guided discovery inside curated Cartier collection moments</li>
              <li>Product storytelling mapped to style, occasion, and identity cues</li>
              <li>VIP consult and appointment capture for private follow-up</li>
              <li>Conversion pathway into post-event clienteling and concierge outreach</li>
            </ul>
          </article>
          <article className="cmCard">
            <h3>Activation Components</h3>
            <ul>
              <li>Bespoke vehicle exterior transformation for campaign consistency</li>
              <li>Hero display zones and high-photogenic editorial moments</li>
              <li>Street-light inspired lighting strategy for premium night visibility</li>
              <li>Brand ambassadors trained for narrative and product context</li>
              <li>QR, RSVP, CRM capture, and social treasure-hunt tie-ins</li>
              <li>Deployable across luxury districts, VIP events, art fairs, and fashion-week satellites</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="cmSection">
        <h2>Operations &amp; Management</h2>
        <div className="cmGrid">
          <article className="cmCard">
            <h3>Execution Model</h3>
            <p>
              Run as a modular city circuit with pre-cleared permits, timed stop windows, and a daily route playbook. Each stop uses a concise setup protocol to preserve consistency and reduce downtime.
            </p>
          </article>
          <article className="cmCard">
            <h3>Staffing &amp; Security</h3>
            <p>
              Concierge lead, product specialist, crowd-flow support, and security team operate in fixed roles. Inventory handling uses controlled display rotation, locked storage, and custody logs.
            </p>
          </article>
          <article className="cmCard">
            <h3>CRM Workflow</h3>
            <p>
              Each interaction captures intent level, product interest, and follow-up preference. Leads are tagged by city and event context, then routed into boutique/client advisor follow-through.
            </p>
          </article>
          <article className="cmCard">
            <h3>Partnership Layer</h3>
            <p>
              High-fit deployment partners include luxury hotels, private members’ clubs, art fairs, premium retail districts, and invitation-only previews to maintain audience quality.
            </p>
          </article>
        </div>
      </section>

      <section id="impact" className="cmSection">
        <h2>Impact &amp; Brand Value</h2>
        <div className="cmGrid">
          <article className="cmCard">
            <h3>Expected Outcomes</h3>
            <ul>
              <li>Higher memorability through moving brand theatre, not static display</li>
              <li>Deeper HNW engagement through intimate, high-touch interactions</li>
              <li>Social amplification via location reveals and visual exclusivity</li>
              <li>Appointment and consultation pipeline for boutique conversion</li>
              <li>Clear top-of-funnel to clienteling handoff structure</li>
              <li>Portable deployment model for multi-city luxury activations</li>
            </ul>
          </article>
          <article className="cmCard">
            <h3>Strategic Positioning</h3>
            <p>
              The concept positions Cartier Rogue as more than product communication: an emblem of modern elegance and fearless self-expression brought into live urban culture touchpoints.
            </p>
          </article>
        </div>
      </section>

      <section className="cmSection">
        <h2>Closing Perspective</h2>
        <div className="cmGrid">
          <article className="cmCard">
            <h3>Why This Format Matters</h3>
            <p>
              A mobile luxury gallery offers controlled exclusivity, adaptive city deployment, and stronger memory value than static retail-only touchpoints, while feeding direct relationship workflows.
            </p>
          </article>
          <article className="cmCard">
            <h3>Program Potential</h3>
            <p>
              The model supports repeatable launches across luxury districts, airports, art events, and invitation circuits, with each deployment tuned to audience density and campaign objective.
            </p>
          </article>
        </div>
      </section>

      <footer className="cmFooter">
        <Link to="/">Back to Portfolio</Link>
        <Link to="/">Return to Cartier Exhibit</Link>
      </footer>

      <MaybachLoader open={showEntryLoader} text="ENTERING CARTIER × MAYBACH" />
    </div>
  );
}
