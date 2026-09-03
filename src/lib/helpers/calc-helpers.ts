import type { Block, CalcResult, CategoryMeta, Field, FormValues, HelperDef } from "./types.ts";
import {
  contribToGoal,
  futureValue,
  loanPrincipal,
  money,
  periodsToPayoff,
  pmt,
  readNum,
  totalInterest,
  yearsLabel,
  yearsToGoal,
} from "./calc-math.ts";

export const CALC_CATEGORY: CategoryMeta = {
  id: "calcs",
  label: "Family, work & life calcs",
  kicker: "Do the math once",
  range: "51–65",
};

const text = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "text", label, ...extra });
const area = (id: string, label: string, extra: Partial<Field> = {}): Field => ({
  id, type: "textarea", label, rows: extra.rows ?? 3, span: 2, ...extra,
});
const cash = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "currency", label, ...extra });
const num = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "number", label, ...extra });
const pct = (id: string, label: string, extra: Partial<Field> = {}): Field => ({ id, type: "percent", label, ...extra });

function H(
  n: number,
  id: string,
  title: string,
  blurb: string,
  blocks: Block[],
  sample: FormValues,
  compute: (values: FormValues) => CalcResult[],
): HelperDef {
  return {
    id,
    n,
    title,
    blurb,
    category: "calcs",
    identity: [text("preparedBy", "Prepared by"), { id: "preparedOn", type: "date", label: "Date" }],
    blocks,
    sample,
    compute,
  };
}

function row(id: string, label: string, value: string, hint?: string): CalcResult {
  return hint ? { id, label, value, hint } : { id, label, value };
}

function mortgagePayment(values: FormValues): CalcResult[] {
  const price = readNum(values, "price");
  const down = readNum(values, "down") ?? 0;
  const rate = readNum(values, "rate");
  const years = readNum(values, "years");
  const tax = readNum(values, "tax") ?? 0;
  const ins = readNum(values, "ins") ?? 0;
  if (price == null || rate == null || years == null || price <= down) return [];
  const loan = price - down;
  const monthly = pmt(loan, rate, years);
  if (monthly == null) return [];
  const housing = monthly + tax / 12 + ins / 12;
  const periods = years * 12;
  return [
    row("loan", "Loan amount", money(loan)),
    row("pi", "Principal + interest", money(monthly) + " / mo"),
    row("housing", "PITI (with tax + insurance)", money(housing) + " / mo"),
    row("interest", "Interest if you never prepay", money(totalInterest(loan, monthly, periods))),
    row("paid", "Total paid to the lender", money(monthly * periods)),
  ];
}

function houseAfford(values: FormValues): CalcResult[] {
  const income = readNum(values, "income");
  const debts = readNum(values, "debts") ?? 0;
  const dti = readNum(values, "dti") ?? 36;
  const rate = readNum(values, "rate");
  const years = readNum(values, "years") ?? 30;
  const down = readNum(values, "down") ?? 0;
  const taxIns = readNum(values, "taxIns") ?? 0;
  if (income == null || rate == null) return [];
  const maxHousing = Math.max(0, (income * (dti / 100)) - debts);
  const maxPi = Math.max(0, maxHousing - taxIns);
  const loan = loanPrincipal(maxPi, rate, years);
  if (loan == null) return [];
  return [
    row("maxHousing", "Max housing payment", money(maxHousing) + " / mo", `${dti}% of gross minus other debts`),
    row("maxPi", "Left for principal + interest", money(maxPi) + " / mo"),
    row("loan", "Loan you can carry", money(loan)),
    row("home", "Home price with this down payment", money(loan + down)),
  ];
}

