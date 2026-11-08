declare const process: { env: Record<string, string | undefined> };
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /shreyash-world/; Vercel/Netlify/Cloudflare serve from the root.
  base: process.env.VERCEL || process.env.NETLIFY || process.env.CF_PAGES ? "/" : "/shreyash-world/",
  build: {
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // PF-01: keep Vite's preload helper (and rollup's commonjs helpers) out of the three.js chunks;
          // otherwise the entry imports them from "drei" and every page modulepreloads three, r3f and drei.
          if (id.indexOf("vite/preload-helper") !== -1 || id.indexOf("commonjsHelpers") !== -1) return "runtime";
          if (id.indexOf("node_modules") === -1) return;

          if (id.indexOf("@react-three/fiber") !== -1) {
            return "r3f";
          }

          if (id.indexOf("@react-three/drei") !== -1 || id.indexOf("three-stdlib") !== -1) {
            return "drei";
          }

          if (id.indexOf("/three/") !== -1) {
            return "three-core";
          }

          if (id.indexOf("framer-motion") !== -1) {
            return "motion";
          }

          if (id.indexOf("react-router-dom") !== -1) {
            return "router";
          }

          if (id.indexOf("/react/") !== -1 || id.indexOf("/react-dom/") !== -1) {
            return "react-vendor";
          }
        },
      },
    },
  },
});
