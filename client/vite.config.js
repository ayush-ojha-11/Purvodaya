import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 700, // optional, AFTER splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("jspdf")) return "pdf-core";
            if (id.includes("jspdf-autotable")) return "pdf-core";
            if (id.includes("html2canvas")) return "pdf-core";
            if (id.includes("canvg")) return "pdf-core";
            if (id.includes("react")) return "react";
            if (id.includes("zustand")) return "state";
            return "vendor";
          }
        },
      },
    },
  },
});
