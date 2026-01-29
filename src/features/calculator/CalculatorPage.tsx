import { useMemo, useState } from "react";
import { calculatePrice } from "../../domain/pricing/engine";
import type { PricingPolicy } from "../../domain/pricing/types";

import policy2023 from "../../policies/2023.json";
import policy2024 from "../../policies/2024.json";
import policy2025 from "../../policies/2025.json";

function eur(cents: number) {
  return (cents / 100).toFixed(2) + " €";
}

export default function CalculatorPage() {
  const [mode, setMode] = useState<"2023" | "2024" | "2025">("2024");
  const [cartEur, setCartEur] = useState("25");
  const [distance, setDistance] = useState("1200");
  const [items, setItems] = useState("3");

  const policy: PricingPolicy = useMemo(() => {
    if (mode === "2023") return policy2023 as PricingPolicy;
    if (mode === "2025") return policy2025 as PricingPolicy;
    return policy2024 as PricingPolicy;
  }, [mode]);

  const cartCents = Math.round((Number(cartEur) || 0) * 100);

  const result = useMemo(() => {
    return calculatePrice(
      {
        cartValueCents: cartCents,
        distanceMeters: Number(distance) || 0,
        itemCount: Number(items) || 0,
        orderTimeISO: new Date().toISOString(),
      },
      policy,
    );
  }, [cartCents, distance, items, policy]);

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Pricing Studio</h2>
        <p className="small">
          Switch policies (2023/2024/2025) to show algorithm control.
        </p>

        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}
        >
          <button
            onClick={() => {
              setCartEur("8");
              setDistance("3200");
              setItems("1");
            }}
          >
            Small basket • Far distance
          </button>
          <button
            onClick={() => {
              setCartEur("18");
              setDistance("1400");
              setItems("13");
            }}
          >
            Bulk threshold case
          </button>
          <button
            onClick={() => {
              setCartEur("45");
              setDistance("700");
              setItems("3");
            }}
          >
            Near distance • High cart
          </button>
        </div>

        <div className="callout" style={{ marginTop: 12 }}>
          <b>Algorithm notes:</b>
          <div className="small" style={{ marginTop: 6 }}>
            Delivery fee = <b>base fee</b> + <b>distance tier fee</b>. If
            distance exceeds tiers, I apply a step increment. Small-order
            surcharge applies when cart value is below the threshold. Item and
            bulk rules are policy-controlled.
          </div>
        </div>

        <div className="row">
          <label>Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as any)}>
            <option value="2023">2023 Policy</option>
            <option value="2024">2024 Policy</option>
            <option value="2025">2025 Policy</option>
          </select>
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <label>Cart value (€)</label>
          <input
            value={cartEur}
            onChange={(e) => setCartEur(e.target.value)}
            inputMode="decimal"
          />
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <label>Distance (meters)</label>
          <input
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            inputMode="numeric"
          />
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <label>Items</label>
          <input
            value={items}
            onChange={(e) => setItems(e.target.value)}
            inputMode="numeric"
          />
        </div>

        <hr />
        <div className="small">
          Policy knobs: baseFee={eur(policy.baseFeeCents)}, smallOrderThreshold=
          {eur(policy.smallOrder.thresholdCents)}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Breakdown</h2>
        {result.breakdown.map((b) => (
          <div
            key={b.key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
            }}
          >
            <div>{b.label}</div>
            <div style={{ fontWeight: b.key === "total" ? 700 : 400 }}>
              {eur(b.amountCents)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
