import { useEffect, useState } from "react";
import type { SiteLink } from "../lib/types";

export function Topbar(props: {
  siteName: string;
  positioning: string;
  links: SiteLink[];
  onNavHome: () => void;
  onBack?: () => void;
  showBack: boolean;
  wallpaperEnabled: boolean;
  onToggleWallpaper: () => void;
}) {
  const { siteName, positioning, links, onNavHome, onBack, showBack, wallpaperEnabled, onToggleWallpaper } = props;
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const byWidth = window.matchMedia("(max-width: 768px)");
    const byPointer = window.matchMedia("(pointer: coarse)");

    const update = () => {
      setIsMobile(byWidth.matches || byPointer.matches || navigator.maxTouchPoints > 0);
    };

    update();
    byWidth.addEventListener("change", update);
    byPointer.addEventListener("change", update);
    return () => {
      byWidth.removeEventListener("change", update);
      byPointer.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  if (isMobile) {
    return (
      <header className="topbar topbar--mobile">
        <button className="topbarHome topbarHome--mobile" type="button" onClick={onNavHome} title={`${siteName} — ${positioning}`}>
          <span className="topbarHomeName">{siteName}</span>
          <span className="kicker">{positioning}</span>
        </button>

        <button className="mobileMenuBtn" type="button" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-controls="mobileTopbarMenu" aria-label="Toggle menu">
          <span className="mobileMenuBtnLabel">Menu</span>
          <span className="mobileMenuBtnLines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        {menuOpen ? <button type="button" className="mobileMenuBackdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} /> : null}

        {menuOpen ? (
          <div id="mobileTopbarMenu" className="mobileMenuPanel" aria-label="Site menu">
            <button className={`mobileMenuLight${wallpaperEnabled ? " is-on" : " is-off"}`} type="button" onClick={onToggleWallpaper} aria-pressed={wallpaperEnabled} aria-label="Toggle wallpaper">
              <svg className="bulbIcon" viewBox="0 0 24 24" aria-hidden="true">
                <path className="bulbGlass" d="M12 3a6.5 6.5 0 0 0-4.46 11.23c.84.78 1.46 1.77 1.74 2.87h5.44c.28-1.1.9-2.09 1.74-2.87A6.5 6.5 0 0 0 12 3z" />
                <path className="bulbBase" d="M9.4 18.3h5.2v1.5H9.4zm.6 2.4h4v1.2h-4z" />
                <path className="bulbRay r1" d="M12 1.4v1.9" />
                <path className="bulbRay r2" d="m4.9 4.3 1.3 1.3" />
                <path className="bulbRay r3" d="M1.6 12h1.9" />
                <path className="bulbRay r4" d="m19.1 4.3-1.3 1.3" />
                <path className="bulbRay r5" d="M20.5 12h1.9" />
              </svg>
              <span>{wallpaperEnabled ? "Wallpaper On" : "Wallpaper Off"}</span>
            </button>

            {showBack ? (
              <button className="mobileMenuLink mobileMenuLink--button" type="button" onClick={() => {
                setMenuOpen(false);
                onBack?.();
              }}>
                Back to Sections
              </button>
            ) : null}

            <nav className="mobileMenuLinks" aria-label="Primary">
              {links.map((link) => (
                <a key={link.label} className="mobileMenuLink" href={link.href} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
    );
  }

  return (
    <header className="topbar">
      <div className="topbarLead">
        <button className="topbarHome" type="button" onClick={onNavHome} aria-label="Return to portfolio home">
          {siteName}
        </button>
        <div className="kicker">{positioning}</div>
        {showBack ? (
          <button className="navBtn" type="button" onClick={onBack}>
            Back to Sections
          </button>
        ) : null}
      </div>

      <div className="topbarCenter">
        <button className={`pill lightToggle${wallpaperEnabled ? " is-on" : " is-off"}`} type="button" onClick={onToggleWallpaper} aria-pressed={wallpaperEnabled} aria-label="Toggle ambient motion background">
          <svg className="bulbIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path className="bulbGlass" d="M12 3a6.5 6.5 0 0 0-4.46 11.23c.84.78 1.46 1.77 1.74 2.87h5.44c.28-1.1.9-2.09 1.74-2.87A6.5 6.5 0 0 0 12 3z" />
            <path className="bulbBase" d="M9.4 18.3h5.2v1.5H9.4zm.6 2.4h4v1.2h-4z" />
            <path className="bulbRay r1" d="M12 1.4v1.9" />
            <path className="bulbRay r2" d="m4.9 4.3 1.3 1.3" />
            <path className="bulbRay r3" d="M1.6 12h1.9" />
            <path className="bulbRay r4" d="m19.1 4.3-1.3 1.3" />
            <path className="bulbRay r5" d="M20.5 12h1.9" />
          </svg>
          <span className="lightToggleLabel">{wallpaperEnabled ? "Motion On" : "Motion Off"}</span>
        </button>
      </div>

      <nav className="pills" aria-label="Primary">
        {links.map((link) => (
          <a key={link.label} className="pill" href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
