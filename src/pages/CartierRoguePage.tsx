import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MaybachLoader } from "../components/MaybachLoader";
import { ScrollParallaxLayer } from "../components/ScrollParallaxLayer";
import { SectionNav } from "../components/system/SectionNav";
import "../styles/cartier-rogue.css";

const WEB = `${import.meta.env.BASE_URL}assets/web`;

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

// Optimised WebP derivatives of the original PNGs in public/assets/cartier-rogue/{new,old} photos
const oldFile = (time: string) => `${WEB}/old-${time.replace(/\./g, "-")}.webp`;

const newHeroImages = [0, 1, 2, 3, 4, 5, 6].map((i) => `${WEB}/rogue-${i}.webp`);

const oldSupportImages = {
  lookbook: (oldFile("11.50.16")),
  moodboard: (oldFile("11.50.28")),
  braceletA: (oldFile("11.50.37")),
  braceletB: (oldFile("11.50.48")),
  banner: (oldFile("11.50.59")),
  oohNight: (oldFile("11.51.11")),
  billboardVar: (oldFile("11.51.19")),
  phone: (oldFile("11.51.32")),
  streetBillboard: (oldFile("11.51.40")),
  busShelter: (oldFile("11.51.54")),
  cityScreen: (oldFile("11.52.01")),
  airport: (oldFile("11.52.10")),
} as const;

const SECTIONS: [string, string][] = [
  ["what", "What it is"],
  ["language", "Language"],
  ["framework", "Framework"],
  ["rollout", "Rollout"],
  ["impact", "Impact"],
];

/** In-page jumps must not touch the URL hash — the site uses HashRouter. */
function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.2, 0.65, 0.2, 1] },
  },
};

const staggerGroup = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const revealCard = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.2, 0.65, 0.2, 1] },
  },
};