function rentVsBuy(values: FormValues): CalcResult[] {
  const rent = readNum(values, "rent");
  const price = readNum(values, "price");
  const down = readNum(values, "down") ?? 0;
  const rate = readNum(values, "rate");
  const years = readNum(values, "years") ?? 5;
  const grow = readNum(values, "grow") ?? 3;
  const rentGrow = readNum(values, "rentGrow") ?? 3;
  const extra = readNum(values, "extra") ?? 0;
  if (rent == null || price == null || rate == null) return [];
  const loan = price - down;
  const monthly = pmt(loan, rate, 30);
  if (monthly == null) return [];
  let rentPaid = 0;
  let buyPaid = down;
  let thisRent = rent;
  for (let y = 0; y < years; y++) {
    rentPaid += thisRent * 12;
    buyPaid += (monthly + extra) * 12;
    thisRent *= 1 + rentGrow / 100;
  }
  const remaining = periodsToPayoff(loan, rate, monthly);
  const paidDown = remaining == null ? 0 : Math.min(loan, monthly * years * 12);
  const equity = down + Math.max(0, paidDown * 0.35);
  const homeValue = price * (1 + grow / 100) ** years;
  const buyNet = buyPaid - (homeValue - (loan - Math.min(loan, equity)));
  return [
    row("rentCash", `Cash out the door if you rent (${years} yr)`, money(rentPaid)),
    row("buyCash", `Cash out the door if you buy (${years} yr)`, money(buyPaid), "Down payment + mortgage + extras"),
    row("homeVal", "Home value if it grows as entered", money(homeValue)),
    row("piti", "Starting P+I", money(monthly) + " / mo"),
    row("take", "Rough takeaway", buyPaid < rentPaid ? "Renting spends more cash over this window — unless you need to move." : "Buying spends more cash up front — run the print sheet with your spouse."),
  ];
}

function mortgagePrepay(values: FormValues): CalcResult[] {
  const loan = readNum(values, "loan");
  const rate = readNum(values, "rate");
  const years = readNum(values, "years");
  const extra = readNum(values, "extra") ?? 0;
  if (loan == null || rate == null || years == null) return [];
  const base = pmt(loan, rate, years);
  if (base == null) return [];
  const basePeriods = years * 12;
  const faster = periodsToPayoff(loan, rate, base + extra);
  const fastPeriods = faster ?? basePeriods;
  const saved = totalInterest(loan, base, basePeriods) - totalInterest(loan, base + extra, fastPeriods);
  return [
    row("base", "Minimum payment", money(base) + " / mo"),
    row("with", "Payment with extra", money(base + extra) + " / mo"),
    row("was", "Time at the minimum", yearsLabel(years)),
    row("now", "Time with extra", faster == null ? "Won’t pay off — extra is too small vs interest" : yearsLabel(fastPeriods / 12)),
    row("saved", "Interest you skip", money(Math.max(0, saved))),
  ];
}

function compareMortgages(values: FormValues): CalcResult[] {
  const amount = readNum(values, "amount");
  const aRate = readNum(values, "aRate");
  const aYears = readNum(values, "aYears");
  const aPts = readNum(values, "aPts") ?? 0;
  const bRate = readNum(values, "bRate");
  const bYears = readNum(values, "bYears");
  const bPts = readNum(values, "bPts") ?? 0;
  if (amount == null || aRate == null || aYears == null || bRate == null || bYears == null) return [];
  const aPmt = pmt(amount, aRate, aYears);
  const bPmt = pmt(amount, bRate, bYears);
  if (aPmt == null || bPmt == null) return [];
  const aCost = aPmt * aYears * 12 + amount * (aPts / 100);
  const bCost = bPmt * bYears * 12 + amount * (bPts / 100);
  const cheaper = aCost <= bCost ? "A" : "B";
  return [
    row("aPmt", "Loan A payment", money(aPmt) + " / mo"),
    row("bPmt", "Loan B payment", money(bPmt) + " / mo"),
    row("aTot", "Loan A all-in (payments + points)", money(aCost)),
    row("bTot", "Loan B all-in (payments + points)", money(bCost)),
    row("win", "Lower lifetime cost", `Loan ${cheaper} by ${money(Math.abs(aCost - bCost))}`),
  ];
}

