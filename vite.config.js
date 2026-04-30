import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    base: "/shreyash-world/",
    build: {
        chunkSizeWarningLimit: 750,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.indexOf("node_modules") === -1)
                        return;
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
