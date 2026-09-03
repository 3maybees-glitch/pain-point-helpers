import type { Block, FormValues, HelperDef, Json } from "./types";

export function emptyValues(helper: HelperDef): FormValues {
  const values: FormValues = {};
  for (const f of helper.identity ?? []) values[f.id] = "";
  for (const block of helper.blocks) applyBlockDefaults(block, values);
  return values;
}

function applyBlockDefaults(block: Block, values: FormValues) {
  if (block.kind === "fields") {
    for (const f of block.fields) values[f.id] = "";
  } else if (block.kind === "table") {
    const rows = Array.from({ length: block.minRows ?? 3 }, () => {
      const row: { [k: string]: Json } = {};
      for (const col of block.columns) row[col.id] = "";
      return row;
    });
    values[block.id] = rows;
  } else if (block.kind === "checks") {
    const map: { [k: string]: Json } = {};
    for (const item of block.items) map[item.id] = false;
    values[block.id] = map;
  }
}

export function tableRows(values: FormValues, id: string): Array<Record<string, Json>> {
  const raw = values[id];
  if (!Array.isArray(raw)) return [];
  return raw.filter((row): row is Record<string, Json> => !!row && typeof row === "object" && !Array.isArray(row));
}

export function checksMap(values: FormValues, id: string): Record<string, boolean> {
  const raw = values[id];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(raw)) out[k] = Boolean(v);
  return out;
}

export function sumColumn(values: FormValues, tableId: string, colId: string): number {
  let total = 0;
  for (const row of tableRows(values, tableId)) {
    const n = Number.parseFloat(String(row[colId] ?? "").replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(n)) total += n;
  }
  return total;
}
