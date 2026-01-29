import { NavLink, Route, Routes } from "react-router-dom";
import CalculatorPage from "../features/calculator/CalculatorPage";
import SupportDashboardPage from "../features/support/SupportDashboardPage";
import OverviewPage from "../features/overview/OverviewPage";
import React from "react";

function getInitialTheme(): "light" | "dark" {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export default function App() {
  const [theme, setTheme] = React.useState<"light" | "dark">(() =>
    getInitialTheme(),
  );

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">Wolt Pricing Studio</div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--text)",
            fontWeight: 800,
          }}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Overview
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Pricing
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Support
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/pricing" element={<CalculatorPage />} />
          <Route path="/support" element={<SupportDashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}
