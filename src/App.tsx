import { AnimatePresence, MotionConfig } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { LoadingScreen, PageShell } from "./components/site/PageShell";
import { ContentProvider, useContentState } from "./lib/content";
import { AboutPage } from "./pages/AboutPage";
import { CaseStudyPage, NotFoundBody } from "./pages/CaseStudyPage";
import { CredentialsPage } from "./pages/CredentialsPage";
import { HomePage } from "./pages/HomePage";
import { WorkPage } from "./pages/WorkPage";
import "./styles/site.css";

const CartierMaybachPage = lazy(() => import("./pages/CartierMaybachPage").then((m) => ({ default: m.CartierMaybachPage })));
const CartierRoguePage = lazy(() => import("./pages/CartierRoguePage").then((m) => ({ default: m.CartierRoguePage })));

function Campaign(props: { which: "rogue" | "maybach" }) {
  const label = props.which === "rogue" ? "Cartier Rogue" : "Cartier × Maybach";
  return (
    <PageShell title={`${label} — Shreyash Ojha`} curtainLabel={label} chrome={false} tone="ink">
      <Suspense fallback={<LoadingScreen />}>{props.which === "rogue" ? <CartierRoguePage /> : <CartierMaybachPage />}</Suspense>
    </PageShell>
  );
}

/** Credentials used to be exhibits; keep old deep links working. */
function WorkOrCredential() {
  const { id } = useParams();
  if (id?.startsWith("cred")) return <Navigate to={`/credentials#${id}`} replace />;
  return <CaseStudyPage />;
}

function AnimatedRoutes() {
  const location = useLocation();
  const { content, error } = useContentState();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  if (!content && error) return <LoadingScreen error={error} />;

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:id" element={<WorkOrCredential />} />
        <Route path="/credentials" element={<CredentialsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cartier-rogue" element={<Campaign which="rogue" />} />
        <Route path="/cartier-maybach" element={<Campaign which="maybach" />} />
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