function simpleLoan(values: FormValues): CalcResult[] {
  const amount = readNum(values, "amount");
  const rate = readNum(values, "rate");
  const years = readNum(values, "years");
  const down = readNum(values, "down") ?? 0;
  if (amount == null || rate == null || years == null) return [];
  const loan = Math.max(0, amount - down);
  const monthly = pmt(loan, rate, years);
  if (monthly == null) return [];
  const n = years * 12;
  return [
    row("loan", "Amount financed", money(loan)),
    row("pmt", "Monthly payment", money(monthly)),
    row("int", "Interest over the term", money(totalInterest(loan, monthly, n))),
    row("tot", "Total of payments", money(monthly * n)),
  ];
}

function retirementNeed(values: FormValues): CalcResult[] {
  const annual = readNum(values, "annual");
  const ss = readNum(values, "ss") ?? 0;
  const have = readNum(values, "have") ?? 0;
  const years = readNum(values, "years") ?? 25;
  if (annual == null) return [];
  const gap = Math.max(0, annual - ss);
  const fourPct = gap * 25;
  const yearsCover = gap * years;
  return [
    row("gap", "Annual gap after Social Security", money(gap)),
    row("four", "Nest egg at a 4% withdrawal", money(fourPct), "25× the annual gap"),
    row("cover", `Cash to cover ${years} years (no growth)`, money(yearsCover)),
    row("short", "Shortfall vs what you have", money(Math.max(0, fourPct - have))),
  ];
}

function retirementPayout(values: FormValues): CalcResult[] {
  const nest = readNum(values, "nest");
  const rate = readNum(values, "rate") ?? 4;
  const years = readNum(values, "years") ?? 25;
  if (nest == null) return [];
  const four = (nest * (rate / 100)) / 12;
  const annuity = pmt(nest, rate, years);
  return [
    row("safe", `${rate}% rule / month`, money(four)),
    row("annuity", `Draw it down over ${years} years`, annuity == null ? "—" : money(annuity) + " / mo"),
    row("year", "That’s per year at the % rule", money(four * 12)),
  ];
}

function workplaceRetirement(values: FormValues): CalcResult[] {
  const current = readNum(values, "current") ?? 0;
  const monthly = readNum(values, "monthly");
  const match = readNum(values, "match") ?? 0;
  const rate = readNum(values, "rate") ?? 7;
  const years = readNum(values, "years");
  if (monthly == null || years == null) return [];
  const into = monthly + match;
  const fv = futureValue(current, into, rate, years);
  if (fv == null) return [];
  return [
    row("into", "Going in each month (you + match)", money(into)),
    row("put", "You put in over the years", money(current + monthly * years * 12)),
    row("fv", "Balance if returns hold", money(fv)),
    row("gain", "Growth on top of deposits", money(Math.max(0, fv - current - monthly * years * 12))),
  ];
}

function compoundSavings(values: FormValues): CalcResult[] {
  const start = readNum(values, "start") ?? 0;
  const monthly = readNum(values, "monthly") ?? 0;
  const rate = readNum(values, "rate");
  const years = readNum(values, "years");
  if (rate == null || years == null) return [];
  const fv = futureValue(start, monthly, rate, years);
  if (fv == null) return [];
  return [
    row("fv", "What it grows to", money(fv)),
    row("in", "Cash you deposited", money(start + monthly * years * 12)),
    row("gain", "Interest earned", money(Math.max(0, fv - start - monthly * years * 12))),
  ];
}

function tuitionSavings(values: FormValues): CalcResult[] {
  const cost = readNum(values, "cost");
  const inflate = readNum(values, "inflate") ?? 5;
  const years = readNum(values, "years");
  const have = readNum(values, "have") ?? 0;
  const rate = readNum(values, "rate") ?? 6;
  if (cost == null || years == null) return [];
  const futureCost = cost * (1 + inflate / 100) ** years;
  const need = contribToGoal(futureCost, have, rate, years);
  return [
    row("future", "Sticker by the first year", money(futureCost)),
    row("month", "Monthly save from now", need == null ? "—" : money(need)),
    row("total", "You would deposit", need == null ? "—" : money(need * years * 12)),
  ];
}