function SupportCard(props: { visual: SupportVisual; className?: string }) {
  const { visual, className = "" } = props;
  return (
    <motion.figure
      className={`crSupportCard ${visual.kind === "portrait" ? "is-portrait" : "is-landscape"} ${visual.fit === "contain" ? "is-contain" : ""} ${className}`.trim()}
      variants={revealCard}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
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
      navigate("/work/cartier-gtm-redirection/maybach", { state: { fromMaybachLoader: true } });
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
      <SectionNav title="Cartier Rogue" sections={SECTIONS.map(([id, label]) => ({ id, label }))} />

      <motion.section
        id="what"
        className="crSection crSection--what crHero"
        initial="hidden"
        animate="show"
        variants={reveal}
      >
        <div className="crWhatLayout crBody">
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
            <motion.div
              className="crWhatSupportPair crCutaways"
              variants={staggerGroup}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.28 }}
            >
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
            </motion.div>
          </div>

          <div className="crWhatVisual">
            <ScrollParallaxLayer className="crScrollFloat" distance={40}>
              <figure className="crHeroVisual crNewHeroFrame">
                <img src={newHeroImages[3]} alt="Cartier Rogue cinematic hero visual" />
              </figure>
            </ScrollParallaxLayer>
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
        <ScrollParallaxLayer className="crScrollFloat" distance={32}>
          <figure className="crFullHero crNewHeroFrame">
            <img src={newHeroImages[0]} alt="Cartier Rogue campaign language hero image" loading="lazy" />
            <figcaption>
              <p className="crCaptionLabel">Campaign Language</p>
              <p>Heritage silhouettes, contemporary posture, and cinematic nocturnal contrast.</p>
            </figcaption>
          </figure>
        </ScrollParallaxLayer>

        <motion.div
          className="crSupportGrid crPortraitStrip"
          variants={staggerGroup}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.22 }}
        >
          {campaignProofCards.map((card) => (
            <SupportCard key={`${card.caption}-${card.src}`} visual={card} className="crSupportGridCard" />
          ))}
        </motion.div>
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
            <motion.div
              className="crFrameworkCards"
              variants={staggerGroup}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {frameworkCards.map((card) => (
                <motion.article key={card.key} className="crFrameworkCard" variants={revealCard}>
                  <p className="crCardLabel">{card.key}</p>
                  <p>{card.body}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
          <ScrollParallaxLayer className="crScrollFloat" distance={30}>
            <figure className="crFrameworkHero crNewHeroFrame">
              <img src={newHeroImages[5]} alt="Cartier Rogue framework hero visual" loading="lazy" />
              <figcaption>
                <p className="crCaptionLabel">Framework Hero</p>
                <p>Cartier codes translated into a contemporary campaign logic system.</p>
              </figcaption>
            </figure>
          </ScrollParallaxLayer>
        </div>

        <motion.div
          className="crEvidenceStrip crPortraitStrip"
          variants={staggerGroup}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.24 }}
        >
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
        </motion.div>
      </motion.section>

      <motion.section
        id="rollout"
        className="crSection crSection--rollout"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <ScrollParallaxLayer className="crScrollFloat" distance={28}>
          <figure className="crRolloutHero crNewHeroFrame">
            <img src={newHeroImages[4]} alt="Cartier Rogue rollout hero visual" loading="lazy" />
            <figcaption>
              <p className="crCaptionLabel">How It Rolls Out</p>
              <p>A phased luxury campaign system from visual tease to activation.</p>
            </figcaption>
          </figure>
        </ScrollParallaxLayer>

        <div className="crRolloutGrid">
          <motion.ol
            className="crPhaseRail"
            variants={staggerGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {rolloutPhases.map((phase) => (
              <motion.li key={phase.phase} variants={revealCard}>
                <p>{phase.title}</p>
              </motion.li>
            ))}
          </motion.ol>

          <motion.div
            className="crPhaseCards"
            variants={staggerGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            {rolloutPhases.map((phase) => (
              <motion.article key={phase.phase} className="crPhaseCard" variants={revealCard}>
                <div className="crPhaseCopy">
                  <h3 className="crPhaseTitle">{phase.title}</h3>
                  <p>{phase.body}</p>
                  <div className="crTagRow">
                    {phase.channels.map((channel) => (
                      <span key={`${phase.phase}-${channel}`}>{channel}</span>
                    ))}
                  </div>
                </div>
                <SupportCard visual={phase.visual} className="crPhaseVisual" />
              </motion.article>
            ))}
          </motion.div>
        </div>

        <motion.article
          className="crActivationCard crVideo"
          variants={revealCard}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.28 }}
        >
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
        </motion.article>

        <motion.article
          className="crActivationCard"
          variants={revealCard}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.28 }}
        >
          <div>
            <h3>Campaign Film</h3>
          </div>
          <div className="crVideoWrap" style={{ width: "100%" }}>
            <div
              className="crVideoFrame"
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                overflow: "hidden",
                borderRadius: "12px",
              }}
            >
              <iframe
                className="crVideoIframe"
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
        </motion.article>
      </motion.section>

      <motion.section
        id="impact"
        className="crSection crSection--impact"
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <ScrollParallaxLayer className="crScrollFloat" distance={24}>
          <div className="crImpactHero crNewHeroFrame">
            <img src={newHeroImages[6]} alt="Cartier Rogue impact closing visual" loading="lazy" />
            <div className="crImpactOverlay">
              <div className="crSectionHeading">
                <h2>Impact &amp; Strategic Value</h2>
              </div>
              <motion.div
                className="crImpactColumns"
                variants={staggerGroup}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
              >
                <motion.article variants={revealCard}>
                  <h3>Brand Impact</h3>
                  <p>Modernizes Cartier’s symbolic language without losing prestige or craft authority.</p>
                </motion.article>
                <motion.article variants={revealCard}>
                  <h3>Audience Impact</h3>
                  <p>Builds emotional relevance with culture-native luxury consumers and new icon communities.</p>
                </motion.article>
                <motion.article variants={revealCard}>
                  <h3>Platform Potential</h3>
                  <p>Scales cleanly across editorial, social, OOH, and experiential activation modules.</p>
                </motion.article>
              </motion.div>
              <p className="crClosingLine">Heritage, re-authored.</p>
            </div>
          </div>
        </ScrollParallaxLayer>
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
