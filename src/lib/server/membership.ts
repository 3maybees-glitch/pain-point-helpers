import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { PlanId } from "@/lib/helpers/plans";
import { parsePlanId } from "@/lib/server/guards";

export type Membership = {
  plan: PlanId;
  status: string;
  activatedAt: string | null;
};

export const getMembership = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Membership | null> => {
    const sql = await getSql();
    const rows = await sql<{ plan: string; status: string; activated_at: string }>`
      select plan, status, activated_at::text from memberships where user_id = ${context.userId} limit 1
    `;
    const row = rows[0];
    if (!row || row.status !== "active") return null;
    return { plan: row.plan as PlanId, status: row.status, activatedAt: row.activated_at };
  });

export const activateMembership = createServerFn({ method: "POST" })
  .validator((plan: PlanId) => parsePlanId(plan))
  .middleware([authMiddleware])
  .handler(async ({ context, data: plan }): Promise<Membership> => {
    const sql = await getSql();
    await sql`
      insert into memberships (user_id, plan, status, activated_at)
      values (${context.userId}, ${plan}, 'active', now())
      on conflict (user_id) do update set plan = excluded.plan, status = 'active', activated_at = now()
    `;
    return { plan, status: "active", activatedAt: new Date().toISOString() };
  });
