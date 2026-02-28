import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Artifact, Exhibit } from "../lib/types";
import { ease } from "../lib/motion";

export function ExhibitModal(props: {
  open: boolean;
  exhibit: Exhibit | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onArtifactAction?: (artifact: Artifact) => void;
}) {
  const { open, exhibit, onClose, onPrev, onNext, onArtifactAction } = props;
  const isRetailClientelingVignette = exhibit?.id === "merch-2";
  const [zoomedImageSrc, setZoomedImageSrc] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && exhibit ? (
        <>
          <motion.div
            className="modalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease } }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div className="modal" layoutId={`exhibit-${exhibit.id}`}>
              <div className="modalHead">
                <div>
                  <div className="modalTitle">{exhibit.title}</div>
                  <div className="modalContext">{exhibit.context}</div>
                </div>
                <button className="iconBtn" type="button" onClick={onClose} aria-label="Close">
                  ×
                </button>
              </div>

              <div className="modalBody">
                {isRetailClientelingVignette ? (
                  <RetailClientelingVignette
                    exhibit={exhibit}
                    onOpenImage={setZoomedImageSrc}
                  />
                ) : (
                  <>
                    <div className="blockTitle">Problem</div>
                    <div>{exhibit.problem}</div>

                    <div className="blockTitle">Approach</div>
                    <ul>
                      {exhibit.approach.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>

                    <div className="blockTitle">Impact</div>
                    <ul>
                      {exhibit.impact.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>

                    <div className="blockTitle">Skills used</div>
                    <div>{exhibit.skills}</div>

                    <div className="blockTitle">Artifacts</div>
                    <div className="artifacts">
                      {exhibit.artifacts.map((a) =>
                        a.actionId ? (
                          <button key={a.label} className="artifact" type="button" onClick={() => onArtifactAction?.(a)}>
                            {a.label}
                          </button>
                        ) : (
                          <a key={a.label} className="artifact" href={a.url} target="_blank" rel="noreferrer">
                            {a.label}
                          </a>
                        ),
                      )}
                    </div>
                  </>
                )}

                <div className={`footerRow${isRetailClientelingVignette ? " footerRow--retailVignette" : ""}`}>
                  <button className="navBtn" type="button" onClick={onPrev}>
                    Prev
                  </button>
                  <button className="navBtn" type="button" onClick={onNext}>
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {zoomedImageSrc ? (
              <motion.div
                className="proofLightboxOverlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) setZoomedImageSrc(null);
                }}
              >
                <motion.div className="proofLightboxPanel" initial={{ scale: 0.98 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }}>
                  <button
                    className="iconBtn proofLightboxClose"
                    type="button"
                    onClick={() => setZoomedImageSrc(null)}
                    aria-label="Close enlarged feedback image"
                  >
                    ×
                  </button>
                  <img className="proofLightboxImage" src={zoomedImageSrc} alt="Enlarged customer feedback screenshot" />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function RetailClientelingVignette(props: {
  exhibit: Exhibit;
  onOpenImage: (src: string) => void;
}) {
  const { exhibit, onOpenImage } = props;
  const proofImageSrc = "/assets/cartier-rogue/merch/Bloomingdales_Customer_Feedback_Crop.jpeg";
  return (
    <section className="retailVignette" aria-label="Retail clienteling case vignette">
      <div className="retailVignetteGrid">
        <div className="retailVignetteCopy">
          <div className="blockTitle">Context</div>
          <p className="retailVignetteText">
            I worked in frontline menswear retail where execution quality directly shaped trust, conversion, and repeat
            intent. This experience sharpened my ability to resolve fit issues, guide product decisions, and deliver
            calm, high-standard service in a fast-moving luxury floor environment.
          </p>

          <div className="blockTitle">What I Brought To The Floor</div>
          <ul className="retailVignetteList">
            <li>Clienteling and fit-resolution support</li>
            <li>Product guidance and styling-oriented selling</li>
            <li>Service recovery and customer reassurance</li>
            <li>Cross-sell support without breaking trust</li>
          </ul>

          <div className="blockTitle">Retail Strengths</div>
          <div className="retailVignetteChips">
            {[
              "Clienteling",
              "Fit Resolution",
              "Service Recovery",
              "Luxury Floor Execution",
              "Cross-Sell Support",
              "Customer Trust",
            ].map((chip) => (
              <span key={chip} className="retailVignetteChip">
                {chip}
              </span>
            ))}
          </div>

          <div className="blockTitle">Category Exposure</div>
          <p className="retailVignetteText">Menswear tailoring, outerwear, footwear, accessories, and fragrance.</p>
        </div>

        <aside className="retailProofCard" aria-label="Bloomingdale's customer feedback proof">
          <button
            className="retailProofImageBtn"
            type="button"
            onClick={() => onOpenImage(proofImageSrc)}
            aria-label="Open customer feedback image in larger view"
          >
            <img
              className="retailProofImage"
              src={proofImageSrc}
              alt="Customer feedback screenshot from Bloomingdale’s Men’s floor support"
              loading="lazy"
            />
          </button>
          <p className="retailProofCaption">
            Customer feedback received during Bloomingdale’s Men’s floor support (attached image).
          </p>
          <p className="retailProofLine">The note reflects service clarity, follow-through, and customer trust.</p>
        </aside>
      </div>
    </section>
  );
}
