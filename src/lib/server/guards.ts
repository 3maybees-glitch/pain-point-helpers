import { HELPER_BY_ID } from "../helpers/catalog.ts";
import { PLANS, type PlanId } from "../helpers/plans.ts";
import type { FormValues } from "../helpers/types.ts";

export const PLAN_IDS = new Set<string>(PLANS.map((p) => p.id));

export const SAVE_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** New tokens are 32 hex chars; older shares were 12. */
export const SHARE_TOKEN_RE = /^[a-f0-9]{12,32}$/i;

export const MAX_SAVE_TITLE = 200;
export const MAX_SAVE_JSON_BYTES = 200_000;

export function parsePlanId(plan: unknown): PlanId {
  if (typeof plan !== "string" || !PLAN_IDS.has(plan)) {
    throw new Error("Unknown plan");
  }
  return plan as PlanId;
}

export function newShareToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function assertShareToken(token: unknown): string {
  if (typeof token !== "string" || !SHARE_TOKEN_RE.test(token.trim())) {
    throw new Error("Invalid share link");
  }
  return token.trim();
}

export function normalizeSaveId(id: unknown): string {
  if (typeof id === "string" && SAVE_ID_RE.test(id)) return id;
  return crypto.randomUUID();
}

export function assertHelperId(helperId: unknown): string {
  if (typeof helperId !== "string" || !HELPER_BY_ID[helperId]) {
    throw new Error("Unknown helper");
  }
  return helperId;
}

export function normalizeSaveTitle(title: unknown): string {
  const trimmed = typeof title === "string" ? title.trim() : "";
  if (!trimmed) throw new Error("Title is required");
  return trimmed.slice(0, MAX_SAVE_TITLE);
}

export function serializeSaveValues(values: FormValues): string {
  const payload = JSON.stringify(values ?? {});
  if (payload.length > MAX_SAVE_JSON_BYTES) {
    throw new Error("That helper is too large to save");
  }
  return payload;
}
