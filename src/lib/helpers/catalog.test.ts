import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CATEGORIES, HELPERS } from "./catalog.ts";
import type { HelperDef } from "./types.ts";

function valueKeys(helper: HelperDef): string[] {
  const ids: string[] = [];
  for (const f of helper.identity ?? []) ids.push(f.id);
  for (const block of helper.blocks) {
    if (block.kind === "fields") {
      for (const f of block.fields) ids.push(f.id);
    } else if (block.kind === "table" || block.kind === "checks") {
      ids.push(block.id);
    }
  }
  return ids;
}

describe("helper catalog", () => {
  it("is fifty unique numbered kits", () => {
    assert.equal(HELPERS.length, 50);
    assert.equal(new Set(HELPERS.map((h) => h.id)).size, 50);
    assert.equal(new Set(HELPERS.map((h) => h.n)).size, 50);
    assert.deepEqual(
      HELPERS.map((h) => h.n).sort((a, b) => a - b),
      Array.from({ length: 50 }, (_, i) => i + 1),
    );
  });

  it("keeps category counts on the advertised ranges", () => {
    const expected: Record<string, number> = {
      money: 6,
      freelance: 7,
      profession: 9,
      health: 6,
      home: 7,
      creators: 7,
      career: 5,
      ai: 3,
    };
    for (const cat of CATEGORIES) {
      assert.equal(
        HELPERS.filter((h) => h.category === cat.id).length,
        expected[cat.id],
        cat.id,
      );
    }
  });

  it("does not reuse a field or block id inside a kit", () => {
    for (const helper of HELPERS) {
      const keys = valueKeys(helper);
      assert.equal(new Set(keys).size, keys.length, helper.id);
    }
  });
});
