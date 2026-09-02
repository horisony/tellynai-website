import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { feishuContactPlugin } from "./server/feishu-contact.mjs";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.endsWith("/src/seo-content.js")) return "seo-content";
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), feishuContactPlugin()],
});
