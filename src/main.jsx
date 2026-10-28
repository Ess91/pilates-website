import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Global tokens and base styles load first; each component then imports its own stylesheet.
import "./styles/global.css";
import { StudioProvider } from "./context/StudioContext";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <StudioProvider>
        <App />
      </StudioProvider>
    </BrowserRouter>
  </StrictMode>
);
