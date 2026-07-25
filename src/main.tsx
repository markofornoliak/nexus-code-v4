import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "./router";
import { App } from "./app/App";
import { ProgressProvider } from "./features/progress/ProgressContext";
import "./styles/global.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("NEXUS root element is missing.");

createRoot(rootElement).render(
  <StrictMode>
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </StrictMode>,
);
