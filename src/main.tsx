import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./App";

const CartierMaybachPage = lazy(() =>
  import("./pages/CartierMaybachPage").then((module) => ({ default: module.CartierMaybachPage })),
);
const CartierRoguePage = lazy(() =>
  import("./pages/CartierRoguePage").then((module) => ({ default: module.CartierRoguePage })),
);

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#050505",
        color: "rgba(247,244,238,0.9)",
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontSize: 12,
      }}
    >
      Loading page…
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/cartier-maybach" element={<CartierMaybachPage />} />
          <Route path="/cartier-rogue" element={<CartierRoguePage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  </React.StrictMode>
);
