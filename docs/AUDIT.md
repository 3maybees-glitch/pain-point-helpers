# Pain Point Helpers — Audit

**Date:** 3 September 2026  
**Scope:** current `main` (commit `d09a214`) plus the fixes in this change  
**Product:** 50 fillable life / work / family kits. Fill online, print a PDF, share a link, or save under an account. All-access is $5 / mo · $25 / yr · $59 lifetime.

This is a launch-readiness audit: security, paywall integrity, data, product completeness, and UX. It is not a Stripe or legal review.

---

## Verdict

The catalog and fill/print experience are demo-quality and coherent. Auth and per-user saves are wired the right way (session-scoped `userId`, no client-sent owner ids).

**It is not ready to take real money.** Checkout is a free server function. Monthly and yearly plans never expire. Print is gated only in the UI. A share link is an unauthenticated read of whatever was saved.

Treat the live site as a preview catalog until payments, expiry, and the print/share gates are real.

---

## What is solid

- **50 unique kits**, numbered 01–50, eight categories matching the advertised ranges.
- **Fill-online forms** with tables, checklists, running totals, letter-size print sheets, and local drafts.
- **Auth** uses Better Auth + `authMiddleware` + `requireUserId`. Saves and membership queries are scoped by the verified session, not a client-supplied user id.
- **Same-site isolation** on mutating server functions (`assertSameSiteRequest`).
- **Library** is sign-in gated; empty and loading states exist.
- **Brand** is consistent: paper/ink/forest palette, Fraunces + Source Sans, Maybee Creations voice.
- Filling without an account is free, as advertised.

---

## Findings

Severity: **P0** blocks taking payment · **P1** security or data integrity · **P2** product / UX · **P3** polish.

### P0 — Checkout is not a checkout

`activateMembership` writes `status = 'active'` for any signed-in user and any plan string. No Stripe (or other) payment, no webhook, no receipt.

The pricing page says this is preview checkout. That is honest in the sandbox and fatal in production: anyone who can create an account gets lifetime all-access.

**Needed for launch:** Stripe Checkout (or equivalent) → webhook → set membership. Disable or delete the free activate path in production.

### P0 — Paid plans never end

`memberships` stores `plan` and `activated_at` only. `getMembership` treats any `status = 'active'` row as current. A “monthly” or “yearly” click is lifetime access.

**Needed:** `expires_at` (or Stripe subscription status) and a check that rejects expired rows.

### P0 — Print paywall is client-only

Print is `window.print()`. The filled sheet is in the DOM (`hidden print:block`). Browser print, Save as PDF, and a screenshot bypass the gate.

This change stops rendering the print sheet until membership is confirmed, so a non-member Ctrl+P gets a blank page instead of the kit. That is still not a real DRM; it just matches the advertised rule.

Share pages (`/s/:token`) correctly allow recipients to print.

### P1 — Open redirect on sign-in return

Login accepted any `?redirect=` that started with `/`, including `//evil.example`. After OAuth, `signIn` assigns `window.location.href = callbackURL`, which follows protocol-relative URLs off-origin.

