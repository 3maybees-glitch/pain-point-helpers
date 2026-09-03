export const PLANS = [
  {
    id: "monthly" as const,
    name: "Monthly",
    price: 19,
    period: "/ mo",
    blurb: "The whole drawer. Cancel any time.",
  },
  {
    id: "yearly" as const,
    name: "Yearly",
    price: 99,
    period: "/ yr",
    blurb: "Two months free. The Sunday-night rate.",
  },
  {
    id: "lifetime" as const,
    name: "Lifetime",
    price: 249,
    period: " once",
    blurb: "Pay once. Keep every kit, including new ones.",
  },
];

export type PlanId = (typeof PLANS)[number]["id"];

/** What the 50 kits would cost if sold one-by-one. */
export const SOLO_BUNDLE_VALUE = 777;
