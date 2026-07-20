import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { feishuContactPlugin } from "./server/feishu-contact.mjs";

export default defineConfig({
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
