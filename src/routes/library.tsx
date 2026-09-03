import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HELPER_BY_ID } from "@/lib/helpers/catalog";
import { deleteSave, listSaves, type SaveRow } from "@/lib/server/saves";
import { useMembership } from "@/hooks/use-membership";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { toast } from "sonner";
import { PAGE_GUIDES } from "@/lib/helpers/guides";
import { MascotTip } from "@/components/mascot";

export const Route = createFileRoute("/library")({ component: Library });

function Library() {
  const { user, userPending, isMember } = useMembership();
  const [rows, setRows] = useState<SaveRow[] | null>(null);

  useEffect(() => {
    if (!user) return;
    listSaves()
      .then(setRows)
      .catch(() => setRows([]));
  }, [user?.id]);

  if (userPending) return <main className="mx-auto max-w-3xl px-4 py-16 text-muted">Loading…</main>;
  if (!user) return <RedirectToSignIn to="/login" />;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 pb-28">
      <h1 className="font-display text-4xl text-ink">My library</h1>
      <p className="mt-2 text-lg text-muted">Filled helpers saved under this account.</p>
      <MascotTip pose="think" className="mt-6">
        {PAGE_GUIDES.library}
      </MascotTip>
      {!isMember ? (
        <p className="mt-4 text-base">
          All-access is off.{" "}
          <Link to="/pricing" className="text-accent underline-offset-2 hover:underline">
            Unlock saving
          </Link>
          .
        </p>
      ) : null}

      {rows === null ? (
        <p className="mt-8 text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-line p-8 text-center">
          <p className="text-lg text-muted">{PAGE_GUIDES.libraryEmpty}</p>
          <Button asChild className="mt-4">
            <Link to="/helpers">Browse the kits</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-3">
          {rows.map((row) => {
            const helper = HELPER_BY_ID[row.helperId];
            return (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
                <div>
                  <Link
                    to="/helpers/$slug"
                    params={{ slug: row.helperId }}
                    search={{ save: row.id }}
                    className="font-display text-lg text-ink hover:underline"
                  >
                    {row.title}
                  </Link>
                  <p className="text-base text-subtle">
                    {helper ? `#${String(helper.n).padStart(2, "0")}` : row.helperId} · updated {row.updatedAt.slice(0, 10)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!window.confirm(`Delete “${row.title}”? This cannot be undone.`)) return;
                    await deleteSave({ data: row.id });
                    setRows((prev) => (prev ?? []).filter((r) => r.id !== row.id));
                    toast.success("Removed");
                  }}
                >
                  Delete
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
