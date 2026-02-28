import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { CartierMaybachPage } from "./pages/CartierMaybachPage";
import { CartierRoguePage } from "./pages/CartierRoguePage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cartier-maybach" element={<CartierMaybachPage />} />
        <Route path="/cartier-rogue" element={<CartierRoguePage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
