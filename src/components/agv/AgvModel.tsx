import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { AGV_PARTS, PART_BY_ID, type AgvPart } from "./agvParts";
import { asset } from "../../lib/projects";

const AgvScene = lazy(() => import("./AgvScene"));

class Boundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const GROUPS: AgvPart["group"][] = ["Structure", "Drive", "Control", "Sensing", "Operator"];

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Interactive 3D model of the ACME robot: mounts once near the viewport and stops rendering when scrolled away. */
export default function AgvModel() {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [gl] = useState(() => (typeof document === "undefined" ? true : webglOk()));
  const [still] = useState(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  const [exploded, setExploded] = useState(false);
  const [casing, setCasing] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  // phones get a wider shot so the whole robot fits the square stage
  const [homeZoom] = useState(() => (typeof window !== "undefined" && window.innerWidth < 640 ? 1.38 : 1));
  const [zoom, setZoom] = useState(homeZoom);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") { setNear(true); setVisible(true); return; }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        setVisible(e.isIntersecting);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const part = selected ? PART_BY_ID[selected] : null;
  const choose = (id: string | null) => {
    setSelected((cur) => (cur === id ? null : id));
    if (id && PART_BY_ID[id]?.layer === "enclosure") setCasing(true);
  };

  const poster = (
    <img className="agv__poster" src={asset("/assets/web/agv-assembled.webp")} alt="Render of the ACME robot: omni wheels, aluminium plates, electronics and a clear acrylic casing" />
  );

  return (
    <div className="agv">
      <div className="agv__stage" ref={box}>
        {!gl ? (
          poster
        ) : (
          <>
            {!ready ? poster : null}
            {near ? (
              <Boundary fallback={poster}>
                <Suspense fallback={null}>
                  <div className={`agv__canvas${ready ? " is-ready" : ""}`}>
                    <AgvScene
                      exploded={exploded}
                      casing={casing}
                      selected={selected}
                      hovered={hovered}
                      onSelect={choose}
                      onHover={setHovered}
                      zoom={zoom}
                      resetKey={resetKey}
                      still={Boolean(still)}
                      active={visible}
                      onReady={() => setReady(true)}
                    />
                  </div>
                </Suspense>
              </Boundary>
            ) : null}
          </>
        )}

        <div className="agv__bar" role="toolbar" aria-label="Model controls">
          <div className="agv__seg" role="group" aria-label="View">
            <button type="button" aria-pressed={!exploded} onClick={() => setExploded(false)}>Assembled</button>
            <button type="button" aria-pressed={exploded} onClick={() => setExploded(true)}>Exploded</button>
          </div>
          <button type="button" className="agv__btn" aria-pressed={casing} onClick={() => setCasing((c) => !c)}>
            Casing {casing ? "on" : "off"}
          </button>
        </div>
        <div className="agv__zoom" role="group" aria-label="Zoom">
          <button type="button" className="agv__btn agv__btn--icon" aria-label="Zoom in" onClick={() => setZoom((z) => Math.max(0.55, +(z - 0.15).toFixed(2)))}>+</button>
          <button type="button" className="agv__btn agv__btn--icon" aria-label="Zoom out" onClick={() => setZoom((z) => Math.min(1.75, +(z + 0.15).toFixed(2)))}>−</button>
          <button type="button" className="agv__btn agv__btn--icon" aria-label="Reset view" title="Reset view" onClick={() => { setZoom(homeZoom); setSelected(null); setExploded(false); setCasing(true); setResetKey((k) => k + 1); }}>↺</button>
        </div>

        <p className="agv__hint" aria-hidden="true">{gl ? "Drag to turn · tap a part to inspect" : "3D view needs WebGL; showing a still render"}</p>
      </div>

      <aside className="agv__side">
        <div className="agv__card" aria-live="polite">
          {part ? (
            <>
              <p className="agv__kicker">{part.group}</p>
              <h3 className="agv__name">{part.name}</h3>
              <p className="agv__body">{part.body}</p>
              {part.spec ? <p className="agv__spec">{part.spec}</p> : null}
            </>
          ) : (
            <>
              <p className="agv__kicker">Inspect</p>
              <h3 className="agv__name">Pick a part</h3>
              <p className="agv__body">
                Rebuilt from the dissertation drawings, the bill of materials and photos of the working prototype. Choose a part in the model or the list to read
                what it does and why it was chosen.
              </p>
            </>
          )}
        </div>

        <nav className="agv__parts" aria-label="Robot parts">
          {GROUPS.map((g) => (
            <div key={g} className="agv__group">
              <p className="agv__groupName">{g}</p>
              <ul>
                {AGV_PARTS.filter((p) => p.group === g).map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      aria-pressed={selected === p.id}
                      onClick={() => choose(p.id)}
                      onMouseEnter={() => setHovered(p.id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}
