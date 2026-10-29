import { AnimatePresence, MotionConfig } from "framer-motion";
import { Suspense, lazy, useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigationType, useParams } from "react-router-dom";
import { LoadingScreen, PageShell } from "./components/site/PageShell";
import { ChapterPager } from "./components/site/Wayfinder";
import { ContentProvider, useContentState } from "./lib/content";
import { AboutPage } from "./pages/AboutPage";
import { CaseStudyPage, NotFoundBody } from "./pages/CaseStudyPage";
import { CredentialsPage } from "./pages/CredentialsPage";
import { HomePage } from "./pages/HomePage";
import { SystemPage } from "./pages/SystemPage";
import { WorkPage } from "./pages/WorkPage";
import { MAYBACH_PATH, ROGUE_PATH, historyIndex, pageLabel, readScroll, rememberLabel, saveScroll } from "./lib/nav";
import "./styles/site.css";

const CartierMaybachPage = lazy(() => import("./pages/CartierMaybachPage").then((m) => ({ default: m.CartierMaybachPage })));
const CartierRoguePage = lazy(() => import("./pages/CartierRoguePage").then((m) => ({ default: m.CartierRoguePage })));

function Campaign(props: { which: "rogue" | "maybach" }) {
  const label = props.which === "rogue" ? "Cartier Rogue" : "Cartier × Maybach";
  return (
    <PageShell title={`${label} — Shreyash Ojha`} curtainLabel={label} tone="campaign">
      <Suspense fallback={<LoadingScreen />}>{props.which === "rogue" ? <CartierRoguePage /> : <CartierMaybachPage />}</Suspense>
      <ChapterPager />
    </PageShell>
  );
}

/** Credentials used to be exhibits; keep old deep links working. */
function WorkOrCredential() {
  const { id } = useParams();
  if (id?.startsWith("cred")) return <Navigate to={`/credentials#${id}`} replace />;
  return <CaseStudyPage />;
}

/**
 * Remembers, per browser tab, what each history step was called and where it was scrolled to,
 * so Back can say where it goes and land the reader exactly where they left.
 */
function useNavMemory() {
  const location = useLocation();
  const navType = useNavigationType();
  const { content } = useContentState();
  const keyRef = useRef(location.key);
  const navTypeRef = useRef(navType);
  const savingRef = useRef(true);
  if (keyRef.current !== location.key) savingRef.current = false; // a page swap is under way: hold the last saved spot
  keyRef.current = location.key;
  navTypeRef.current = navType;

  useEffect(() => {
    rememberLabel(historyIndex(), pageLabel(location.pathname, content), navType === "PUSH");
  }, [location.key, location.pathname, navType, content]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (savingRef.current) saveScroll(keyRef.current, window.scrollY);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /** Called once the outgoing page has left: new pages start at the top, Back returns to the saved spot. */
  return () => {
    const y = navTypeRef.current === "POP" ? readScroll(keyRef.current) : null;
    if (!y) {
      window.scrollTo(0, 0);
      savingRef.current = true;
      return;
    }
    // the returning page may still be growing (images, lazy sections): keep placing until it holds
    const started = performance.now();
    let held = 0;
    const settle = () => {
      window.scrollTo(0, y);
      held = Math.abs(window.scrollY - y) <= 2 ? held + 1 : 0;
      if (held < 12 && performance.now() - started < 2500) requestAnimationFrame(settle);
      else savingRef.current = true;
    };
    requestAnimationFrame(settle);
  };
}

function AnimatedRoutes() {
  const location = useLocation();
  const { content, error } = useContentState();
  const afterExit = useNavMemory();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  if (!content && error) return <LoadingScreen error={error} />;

  return (
    <AnimatePresence mode="wait" onExitComplete={afterExit}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:id" element={<WorkOrCredential />} />
        <Route path="/credentials" element={<CredentialsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/system" element={<SystemPage />} />
        <Route path={ROGUE_PATH} element={<Campaign which="rogue" />} />
        <Route path={MAYBACH_PATH} element={<Campaign which="maybach" />} />
        {/* old addresses keep working */}
        <Route path="/cartier-rogue" element={<Navigate to={ROGUE_PATH} replace />} />
        <Route path="/cartier-maybach" element={<Navigate to={MAYBACH_PATH} replace />} />
        <Route path="*" element={<NotFoundBody />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ContentProvider>
        <AnimatedRoutes />
      </ContentProvider>
    </MotionConfig>
  );
}
