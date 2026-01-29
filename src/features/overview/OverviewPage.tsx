export default function OverviewPage() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* HERO */}
      <div className="hero-card">
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "1fr",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>
              Delivery Pricing Studio + Support Ops Dashboard
            </h1>

            <div className="small" style={{ marginTop: 8 }}>
              Wolt-inspired delivery tooling: policy-driven pricing +
              operational support workflow.
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              <span className="pill pill-blue">React + TypeScript</span>
              <span className="pill pill-green">Unit tested engine</span>
              <span className="pill pill-amber">Mobile responsive</span>
            </div>

            <div className="callout" style={{ marginTop: 14 }}>
              <b>Why I built this:</b>
              <div className="small" style={{ marginTop: 6 }}>
                I wanted to demonstrate frontend engineering that’s more than
                UI:
                <b> correctness</b>, <b>testability</b>, and{" "}
                <b>operational tooling</b>. Delivery products succeed when
                pricing is transparent under edge cases, and internal support
                tools reduce time-to-resolution.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="/hero.webp"
              alt="Delivery couriers"
              className="hero-image"
            />
          </div>
        </div>
      </div>

      {/* TWO BIG CARDS */}
      <div className="grid">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>
            1) Pricing Studio (Algorithm Control)
          </h2>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>
              Policy switch: <b>2023 / 2024 / 2025</b> modes
            </li>
            <li>Distance tiers + base fee + optional caps</li>
            <li>Small-order surcharge (threshold-based)</li>
            <li>Item surcharge + bulk threshold</li>
            <li>Deterministic breakdown for transparency + testing</li>
          </ul>

          <div className="callout" style={{ marginTop: 12 }}>
            <div className="small">
              <b>Engineering intent:</b> pricing rules are modeled as{" "}
              <b>JSON policies</b>
              so the algorithm can change without rewriting UI.
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>
            2) Support Ops Dashboard (Internal Tooling)
          </h2>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Ticket queue with priority & status visibility</li>
            <li>
              <b>Assign / Unassign</b> tickets
            </li>
            <li>
              Task workflow: <b>assign / unassign</b> + mark done
            </li>
            <li>Resolve / reopen tickets</li>
            <li>Age awareness (SLA-style)</li>
          </ul>

          <div className="callout" style={{ marginTop: 12 }}>
            <div className="small">
              <b>Product intent:</b> support tooling is a real product. Clear
              workflows reduce handling time and improve customer trust.
            </div>
          </div>
        </div>
      </div>

      {/* ENGINEERING HIGHLIGHTS */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Engineering highlights</h2>
        <div style={{ display: "grid", gap: 10 }}>
          <div className="callout">
            <b>Clean separation:</b>{" "}
            <span className="small">
              pricing engine lives in <code>src/domain/pricing</code> as pure
              functions.
            </span>
          </div>
          <div className="callout">
            <b>Policy-driven rules:</b>{" "}
            <span className="small">
              editable JSON in <code>src/policies</code> for quick iteration and
              control.
            </span>
          </div>
          <div className="callout">
            <b>Tests:</b>{" "}
            <span className="small">
              unit tests cover tiers, thresholds, item/bulk logic, and
              out-of-range distances.
            </span>
          </div>
          <div className="callout">
            <b>UX:</b>{" "}
            <span className="small">
              mobile-first layout, clear breakdown, and high-signal visual
              states.
            </span>
          </div>
        </div>
      </div>

      {/* ROADMAP */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Roadmap (what I’d build next)</h2>
        <ul style={{ marginTop: 8, paddingLeft: 18 }}>
          <li>
            API-backed policies + ticket data (drop-in replacement for mock
            state)
          </li>
          <li>Rush windows / time-based pricing as a policy extension</li>
          <li>Role-based permissions (agent vs admin) for support actions</li>
          <li>Playwright end-to-end test for one full pricing flow</li>
        </ul>
      </div>
    </div>
  );
}