function pathToMillion(values: FormValues): CalcResult[] {
  const start = readNum(values, "start") ?? 0;
  const monthly = readNum(values, "monthly");
  const rate = readNum(values, "rate") ?? 7;
  const goal = readNum(values, "goal") ?? 1_000_000;
  if (monthly == null) return [];
  const years = yearsToGoal(goal, start, monthly, rate);
  const fv20 = futureValue(start, monthly, rate, 20);
  return [
    row("when", `Time to ${money(goal)}`, years == null ? "Never at this rate — raise the deposit" : yearsLabel(years)),
    row("twenty", "If you keep this up 20 years", fv20 == null ? "—" : money(fv20)),
  ];
}

function assetAllocation(values: FormValues): CalcResult[] {
  const age = readNum(values, "age");
  const rule = readNum(values, "rule") ?? 110;
  if (age == null) return [];
  const stocks = Math.min(100, Math.max(0, rule - age));
  const bonds = 100 - stocks;
  return [
    row("stocks", "Stocks / equity", `${stocks.toFixed(0)}%`),
    row("bonds", "Bonds / cash / fixed", `${bonds.toFixed(0)}%`),
    row("note", "This is a starting split", "Move toward bonds if you cannot sleep. The opposite if you have a long runway and a stomach."),
  ];
}

function habitLeak(values: FormValues): CalcResult[] {
  const daily = readNum(values, "daily");
  const days = readNum(values, "days") ?? 5;
  const years = readNum(values, "years") ?? 10;
  const rate = readNum(values, "rate") ?? 6;
  if (daily == null) return [];
  const yearly = daily * days * 52;
  const invested = futureValue(0, yearly / 12, rate, years);
  return [
    row("year", "That habit costs this year", money(yearly)),
    row("raw", `Cash over ${years} years`, money(yearly * years)),
    row("fv", "If you invested it instead", invested == null ? "—" : money(invested)),
  ];
}

function leaseVsBuy(values: FormValues): CalcResult[] {
  const price = readNum(values, "price");
  const down = readNum(values, "down") ?? 0;
  const rate = readNum(values, "rate");
  const years = readNum(values, "years") ?? 5;
  const residual = readNum(values, "residual") ?? 0;
  const lease = readNum(values, "lease");
  const drive = readNum(values, "drive") ?? 0;
  if (price == null || rate == null || lease == null) return [];
  const loan = Math.max(0, price - down);
  const buyPmt = pmt(loan, rate, years);
  if (buyPmt == null) return [];
  const buyCash = down + buyPmt * years * 12 + drive * years - residual;
  const leaseCash = lease * years * 12 + drive * years;
  const cheaper = buyCash <= leaseCash ? "Buying" : "Leasing";
  return [
    row("buyPmt", "Buy payment", money(buyPmt) + " / mo"),
    row("buy", "Net cost to own (minus what it’s worth)", money(buyCash)),
    row("lease", "Net cost to lease", money(leaseCash)),
    row("win", "Cheaper on paper", `${cheaper} by ${money(Math.abs(buyCash - leaseCash))}`),
  ];
}

