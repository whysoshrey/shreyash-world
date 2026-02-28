import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MaybachLoader } from "../components/MaybachLoader";
import "../styles/cartier-rogue.css";

const NEW_BASE = `${import.meta.env.BASE_URL}assets/cartier-rogue/new%20photos`;
const OLD_BASE = `${import.meta.env.BASE_URL}assets/cartier-rogue/old%20photos`;
const NNBSP = "\u202f";

type SupportVisual = {
  src: string;
  alt: string;
  caption: string;
  kind: "portrait" | "landscape";
  fit?: "cover" | "contain";
  position?: string;
};

type FrameworkCard = {
  key: "What" | "Who" | "Why" | "Where" | "When";
  body: string;
};

type RolloutPhase = {
  phase: string;
  title: string;
  body: string;
  channels: string[];
  visual: SupportVisual;
};

const oldPath = (filename: string) => `${OLD_BASE}/${encodeURIComponent(filename)}`;
const oldFile = (time: string) => `Screenshot 2026-02-23 at ${time}${NNBSP}PM.png`;

const newHeroImages = [
  `${NEW_BASE}/Shreyash_a_victoria_era_lady_in_regal_clothing_and_regal_cart_4ecb160e-9879-4bbd-9769-71fb41ec1189_1.png`,
  `${NEW_BASE}/Shreyash_a_victoria_era_lady_in_regal_clothing_and_regal_cart_9096dd56-6bd1-4ff8-9b05-67b4cc0c05f9_1.png`,
  `${NEW_BASE}/Shreyash_a_victoria_era_lady_in_regal_clothing_and_regal_cart_9096dd56-6bd1-4ff8-9b05-67b4cc0c05f9_2.png`,
  `${NEW_BASE}/Shreyash_a_victoria_era_lady_in_regal_clothing_and_regal_cart_4ecb160e-9879-4bbd-9769-71fb41ec1189_3.png`,
  `${NEW_BASE}/Shreyash_a_victoria_era_lady_in_regal_clothing_and_regal_cart_c6d5c6af-2d41-4884-b76e-07b4d712a1b6_3.png`,
  `${NEW_BASE}/Shreyash_a_victoria_era_lady_in_regal_clothing_and_regal_cart_d9181ea4-ed70-48e3-bbdf-067941ba3824_3.png`,
  `${NEW_BASE}/Shreyash_slow_motion_240_fps_cinematic_steadycam_track_from_b_199ead9e-9e48-4ccd-849f-1f4305486e74_0.png`,
] as const;

const oldSupportImages = {
  lookbook: oldPath(oldFile("11.50.16")),
  moodboard: oldPath(oldFile("11.50.28")),
  braceletA: oldPath(oldFile("11.50.37")),
  braceletB: oldPath(oldFile("11.50.48")),
  banner: oldPath(oldFile("11.50.59")),
  oohNight: oldPath(oldFile("11.51.11")),
  billboardVar: oldPath(oldFile("11.51.19")),
  phone: oldPath(oldFile("11.51.32")),
  streetBillboard: oldPath(oldFile("11.51.40")),
  busShelter: oldPath(oldFile("11.51.54")),
  cityScreen: oldPath(oldFile("11.52.01")),
  airport: oldPath(oldFile("11.52.10")),
} as const;

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.2, 0.65, 0.2, 1] },
  },
};

function SupportCard({ visual, className = "" }: { visual: SupportVisual; className?: string }) {
  return (
    <motion.figure
      className={`crSupportCard ${visual.kind === "portrait" ? "is-portrait" : "is-landscape"} ${visual.fit === "contain" ? "is-contain" : ""} ${className}`.trim()}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <img
        src={visual.src}
        alt={visual.alt}
        loading="lazy"
        style={visual.position ? { objectPosition: visual.position } : undefined}
      />
      <figcaption>{visual.caption}</figcaption>
    </motion.figure>
  );
}

