import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

function normalizeBasePath(value: string | undefined): string {
  if (!value || value === "/") {
    return "/";
  }

  return `/${value.replace(/^\/+|\/+$/g, "")}/`;
}

export default defineConfig({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
    // Three.js is a lazy spatial-instrument chunk. Its uncompressed size is expected;
    // the network transfer is below 200 KiB gzip and never blocks the initial route.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          codemirror: ["@codemirror/state", "@codemirror/view", "@codemirror/language"],
          three: ["three"],
        },
      },
    },
  },
  worker: {
    format: "es",
  },
});