export const CALC_HELPERS: HelperDef[] = [
  H(51, "mortgage-payment", "Mortgage payment",
    "What the house actually costs each month — principal, interest, tax, insurance.",
    [
      { kind: "fields", title: "The loan", fields: [
        cash("price", "Home price"), cash("down", "Down payment"), pct("rate", "Rate %"), num("years", "Years"),
      ] },
      { kind: "fields", title: "The rest of PITI", fields: [
        cash("tax", "Property tax / year"), cash("ins", "Homeowners insurance / year"),
      ] },
      { kind: "note", body: "This is the payment if you never throw extra at it. Use Prepay the mortgage to see what $100 extra does." },
    ],
    { price: "320000", down: "64000", rate: "6.5", years: "30", tax: "3600", ins: "1400" },
    mortgagePayment),

  H(52, "house-afford", "How much house can we afford",
    "A DTI-first number before you fall in love with the listing.",
    [
      { kind: "fields", title: "Income & debts", fields: [
        cash("income", "Gross monthly income"), cash("debts", "Other monthly debts"), pct("dti", "Max DTI %"),
      ] },
      { kind: "fields", title: "The loan you’ll shop", fields: [
        pct("rate", "Rate %"), num("years", "Years"), cash("down", "Down payment you have"), cash("taxIns", "Tax + insurance / mo"),
      ] },
      { kind: "prompts", title: "After the number", items: ["Can we still fund sinking funds?", "What breaks if one income pauses 90 days?", "Are we bidding on the house or the payment?"] },
    ],
    { income: "8200", debts: "480", dti: "36", rate: "6.5", years: "30", down: "40000", taxIns: "420" },
    houseAfford),

  H(53, "rent-vs-buy", "Rent vs buy",
    "Five (or N) years of cash out the door — not a vibes argument.",
    [
      { kind: "fields", title: "Renting", fields: [cash("rent", "Rent / mo"), pct("rentGrow", "Rent raise % / yr")] },
      { kind: "fields", title: "Buying", fields: [
        cash("price", "Home price"), cash("down", "Down payment"), pct("rate", "Rate %"), cash("extra", "Extra housing / mo"),
      ] },
      { kind: "fields", title: "The window", fields: [num("years", "Years you’ll stay"), pct("grow", "Home growth % / yr")] },
    ],
    { rent: "1850", rentGrow: "3", price: "310000", down: "40000", rate: "6.5", extra: "350", years: "5", grow: "3" },
    rentVsBuy),

  H(54, "mortgage-prepay", "Prepay the mortgage",
    "What $100 (or $400) extra does to the payoff date and the interest.",
    [
      { kind: "fields", fields: [
        cash("loan", "Balance left"), pct("rate", "Rate %"), num("years", "Years left"), cash("extra", "Extra / mo"),
      ] },
      { kind: "note", body: "If the rate is 3% and your HYSA is 4%, extra principal is a feeling, not a math win. Run both." },
    ],
    { loan: "248000", rate: "6.5", years: "27", extra: "200" },
    mortgagePrepay),

  H(55, "compare-mortgages", "Compare two mortgages",
    "Rate, term, and points on one page. Pick the cheaper all-in, not the prettier payment.",
    [
      { kind: "fields", title: "Shared", fields: [cash("amount", "Loan amount")] },
      { kind: "fields", title: "Loan A", fields: [pct("aRate", "Rate %"), num("aYears", "Years"), pct("aPts", "Points %")] },
      { kind: "fields", title: "Loan B", fields: [pct("bRate", "Rate %"), num("bYears", "Years"), pct("bPts", "Points %")] },
    ],
    { amount: "280000", aRate: "6.5", aYears: "30", aPts: "0", bRate: "6.125", bYears: "30", bPts: "1" },
    compareMortgages),

  H(56, "simple-loan", "Car / personal loan",
    "The payment, the interest, the total. Car, boat, or the couch you should not finance.",
    [
      { kind: "fields", fields: [
        cash("amount", "Price"), cash("down", "Down / trade"), pct("rate", "APR %"), num("years", "Years"),
      ] },
      { kind: "prompts", title: "Before you sign", items: ["Can this payment die and we still eat?", "What’s the out-the-door after tax and fees?", "Used, and we walk if the payment needs a fourth year."] },
    ],
    { amount: "18600", down: "2500", rate: "7.9", years: "5" },
    simpleLoan),

  H(57, "retirement-need", "How much retirement do we need",
    "Annual spend, minus Social Security, times a boring rule. The number you actually save toward.",
    [
      { kind: "fields", fields: [
        cash("annual", "Spend in retirement / yr"), cash("ss", "Social Security / yr"), cash("have", "Already saved"), num("years", "Years to cover (no 4%)"),
      ] },
      { kind: "note", body: "The 4% rule is a planning stick, not a promise. Healthcare and housing will lie to you." },
    ],
    { annual: "72000", ss: "28000", have: "180000", years: "25" },
    retirementNeed),

  H(58, "retirement-payout", "Retirement monthly payout",
    "What a nest egg throws off each month — % rule vs drawing it down.",
    [
      { kind: "fields", fields: [
        cash("nest", "Nest egg"), pct("rate", "Withdrawal or return %"), num("years", "Years to empty it"),
      ] },
    ],
    { nest: "850000", rate: "4", years: "25" },
    retirementPayout),

  H(59, "workplace-retirement", "401k / IRA growth",
    "What this year’s deferral plus the match becomes if you do not raid it.",
    [
      { kind: "fields", fields: [
        cash("current", "Balance now"), cash("monthly", "Your deferral / mo"), cash("match", "Employer match / mo"),
        pct("rate", "Assumed return %"), num("years", "Years until you stop"),
      ] },
    ],
    { current: "42000", monthly: "500", match: "200", rate: "7", years: "22" },
    workplaceRetirement),

  H(60, "compound-savings", "Compound savings",
    "A number in, a number out, interest in the middle. HYSA, brokerage, the ugly mutual fund.",
    [
      { kind: "fields", fields: [
        cash("start", "Starting balance"), cash("monthly", "Add each month"), pct("rate", "Annual return %"), num("years", "Years"),
      ] },
    ],
    { start: "8000", monthly: "250", rate: "5", years: "12" },
    compoundSavings),

  H(61, "tuition-savings", "Tuition savings",
    "Today’s sticker, grown by inflation, then the monthly save so you are not borrowing the whole thing.",
    [
      { kind: "fields", fields: [
        cash("cost", "Today’s annual cost"), pct("inflate", "Tuition inflate %"), num("years", "Years until start"),
        cash("have", "Already saved"), pct("rate", "Invest return %"),
      ] },
      { kind: "note", body: "This is one year of school. Multiply by four if you are being honest, or two if a state school and a job." },
    ],
    { cost: "28000", inflate: "5", years: "8", have: "12000", rate: "6" },
    tuitionSavings),

  H(62, "path-to-million", "Path to $1 million",
    "How long at this deposit and this return — or change the goal if a million is the wrong stick.",
    [
      { kind: "fields", fields: [
        cash("start", "Starting balance"), cash("monthly", "Monthly add"), pct("rate", "Return %"), cash("goal", "Goal"),
      ] },
    ],
    { start: "15000", monthly: "600", rate: "7", goal: "1000000" },
    pathToMillion),

  H(63, "asset-allocation", "Asset allocation by age",
    "A first split: stocks vs ballast. Age in, percentage out. Then you argue with it.",
    [
      { kind: "fields", fields: [
        num("age", "Your age"), num("rule", "Rule (110 − age is common)", { placeholder: "110" }),
      ] },
      { kind: "prompts", title: "Then adjust", items: ["Pension or paid-off house? You can hold more stock.", "If a 20% drop would make you sell, you are already too heavy.", "This is not advice. It is a starting pie."] },
    ],
    { age: "42", rule: "110" },
    assetAllocation),

  H(64, "habit-leak", "Habit leak (coffee, lunch, vending machine for random snacks)",
    "An $8–15 lunch, the vending machine for random snacks, the quiet coffee. Times a decade vs investing it. No lecture — just the receipt.",
    [
      { kind: "fields", fields: [
        cash("daily", "Spend on the habit / day", { placeholder: "8–15 for a typical lunch" }),
        num("days", "Days / week"),
        num("years", "Years"),
        pct("rate", "If invested, return %"),
      ] },
      { kind: "fields", fields: [area("habit", "What it is (so future-you remembers)")] },
    ],
    { daily: "12", days: "5", years: "10", rate: "6", habit: "Workweek lunch out ($8–15) + vending machine for random snacks" },
    habitLeak),

  H(65, "lease-vs-buy", "Lease vs buy",
    "Car or equipment: payment story vs what you own at the end.",
    [
      { kind: "fields", title: "Buy it", fields: [
        cash("price", "Price"), cash("down", "Down"), pct("rate", "Loan APR %"), num("years", "Years"), cash("residual", "Worth at the end"),
      ] },
      { kind: "fields", title: "Lease it", fields: [
        cash("lease", "Lease / mo"), cash("drive", "Other / yr (insurance gap, miles)"),
      ] },
    ],
    { price: "34000", down: "3000", rate: "6.9", years: "5", residual: "16000", lease: "429", drive: "400" },
    leaseVsBuy),
];
