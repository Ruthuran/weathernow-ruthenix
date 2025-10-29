import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
      {/* Sidebar placeholder (you’ll paste Sidebar.jsx later) */}
      <div id="sidebar-root"></div>

      {/* Main weather app */}
      <div className="flex-1">
        <App />
      </div>
    </div>
  </StrictMode>
);
