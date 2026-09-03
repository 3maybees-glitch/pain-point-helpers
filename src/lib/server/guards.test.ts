import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PLAN_IDS,
  SAVE_ID_RE,
  SHARE_TOKEN_RE,
  assertHelperId,
  assertShareToken,
  normalizeSaveId,
  normalizeSaveTitle,
  parsePlanId,
  serializeSaveValues,
} from "./guards.ts";

describe("parsePlanId", () => {
  it("accepts the three advertised plans", () => {
    assert.deepEqual([...PLAN_IDS].sort(), ["lifetime", "monthly", "yearly"]);
    assert.equal(parsePlanId("monthly"), "monthly");
    assert.equal(parsePlanId("yearly"), "yearly");
    assert.equal(parsePlanId("lifetime"), "lifetime");
  });

  it("rejects anything else", () => {
    assert.throws(() => parsePlanId("free"), /Unknown plan/);
    assert.throws(() => parsePlanId(""), /Unknown plan/);
    assert.throws(() => parsePlanId(1), /Unknown plan/);
  });
});

describe("share tokens", () => {
  it("accepts 12-char legacy and 32-char current tokens", () => {
    assert.equal(assertShareToken("aabbccddeeff"), "aabbccddeeff");
    assert.equal(assertShareToken("a".repeat(32)), "a".repeat(32));
    assert.match("aabbccddeeff", SHARE_TOKEN_RE);
  });

  it("rejects empty or odd shapes", () => {
    assert.throws(() => assertShareToken(""), /Invalid share link/);
    assert.throws(() => assertShareToken("../x"), /Invalid share link/);
    assert.throws(() => assertShareToken("abc"), /Invalid share link/);
  });
});

describe("save write guards", () => {
  it("keeps a real UUID and mints one otherwise", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    assert.equal(normalizeSaveId(id), id);
    assert.match(normalizeSaveId("not-a-uuid"), SAVE_ID_RE);
  });

  it("requires a catalog helper and a title", () => {
    assert.equal(assertHelperId("sinking-funds-bill-calendar"), "sinking-funds-bill-calendar");
    assert.throws(() => assertHelperId("nope"), /Unknown helper/);
    assert.equal(normalizeSaveTitle("  Hello  "), "Hello");
    assert.throws(() => normalizeSaveTitle("   "), /Title is required/);
  });

  it("caps oversized payloads", () => {
    const huge: Record<string, string> = {};
    huge.blob = "x".repeat(200_001);
    assert.throws(() => serializeSaveValues(huge), /too large/);
    assert.equal(serializeSaveValues({ a: 1 }), "{\"a\":1}");
  });
});
