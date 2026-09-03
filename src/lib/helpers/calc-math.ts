import { formatMoneyExact } from "../utils.ts";
import type { FormValues } from "./types.ts";

export function readNum(values: FormValues, id: string): number | null {
  const raw = values[id];
  if (raw == null || raw === "") return null;
  const n = Number.parseFloat(String(raw).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function money(n: number): string {
  return formatMoneyExact(n);
}

export function yearsLabel(years: number): string {
  if (!Number.isFinite(years) || years < 0) return "—";
  if (years < 1) {
    const months = Math.round(years * 12);
    return months <= 1 ? "about 1 month" : `${months} months`;
  }
  const whole = Math.floor(years);
  const months = Math.round((years - whole) * 12);
  if (months === 0) return whole === 1 ? "1 year" : `${whole} years`;
  return `${whole} yr ${months} mo`;
}

/** Periodic loan payment. `ratePct` is annual percent (6.5 = 6.5%). */
export function pmt(principal: number, ratePct: number, years: number, perYear = 12): number | null {
  if (principal <= 0 || years <= 0 || perYear <= 0) return null;
  const n = years * perYear;
  const r = ratePct / 100 / perYear;
  if (r === 0) return principal / n;
  const pow = (1 + r) ** n;
  return (principal * r * pow) / (pow - 1);
}

export function loanPrincipal(payment: number, ratePct: number, years: number, perYear = 12): number | null {
  if (payment <= 0 || years <= 0 || perYear <= 0) return null;
  const n = years * perYear;
  const r = ratePct / 100 / perYear;
  if (r === 0) return payment * n;
  const pow = (1 + r) ** n;
  return (payment * (pow - 1)) / (r * pow);
}

export function periodsToPayoff(principal: number, ratePct: number, payment: number, perYear = 12): number | null {
  if (principal <= 0 || payment <= 0 || perYear <= 0) return null;
  const r = ratePct / 100 / perYear;
  if (r === 0) return principal / payment;
  if (payment <= principal * r) return null;
  return Math.log(payment / (payment - r * principal)) / Math.log(1 + r);
}

export function futureValue(pv: number, contrib: number, ratePct: number, years: number, perYear = 12): number | null {
  if (years < 0 || perYear <= 0) return null;
  const n = years * perYear;
  const r = ratePct / 100 / perYear;
  if (r === 0) return pv + contrib * n;
  const pow = (1 + r) ** n;
  return pv * pow + contrib * ((pow - 1) / r);
}

export function contribToGoal(goal: number, pv: number, ratePct: number, years: number, perYear = 12): number | null {
  if (goal <= 0 || years <= 0 || perYear <= 0) return null;
  const n = years * perYear;
  const r = ratePct / 100 / perYear;
  if (r === 0) return (goal - pv) / n;
  const pow = (1 + r) ** n;
  return ((goal - pv * pow) * r) / (pow - 1);
}

export function yearsToGoal(goal: number, pv: number, contrib: number, ratePct: number, perYear = 12): number | null {
  if (goal <= 0 || perYear <= 0) return null;
  if (pv >= goal) return 0;
  const r = ratePct / 100 / perYear;
  if (r === 0) {
    if (contrib <= 0) return null;
    return (goal - pv) / contrib / perYear;
  }
  const grow = pv * r + contrib;
  if (grow <= 0) return null;
  const n = Math.log((goal * r + contrib) / grow) / Math.log(1 + r);
  if (!Number.isFinite(n) || n < 0) return null;
  return n / perYear;
}

export function totalInterest(principal: number, payment: number, periods: number): number {
  return Math.max(0, payment * periods - principal);
}
