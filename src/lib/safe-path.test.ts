import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { safeInternalPath } from "./safe-path.ts";

describe("safeInternalPath", () => {
  it("keeps ordinary app paths", () => {
    assert.equal(safeInternalPath("/library", "/"), "/library");
    assert.equal(safeInternalPath("/helpers/foo?save=1", "/"), "/helpers/foo?save=1");
  });

  it("rejects protocol-relative and off-origin values", () => {
    assert.equal(safeInternalPath("//evil.example", "/library"), "/library");
    assert.equal(safeInternalPath("/\\evil.example", "/library"), "/library");
    assert.equal(safeInternalPath("https://evil.example", "/library"), "/library");
    assert.equal(safeInternalPath("/login?next=https://evil.example", "/library"), "/library");
  });

  it("falls back for empty or non-strings", () => {
    assert.equal(safeInternalPath("", "/library"), "/library");
    assert.equal(safeInternalPath("   ", "/library"), "/library");
    assert.equal(safeInternalPath(undefined, "/library"), "/library");
  });
});
