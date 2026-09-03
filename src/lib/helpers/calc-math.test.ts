import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { futureValue, pmt, yearsToGoal } from "./calc-math.ts";

describe("calc math", () => {
  it("prices a standard 30-year mortgage", () => {
    const monthly = pmt(256_000, 6.5, 30);
    assert.ok(monthly);
    assert.ok(Math.abs(monthly - 1618) < 3, String(monthly));
  });

  it("grows a monthly savings habit", () => {
    const fv = futureValue(0, 250, 5, 12);
    assert.ok(fv);
    assert.ok(fv > 250 * 12 * 12);
  });

  it("estimates years to a million", () => {
    const years = yearsToGoal(1_000_000, 15_000, 600, 7);
    assert.ok(years);
    assert.ok(years > 20 && years < 45, String(years));
  });
});