**Fixed:** only same-origin paths (`/…`, not `//`, not `\`, not `://`) are used as the post-login destination.

### P1 — Share tokens were 48 bits and public

Tokens were 12 hex characters from a UUID slice (~48 bits). `getSaveByToken` is unauthenticated. Helpers can hold medical notes, bills, kids’ names, lockbox codes, emergency contacts.

**Fixed:** new tokens are 32 hex characters (full UUID, no dashes). Lookup rejects tokens outside `[a-f0-9]{12,32}` so old 12-char links still resolve.

Remaining (not fixed here): no expiry, no revoke, no rate limit, anyone with the URL can read the save.

### P1 — Save upsert could report success without writing

If a client posted another user’s save `id`, `INSERT` hit the primary key, `UPDATE` was skipped by the `user_id` clause, and the handler still returned a fabricated success (including a token that was never stored).

**Fixed:** require a row owned by the caller after write; otherwise throw. Client-supplied ids must be UUIDs. `helperId` must exist in the catalog. Title and JSON payload are size-capped.

### P1 — Plan id was not validated

`activateMembership` accepted any string as `plan`.

**Fixed:** only `monthly` | `yearly` | `lifetime`.

### P1 — Field id collision on kit 37

`batch-filming-shotlist` used `day` for both “Filming day” and the day-of checklist. The two controls wrote the same key; one clobbered the other.

**Fixed:** checklist id is `dayOf`.

### P2 — Search existed in the URL, not in the UI

`/helpers?q=` was parsed and filtered. There was no search box, and category chips dropped `q`.

**Fixed:** search field on The 50; category chips keep the query; empty results are explained.

### P2 — Membership race on the helper page

Print / share / save treated “membership still loading” as “not a member” and bounced paying users to pricing.

**Fixed:** those actions wait until membership is resolved.

### P2 — Library delete had no confirm

**Fixed:** confirm before delete.

### P2 — Thirteen kits have no sample fill

Fill sample is a no-op (or nearly) on: 26, 30, 32–35, 37, 39, 40, 42, 44, 46, 47. The button still shows.

### P2 — Email share does not share the filled sheet

Email opens `mailto:` with the current helper URL (usually the blank template), not a share token. Copy share link is the real share path.

### P2 — Saved title is always the kit name

`upsertSave` stores `helper.title`, not a user-chosen name. Two sinking-fund saves look identical in the library.

### P2 — No way to revoke or rotate a share link

Sharing always upserts; the token is created once and kept. There is no “stop sharing.”

### P2 — Drafts are device-local only

`localStorage` drafts (`pph.draft.*`) never merge into the signed-in library. Switching devices loses unsaved work. Expected for a preview; call it out if you sell “library across devices.”

### P3 — Error screen is off-brand

`AppErrorComponent` is zinc/neutral, not paper/ink.

### P3 — Narrow table columns clip sample text

On Invoice chase tracker, “Northside PT” and “Call Tuesday 10am” overflow the cell inputs. Tables use a 36rem min-width with horizontal scroll; cells still clip.

### P3 — Category chips do not keep focus / scroll on mobile

Long category rows wrap; fine, but there is no “jump to category” from the home page beyond the first six kits.

### P2 — Production preview without Neon cannot boot PGLite

`npm run preview` (built output, no `DATABASE_URL`) crashes: Nitro packs `@electric-sql/pglite` JS but not `pglite.data` / `pglite.wasm`. Dev works. A Vercel deploy with Neon never hits this path.

**Needed:** set `DATABASE_URL` on deploy (already in the README). Do not rely on the WASM fallback in production.

### P3 — Unused platform modules

`src/lib/multiplayer/*` and `src/lib/app-data/*` are unused by the product. Harmless template leftovers.

---

## Paywall matrix (as designed vs as shipped)

| Action | Advertised | Before this audit | After this change |
| --- | --- | --- | --- |
| Fill a kit | Free | Free | Free |
| Fill sample | Free | Free | Free |
| Save to library | All-access | Server-enforced | Server-enforced + stricter write |
| Copy share link | All-access | Server-enforced (via save) | Same |
| Print / PDF | All-access | UI only (`window.print`) | UI + print sheet omitted for non-members |
| Open `/s/:token` | Anyone with the link | Anyone with the link | Same; stronger tokens |
| Get all-access | Paid | Free activate | Still free activate (preview) |

---

## Data the product asks people to type

Several kits are one lost share link away from being a privacy incident:

- Household runbook, emergency contacts, babysitter sheet (phones, addresses, kids)
- Care-visit log, specialist history, symptom log (health)
- Realtor showing-day (lockbox / access codes)
- Teacher sub plan (“passwords sheet”)
- Tax folder, invoices, salary numbers

Do not ship share-by-default. Consider: confirm before first share, expiry, and a “this link can see medical / family data” line.

---

## Recommended next work (in order)

1. **Real checkout** — Stripe Checkout + webhook; kill free `activateMembership` in production.
2. **Subscription expiry** — `expires_at` or Stripe customer portal + status sync.
3. **Share hygiene** — revoke, expiry, optional password; rate-limit token lookup.
4. **Sample fills** for the 13 empty kits.
5. **Rename-in-library** so two saves of the same kit are distinguishable.
6. **Privacy copy** on share (especially health / family / access-code kits).
7. **Legal** — terms, privacy, refund, and “not medical / legal advice” on those kits.

---

## Fixes included with this audit

- Safe post-login redirect
- Stronger share tokens + token shape check
- Save upsert: catalog helper, UUID id, payload cap, write must land
- Plan id allowlist
- Kit 37 field-id collision
- Search on The 50
- Print sheet only for members
- Wait for membership before save / print / share
- Confirm library delete
- Catalog uniqueness / collision tests
