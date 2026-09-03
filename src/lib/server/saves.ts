import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { FormValues, Json } from "@/lib/helpers/types";

export type SaveRow = {
  id: string;
  helperId: string;
  title: string;
  values: FormValues;
  shareToken: string | null;
  updatedAt: string;
};

function asValues(raw: unknown): FormValues {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as FormValues;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as Json;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as FormValues;
    } catch {
      /* ignore */
    }
  }
  return {};
}

export const listSaves = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SaveRow[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      helper_id: string;
      title: string;
      values_json: unknown;
      share_token: string | null;
      updated_at: string;
    }>`
      select id, helper_id, title, values_json, share_token, updated_at::text
      from helper_saves where user_id = ${context.userId}
      order by updated_at desc
    `;
    return rows.map((r) => ({
      id: r.id,
      helperId: r.helper_id,
      title: r.title,
      values: asValues(r.values_json),
      shareToken: r.share_token,
      updatedAt: r.updated_at,
    }));
  });

export const getSave = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }): Promise<SaveRow | null> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      helper_id: string;
      title: string;
      values_json: unknown;
      share_token: string | null;
      updated_at: string;
    }>`
      select id, helper_id, title, values_json, share_token, updated_at::text
      from helper_saves where id = ${id} and user_id = ${context.userId} limit 1
    `;
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      helperId: r.helper_id,
      title: r.title,
      values: asValues(r.values_json),
      shareToken: r.share_token,
      updatedAt: r.updated_at,
    };
  });

export const upsertSave = createServerFn({ method: "POST" })
  .validator((input: { id?: string; helperId: string; title: string; values: FormValues }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<SaveRow> => {
    const sql = await getSql();
    const memberRows = await sql<{ status: string }>`
      select status from memberships where user_id = ${context.userId} limit 1
    `;
    if (!memberRows[0] || memberRows[0].status !== "active") {
      throw new Error("All-access required to save");
    }
    const id = data.id ?? crypto.randomUUID();
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
    const payload = JSON.stringify(data.values);
    await sql`
      insert into helper_saves (id, user_id, helper_id, title, values_json, share_token, updated_at)
      values (${id}, ${context.userId}, ${data.helperId}, ${data.title}, ${payload}::jsonb, ${token}, now())
      on conflict (id) do update set
        title = excluded.title,
        values_json = excluded.values_json,
        updated_at = now()
      where helper_saves.user_id = ${context.userId}
    `;
    const rows = await sql<{ share_token: string | null; updated_at: string }>`
      select share_token, updated_at::text from helper_saves where id = ${id} and user_id = ${context.userId}
    `;
    return {
      id,
      helperId: data.helperId,
      title: data.title,
      values: data.values,
      shareToken: rows[0]?.share_token ?? token,
      updatedAt: rows[0]?.updated_at ?? new Date().toISOString(),
    };
  });

export const deleteSave = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from helper_saves where id = ${id} and user_id = ${context.userId}`;
  });

export const getSaveByToken = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }): Promise<SaveRow | null> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      helper_id: string;
      title: string;
      values_json: unknown;
      share_token: string | null;
      updated_at: string;
    }>`
      select id, helper_id, title, values_json, share_token, updated_at::text
      from helper_saves where share_token = ${token} limit 1
    `;
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      helperId: r.helper_id,
      title: r.title,
      values: asValues(r.values_json),
      shareToken: r.share_token,
      updatedAt: r.updated_at,
    };
  });