export function CartierRoguePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showEntryVeil, setShowEntryVeil] = useState(
    Boolean((location.state as { fromRogueTransition?: boolean } | null)?.fromRogueTransition),
  );
  const [isMaybachLoading, setIsMaybachLoading] = useState(false);
  const maybachTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.classList.add("crRoute");
    return () => document.body.classList.remove("crRoute");
  }, []);

  useEffect(() => {
    if (!showEntryVeil) return;
    const t = window.setTimeout(() => setShowEntryVeil(false), 760);
    return () => window.clearTimeout(t);
  }, [showEntryVeil]);

  useEffect(() => {
    return () => {
      if (maybachTimerRef.current !== null) {
        window.clearTimeout(maybachTimerRef.current);
      }
    };
  }, []);

  const openMaybachFromRogue = () => {
    if (isMaybachLoading) return;
    setIsMaybachLoading(true);
    maybachTimerRef.current = window.setTimeout(() => {
      navigate("/cartier-maybach", { state: { fromMaybachLoader: true } });
      setIsMaybachLoading(false);
      maybachTimerRef.current = null;
    }, 950);
  };

  const frameworkCards = useMemo<FrameworkCard[]>(
    () => [
      {
        key: "What",
        body: "Cartier Rogue is a speculative campaign platform spanning editorial, digital, OOH, and experiential touchpoints.",
      },
      {
        key: "Who",
        body: "Culture-led younger luxury audiences: identity-driven, fashion-native, globally aware, and emotionally selective.",
      },
      {
        key: "Why",
        body: "To reposition heritage symbols for contemporary relevance without diluting Cartier craft authority.",
      },
      {
        key: "Where",
        body: "Urban luxury environments, premium OOH placements, and digital-first discovery channels in global cities.",
      },
      {
        key: "When",
        body: "Seasonal cadence: tease, reveal, amplify, and activate with measurable narrative continuity.",
      },
    ],
    [],
  );

  const campaignProofCards = useMemo<SupportVisual[]>(
    () => [
      {
        src: oldSupportImages.lookbook,
        alt: "Cartier Rogue lookbook cover proof",
        caption: "Lookbook Cover",
        kind: "landscape",
        fit: "contain",
      },
      {
        src: oldSupportImages.oohNight,
        alt: "Cartier Rogue OOH street placement proof",
        caption: "OOH Street Placement",
        kind: "landscape",
      },
      {
        src: oldSupportImages.busShelter,
        alt: "Cartier Rogue transit poster proof",
        caption: "Transit Poster",
        kind: "portrait",
        fit: "contain",
      },
      {
        src: oldSupportImages.braceletA,
        alt: "Cartier Rogue jewelry detail frame proof",
        caption: "Jewelry Detail Frame",
        kind: "landscape",
        fit: "contain",
      },
      {
        src: oldSupportImages.phone,
        alt: "Cartier Rogue digital campaign panel proof",
        caption: "Digital Campaign Panel",
        kind: "portrait",
        fit: "contain",
      },
    ],
    [],
  );

  const rolloutPhases = useMemo<RolloutPhase[]>(
    () => [
      {
        phase: "01",
        title: "Visual Tease",
        body: "Controlled early visuals establish tone and symbolic intrigue before narrative disclosure.",
        channels: ["OOH", "Social"],
        visual: {
          src: oldSupportImages.banner,
          alt: "Cartier Rogue teaser banner proof",
          caption: "Teaser Banner",
          kind: "landscape",
          fit: "contain",
        },
      },
      {
        phase: "02",
        title: "Editorial Reveal",
        body: "Portrait-led campaign imagery introduces the new sovereign persona and product authority.",
        channels: ["Editorial", "Film"],
        visual: {
          src: oldSupportImages.streetBillboard,
          alt: "Cartier Rogue editorial reveal billboard proof",
          caption: "Editorial Reveal Frame",
          kind: "landscape",
          fit: "contain",
        },
      },
      {
        phase: "03",
        title: "OOH Penetration",
        body: "High-traffic city placements scale visibility while preserving premium visual discipline.",
        channels: ["OOH", "Press"],
        visual: {
          src: oldSupportImages.billboardVar,
          alt: "Cartier Rogue OOH penetration proof",
          caption: "City Billboard Variant",
          kind: "landscape",
          fit: "contain",
        },
      },
      {
        phase: "04",
        title: "Social Amplification",
        body: "Digital storytelling turns campaign symbols into repeatable cultural conversation moments.",
        channels: ["Social", "Digital"],
        visual: {
          src: oldSupportImages.cityScreen,
          alt: "Cartier Rogue digital amplification proof",
          caption: "Digital City Screen",
          kind: "portrait",
          fit: "contain",
        },
      },
      {
        phase: "05",
        title: "Experiential Activation",
        body: "Narrative extends into physical luxury contexts through appointment-led, high-touch encounters.",
        channels: ["Retail", "Activation"],
        visual: {
          src: oldSupportImages.airport,
          alt: "Cartier Rogue experiential activation proof",
          caption: "Airport Activation",
          kind: "portrait",
          fit: "contain",
        },
      },
    ],
    [],
  );

  return (
    <div className="crPage">
      <header className="crHeader">
        <div className="crBrand">Cartier Rogue</div>
        <nav>
          <Link to="/">Back to Portfolio</Link>
        </nav>
      </header>

      <motion.section
        id="what"
        className="crSection crSection--what"
        initial="hidden"
        animate="show"
        variants={reveal}
      >
        <div className="crWhatLayout">
          <div className="crWhatCopyCol">
            <div className="crCopyPanel">
              <p className="crKicker">Cartier Rogue</p>
              <h1>What is Cartier Rogue?</h1>
              <p className="crSubtitle">
                A luxury campaign concept for the era of cultural self-definition.
              </p>
              <p className="crLead">
                Cartier Rogue reframes Cartier heritage through contemporary rebellion, where jewelry is no longer a distant
                aristocratic symbol but expressive identity in motion. It bridges Cartier’s precision, material richness,
                and timeless authority with editorial street energy designed for new icons of cultural power.
              </p>
              <p className="crTagline">
                Power doesn’t look like it used to, but it still wears Cartier.
              </p>
              <div className="crChipRow">
                <span>Concept</span>
                <span>Luxury Campaign</span>
                <span>Editorial / OOH / Digital</span>
                <span>Cultural Repositioning</span>
                <span>Youth Luxury</span>
              </div>
            </div>
            <div className="crWhatSupportPair">
              <SupportCard
                visual={{
                  src: oldSupportImages.lookbook,
                  alt: "Cartier Rogue lookbook proof",
                  caption: "Lookbook Cover",
                  kind: "landscape",
                  fit: "contain",
                }}
              />
              <SupportCard
                visual={{
                  src: oldSupportImages.moodboard,
                  alt: "Cartier Rogue concept moodboard proof",
                  caption: "Concept Moodboard",
                  kind: "landscape",
                  fit: "contain",
                }}
              />
            </div>
          </div>

          <div className="crWhatVisual">
            <figure className="crHeroVisual crNewHeroFrame">
              <img src={newHeroImages[3]} alt="Cartier Rogue cinematic hero visual" />
            </figure>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="language"
        className="crSection crSection--language"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <figure className="crFullHero crNewHeroFrame">
          <img src={newHeroImages[0]} alt="Cartier Rogue campaign language hero image" loading="lazy" />
          <figcaption>
            <p className="crCaptionLabel">Campaign Language</p>
            <p>Heritage silhouettes, contemporary posture, and cinematic nocturnal contrast.</p>
          </figcaption>
        </figure>

        <div className="crSupportGrid">
          {campaignProofCards.map((card) => (
            <SupportCard key={`${card.caption}-${card.src}`} visual={card} className="crSupportGridCard" />
          ))}
        </div>
      </motion.section>

      <motion.section
        id="framework"
        className="crSection crSection--framework"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="crFrameworkLayout">
          <div className="crFrameworkContent">
            <div className="crSectionHeading">
              <h2>Campaign Framework</h2>
              <p className="crSectionSub">What / Who / Why / Where / When</p>
            </div>
            <div className="crFrameworkCards">
              {frameworkCards.map((card) => (
                <article key={card.key} className="crFrameworkCard">
                  <p className="crCardLabel">{card.key}</p>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
          <figure className="crFrameworkHero crNewHeroFrame">
            <img src={newHeroImages[5]} alt="Cartier Rogue framework hero visual" loading="lazy" />
            <figcaption>
              <p className="crCaptionLabel">Framework Hero</p>
              <p>Cartier codes translated into a contemporary campaign logic system.</p>
            </figcaption>
          </figure>
        </div>

        <div className="crEvidenceStrip">
          <SupportCard
            visual={{
              src: oldSupportImages.braceletB,
              alt: "Cartier Rogue bracelet detail proof",
              caption: "Bracelet Detail",
              kind: "landscape",
              fit: "contain",
            }}
            className="crEvidenceCard"
          />
          <SupportCard
            visual={{
              src: oldSupportImages.oohNight,
              alt: "Cartier Rogue Times Square style OOH proof",
              caption: "OOH Night Frame",
              kind: "landscape",
            }}
            className="crEvidenceCard"
          />
          <SupportCard
            visual={{
              src: oldSupportImages.airport,
              alt: "Cartier Rogue airport digital proof",
              caption: "Airport Digital",
              kind: "portrait",
              fit: "contain",
            }}
            className="crEvidenceCard"
          />
        </div>
      </motion.section>

      <motion.section
        id="rollout"
        className="crSection crSection--rollout"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <figure className="crRolloutHero crNewHeroFrame">
          <img src={newHeroImages[4]} alt="Cartier Rogue rollout hero visual" loading="lazy" />
          <figcaption>
            <p className="crCaptionLabel">How It Rolls Out</p>
            <p>A phased luxury campaign system from visual tease to activation.</p>
          </figcaption>
        </figure>

        <div className="crRolloutGrid">
          <ol className="crPhaseRail">
            {rolloutPhases.map((phase) => (
              <li key={phase.phase}>
                <span>{phase.phase}</span>
                <p>{phase.title}</p>
              </li>
            ))}
          </ol>

          <div className="crPhaseCards">
            {rolloutPhases.map((phase) => (
              <article key={phase.phase} className="crPhaseCard">
                <div className="crPhaseCopy">
                  <p className="crCardLabel">
                    Phase {phase.phase} · {phase.title}
                  </p>
                  <p>{phase.body}</p>
                  <div className="crTagRow">
                    {phase.channels.map((channel) => (
                      <span key={`${phase.phase}-${channel}`}>{channel}</span>
                    ))}
                  </div>
                </div>
                <SupportCard visual={phase.visual} className="crPhaseVisual" />
              </article>
            ))}
          </div>
        </div>

        <article className="crActivationCard">
          <div>
            <h3>Experiential Extension</h3>
            <p>
              The Cartier Rogue narrative expands into physical activation through the existing Cartier × Maybach mobile
              luxury gallery concept.
            </p>
          </div>
          <button type="button" className="crBtn crBtn--gold" onClick={openMaybachFromRogue}>
            Open Cartier × Maybach Experience
          </button>
        </article>

        <article className="crActivationCard">
          <div>
            <h3>Campaign Film</h3>
          </div>
          <div style={{ width: "100%" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                overflow: "hidden",
                borderRadius: "12px",
              }}
            >
              <iframe
                title="Cartier Rogue Campaign Film"
                src="https://www.youtube.com/embed/IQGZCsvl9MM"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
          </div>
        </article>
      </motion.section>

      <motion.section
        id="impact"
        className="crSection crSection--impact"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="crImpactHero crNewHeroFrame">
          <img src={newHeroImages[6]} alt="Cartier Rogue impact closing visual" loading="lazy" />
          <div className="crImpactOverlay">
            <div className="crSectionHeading">
              <h2>Impact &amp; Strategic Value</h2>
            </div>
            <div className="crImpactColumns">
              <article>
                <h3>Brand Impact</h3>
                <p>Modernizes Cartier’s symbolic language without losing prestige or craft authority.</p>
              </article>
              <article>
                <h3>Audience Impact</h3>
                <p>Builds emotional relevance with culture-native luxury consumers and new icon communities.</p>
              </article>
              <article>
                <h3>Platform Potential</h3>
                <p>Scales cleanly across editorial, social, OOH, and experiential activation modules.</p>
              </article>
            </div>
            <p className="crClosingLine">Heritage, re-authored.</p>
            <div className="crHeroCtas">
              <Link to="/" className="crBtn">
                Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {showEntryVeil ? (
          <motion.div
            className="crEntryVeil"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ) : null}
      </AnimatePresence>
      <MaybachLoader open={isMaybachLoading} />
    </div>
  );
}
