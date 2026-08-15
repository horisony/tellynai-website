import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { App } from "./App.jsx";
import { initializeAnalytics } from "./analytics.js";
import "./styles.css";

initializeAnalytics();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Analytics mode={import.meta.env.PROD ? "production" : "development"} />
  </React.StrictMode>,
);
