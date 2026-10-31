import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { easeOutExpo } from "../../lib/motion";
import type { SiteLink } from "../../lib/types";
import { BackButton } from "./Wayfinder";

const NAV = [
  { to: "/work", label: "Work" },
  { to: "/credentials", label: "Credentials" },
  { to: "/about", label: "About" },
];

export function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteHeader(props: { name: string; positioning: string; links: SiteLink[] }) {
  const { name, positioning, links } = props;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const location = useLocation();
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const cv = links.find((l) => l.label.toLowerCase() === "cv");

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setPastHero(window.scrollY > window.innerHeight * 0.45);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      menuBtnRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <a className="skipLink" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>
        Skip to content
      </a>
      <header className={`siteHeader${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}${location.pathname === "/" && !pastHero ? " is-quiet" : ""}`}>
        <div className="siteHeader__start">
        <Link to="/" className="siteHeader__brand" aria-label={`S·O ${name}, home`}>
          <span className="siteHeader__mono" aria-hidden="true">
            S<i>·</i>O
          </span>
          <span className="siteHeader__mark" aria-hidden={location.pathname === "/" && !pastHero ? true : undefined}>{name}</span>
          <span className="siteHeader__role" aria-hidden="true">{positioning}</span>
        </Link>

        <BackButton className="siteHeader__back" />
        </div>

        <nav className="siteHeader__nav" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `navLink${isActive ? " is-active" : ""}`}>
              {item.label}
            </NavLink>
          ))}
          <button type="button" className="navLink" onClick={scrollToContact}>
            Contact
          </button>
        </nav>

        <div className="siteHeader__end">
          {cv ? (
            <a className="navLink navLink--cv" href={cv.href} target="_blank" rel="noreferrer">
              Résumé <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          <button
            ref={menuBtnRef}
            type="button"
            className="menuBtn"
            aria-expanded={open}
            aria-controls="siteMenu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menuBtn__label">{open ? "Close" : "Menu"}</span>
            <span className="menuBtn__icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="siteMenu"
            className="siteMenu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)", transition: { duration: 0.45, ease: [0.77, 0, 0.175, 1] } }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.3, ease: [0.77, 0, 0.175, 1] } }}
          >
            <nav className="siteMenu__nav" aria-label="Menu">
              {[{ to: "/", label: "Index" }, ...NAV].map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ y: "110%" }}
                  animate={{ y: 0, transition: { delay: 0.12 + i * 0.06, duration: 0.8, ease: easeOutExpo } }}
                  className="siteMenu__item"
                >
                  <Link to={item.to} className="siteMenu__link">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0, transition: { delay: 0.36, duration: 0.8, ease: easeOutExpo } }}
                className="siteMenu__item"
              >
                <button
                  type="button"
                  className="siteMenu__link"
                  onClick={() => {
                    setOpen(false);
                    window.setTimeout(scrollToContact, 350);
                  }}
                >
                  Contact
                </button>
              </motion.div>
            </nav>
            <motion.div
              className="siteMenu__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.45, duration: 0.6 } }}
            >
              {links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                  {l.label === "CV" ? "Résumé" : l.label} ↗
                </a>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
