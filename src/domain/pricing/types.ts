export type MoneyCents = number;

export type DistanceTier = {
  upToMeters: number; // inclusive
  feeCents: MoneyCents;
};

export type PricingPolicy = {
  currency: "EUR";
  baseFeeCents: MoneyCents;
  distanceTiers: DistanceTier[];
  maxDeliveryFeeCents?: MoneyCents;

  smallOrder: {
    thresholdCents: MoneyCents; // cart < threshold => surcharge = threshold - cart
    enabled: boolean;
  };

  items: {
    perItemFeeCents: MoneyCents;
    bulkThreshold: number; // if itemCount >= threshold => bulkFee
    bulkFeeCents: MoneyCents;
    enabled: boolean;
  };
};

export type PricingInput = {
  cartValueCents: MoneyCents;
  distanceMeters: number;
  itemCount: number;
  orderTimeISO: string; // for future (rush etc.)
};

export type BreakdownLine = {
  key: "cart" | "delivery" | "small_order" | "items" | "bulk" | "total";
  label: string;
  amountCents: MoneyCents;
};

export type PricingResult = {
  totalCents: MoneyCents;
  deliveryFeeCents: MoneyCents;
  smallOrderSurchargeCents: MoneyCents;
  itemSurchargeCents: MoneyCents;
  bulkFeeCents: MoneyCents;
  breakdown: BreakdownLine[];
};
