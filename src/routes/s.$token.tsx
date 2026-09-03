import { createFileRoute, Link } from "@tanstack/react-router";
import { HELPER_BY_ID } from "@/lib/helpers/catalog";
import { getSaveByToken } from "@/lib/server/saves";
import { PrintSheet } from "@/components/print-sheet";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/s/$token")({
  loader: async ({ params }) => {
    const row = await getSaveByToken({ data: params.token });
    return { row };
  },
  component: SharedSave,
});

function SharedSave() {
  const { row } = Route.useLoaderData();
  if (!row) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-display text-2xl">This share link is gone.</h1>
        <Button asChild className="mt-6">
          <Link to="/">Pain Point Helpers</Link>
        </Button>
      </main>
    );
  }
  const helper = HELPER_BY_ID[row.helperId];
  if (!helper) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-display text-2xl">Unknown helper.</h1>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="no-print text-xs uppercase tracking-widest text-accent">Shared helper</p>
      <div className="no-print mt-4 flex gap-2">
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          Print / PDF
        </Button>
        <Button asChild>
          <Link to="/helpers/$slug" params={{ slug: helper.id }}>
            Fill your own
          </Link>
        </Button>
      </div>
      <div className="mt-8 rounded-xl border border-line bg-white p-6">
        <PrintSheet helper={helper} values={row.values} />
      </div>
    </main>
  );
}
