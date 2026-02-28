type Props = {
  bodyColor: string;
  accentColor: string;
  heroLightOn: boolean;
  onBodyColor: (value: string) => void;
  onAccentColor: (value: string) => void;
  onReset: () => void;
  onToggleHeroLight: () => void;
};

const SWATCHES = [
  { name: "Cartier Black", value: "#0A0A0A" },
  { name: "Satin Noir", value: "#151515" },
  { name: "Cartier Gold", value: "#C8A35A" },
  { name: "Antique Gold", value: "#B08A45" },
  { name: "Champagne Gold", value: "#D6BE8A" },
  { name: "Ivory Lacquer", value: "#F4F0E6" },
  { name: "Deep Burgundy", value: "#4A1014" },
  { name: "Ruby Oxblood", value: "#5A0F18" },
];

export function MaybachColorControls({
  bodyColor,
  accentColor,
  heroLightOn,
  onBodyColor,
  onAccentColor,
  onReset,
  onToggleHeroLight,
}: Props) {
  return (
    <div className="cmControlsTray">
      <div className="cmControlTitle">Concept Finishes</div>
      <div className="cmControlGroup">
        <div className="cmControlTitle">Body Finish</div>
        <div className="cmSwatchGrid">
          {SWATCHES.map((s) => (
            <button
              key={`body-${s.value}`}
              type="button"
              className={`cmSwatch${bodyColor.toLowerCase() === s.value.toLowerCase() ? " is-active" : ""}`}
              onClick={() => onBodyColor(s.value)}
              aria-label={`Set body finish to ${s.name}`}
              title={s.name}
            >
              <span className="cmSwatchDot" style={{ backgroundColor: s.value }} />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cmControlGroup">
        <div className="cmControlTitle">Accent Finish</div>
        <div className="cmSwatchGrid">
          {SWATCHES.map((s) => (
            <button
              key={`accent-${s.value}`}
              type="button"
              className={`cmSwatch${accentColor.toLowerCase() === s.value.toLowerCase() ? " is-active" : ""}`}
              onClick={() => onAccentColor(s.value)}
              aria-label={`Set accent finish to ${s.name}`}
              title={s.name}
            >
              <span className="cmSwatchDot" style={{ backgroundColor: s.value }} />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cmControlRow">
        <button type="button" className={`cmLightToggle${heroLightOn ? " is-on" : ""}`} onClick={onToggleHeroLight} aria-pressed={heroLightOn}>
          <svg viewBox="0 0 24 24" className="cmBulbIcon" aria-hidden="true">
            <path d="M12 3.2a6.1 6.1 0 0 0-4.2 10.55c.8.75 1.4 1.72 1.64 2.75h5.16c.24-1.03.84-2 1.64-2.75A6.1 6.1 0 0 0 12 3.2Z" />
            <path d="M9.6 18.1h4.8M10.2 20h3.6" />
            <path d="M12 1.8v1.6M4.9 4.9l1.2 1.2M2 12h1.6M19.1 4.9l-1.2 1.2M20.4 12H22" />
          </svg>
          <span>Hero Light</span>
        </button>

        <button type="button" className="cmResetBtn" onClick={onReset}>
          Reset to Signature
        </button>
      </div>
    </div>
  );
}
