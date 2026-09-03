import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, HELPERS } from "@/lib/helpers/catalog";
import { PAGE_GUIDES, categoryGuide } from "@/lib/helpers/guides";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MascotTip } from "@/components/mascot";

export const Route = createFileRoute("/helpers/")({
  validateSearch: (s: Record<string, unknown>): { cat?: string; q?: string } => {
    const out: { cat?: string; q?: string } = {};
    if (typeof s.cat === "string") out.cat = s.cat;
    if (typeof s.q === "string") out.q = s.q;
    return out;
  },
  component: HelpersIndex,
});

function HelpersIndex() {
  const { cat, q } = Route.useSearch();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(q ?? "");
  const query = draft.trim().toLowerCase();
  const list = HELPERS.filter((h) => {
    if (cat && h.category !== cat) return false;
    if (!query) return true;
    return `${h.title} ${h.blurb} ${h.id}`.toLowerCase().includes(query);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-28">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">The drawer</p>
      <h1 className="mt-2 font-display text-4xl text-ink">The kits</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        {HELPERS.length} fillable kits and family, work, and life calcs. Fill it, print it, keep it.
      </p>
      <MascotTip pose="explain" className="mt-6 max-w-3xl">
        {PAGE_GUIDES.helpers}
      </MascotTip>

      <label className="mt-6 block max-w-md">
        <span className="sr-only">Search helpers</span>
        <Input
          type="search"
          value={draft}
          placeholder="Search the drawer — mortgage, invoice, sleep…"
          autoComplete="off"
          onChange={(e) => {
            const next = e.target.value;
            setDraft(next);
            void navigate({
              to: "/helpers",
              search: { cat, q: next.trim() ? next : undefined },
            });
          }}
        />
      </label>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/helpers"
          search={{ q }}
          className={`rounded-full px-3.5 py-2 text-base ${!cat ? "bg-accent text-accent-fg" : "bg-ink/5 text-muted hover:text-ink"}`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to="/helpers"
            search={{ cat: c.id, q }}
            className={`rounded-full px-3.5 py-2 text-base ${cat === c.id ? "bg-accent text-accent-fg" : "bg-ink/5 text-muted hover:text-ink"}`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-10">
        {CATEGORIES.filter((c) => !cat || c.id === cat).map((c) => {
          const items = list.filter((h) => h.category === c.id);
          if (items.length === 0) return null;
          return (
            <section key={c.id}>
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-widest text-accent">{c.kicker}</p>
                  <h2 className="font-display text-2xl text-ink">{c.label}</h2>
                  <p className="mt-1 max-w-xl text-base text-muted">{categoryGuide(c.id)}</p>
                </div>
                <Badge>{c.range}</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((h) => (
                  <Link
                    key={h.id}
                    to="/helpers/$slug"
                    params={{ slug: h.id }}
                    className="rounded-xl border border-line bg-surface p-4 hover:border-line-strong"
                  >
                    <p className="text-sm text-subtle">{String(h.n).padStart(2, "0")}</p>
                    <h3 className="mt-1 font-display text-xl text-ink">{h.title}</h3>
                    <p className="mt-1 text-base text-muted">{h.blurb}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {list.length === 0 ? (
        <p className="mt-10 text-muted">Nothing in the drawer matches that. Try another word, or clear search.</p>
      ) : null}
    </div>
  );
}
