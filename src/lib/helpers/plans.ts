export const PLANS = [
  {
    id: "monthly" as const,
    name: "Monthly",
    price: 5,
    period: "/ mo",
    blurb: "The whole drawer. Cancel any time.",
  },
  {
    id: "yearly" as const,
    name: "Yearly",
    price: 25,
    period: "/ yr",
    blurb: "Seven months free. The Sunday-night rate.",
  },
  {
    id: "lifetime" as const,
    name: "Lifetime",
    price: 59,
    period: " once",
    blurb: "Pay once. Keep every kit, including new ones.",
  },
];

export type PlanId = (typeof PLANS)[number]["id"];

/** What the 50 kits would cost if sold one-by-one. */
export const SOLO_BUNDLE_VALUE = 777;
