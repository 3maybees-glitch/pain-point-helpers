import type { FormValues } from "./helpers/types";

const prefix = "pph.draft.";

export function loadDraft(helperId: string): FormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(prefix + helperId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FormValues;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function saveDraft(helperId: string, values: FormValues) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(prefix + helperId, JSON.stringify(values));
  } catch {
    /* quota */
  }
}
