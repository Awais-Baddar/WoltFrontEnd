import type {
  PricingInput,
  PricingPolicy,
  PricingResult,
  MoneyCents,
} from "./types";

function clampInt(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

function getTierFeeCents(
  distanceMeters: number,
  policy: PricingPolicy,
): MoneyCents {
  const d = clampInt(distanceMeters, 0, 1_000_000);

  const tier = policy.distanceTiers.find((t) => d <= t.upToMeters);

  if (tier) return tier.feeCents;

  // Beyond last tier: add steps (simple, still shows algorithm thinking)
  const last = policy.distanceTiers[policy.distanceTiers.length - 1];
  const beyond = d - last.upToMeters;
  const stepMeters = 500;
  const stepFeeCents = 50;
  const steps = Math.ceil(beyond / stepMeters);
  return last.feeCents + steps * stepFeeCents;
}

function applyMaxCap(fee: MoneyCents, cap?: MoneyCents): MoneyCents {
  return cap == null ? fee : Math.min(fee, cap);
}

export function calculatePrice(
  input: PricingInput,
  policy: PricingPolicy,
): PricingResult {
  const cart = clampInt(input.cartValueCents, 0, 1_000_000_00);
  const items = clampInt(input.itemCount, 0, 10_000);
  const distance = clampInt(input.distanceMeters, 0, 1_000_000);

  let deliveryFee = policy.baseFeeCents + getTierFeeCents(distance, policy);
  deliveryFee = applyMaxCap(deliveryFee, policy.maxDeliveryFeeCents);

  const smallOrderSurcharge =
    policy.smallOrder.enabled && cart < policy.smallOrder.thresholdCents
      ? policy.smallOrder.thresholdCents - cart
      : 0;

  const itemSurcharge = policy.items.enabled
    ? items * policy.items.perItemFeeCents
    : 0;
  const bulkFee =
    policy.items.enabled && items >= policy.items.bulkThreshold
      ? policy.items.bulkFeeCents
      : 0;

  const total =
    cart + deliveryFee + smallOrderSurcharge + itemSurcharge + bulkFee;

  return {
    totalCents: total,
    deliveryFeeCents: deliveryFee,
    smallOrderSurchargeCents: smallOrderSurcharge,
    itemSurchargeCents: itemSurcharge,
    bulkFeeCents: bulkFee,
    breakdown: [
      { key: "cart", label: "Cart value", amountCents: cart },
      { key: "delivery", label: "Delivery fee", amountCents: deliveryFee },
      {
        key: "small_order",
        label: "Small order surcharge",
        amountCents: smallOrderSurcharge,
      },
      { key: "items", label: "Items surcharge", amountCents: itemSurcharge },
      { key: "bulk", label: "Bulk fee", amountCents: bulkFee },
      { key: "total", label: "Total", amountCents: total },
    ],
  };
}
