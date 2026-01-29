import { describe, expect, test } from "vitest";
import { calculatePrice } from "./engine";
import type { PricingPolicy } from "./types";

const policy: PricingPolicy = {
  currency: "EUR",
  baseFeeCents: 100,
  distanceTiers: [
    { upToMeters: 1000, feeCents: 100 },
    { upToMeters: 2000, feeCents: 200 },
  ],
  maxDeliveryFeeCents: 800,
  smallOrder: { enabled: true, thresholdCents: 2000 },
  items: {
    enabled: true,
    perItemFeeCents: 10,
    bulkThreshold: 13,
    bulkFeeCents: 120,
  },
};

test("delivery fee = base + correct tier", () => {
  const r = calculatePrice(
    {
      cartValueCents: 3000,
      distanceMeters: 900,
      itemCount: 0,
      orderTimeISO: new Date().toISOString(),
    },
    policy,
  );
  expect(r.deliveryFeeCents).toBe(200); // base 100 + tier 100
});

test("small order surcharge applies when cart < threshold", () => {
  const r = calculatePrice(
    {
      cartValueCents: 1500,
      distanceMeters: 900,
      itemCount: 0,
      orderTimeISO: new Date().toISOString(),
    },
    policy,
  );
  expect(r.smallOrderSurchargeCents).toBe(500);
});

test("item surcharge uses per-item fee", () => {
  const r = calculatePrice(
    {
      cartValueCents: 3000,
      distanceMeters: 900,
      itemCount: 4,
      orderTimeISO: new Date().toISOString(),
    },
    policy,
  );
  expect(r.itemSurchargeCents).toBe(40);
});

test("bulk fee triggers at threshold", () => {
  const r = calculatePrice(
    {
      cartValueCents: 3000,
      distanceMeters: 900,
      itemCount: 13,
      orderTimeISO: new Date().toISOString(),
    },
    policy,
  );
  expect(r.bulkFeeCents).toBe(120);
});

test("distance beyond last tier increases with steps", () => {
  const r = calculatePrice(
    {
      cartValueCents: 3000,
      distanceMeters: 2600,
      itemCount: 0,
      orderTimeISO: new Date().toISOString(),
    },
    policy,
  );
  // last tier upTo 2000 fee 200, beyond 600 => steps=2 => +100
  // delivery = base 100 + 200 + 100 = 400
  expect(r.deliveryFeeCents).toBe(400);
});
